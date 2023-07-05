import { EyeIcon, PencilIcon } from '@heroicons/react/solid';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../../services';
import Breadcrumb from '../../Components/Breadcrumbs';
import { PlusCircleIcon } from '@heroicons/react/outline';
import { NotificationContext } from '../../Layout';
import CategoryCard from '../../Components/CategoryCard';

const pages = [
  {
    name: 'Categories',
    href: '/',
    current: true
  }
]

export default function AllCategories() {
  const { setNotificationState } = useContext(NotificationContext);

  const [loading, setLoading] = useState(true);
  const [parentCategories, setParentCategories] = useState([]);
  useEffect(() => {
    getCategories()
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          setParentCategories(res.data.data);
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
  }, []);
  if (loading) {
    return <div className='animate-pulse m-3 font-bold '>Loading...</div>;
  }
  if (parentCategories.length === 0) {
    return <><div className='m-3 font-bold '>No Categories</div><div className='-mt-6 flex justify-end items-center'>
      <Link
        to={`/categories/new`}
        className='inline-flex justify-center items-center px-2 border border-gray-300 rounded-md text-gray-700 bg-transparent hover:bg-gray-200 hover:border-gray-200'
      >Add New Category<PlusCircleIcon className='border-l border-gray-300 ml-1 pl-1 h-6 w-6' /></Link>
    </div></>;
  }
  return (
    <>
      <Breadcrumb pages={pages} />
      <div>
        <div className='-mt-6 flex justify-end items-center'>
          <Link
            to={`/categories/new`}
            className='inline-flex justify-center items-center px-2 border border-gray-300 rounded-md text-gray-700 bg-transparent hover:bg-gray-200 hover:border-gray-200'
          >Add New Category<PlusCircleIcon className='border-l border-gray-300 ml-1 pl-1 h-6 w-6' /></Link>
        </div>
      </div>
      <div className='mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
        {parentCategories.map((feature) => (
          <div key={feature._id} className='pt-6'>
            <CategoryCard key={feature._id} feature={feature} />
          </div>
        ))}
      </div>
    </>
  );
}
