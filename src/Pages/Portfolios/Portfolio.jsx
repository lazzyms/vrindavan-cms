import { Link } from "react-router-dom";
import Breadcrumb from "../../Components/Breadcrumbs";
import ErrorBoundary from "../../Components/ErrorBoundry";
import { PlusCircleIcon } from "@heroicons/react/outline";

const pages = [
  {
    name: "Portfolios",
    href: "/portfolio",
    current: true,
  },
];

const Portfolio = () => {
  return (
    <>
      <Breadcrumb pages={pages} />
      <div>
        <div className="-mt-6 flex justify-end items-center">
          <Link
            to={`/portfolio/new`}
            className="inline-flex justify-center items-center px-2 border border-gray-300 rounded-md text-gray-700 bg-transparent hover:bg-gray-200 hover:border-gray-200"
          >
            Add New
            <PlusCircleIcon className="border-l border-gray-300 ml-1 pl-1 h-6 w-6" />
          </Link>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"></div>
    </>
  );
};

export default Portfolio;
