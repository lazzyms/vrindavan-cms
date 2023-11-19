import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllWishlists, getAllWishlistsByUser } from '../services';
import Breadcrumb from '../Components/Breadcrumbs';
import { ArrowLeftIcon, ArrowRightIcon, PlusCircleIcon } from '@heroicons/react/outline';
import { NotificationContext } from '../Layout';
import BannerCard from '../Components/BannerCard';
import { classNames, getImageUrl } from '../utils';
import ProductCard from '../Components/ProductCard';

const pages = [
  {
    name: 'Wishlists',
    href: '/wishlists',
    current: true
  }
];

export default function Wishlists() {
  const totalPages = 2;
  const { setNotificationState } = useContext(NotificationContext);
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true);
  const [wishlists, setWishlists] = useState([]);
  useEffect(() => {
    getAllWishlists(page)
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          setWishlists(res.data.data);
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
  if (wishlists.length === 0) {
    return (
      <div className='relative h-full w-full'>
        <div className='absolute inset-0'>
          <span className='flex items-center gap-1'>
            No item found in any user's wishlist.
          </span>
        </div>
      </div>
    );
  }
  return (
    <>
      <Breadcrumb pages={pages} />
      <div className="">
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className='flex-row'>
                {wishlists.map(item => (
                  <div
                    key={item._id}
                    className={classNames(
                      'flex gap-2 border rounded p-6 items-center my-2'
                    )}
                  >
                    <img src={getImageUrl(item.product.productImages[0])} className='mt-1 h-52 rounded-xl object-scale-down' alt={item.product.name} />
                    <div className="mt-2">

                      <h3 className="mt-2 text-base font-semibold leading-6 text-gray-900">
                        {item.product.name}
                      </h3>
                      <h3 className='text-lg font-medium tracking-tight text-gray-800'>
                        ₹{item.product.price}
                      </h3>
                      {item.product.description.replaceAll('"', '') ? (
                        <div
                          className='my-auto text-base text-gray-500 h-28 text-clip overflow-auto border border-dashed p-1 rounded'
                          dangerouslySetInnerHTML={{
                            __html: item.product.description.replaceAll('"', '')
                          }}
                        />
                      ) : (
                        <p className='my-auto text-base text-gray-500 h-20 text-clip overflow-auto'>
                          No description provided
                        </p>
                      )}

                    </div>
                    <div className="w-full h-full">
                      <p className='my-auto text-base text-gray-700'>
                        Wish of: <a className='text-blue-700' href={`mailto:${item.email}`}>{item.email}</a>
                      </p>
                      <p className='text-gray-600'>Created At: {new Date(item.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <nav className='mt-4 flex items-center justify-between border-gray-200 px-4 sm:px-0'>
                  <div className=' flex w-0 flex-1'>
                    <button
                      className={classNames(
                        page === 1 ? 'hidden' : 'inline-flex',
                        'items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      )}
                      onClick={() => setPage(page - 1)}
                    >
                      <ArrowLeftIcon
                        className='mr-3 h-5 w-5 text-gray-400'
                        aria-hidden='true'
                      />
                      Previous
                    </button>
                  </div>
                  <div className='hidden md:-mt-px md:flex'>
                    {[...Array(totalPages).keys()].map((i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={classNames(
                          i + 1 === page
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                          'inline-flex items-center border-t-2 px-4 pt-1 text-sm font-medium'
                        )}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <div className='-mt-px flex w-0 flex-1 justify-end'>
                    <button
                      className={classNames(
                        page === totalPages ? 'hidden' : 'inline-flex',
                        'items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      )}
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                      <ArrowRightIcon
                        className='ml-3 h-5 w-5 text-gray-400'
                        aria-hidden='true'
                      />
                    </button>
                  </div>
                </nav>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
