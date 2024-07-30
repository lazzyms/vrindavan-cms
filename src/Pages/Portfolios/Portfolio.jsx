import { Link } from "react-router-dom";
import Breadcrumb from "../../Components/Breadcrumbs";
import ErrorBoundary from "../../Components/ErrorBoundry";
import { PlusCircleIcon } from "@heroicons/react/outline";
import { useContext, useEffect, useState } from "react";
import { deletePortfolioById, getPortfolios } from "../../services";
import { NotificationContext } from "../../Layout";
import PortfolioCard from "../../Components/PortfolioCard";
import ConfirmDialouge from "../../Components/ConfirmDialouge";

const pages = [
  {
    name: "Portfolios",
    href: "/portfolio",
    current: true,
  },
];

const Portfolio = () => {
  const { setNotificationState } = useContext(NotificationContext);

  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPortfolios()
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          setPortfolios(res.data.data.items);
        }
      })
      .catch((err) => {
        setLoading(false);
        setNotificationState({
          type: "error",
          message:
            err.response.status === 400
              ? err.response.data.error.message
              : err.message,
          show: true,
        });
      });
  }, []);

  const [catDeleteModal, setCatDeleteModal] = useState(false);

  const handleDelete = (id) => {
    deletePortfolioById(id)
      .then((res) => {
        if (res.data.success) {
          setPortfolios(portfolios.filter((item) => item._id !== id));
          setCatDeleteModal(false);
        }
      })
      .catch((err) => {
        setNotificationState({
          type: "error",
          message:
            err.response.status === 400
              ? err.response.data.error.message
              : err.message,
          show: true,
        });
      });
  };

  const handleDeleteModal = (id) => {
    setCatDeleteModal(true);
    // handleDelete(id);
  };

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
      <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="animate-pulse m-3 font-bold">
            <div className="">
              <div className="mx-auto px-4 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between">
                <h2 className="bg-gray-400 h-12 w-80 rounded sm:text-4xl">
                  <span className="block"></span>
                </h2>
                <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                  <div className="inline-flex rounded-md shadow">
                    <Link
                      to="/portfolio"
                      className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    ></Link>
                  </div>
                  <div className="ml-3 inline-flex rounded-md shadow">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                    ></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          portfolios &&
          portfolios.length > 0 &&
          portfolios.map((feature) => (
            <div key={feature._id} className="pt-6">
              <PortfolioCard
                key={feature._id}
                feature={feature}
                handleDelete={handleDeleteModal}
              />
              <ErrorBoundary>
                <ConfirmDialouge
                  id={feature._id}
                  open={catDeleteModal}
                  setOpen={(e) => setCatDeleteModal(e)}
                  message="Warning: You are about to remove the item and all its contents. This is a permanent action and cannot be reversed. Please confirm if you want to proceed."
                  title={`Delete ${feature.title}`}
                  handleAction={(e) => handleDelete(e)}
                />
              </ErrorBoundary>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Portfolio;
