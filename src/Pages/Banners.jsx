import { EyeIcon, PencilIcon } from '@heroicons/react/solid';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBanners, getCategories } from '../services';
import Breadcrumb from '../Components/Breadcrumbs';
import { getImageUrl } from '../utils';
import { PlusCircleIcon } from '@heroicons/react/outline';
import { NotificationContext } from '../Layout';
import BannerCard from '../Components/BannerCard';

const pages = [
  {
    name: 'Banners',
    href: '/banners',
    current: true
  }
];

export default function Banners() {
  const { setNotificationState } = useContext(NotificationContext);

  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState([]);
  useEffect(() => {
    getBanners()
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          setBanners(res.data.data);
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
    setLoading(false);
  }, []);
  if (loading) {
    return (
      <div className='relative'>
        <div className='absolute inset-0 animate-pulse m-3 font-bold '>
          Loading...
        </div>
      </div>
    );
  }
  if (banners.length === 0) {
    return (
      <div className='relative h-full w-full'>
        <div className='absolute inset-0'>
          <span className='flex items-center gap-1'>
            No banners found.
            <Link
              to={`/banners/new`}
              className='flex justify-center items-center text-teal-600 hover:text-teal-700'
            >
              Click to add new Banner
            </Link>
          </span>
        </div>
      </div>
    );
  }
  return (
    <>
      <Breadcrumb pages={pages} />
      <div>
        <div className='-mt-6 flex justify-end items-center'>
          <Link
            to={`/banners/new`}
            className='inline-flex justify-center items-center px-2 border border-gray-300 rounded-md text-gray-700 bg-transparent hover:bg-gray-200 hover:border-gray-200'
          >
            Add New Banner
            <PlusCircleIcon className='border-l border-gray-300 ml-1 pl-1 h-6 w-6' />
          </Link>
        </div>
      </div>
      <div className='mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
        {banners.map((banner) => (
          <BannerCard key={banner._id} banner={banner} />
        ))}
      </div>
    </>
  );
}
