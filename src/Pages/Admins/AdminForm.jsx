import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { createAdmin, updateAdmin, getAdmins } from "../../services";
import Breadcrumb from "../../Components/Breadcrumbs";
import { NotificationContext } from "../../Layout";
import LoaderSvg from "../../Components/LoaderSvg";
import { Switch } from "@headlessui/react";
import { classNames } from "../../utils";
import {
  handleApiError,
  extractValidationErrors,
} from "../../utils/errorHandler";

export default function AdminForm() {
  const navigate = useNavigate();
  const { setNotificationState } = useContext(NotificationContext);
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEdit);
  const [apiErrors, setApiErrors] = useState({});
  const [pages] = useState([
    {
      name: "Admin Management",
      href: "/admins",
      current: false,
    },
    {
      name: isEdit ? "Edit Admin" : "Add new",
      href: isEdit ? `/admins/edit/${id}` : `/admins/new`,
      current: true,
    },
  ]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      role: "ADMIN",
      isActive: true,
    },
  });

  const watchPassword = watch("password");

  // Load admin data for editing
  useEffect(() => {
    if (isEdit && id) {
      loadAdminData();
    }
  }, [isEdit, id]);

  const loadAdminData = async () => {
    setPageLoading(true);
    try {
      // Get the specific admin data
      const response = await getAdmins({ adminId: id });
      if (response.data.success) {
        const adminData = response.data.data.admins?.[0] || response.data.data;
        if (adminData) {
          setValue("email", adminData.email || "");
          setValue("role", adminData.role || "ADMIN");
          setValue(
            "isActive",
            adminData.isActive !== undefined ? adminData.isActive : true
          );
        }
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setNotificationState({
        type: "error",
        message: `Failed to load admin data: ${errorMessage}`,
        show: true,
      });
    } finally {
      setPageLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setApiErrors({});

    // Validation for passwords
    if (!isEdit && data.password !== data.confirmPassword) {
      setNotificationState({
        type: "error",
        message: "Passwords do not match",
        show: true,
      });
      setLoading(false);
      return;
    }

    const submitData = {
      email: data.email,
      role: data.role,
      isActive: data.isActive,
    };

    if (!isEdit) {
      submitData.password = data.password;
    }

    try {
      const response = isEdit
        ? await updateAdmin(id, submitData)
        : await createAdmin(submitData);

      if (response.data.success) {
        setNotificationState({
          type: "success",
          message: isEdit
            ? "Admin updated successfully"
            : "Admin created successfully",
          show: true,
        });
        navigate("/admins");
      } else {
        const errorMessage =
          response.data.message ||
          response.data.error?.message ||
          "An error occurred";
        setNotificationState({
          type: "error",
          message: errorMessage,
          show: true,
        });
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      const validationErrors = extractValidationErrors(err);

      if (Object.keys(validationErrors).length > 0) {
        setApiErrors(validationErrors);
        setNotificationState({
          type: "error",
          message: "Please check the form for errors",
          show: true,
        });
      } else {
        setNotificationState({
          type: "error",
          message: errorMessage,
          show: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <>
        <Breadcrumb pages={pages} />
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <LoaderSvg />
            <p className="mt-2 text-sm text-gray-500">Loading admin data...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb pages={pages} />

      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
              {isEdit ? "Edit Admin" : "Create New Admin"}
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    id="email"
                    autoComplete="email"
                    className={classNames(
                      errors.email || apiErrors.email
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500",
                      "shadow-sm block w-full sm:text-sm rounded-md"
                    )}
                    placeholder="admin@example.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {(errors.email || apiErrors.email) && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.email?.message || apiErrors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Role Field */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700"
                >
                  Role
                </label>
                <div className="mt-1">
                  <select
                    id="role"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    {...register("role", { required: "Role is required" })}
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="PRODUCT">Product Manager</option>
                    <option value="SUPERADMIN">Super Admin</option>
                  </select>
                  {errors.role && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.role.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Password Fields (only for create) */}
              {!isEdit && (
                <>
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        className={classNames(
                          errors.password
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500",
                          "shadow-sm block w-full sm:text-sm rounded-md"
                        )}
                        placeholder="Enter password"
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 8,
                            message:
                              "Password must be at least 8 characters long",
                          },
                        })}
                      />
                      {errors.password && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Confirm Password
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        id="confirmPassword"
                        autoComplete="new-password"
                        className={classNames(
                          errors.confirmPassword
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500",
                          "shadow-sm block w-full sm:text-sm rounded-md"
                        )}
                        placeholder="Confirm password"
                        {...register("confirmPassword", {
                          required: "Please confirm your password",
                          validate: (value) =>
                            value === watchPassword || "Passwords do not match",
                        })}
                      />
                      {errors.confirmPassword && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Active Status */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700">
                    Account Status
                  </label>
                  <p className="text-sm text-gray-500">
                    Active accounts can log in to the system
                  </p>
                </div>
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Switch
                      checked={value}
                      onChange={onChange}
                      className={classNames(
                        value ? "bg-indigo-600" : "bg-gray-200",
                        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      )}
                    >
                      <span className="sr-only">Account active</span>
                      <span
                        aria-hidden="true"
                        className={classNames(
                          value ? "translate-x-5" : "translate-x-0",
                          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                        )}
                      />
                    </Switch>
                  )}
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate("/admins")}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={classNames(
                    loading
                      ? "cursor-not-allowed bg-indigo-300"
                      : "cursor-pointer bg-indigo-600 hover:bg-indigo-700",
                    "inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  )}
                >
                  {isEdit ? "Update Admin" : "Create Admin"}
                  {loading && <LoaderSvg />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
