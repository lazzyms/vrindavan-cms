import React, { useContext, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { PlusCircleIcon, UserIcon } from "@heroicons/react/outline";
import { getAdmins, removeAdmin } from "../../services";
import Breadcrumb from "../../Components/Breadcrumbs";
import { NotificationContext } from "../../Layout";
import ConfirmDialogue from "../../Components/ConfirmDialouge";
import { handleApiError } from "../../utils/errorHandler";

const pages = [
  {
    name: "Admin Management",
    href: "/admins",
    current: true,
  },
];

export default function AllAdmins() {
  const { setNotificationState } = useContext(NotificationContext);
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState([]);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    role: "",
    search: "",
    isActive: true,
  });
  const [pagination, setPagination] = useState({});
  const [adminDeleteModal, setAdminDeleteModal] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState(null);

  const currentUserRole = localStorage.getItem("role");
  const isSuperAdmin = currentUserRole === "SUPERADMIN";

  const fetchAdmins = useCallback(() => {
    setLoading(true);
    getAdmins(filters)
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          setAdmins(res.data.data.admins || res.data.data);
          setPagination(res.data.data.pagination || {});
        }
      })
      .catch((err) => {
        setLoading(false);
        const errorMessage = handleApiError(err);
        setNotificationState({
          type: "error",
          message: errorMessage,
          show: true,
        });
      });
  }, [filters, setNotificationState]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      page: 1,
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleDelete = (id) => {
    removeAdmin(id)
      .then((res) => {
        if (res.data.success) {
          setAdmins(admins.filter((admin) => admin._id !== id));
          setAdminDeleteModal(false);
          setNotificationState({
            type: "success",
            message: "Admin removed successfully",
            show: true,
          });
        }
      })
      .catch((err) => {
        const errorMessage = handleApiError(err);
        setNotificationState({
          type: "error",
          message: errorMessage,
          show: true,
        });
      });
  };

  const handleDeleteModal = (id) => {
    setSelectedAdminId(id);
    setAdminDeleteModal(true);
  };

  if (loading) {
    return <div className="animate-pulse m-3 font-bold">Loading...</div>;
  }

  if (admins.length === 0 && !filters.search && !filters.role) {
    return (
      <>
        <Breadcrumb pages={pages} />
        <div className="text-center py-8">
          <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No admins</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new admin user.
          </p>
          {isSuperAdmin && (
            <div className="mt-6">
              <Link
                to="/admins/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusCircleIcon
                  className="-ml-1 mr-2 h-5 w-5"
                  aria-hidden="true"
                />
                New Admin
              </Link>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb pages={pages} />

      {/* Header with filters and add button */}
      <div className="mb-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex sm:space-x-4">
            {/* Search filter */}
            <input
              type="text"
              placeholder="Search by email..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="mb-2 sm:mb-0 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />

            {/* Role filter */}
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange("role", e.target.value)}
              className="mb-2 sm:mb-0 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="">All Roles</option>
              <option value="SUPERADMIN">Super Admin</option>
              <option value="ADMIN">Admin</option>
              <option value="PRODUCT">Product Manager</option>
            </select>

            {/* Status filter */}
            <select
              value={filters.isActive}
              onChange={(e) =>
                handleFilterChange("isActive", e.target.value === "true")
              }
              className="mb-2 sm:mb-0 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value={true}>Active Only</option>
              <option value={false}>Inactive Only</option>
            </select>
          </div>

          {isSuperAdmin && (
            <div className="mt-4 sm:mt-0">
              <Link
                to="/admins/new"
                className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Add New Admin
                <PlusCircleIcon className="border-l border-gray-300 ml-2 pl-2 h-5 w-5" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Admin table */}
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Created At
                    </th>
                    {isSuperAdmin && (
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {admins.map((admin) => (
                    <tr key={admin._id || admin.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {admin.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            admin.role === "SUPERADMIN"
                              ? "bg-purple-100 text-purple-800"
                              : admin.role === "ADMIN"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {admin.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            admin.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {admin.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </td>
                      {isSuperAdmin && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            to={`/admins/edit/${admin._id || admin.id}`}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() =>
                              handleDeleteModal(admin._id || admin.id)
                            }
                            className="text-red-600 hover:text-red-900"
                          >
                            Remove
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              disabled={!pagination.hasPrev}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              disabled={!pagination.hasNext}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page{" "}
                <span className="font-medium">{pagination.currentPage}</span> of{" "}
                <span className="font-medium">{pagination.totalPages}</span>
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  disabled={!pagination.hasPrev}
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  disabled={!pagination.hasNext}
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialogue
        id={selectedAdminId}
        open={adminDeleteModal}
        setOpen={setAdminDeleteModal}
        message="Warning: You are about to remove this admin user. This action cannot be reversed. The admin will lose access to the system immediately."
        title="Remove Admin"
        handleAction={handleDelete}
      />
    </>
  );
}
