/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Switch } from '@headlessui/react';
import { useEffect } from 'react';
import {
  addBanner,
  addOrUpdateCategories,
  getCategories,
  uploadToCloudinary
} from '../services';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from '../Layout';
import Breadcrumb from '../Components/Breadcrumbs';
import LoaderSvg from '../Components/LoaderSvg';
import { ErrorMessage } from '@hookform/error-message';
import { classNames } from '../utils';



export default function BannerForm() {
  const navigate = useNavigate();
  const { setNotificationState } = useContext(NotificationContext);

  const [cover, setCover] = useState('');
  const [pages, setPages] = useState([
    {
      name: 'Banners',
      href: '/banners',
      current: false
    },
    {
      name: 'Add new',
      href: `/banners/new`,
      current: true
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [parentCategories, setParentCategories] = useState([]);

  useEffect(() => {
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
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    if (data.banner[0]) {
      const iconData = new FormData();
      iconData.append('file', data.banner[0]);
      iconData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_PRESET);
      iconData.append('folder', 'banners/');
      const icon = await uploadToCloudinary(iconData);
      data.image = icon.public_id;
    }

    addBanner(data)
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          setNotificationState({
            type: 'success',
            message: res.data.message,
            show: true
          });
          navigate('/banners/');
        } else {
          setNotificationState({
            type: 'success',
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

  const handleCoverChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setCover(URL.createObjectURL(e.target.files[0]));
    } else {
      URL.revokeObjectURL(cover);
      setCover('');
    }
  };
  return (
    <>
      <Breadcrumb pages={pages} />
      <form
        className='space-y-8 divide-y divide-gray-200'
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className='space-y-8 divide-y divide-gray-200 sm:space-y-5'>
          <div>
            <div className='mt-6 sm:mt-5 space-y-6 sm:space-y-5'>
              <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                <label
                  htmlFor='username'
                  className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                >
                  Select Category
                </label>
                <div className='mt-1 sm:mt-0 sm:col-span-2'>
                  <div className='max-w-lg flex rounded-md shadow-sm'>
                    <select
                      id='categoryId'
                      name='categoryId'
                      className='block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6'
                      defaultValue=''
                      {...register('categoryId')}
                    >
                      <option disabled value=''>
                        Select
                      </option>
                      <option value='all'>All (Home)</option>
                      {parentCategories.map((cat, index) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                <label
                  htmlFor='banner'
                  className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                >
                  Cover Image
                </label>
                <div className='mt-1 sm:mt-0 sm:col-span-2'>
                  <div className='flex items-center'>
                    <label
                      htmlFor='banner'
                      className='bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none'
                    >
                      <span>Upload Cover (Desktop/Tablet)</span>
                      <input
                        id='banner'
                        type='file'
                        accept='image/*'
                        className='sr-only'
                        {...register('banner', {
                          required: 'Banner image is required',
                          onChange: (e) => handleCoverChange(e)
                        })}
                      />
                    </label>
                    {cover && (
                      <img
                        src={cover}
                        alt='banner'
                        className='m-2 w-32 h-16 object-contain'
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='pt-5'>
          <div className='flex justify-end'>
            <ErrorMessage
              errors={errors}
              name='multipleErrorInput'
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
