/* eslint-disable react-hooks/exhaustive-deps */
import { PencilIcon } from '@heroicons/react/outline';
import { EyeIcon, PlusIcon, TrashIcon } from '@heroicons/react/solid';
import React, { useContext, useState } from 'react';
import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ConfirmDialouge from '../../Components/ConfirmDialouge';
import ErrorBoundary from '../../Components/ErrorBoundry';
import Popup from '../../Components/Popup';
import {
  deleteCategory,
  deleteProduct,
  getCategoryDetails,
  getProductsByCategoryId,
} from '../../services';
import Product from './Product';
import Breadcrumb from '../../Components/Breadcrumbs';
import { getImageUrl } from '../../utils';
import { NotificationContext } from '../../Layout';

export default function Category() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setNotificationState } = useContext(NotificationContext);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [categoryDetails, setCategoryDetails] = useState();
  const [insertForm, setInsertForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [prodDeleteModal, setProdDeleteModal] = useState(false);
  const [pages, setPages] = useState([]);

  const getFreshCategories = () => {
    getProductsByCategoryId(id)
      .then((res) => {
        setProductsLoading(false);
        if (res.data.success) {
          setProducts(res.data.data);
        }
      })
      .catch((err) => {
        setProductsLoading(false);
        setNotificationState({
          type: 'error',
          message:
            err.response.status === 400
              ? err.response.data.error.message
              : err.message,
          show: true
        });
      });
  }

  useEffect(() => {
    getCategoryDetails(id)
      .then((res) => {
        setCategoryLoading(false);
        if (res.data.success) {
          setCategoryDetails(res.data.data);
          setPages([
            {
              name: 'Categories',
              href: '/',
              current: false
            },
            {
              name: res.data.data.name,
              href: `/categories/${res.data.data._id}`,
              current: true
            }
          ])
        }
      })
      .catch((err) => {
        setCategoryLoading(false);
        setNotificationState({
          type: 'error',
          message:
            err.response.status === 400
              ? err.response.data.error.message
              : err.message,
          show: true
        });
      });
    getFreshCategories();
  }, [id]);

  useEffect(() => {
    if (!insertForm) {
      getFreshCategories()
    }
  }, [insertForm])

  const onDelete = (id) => {
    deleteCategory(id).then((res) => {
      setDeleteModal(false);
      navigate('/')
    });
  };

  const removeProduct = (pid) => {
    deleteProduct(pid).then((res) => {
      setProdDeleteModal(false);
      getFreshCategories()
    });
  }

  return (
    <div className=''>
      <Breadcrumb pages={pages} />
      <div className='border-b pb-2'>
        {categoryLoading ? (
          <div className='animate-pulse m-3 font-bold'>
            <div className=''>
              <div className='mx-auto px-4 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between'>
                <h2 className='bg-gray-400 h-12 w-80 rounded sm:text-4xl'>
                  <span className='block'></span>
                </h2>
                <div className='mt-8 flex lg:mt-0 lg:flex-shrink-0'>
                  <div className='inline-flex rounded-md shadow'>
                    <Link
                      to={`/categories/edit/${id}`}
                      className='inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700'
                    ></Link>
                  </div>
                  <div className='ml-3 inline-flex rounded-md shadow'>
                    <button
                      type='button'
                      className='inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50'
                    ></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='lg:flex lg:items-between lg:justify-between'>
            <div className='inline-flex'>
              <p className='my-auto text-base text-gray-500'>
                {categoryDetails.description.replaceAll('"', '')}
              </p>
            </div>
            <div className='inline-flex'>
              <div className='inline-flex'>
                <Link
                  to={`/categories/edit/${categoryDetails._id}`}
                  className='inline-flex items-center justify-center p-2 border border-transparent text-base font-medium rounded text-gray-600 bg-white hover:bg-gray-50 hover:shadow'
                >
                  Edit Category
                </Link>
              </div>
              {categoryDetails.subCategories.length === 0 && (
                <>
                  <div className='ml-3 inline-flex'>
                    <button
                      type='button'
                      className='inline-flex items-center justify-center p-2 border border-transparent text-base font-medium rounded text-gray-600 bg-white hover:bg-gray-50 hover:shadow'
                      onClick={() => setInsertForm(true)}
                    >
                      <PlusIcon className='h-4 w-4' />
                      <span>Add Product</span>
                    </button>
                    <Popup
                      heading='Add Product'
                      open={insertForm}
                      setOpen={setInsertForm}
                      content={<Product categoryId={id} categoryName={categoryDetails.name} handlePopup={setInsertForm} />}
                    />
                  </div>

                  <div className='ml-3 inline-flex'>
                    <button
                      type='button'
                      className='text-red-500 inline-flex items-center justify-center p-2 border border-transparent text-base font-medium rounded text-gray-600 bg-white hover:bg-gray-50 hover:shadow'
                      onClick={() => setDeleteModal(true)}
                    >
                      Delete Category
                    </button>
                    <ErrorBoundary>
                      <ConfirmDialouge
                        id={id}
                        open={deleteModal}
                        setOpen={(e) => setDeleteModal(e)}
                        message='Warning: You are about to erase the category and all its contents. This is a permanent action and cannot be reversed. Please confirm if you want to proceed.'
                        title={`Delete ${categoryDetails.name}`}
                        handleAction={(e) => onDelete(e)}
                      />
                    </ErrorBoundary>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      {!categoryLoading && categoryDetails.subCategories.length > 0 && (
        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
          {categoryDetails.subCategories.map((feature) => (
            <div key={feature._id} className='mt-4 pt-6'>
              <div className='flow-root rounded-lg bg-gray-50 px-6 pb-8'>
                <div className='-mt-6'>
                  <div className='flex items-center justify-between'>
                    <span className='inline-flex items-center justify-center rounded-md bg-gray-300 p-3 shadow-lg'>
                      <img
                        src={getImageUrl(feature.icon)}
                        className='h-12 w-12'
                        aria-hidden='true'
                        alt={feature.name}
                      />
                    </span>
                    <div className='flex'>
                      <Link to={`/categories/${feature._id}`}>
                        <EyeIcon className='m-1 mt-8 p-2 text-gray-600 hover:text-gray-900 h-8 w-8 border rounded-full hover:shadow' />
                      </Link>
                      <Link to={`/categories/edit/${feature._id}`}>
                        <PencilIcon className='m-1 mt-8 p-2 text-gray-600 hover:text-gray-900 h-8 w-8 border rounded-full hover:shadow' />
                      </Link>
                    </div>
                  </div>
                  <h3 className='mt-4 text-lg font-medium tracking-tight text-gray-900'>
                    {feature.name}
                  </h3>
                  <p className='mt-1 text-base text-gray-500'>
                    {feature.description.replaceAll('"', '')}
                  </p>
                  <img
                    src={getImageUrl(feature.coverImage)}
                    className='mt-1 w-full h-36'
                    alt={feature._id}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div>
        {productsLoading ? (
          <div className='animate-pulse m-3 font-bold '>
            <div className='h-full rounded'>
              <div className='m-1 rounded'>Loading products....</div>
              <div className='m-1 bg-gray-400 h-3 w-64 rounded'></div>
              <div className='m-1 bg-gray-400 h-3 w-60 rounded'></div>
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {products.length > 0 && products.map((product, i) => (
              <div key={product._id} className='pt-4'>
                <div className='flow-root rounded-lg bg-gray-50 shadow-md h-full'>
                  <div className='mx-4'>

                    <img
                      src={product.productImages ? getImageUrl(product.productImages[0]) : getImageUrl()}
                      className='mt-1 w-full h-36 rounded-xl contain'
                      alt={product._id}
                    />
                    <div className='flex items-center justify-between'>
                      <h3 className='mt-1 text-lg font-medium tracking-tight text-gray-900'>
                        {product.name}
                      </h3>
                      <h3 className='mt-1 text-lg font-medium tracking-tight text-gray-800'>
                        ₹{product.price}
                      </h3>
                    </div>
                    {product.description.replaceAll('"', '') ? <p className='mt-1 h-8 text-base text-gray-600'>
                      {product.description.replaceAll('"', '')}
                    </p> : <p className='mt-1 h-8 text-base text-gray-400'>
                      No description provided
                    </p>}

                  </div>
                  <div className="isolate inline-flex rounded-md w-full border-t">
                    <Link
                      className='relative inline-flex items-center justify-center hover:shadow-md rounded-l-md px-2 py-2 text-sm font-semibold w-1/2 border-r'
                      to={`/products/${product._id}`}
                    >
                      <EyeIcon className='h-6 w-6 text-gray-700' />
                      <span className="px-2 text-gray-700">Edit</span>
                    </Link>
                    <button
                      className='relative -ml-px inline-flex items-center justify-center hover:shadow-md rounded-r-md px-2 py-2 text-sm font-semibold w-1/2 border-l'
                      onClick={() => setProdDeleteModal(true)}
                    >
                      <TrashIcon className='h-6 w-6 text-red-400' />
                      <span className="px-2 text-red-400">Delete</span>
                    </button>
                  </div>
                  <ErrorBoundary>
                    <ConfirmDialouge
                      id={product._id}
                      open={prodDeleteModal}
                      setOpen={(e) => setProdDeleteModal(e)}
                      message='Warning: You are about to remove the product and all its contents. This is a permanent action and cannot be reversed. Please confirm if you want to proceed.'
                      title={`Delete ${product.name}`}
                      handleAction={(e) => removeProduct(e)}
                    />
                  </ErrorBoundary>
                </div>
              </div>))}
          </div>
        )}
      </div>
    </div>
  );
}


