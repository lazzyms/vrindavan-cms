import { Link } from "react-router-dom";
import { getImageUrl } from "../utils";
import { EyeIcon, PencilIcon } from "@heroicons/react/outline";
import { useContext } from "react";
import { WindowWidthContext } from "../Layout";

export default function CategoryCard({ feature }) {
  const isMobile = useContext(WindowWidthContext);
  return (
    <div className='flow-root rounded-lg bg-gray-50 px-6 pb-8'>
      <div className='-mt-6'>
        <div className='flex items-center justify-between'>
          <span className='inline-flex items-center justify-center rounded-md bg-gray-300 p-3 shadow-lg'>
            <img
              src={getImageUrl(feature.icon, isMobile)}
              className='h-12 w-12 object-scale-down'
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
        <p className='mt-1 text-base text-gray-500 h-20 text-clip overflow-hidden'>
          {feature.description.replaceAll('"', '')}
        </p>
        <img
          src={getImageUrl(feature.coverImage, isMobile)}
          className='mt-1 w-full h-36 rounded-xl object-scale-down'
          alt={feature._id}
        />
      </div>
    </div>
  );
}