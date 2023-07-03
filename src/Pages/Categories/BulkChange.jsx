import { useContext, useEffect, useMemo, useState } from "react";
import Breadcrumb from "../../Components/Breadcrumbs";
import { getCategories, searchProductsByName, updateBulkDiscount, updateBulkPriceByPercentage } from "../../services";
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/solid'
import { Combobox } from '@headlessui/react'
import { debounce } from "lodash";
import { classNames, getImageUrl } from "../../utils";
import { XIcon } from "@heroicons/react/outline";
import { useForm } from "react-hook-form";
import { NotificationContext, WindowWidthContext } from "../../Layout";
import { ErrorMessage } from "@hookform/error-message";
import LoaderSvg from "../../Components/LoaderSvg";

const pages = [
  {
    name: 'Price update',
    href: '/products/discount',
    current: true
  }
]

const allChangeTypes = [
  {
    name: 'Discount',
    value: 'discount'
  },
  {
    name: 'Adjustment',
    value: 'adjustment'
  }
]

const allProductTypes = [
  {
    name: 'All Products',
    value: 'all'
  },
  {
    name: 'Products by Category',
    value: 'category'
  },
  {
    name: 'Products by Search',
    value: 'products'
  }
]
export default function BulkChange() {
  const { setNotificationState } = useContext(NotificationContext);
  const [changeType, setChangeType] = useState('')
  const [productType, setProductType] = useState('')
  const [parentCategories, setParentCategories] = useState([]);
  const [searchProducts, setSearchProducts] = useState([]);
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (productType === 'category') {
      getCategories()
        .then((res) => {
          if (res.data.success) {
            setParentCategories(res.data.data);
          }
        })
        .catch((err) => {
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
  }, [productType])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = (data) => {
    setLoading(true)
    data.bulkIds = []
    data.id = data.id ? data.id : ''
    if (data.type === 'products') {
      if (searchProducts.length > 0) {
        data.bulkIds = searchProducts;
      } else {
        setNotificationState({
          type: 'error',
          message: 'Please select at least one product',
          show: true
        });
        return
      }
    }
    if (changeType === 'discount') {
      updateBulkDiscount(data)
        .then((res) => {
          if (res.data.success) {
            setNotificationState({
              type: 'success',
              message: res.data.message,
              show: true
            });
          }
          setLoading(false)
          setChangeType('')
          setProductType('')
          reset()
        })
        .catch((err) => {
          setNotificationState({
            type: 'error',
            message:
              err.response.status === 400
                ? err.response.data.error.message
                : err.message,
            show: true
          });
          setLoading(false)
        })
    } else {
      updateBulkPriceByPercentage(data)
        .then((res) => {
          if (res.data.success) {
            setNotificationState({
              type: 'success',
              message: res.data.message,
              show: true
            });
          }
          setLoading(false)
          setChangeType('')
          setProductType('')
          reset()
        })
        .catch((err) => {
          setNotificationState({
            type: 'error',
            message:
              err.response.status === 400
                ? err.response.data.error.message
                : err.message,
            show: true
          });
          setLoading(false)
        })
    }
  }

  return (
    <>
      <Breadcrumb pages={pages} />
      <div className="flex">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-12 sm:space-y-16">
            <div>
              <div className="mt-5 space-y-8 sm:space-y-0 sm:border-t">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Select Products
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg flex rounded-md shadow-sm">
                      <select
                        id="productType"
                        name="productType"
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        defaultValue=""
                        {...register('type', {
                          required: true
                        })}
                        onChange={(event) => setProductType(event.target.value)}
                      >
                        <option disabled value="">Select</option>
                        {allProductTypes.map((changeType, index) => (
                          <option key={changeType.value} value={changeType.value}>{changeType.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                {productType === 'category' && (
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Select Category
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="max-w-lg flex rounded-md shadow-sm">
                        <select
                          id="categoryId"
                          name="categoryId"
                          className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          defaultValue=""
                          {...register('id', {
                            required: true
                          })}
                        >
                          <option disabled value="">Select</option>
                          {parentCategories.map((cat, index) => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
                {productType === 'products' && (
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Search Products
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <SearchWithDropdownSelector handleSelectedProducts={setSearchProducts} />
                    </div>
                  </div>
                )}
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Select Type of price change
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg flex rounded-md shadow-sm">
                      <select
                        id="changeType"
                        name="changeType"
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        defaultValue=""
                        onChange={(event) => setChangeType(event.target.value)}
                      >
                        <option disabled value="">Select change type</option>
                        {allChangeTypes.map((changeType, index) => (
                          <option key={changeType.value} value={changeType.value}>{changeType.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                {changeType === 'discount' && (
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Discount (%)
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="max-w-lg flex rounded-md shadow-sm">
                        <input
                          type='number'
                          name='discount'
                          id='discount'
                          className='flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300'
                          {...register('discount', {
                            required: true
                          })}
                          placeholder='i.e. 10, 5. (% of discount will be applied on price)'
                        />
                      </div>
                    </div>
                  </div>
                )}
                {changeType === 'adjustment' && (<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Percentage update (+/- %)
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg flex rounded-md shadow-sm">
                      <input
                        type='number'
                        name='percentage'
                        id='percentage'
                        className='flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300'
                        {...register('percentage', {
                          required: true
                        })}
                        placeholder='i.e. 10, -10 (% of price will be updated)'
                      />
                    </div>
                  </div>
                </div>)}
                <div className="mt-1 sm:mt-0">
                  <ErrorMessage
                    errors={errors}
                    name="multipleErrorInput"
                    render={({ messages }) =>
                      messages &&
                      Object.entries(messages).map(([type, message]) => (
                        <p key={type}>{message}</p>
                      ))
                    }
                  />
                  <button
                    type='submit'
                    className={classNames(
                      loading ? 'cursor-not-allowed animate-pulse' : '',
                      'w-full my-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none'
                    )}
                  >
                    Update price
                    {loading && <LoaderSvg />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

function SearchWithDropdownSelector({ handleSelectedProducts }) {
  const [searchResult, setSearchResult] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const setNotificationState = useContext(NotificationContext);
  const isMobile = useContext(WindowWidthContext);
  const handleSearch = debounce((searchTerm) => {
    if (searchTerm) {
      searchProductsByName({ query: searchTerm })
        .then((res) => {
          if (res.data.success) {
            setSearchResult(res.data.data);
          }
        })
        .catch((err) => {
          setNotificationState({
            type: 'error',
            message:
              err.response.status === 400
                ? err.response.data.error.message
                : err.message,
            show: true
          });
        });
    } else {
      setSearchResult([]);
    }
  }, 500);

  useEffect(() => {
    if (searchTerm.length > 0) {
      handleSearch(searchTerm)
    }
  }, [searchTerm])

  const [selectedProducts, setSelectedProducts] = useState([])

  const handleSelect = (product) => {
    if (selectedProducts.some((p) => p._id === product._id)) {
      setSelectedProducts(selectedProducts.filter((p) => p._id !== product._id));
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  useEffect(() => {
    if (selectedProducts.length > 0) {
      handleSelectedProducts(selectedProducts.map(p => p._id))
    }
  }, [selectedProducts])

  return (
    <Combobox as="div" className="relative mt-1" value={selectedProducts} onChange={setSelectedProducts} multiple>
      {selectedProducts.length > 0 && (
        <ul>
          {selectedProducts.map((product) => (
            <span key={product._id} className="inline-flex items-center pl-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 mr-2 mb-1">
              {product.name}
              <button
                type="button"
                className="flex-shrink-0 ml-1 h-5 w-5 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none"
                onClick={() => handleSelect(product)}
              >
                <span className="sr-only">Remove {product.name}</span>
                <XIcon />
              </button>
            </span>
          ))}
        </ul>
      )}
      <Combobox.Input
        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
        onChange={(event) => {
          const value = event.target.value;
          setSearchTerm(value);
          if (value === '') {
            setSearchResult([]);
          }
        }}
        defaultValue={searchTerm}
        placeholder='Search for a product (type minimum 2 letter)' />

      <Combobox.Options className="mt-1 absolute z-50 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm" >
        {searchResult.map((product) => (
          <Combobox.Option
            key={product._id}
            value={product}
            className={classNames('cursor-default select-none relative py-2 px-4 hover:bg-indigo-100', selectedProducts.some((p) => p._id === product._id) && 'bg-indigo-100')}
            disabled={selectedProducts.some((p) => p._id === product._id)}
          >
            <div className="flex items-center">
              <img
                src={product.productImages ? getImageUrl(product.productImages[0], isMobile) : getImageUrl()}
                alt={product.description}
                className="h-6 w-6 flex-shrink-0 rounded-md" />
              <span className={classNames('ml-3 truncate')}>
                {product.name}
              </span>
            </div>
          </Combobox.Option>
        ))}
      </Combobox.Options>
    </Combobox>
  )
}

