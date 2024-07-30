import { Link } from "react-router-dom";
import { getImageUrl } from "../utils";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/outline";
import { useContext } from "react";
import { WindowWidthContext } from "../Layout";

export default function PortfolioCard({ feature, handleDelete }) {
  const isMobile = useContext(WindowWidthContext);
  return (
    <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8">
      <div className="mt-6">
        <h3 className="mt-4 text-lg font-medium tracking-tight text-gray-900">
          {feature.title}
        </h3>
        <p className="mt-1 text-base text-gray-500 h-20 text-clip overflow-hidden">
          {feature.description.replaceAll('"', "")}
        </p>
        <img
          src={getImageUrl(feature.coverImage, isMobile)}
          className="mt-1 w-full h-36 rounded-xl object-scale-down"
          alt={feature._id}
        />
      </div>
      <div className="-my-6 flex items-center justify-center">
        <Link to={`/portfolio/edit/${feature._id}`}>
          <PencilIcon className="m-1 mt-8 p-2 text-gray-600 hover:text-gray-900 h-8 w-8 border rounded-full hover:shadow" />
        </Link>
        <button type="button" onClick={() => handleDelete(feature._id)}>
          <TrashIcon className="m-1 mt-8 p-2 text-gray-600 hover:text-gray-900 h-8 w-8 border rounded-full hover:shadow" />
        </button>
      </div>
    </div>
  );
}
