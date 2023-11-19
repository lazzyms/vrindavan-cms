import { classNames, getImageUrl } from '../utils';
import { EyeIcon, TrashIcon } from '@heroicons/react/outline';
import ErrorBoundary from './ErrorBoundry';
import ConfirmDialouge from './ConfirmDialouge';
import Popup from './Popup';
import Product from '../Pages/Categories/Product';
import { useContext, useState } from 'react';
import { WindowWidthContext } from '../Layout';
import { useNavigate } from 'react-router-dom';
import { deleteProduct } from '../services';

export default function ProductCard({ product, showControls = true }) {
  const navigate = useNavigate();
  const [insertForm, setInsertForm] = useState(false);
  const [prodDeleteModal, setProdDeleteModal] = useState(false);
  const isMobile = useContext(WindowWidthContext);

  const removeProduct = (pid) => {
    deleteProduct(pid).then((res) => {
      setProdDeleteModal(false);
      navigate(`/categories/${product.categoryId}`);
    });
  };
  return (
    <div className='pt-4'>
      <div
        className={classNames(
          product.isVisible ? 'bg-gray-50' : 'bg-black/10',
          'flow-root rounded-lg bg-gray-50  h-full',
          showControls ? 'shadow-md' : 'border'
        )}
      >
        <div className='mx-4'>
          <img
            src={
              product.productImages
                ? getImageUrl(product.productImages[0], isMobile)
                : getImageUrl()
            }
            className='mt-1 w-full h-36 rounded-xl object-scale-down'
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
          {product.description.replaceAll('"', '') ? (
            <div
              className='mt-1 text-base text-gray-600 h-12 text-clip overflow-hidden prose'
              dangerouslySetInnerHTML={{
                __html: product.description.replaceAll('"', '')
              }}
            />
          ) : (
            <p className='mt-1 h-12 text-base text-gray-400'>
              No description provided
            </p>
          )}
        </div>
        {showControls &&
          <div className='isolate inline-flex rounded-md w-full border-t'>
            <button
              type='button'
              className='relative inline-flex items-center justify-center hover:shadow-md rounded-l-md px-2 py-2 text-sm font-semibold w-1/2 border-r'
              onClick={() => setInsertForm(true)}
            >
              <EyeIcon className='h-6 w-6 text-gray-700' />
              <span className='px-2 text-gray-700'>Edit</span>
            </button>
            <Popup
              heading={
                <>
                  Edit: <b>{product.name}</b>
                </>
              }
              open={insertForm}
              setOpen={setInsertForm}
              content={
                <Product handlePopup={setInsertForm} productId={product._id} />
              }
            />
            <button
              className='relative -ml-px inline-flex items-center justify-center hover:shadow-md rounded-r-md px-2 py-2 text-sm font-semibold w-1/2 border-l'
              onClick={() => setProdDeleteModal(true)}
            >
              <TrashIcon className='h-6 w-6 text-red-400' />
              <span className='px-2 text-red-400'>Delete</span>
            </button>
          </div>
        }
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
    </div>
  );
}
