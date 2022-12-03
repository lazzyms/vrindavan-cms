import { Switch } from '@headlessui/react';
import { PencilIcon, TrashIcon } from '@heroicons/react/outline';
import { EyeIcon, PlusIcon } from '@heroicons/react/solid';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import Popup from '../../Components/Popup';
import { getCategoryDetails, getProductsByCategoryId } from '../../services';

export default function AllCategories() {
  const { id } = useParams();
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [categoryDetails, setCategoryDetails] = useState();
  const [formState, setFormState] = useState(false);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    getCategoryDetails(id)
      .then((res) => {
        setCategoryLoading(false);
        if (res.data.success) {
          setCategoryDetails(res.data.data);
        }
      })
      .catch((err) => {
        setCategoryLoading(false);
        console.log(err);
      });
    getProductsByCategoryId(id)
      .then((res) => {
        setProductsLoading(false);
        if (res.data.success) {
          setProducts(res.data.data);
        }
      })
      .catch((err) => {
        setProductsLoading(false);
        console.log(err);
      });
  }, [id]);

  return (
    <div className='divide-y space-y-4'>
      <div>
        {categoryLoading ? (
          <div className='animate-pulse m-3 font-bold '>
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
          <div className=''>
            <div className='mx-auto px-4 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between'>
              <div className='inline-flex'>
                <h2 className='text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl'>
                  <span className='block'>{categoryDetails.name}</span>
                </h2>
                <div className='ml-3 inline-flex'>
                  <Link
                    to={`/categories/edit/${categoryDetails._id}`}
                    className='inline-flex items-center justify-center p-3 text-gray-900 font-medium rounded-full border hover:shadow'
                  >
                    <PencilIcon className='h-4 w-4' />
                  </Link>
                </div>
                <div className='ml-3 inline-flex'>
                  <button
                    type='button'
                    className='inline-flex items-center justify-center p-3 text-red-500 font-medium rounded-full border hover:shadow'
                  >
                    <TrashIcon className='h-4 w-4' />
                  </button>
                </div>
              </div>

              <div className='mt-8 flex lg:mt-0 lg:flex-shrink-0'>
                <div className='ml-3 inline-flex'>
                  <button
                    type='button'
                    className='inline-flex items-center justify-center p-2 border border-transparent text-base font-medium rounded text-gray-600 bg-white hover:bg-gray-50 hover:shadow'
                    onClick={() => setFormState(true)}
                  >
                    <PlusIcon className='h-4 w-4' />
                    <span>Add Product</span>
                  </button>
                  <Popup
                    heading='Add Product'
                    open={formState}
                    setOpen={setFormState}
                    content={<AddProduct />}
                  />
                </div>
              </div>
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
                        src={feature.iconUrl}
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
                    src={feature.coverImageUrl}
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
        ) : products.length === 0 ? (
          <div className='m-3 font-bold '>
            <div className='h-full rounded'>
              <div className='m-1 rounded'>No products added in category</div>
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4'></div>
        )}
      </div>
    </div>
  );
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const AddProduct = (productDetail = {}) => {
  const [colors, setColors] = useState([]);
  const [enabled, setEnabled] = useState(false);
  const [images, setImages] = useState([]);
  const [range, setRange] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  const handleImageUpdate = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImages(URL.createObjectURL(e.target.files));
    }
  };

  const handleChangeColor = (e, i) => {
    const newColors = [...colors];
    newColors[i] = e.target.value;
    setColors(newColors);
  };

  const addNewColor = () => {
    setColors([...colors, '']);
  };

  return (
    <form
      className='space-y-8 divide-y divide-gray-200'
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className='space-y-8 divide-y divide-gray-200 sm:space-y-5'>
        <div>
          {productDetail.id && (
            <input
              type='hidden'
              name='id'
              {...register('id')}
              value={productDetail.id}
            />
          )}
          <div className='mt-6 sm:mt-5 space-y-6 sm:space-y-5'>
            <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
              <label
                htmlFor='username'
                className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
              >
                Name
              </label>
              <div className='mt-1 sm:mt-0 sm:col-span-2'>
                <div className='max-w-lg flex rounded-md shadow-sm'>
                  <input
                    type='text'
                    name='name'
                    id='name'
                    autoComplete='name'
                    defaultValue={productDetail.name}
                    className='flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300'
                    {...register('name', {
                      required: true
                    })}
                    placeholder='Enter name of Product Category, e.g. Sofa'
                  />
                </div>
              </div>
            </div>

            <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
              <label
                htmlFor='about'
                className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
              >
                Description
              </label>
              <div className='mt-1 sm:mt-0 sm:col-span-2'>
                <textarea
                  id='description'
                  name='description'
                  rows={3}
                  defaultValue={productDetail.description}
                  className='max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md'
                  placeholder='Enter a description of the category'
                  {...register('description')}
                />
              </div>
            </div>

            <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5'>
              <label
                htmlFor='photo'
                className='block text-sm font-medium text-gray-700'
              >
                Color options
              </label>
              <div className='mt-1 sm:mt-0 sm:col-span-2 flex item-center'>
                {colors.map((color, index) => (
                  <input
                    type='color'
                    value={color}
                    className='m-1'
                    onChange={(e) => handleChangeColor(e, index)}
                  />
                ))}
                <button
                  className='bg-white mx-1 py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none'
                  onClick={() => addNewColor()}
                >
                  Add Color
                </button>
              </div>
            </div>

            <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
              <label
                htmlFor='cover-photo'
                className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
              >
                Product Images
              </label>
              <div className='mt-1 sm:mt-0 sm:col-span-2'>
                <div className='flex items-center'>
                  <label
                    htmlFor='productImages'
                    className='bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none'
                  >
                    <span>Upload Images</span>
                    <input
                      id='productImages'
                      name='productImages'
                      type='file'
                      accept='image/*'
                      multiple
                      className='sr-only'
                      {...register('productImages', {
                        onChange: (e) => handleImageUpdate(e)
                      })}
                    />
                  </label>
                  {images && images.length > 0 && (
                    <div className='flex-1'>
                      {images.map((image) => (
                        <img
                          key={image}
                          src={image}
                          alt={image}
                          className='m-2 w-32 h-16 object-contain'
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
              <label
                htmlFor='country'
                className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
              >
                Price Range?
              </label>
              <div className='mt-1 sm:mt-0 sm:col-span-2'>
                <Switch
                  checked={range}
                  className={classNames(
                    enabled ? 'bg-indigo-600' : 'bg-gray-200',
                    'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none'
                  )}
                  onChange={() => setRange(!range)}
                >
                  <span
                    aria-hidden='true'
                    className={classNames(
                      enabled ? 'translate-x-5' : 'translate-x-0',
                      'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200'
                    )}
                  />
                </Switch>
              </div>
            </div>
            <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
              <label
                htmlFor='country'
                className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
              >
                Visible
              </label>
              <div className='mt-1 sm:mt-0 sm:col-span-2'>
                <Controller
                  name='isVisible'
                  control={control}
                  rules={{ onChange: setEnabled, value: enabled }}
                  checked={enabled}
                  render={({ field }) => (
                    <Switch
                      {...field}
                      checked={enabled}
                      className={classNames(
                        enabled ? 'bg-indigo-600' : 'bg-gray-200',
                        'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none'
                      )}
                    >
                      <span
                        aria-hidden='true'
                        className={classNames(
                          enabled ? 'translate-x-5' : 'translate-x-0',
                          'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200'
                        )}
                      />
                    </Switch>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='pt-5'>
        <div className='flex justify-end'>
          <button
            type='submit'
            className={classNames(
              loading ? 'cursor-not-allowed animate-pulse' : '',
              'ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none'
            )}
          >
            Save
            {loading && (
              <span className='ml-1'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z'
                  />
                </svg>
              </span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
