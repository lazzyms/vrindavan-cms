/* eslint-disable react-hooks/exhaustive-deps */
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/outline";
import { PlusIcon, ArrowCircleUpIcon } from "@heroicons/react/solid";
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ConfirmDialouge from "../../Components/ConfirmDialouge";
import ErrorBoundary from "../../Components/ErrorBoundry";
import Popup from "../../Components/Popup";
import { usePopper } from "react-popper";
import {
  deleteCategory,
  deleteProduct,
  getCategoryDetails,
  getProductsByCategoryId,
} from "../../services";
import Product from "./Product";
import Breadcrumb from "../../Components/Breadcrumbs";
import { NotificationContext } from "../../Layout";
import CategoryCard from "../../Components/CategoryCard";
import ProductCard from "../../Components/ProductCard";
import { classNames } from "../../utils";

const pageLimit = 6;

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
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: "arrow", options: { element: arrowElement } }],
    placement: "bottom-end",
  });

  const getFreshCategories = () => {
    getProductsByCategoryId(id, { page: pageNumber, limit: pageLimit })
      .then((res) => {
        setProductsLoading(false);
        if (res.data.success) {
          const newProducts = res.data.data.products;
          products[pageNumber - 1] = newProducts;
          setProducts(products);
          setTotalPages(res.data.data.pages);
        }
      })
      .catch((err) => {
        setProductsLoading(false);
        setNotificationState({
          type: "error",
          message:
            err.response.status === 400
              ? err.response.data.error.message
              : err.message,
          show: true,
        });
      });
  };

  useEffect(() => {
    if (!products[pageNumber - 1]) {
      setProductsLoading(true);
      getFreshCategories();
    }
  }, [pageNumber]);

  useEffect(() => {
    getCategoryDetails(id)
      .then((res) => {
        setCategoryLoading(false);
        if (res.data.success) {
          setCategoryDetails(res.data.data);
          setPages([
            {
              name: "Categories",
              href: "/",
              current: false,
            },
            {
              name: res.data.data.name,
              href: `/categories/${res.data.data._id}`,
              current: true,
            },
          ]);
        }
      })
      .catch((err) => {
        setCategoryLoading(false);
        setNotificationState({
          type: "error",
          message:
            err.response.status === 400
              ? err.response.data.error.message
              : err.message,
          show: true,
        });
      });
  }, [id]);

  useEffect(() => {
    if (!insertForm) {
      setPageNumber(1);
      setProducts([]);
    }
  }, [insertForm]);

  const onDelete = (id) => {
    deleteCategory(id).then((res) => {
      setDeleteModal(false);
      navigate("/");
    });
  };

  const removeProduct = (pid) => {
    deleteProduct(pid).then((res) => {
      setProdDeleteModal(false);
      setPageNumber(1);
      setProducts([]);
    });
  };

  return (
    <div className="">
      <Breadcrumb pages={pages} />
      <div className="border-b pb-2">
        {categoryLoading ? (
          <div className="animate-pulse m-3 font-bold">
            <div className="">
              <div className="mx-auto px-4 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between">
                <h2 className="bg-gray-400 h-12 w-80 rounded sm:text-4xl">
                  <span className="block"></span>
                </h2>
                <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                  <div className="inline-flex rounded-md shadow">
                    <Link
                      to={`/categories/edit/${id}`}
                      className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    ></Link>
                  </div>
                  <div className="ml-3 inline-flex rounded-md shadow">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                    ></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 lg:items-between lg:justify-between gap-1">
            <div className="col-span-2">
              <p className="my-auto text-base text-gray-500 h-20 text-clip overflow-auto">
                {categoryDetails.description.replaceAll('"', "")}
              </p>
            </div>
            <div className="grid grid-cols-3 items-center gap-1">
              <Link
                to={`/categories/edit/${categoryDetails._id}`}
                className="h-full w-full inline-flex items-center justify-center p-2 border border-transparent font-medium rounded-xl text-gray-600 bg-white hover:bg-gray-50 hover:shadow"
              >
                Edit Category
              </Link>
              {categoryDetails.subCategories.length === 0 && (
                <>
                  <button
                    ref={setReferenceElement}
                    type="button"
                    className="h-full w-full flex items-center justify-center p-2 border border-transparent font-medium rounded-xl text-gray-600 bg-white hover:bg-gray-50 hover:shadow"
                    onClick={() => setInsertForm(true)}
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span>Add Product</span>
                  </button>
                  <Popup
                    heading="Add Product"
                    open={insertForm}
                    setOpen={setInsertForm}
                    content={
                      <Product
                        categoryId={id}
                        categoryName={categoryDetails.name}
                        handlePopup={setInsertForm}
                      />
                    }
                  />
                  <button
                    type="button"
                    className="h-full w-full text-red-500 items-center justify-center p-2 border border-transparent font-medium rounded-xl text-gray-600 bg-white hover:bg-gray-50 hover:shadow"
                    onClick={() => setDeleteModal(true)}
                  >
                    Delete Category
                  </button>
                  <ErrorBoundary>
                    <ConfirmDialouge
                      id={id}
                      open={deleteModal}
                      setOpen={(e) => setDeleteModal(e)}
                      message="Warning: You are about to erase the category and all its contents. This is a permanent action and cannot be reversed. Please confirm if you want to proceed."
                      title={`Delete ${categoryDetails.name}`}
                      handleAction={(e) => onDelete(e)}
                    />
                  </ErrorBoundary>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      {!categoryLoading && categoryDetails.subCategories.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categoryDetails.subCategories.map((feature) => (
            <CategoryCard key={feature._id} feature={feature} />
          ))}
        </div>
      )}
      <div>
        {productsLoading && !products[pageNumber - 1] ? (
          <div className="animate-pulse m-3 font-bold ">
            <div className="h-48 w-72 rounded">
              <div className="m-1 bg-gray-400 h-20 rounded"></div>
              <div className="m-1 bg-gray-400 h-8 w-64 rounded"></div>
              <div className="m-1 bg-gray-400 h-2 w-60 rounded"></div>
              <div className="m-1 bg-gray-400 h-4 w-60 rounded border-t"></div>
            </div>
          </div>
        ) : (
          <div className="flex w-full">
            <div className="w-full grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products[pageNumber - 1]?.length > 0 &&
                products[pageNumber - 1].map((product, i) => (
                  <ProductCard
                    key={product._id + i}
                    product={product}
                    prodDeleteModal={prodDeleteModal}
                    setProdDeleteModal={setProdDeleteModal}
                    removeProduct={removeProduct}
                  />
                ))}
            </div>
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <nav className="mt-4 flex items-center justify-between border-gray-200 px-4 sm:px-0">
          <div className=" flex w-0 flex-1">
            <button
              className={classNames(
                pageNumber === 1 ? "hidden" : "inline-flex",
                "items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              )}
              onClick={() => setPageNumber(pageNumber - 1)}
            >
              <ArrowLeftIcon
                className="mr-3 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              Previous
            </button>
          </div>
          <div className="hidden md:-mt-px md:flex">
            {[...Array(totalPages).keys()].map((i) => (
              <button
                key={i}
                onClick={() => setPageNumber(i + 1)}
                className={classNames(
                  i + 1 === pageNumber
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                  "inline-flex items-center border-t-2 px-4 pt-1 text-sm font-medium"
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div className="-mt-px flex w-0 flex-1 justify-end">
            <button
              className={classNames(
                pageNumber === totalPages ? "hidden" : "inline-flex",
                "items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              )}
              onClick={() => setPageNumber(pageNumber + 1)}
            >
              Next
              <ArrowRightIcon
                className="ml-3 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
