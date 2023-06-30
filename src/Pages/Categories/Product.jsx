/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { NotificationContext } from "../../Layout";
import { Controller, useForm } from "react-hook-form";
import { Switch } from "@headlessui/react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductsById, addOrUpdateProduct, uploadToCloudinary, removeFromCloudinary } from "../../services";
import Breadcrumb from "../../Components/Breadcrumbs";
import { XCircleIcon } from "@heroicons/react/solid";
import { getImageUrl } from "../../utils";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Product({ categoryId = '', categoryName = '', handlePopup }) {
  const { pid } = useParams();
  const navigate = useNavigate();
  const { setNotificationState } = useContext(NotificationContext);
  const [productDetails, setProductDetails] = useState(null);
  const [pages, setPages] = useState([]);
  const [colors, setColors] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!categoryId) {
      getProductsById(pid).then(res => {
        if (res.data.success) {
          const product = res.data.data;
          setProductDetails(product);
          if (product.colors) {
            setColors(product.colors);
          }
          if (product.productImages) {
            setImages(product.productImages.map(img => getImageUrl(img)));
          }
          setPages([
            {
              name: 'Categories',
              href: '/',
              current: false
            },
            {
              name: categoryName ? categoryName : product.categoryName,
              href: `/categories/${product.categoryId}`,
              current: false
            },
            {
              name: 'Edit Product',
              href: `/products/${pid}`,
              current: true
            }
          ])
        }
      }).catch((err) => {
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
  }, [])

  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
  } = useForm({
    defaultValues: {
      isVisible: productDetails ? productDetails.isVisible : true,
    }
  });

  const onSubmit = async (data) => {
    data.categoryId = categoryId ? categoryId : productDetails.categoryId
    setLoading(true);

    if (data.productImages.length > 0) {
      const files = Array.from(data.productImages);
      data.productImages = await Promise.all(files.map(async (img, i) => {
        const productData = new FormData();
        productData.append('file', img);
        productData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_PRESET);
        productData.append('folder', `products/${data.categoryId}/`);

        const icon = await uploadToCloudinary(productData);
        return icon.public_id;
      }))
    } else {
      data.productImages = productDetails.productImages;
    }
    data.colors = colors;
    addOrUpdateProduct(data)
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          setNotificationState({
            type: 'success',
            message: res.data.message,
            show: true
          });
          if (pid) {
            navigate(`/categories/${data.categoryId}`);
          } else {
            handlePopup(false);

          }
        } else {
          setNotificationState({
            type: 'error',
            message: res.data.message,
            show: true
          });
        }
      })
      .catch((err) => {
        setLoading(false);
        setNotificationState({
          type: 'error',
          message:
            err.response.status === 400
              ? err.response.data.error.message
              : err.message,
          show: true
        });
      });
  };

  const handleImageUpdate = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setImages(files.map(file => URL.createObjectURL(file)));
    } else {
      images.map(image => URL.revokeObjectURL(image));
      setImages([]);
    }
  };

  const removeImage = (url) => {
    if (pid) {
      const publicId = url.match(/\/v\d+\/(.+)\.\w{3,4}$/);
      removeFromCloudinary(publicId[0]);
    }
    setImages(images.filter(img => img !== url));
  }

  const handleChangeColor = (e, i) => {
    const newColors = [...colors];
    newColors[i] = e.target.value;
    setColors(newColors);
  };

  const removeColor = (color) => {
    const newColors = colors.filter(c => c !== color);
    setColors(newColors);
  }

  const addNewColor = () => {
    setColors([...colors, '']);
  };

  return (
    <>
      <Breadcrumb pages={pages} />
      <form
        className='space-y-8 divide-y divide-gray-200 overflow-auto'
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className='space-y-8 divide-y divide-gray-200 sm:space-y-5'>
          <div>
            {productDetails && productDetails._id && (
              <input
                type='hidden'
                name='id'
                {...register('id')}
                value={productDetails._id}
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
                      defaultValue={productDetails && productDetails.name}
                      className='text-input'
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
                    defaultValue={productDetails && productDetails.description}
                    className='max-w-lg text-input'
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
                    <div key={color + index} className="relative group">
                      <input
                        type='color'
                        defaultValue={color}
                        className='my-auto h-8'
                        onChange={(e) => handleChangeColor(e, index)}
                      />
                      <button
                        className='absolute top-full left-0 right-0 text-gray-200 bg-red-900 rounded-md text-sm invisible group-hover:visible'
                        onClick={() => removeColor(color)}
                      >
                        Delete
                      </button>
                    </div>
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
                          required: true,
                          onChange: (e) => handleImageUpdate(e)
                        })}
                      />
                    </label>
                    {images && images.length > 0 && (
                      <div className='grid'>
                        {images.map((image, index) => (
                          <div key={image} className='relative group'>
                            <img
                              src={image}
                              alt={image}
                              className='m-2 w-32 object-contain rounded-md'
                            />
                            <button
                              type="button"
                              className='absolute top-0 right-0 text-gray-200 rounded-md text-sm invisible group-hover:visible'
                              onClick={() => removeImage(image)}
                            >
                              <XCircleIcon className='h-6 w-6 text-red-800' />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                <label
                  htmlFor='username'
                  className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                >
                  Price
                </label>
                <div className='mt-1 sm:mt-0 sm:col-span-2'>
                  <div className='max-w-xs relative mt-2 rounded-md shadow-sm'>
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-400">₹</span>
                    </div>
                    <input
                      type='number'
                      name='price'
                      id='price'
                      autoComplete='price'
                      defaultValue={productDetails && productDetails.price}
                      className='text-input py-1.5 pl-6'
                      {...register('price', {
                        required: true
                      })}
                    />
                  </div>
                </div>
              </div>
              <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                <label
                  htmlFor='cover-photo'
                  className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                >Show/Hide</label>
                <Controller
                  name="isVisible"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Switch
                      checked={value}
                      onChange={onChange}
                      className={`${value ? 'bg-indigo-600' : 'bg-gray-200'
                        } relative inline-flex items-center h-6 rounded-full w-11`}
                    >
                      <span className="sr-only">Show/Hide</span>
                      <span
                        className={`${value ? 'translate-x-6' : 'translate-x-1'
                          } inline-block w-4 h-4 transform bg-white rounded-full`}
                      />
                    </Switch>
                  )}
                />
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
    </>
  );
};