/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import { NotificationContext, WindowWidthContext } from '../../Layout';
import { Controller, useForm } from 'react-hook-form';
import { Switch } from '@headlessui/react';
import {
  getProductsById,
  addOrUpdateProduct,
  uploadToCloudinary,
  removeFromCloudinary
} from '../../services';
import { XCircleIcon } from '@heroicons/react/solid';
import { classNames, getImageUrl } from '../../utils';
import MarkDownInput from '../../Components/MarkDownInput';
import LoaderSvg from '../../Components/LoaderSvg';
import { useParams } from 'react-router';

export default function Product({
  categoryId = '',
  productId = '',
  handlePopup
}) {
  let { pid } = useParams();
  pid = productId ? productId : pid;
  const { setNotificationState } = useContext(NotificationContext);
  const isMobile = useContext(WindowWidthContext);
  const [productDetails, setProductDetails] = useState(null);
  const [errors, setErrors] = useState([]);
  const [colors, setColors] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!categoryId) {
      getProductsById(pid)
        .then((res) => {
          if (res.data.success) {
            const product = res.data.data;

            if (product.colors) {
              setColors(product.colors);
            }
            if (product.productImages) {
              setImages(
                product.productImages.map((img) => getImageUrl(img, isMobile))
              );
            }
            setProductDetails(product);
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
  }, []);

  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, control, setValue } = useForm();

  useEffect(() => {
    setValue('name', productDetails?.name ?? '');
    setValue('description', productDetails?.description ?? '');
    setValue('price', productDetails?.price ?? '');
    setValue('isVisible', productDetails?.isVisible ?? '');
    setValue('colors', productDetails?.colors ?? []);
  }, [productDetails]);

  const onSubmit = async (data) => {
    data.categoryId = categoryId ? categoryId : productDetails.categoryId;
    setLoading(true);
    if (!pid && data.productImages.length > 0) {
      const files = Array.from(data.productImages);
      data.productImages = await Promise.all(
        files.map(async (img, i) => {
          const productData = new FormData();
          productData.append('file', img);
          productData.append(
            'upload_preset',
            process.env.REACT_APP_CLOUDINARY_PRESET
          );
          productData.append('folder', `products/${data.categoryId}/`);

          const icon = await uploadToCloudinary(productData);
          return icon.public_id;
        })
      );
    } else {
      data.productImages = productDetails.productImages;
    }
    console.log(data);
    addOrUpdateProduct(data)
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          setNotificationState({
            type: 'success',
            message: res.data.message,
            show: true
          });
          handlePopup(false);
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
      setImages(files.map((file) => URL.createObjectURL(file)));
    } else {
      images.map((image) => URL.revokeObjectURL(image));
      setImages([]);
    }
  };

  const removeImage = (url) => {
    if (pid) {
      const publicId = url.match(/\/v\d+\/(.+)\.\w{3,4}$/);
      removeFromCloudinary(publicId[0]);
    }
    setImages(images.filter((img) => img !== url));
  };

  const removeColor = (color) => {
    const newColors = colors.filter((c) => c !== color);
    setColors(newColors);
    setValue('colors', newColors);
  };

  const addNewColor = () => {
    setColors([...colors, '']);
  };

  const onErrors = (errs) => {
    const keys = Object.keys(errs);
    setErrors(
      keys.map((key) => {
        return { key, message: errs[key].message };
      })
    );
  };

  return (
    <>
      <form
        className='space-y-8 divide-y divide-gray-200 overflow-auto'
        onSubmit={handleSubmit(onSubmit, onErrors)}
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
                  htmlFor='name'
                  className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                >
                  Name
                </label>
                <div className='mt-1 sm:mt-0 sm:col-span-2'>
                  <div className='max-w-lg flex rounded-md shadow-sm'>
                    <input
                      type='text'
                      id='name'
                      className='text-input'
                      {...register('name', {
                        required: 'Product name is required'
                      })}
                      placeholder='Enter name of Product Category, e.g. Sofa'
                    />
                  </div>
                </div>
              </div>

              <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                <span className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'>
                  Description
                </span>
                <div className='mt-1 sm:mt-0 sm:col-span-2'>
                  {/* <input
                      type='text'
                      id='description'
                      className='text-input'
                      {...register('description')}
                      placeholder='Enter description of Product Category'
                    /> */}
                  <Controller
                    control={control}
                    name='description'
                    render={({ field }) => (
                      <MarkDownInput
                        id='description'
                        {...field}
                        defaultValue={
                          productDetails && productDetails.description
                        }
                      />
                    )}
                  />
                </div>
              </div>

              <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5'>
                <span className='block text-sm font-medium text-gray-700'>
                  Color options
                </span>
                <div className='mt-1 sm:mt-0 sm:col-span-2 flex item-center'>
                  {colors.map((color, index) => (
                    <div key={color + index} className='relative group'>
                      <input
                        id={`colors[${index}]`}
                        type='color'
                        className='my-auto h-8'
                        {...register(`colors[${index}]`)}
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
                    type='button'
                    className='bg-white mx-1 py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none'
                    onClick={() => addNewColor()}
                  >
                    Add Color
                  </button>
                </div>
              </div>

              <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                <span className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'>
                  Product Images
                </span>
                <div className='mt-1 sm:mt-0 sm:col-span-2'>
                  <div className='flex items-center'>
                    <label
                      htmlFor='productImages'
                      className='bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none'
                    >
                      <span>Upload Images</span>
                      <input
                        id='productImages'
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
                      <div className='grid'>
                        {images.map((image, index) => (
                          <div key={image} className='relative group'>
                            <img
                              src={image}
                              alt={image}
                              className='m-2 w-32 object-contain rounded-md'
                            />
                            <button
                              type='button'
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
                  htmlFor='price'
                  className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                >
                  Price
                </label>
                <div className='mt-1 sm:mt-0 sm:col-span-2'>
                  <div className='max-w-xs relative mt-2 rounded-md shadow-sm'>
                    <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                      <span className='text-gray-400'>₹</span>
                    </div>
                    <input
                      type='number'
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
                <span className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'>
                  Show/Hide
                </span>
                <Controller
                  id='isVisible'
                  name='isVisible'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Switch
                      checked={value}
                      defaultChecked={
                        productDetails ? productDetails.isVisible : true
                      }
                      onChange={onChange}
                      className={`${value ? 'bg-indigo-600' : 'bg-gray-200'
                        } relative inline-flex items-center h-6 rounded-full w-11`}
                    >
                      <span className='sr-only'>Show/Hide</span>
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
            <div className='text-sm text-red-500'>
              {errors &&
                errors.length > 0 &&
                errors.map((error) => (
                  <p key={error}>
                    {error.key}:{error.message}
                  </p>
                ))}
            </div>
            <button
              id='product-submit'
              type='submit'
              className={classNames(
                loading ? 'cursor-not-allowed animate-pulse' : '',
                'ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none'
              )}
            >
              Save
              {loading && <LoaderSvg />}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
