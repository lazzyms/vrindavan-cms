import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { changePassword } from "../../services";
import Breadcrumb from "../../Components/Breadcrumbs";
import { NotificationContext } from "../../Layout";
import LoaderSvg from "../../Components/LoaderSvg";
import { classNames } from "../../utils";
import {
  handleApiError,
  extractValidationErrors,
} from "../../utils/errorHandler";

const pages = [
  {
    name: "Change Password",
    href: "/change-password",
    current: true,
  },
];

export default function ChangePassword() {
  const navigate = useNavigate();
  const { setNotificationState } = useContext(NotificationContext);
  const [loading, setLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const watchNewPassword = watch("newPassword");

  const onSubmit = async (data) => {
    setLoading(true);
    setApiErrors({});

    if (data.newPassword !== data.confirmPassword) {
      setNotificationState({
        type: "error",
        message: "New passwords do not match",
        show: true,
      });
      setLoading(false);
      return;
    }

    try {
      const response = await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (response.data.success) {
        setNotificationState({
          type: "success",
          message: "Password changed successfully",
          show: true,
        });
        reset();
        // Optionally redirect to login to re-authenticate
        // navigate("/login");
      } else {
        const errorMessage =
          response.data.message ||
          response.data.error?.message ||
          "Failed to change password";
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

  return (
    <>
      <Breadcrumb pages={pages} />

      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
              Change Password
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Current Password */}
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Current Password
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    id="currentPassword"
                    autoComplete="current-password"
                    className={classNames(
                      errors.currentPassword
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500",
                      "shadow-sm block w-full sm:text-sm rounded-md"
                    )}
                    placeholder="Enter current password"
                    {...register("currentPassword", {
                      required: "Current password is required",
                    })}
                  />
                  {errors.currentPassword && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.currentPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {/* New Password */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    id="newPassword"
                    autoComplete="new-password"
                    className={classNames(
                      errors.newPassword
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500",
                      "shadow-sm block w-full sm:text-sm rounded-md"
                    )}
                    placeholder="Enter new password"
                    {...register("newPassword", {
                      required: "New password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters long",
                      },
                    })}
                  />
                  {errors.newPassword && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm New Password
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
                    placeholder="Confirm new password"
                    {...register("confirmPassword", {
                      required: "Please confirm your new password",
                      validate: (value) =>
                        value === watchNewPassword || "Passwords do not match",
                    })}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
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
                  Change Password
                  {loading && <LoaderSvg />}
                </button>
              </div>
            </form>

            {/* Password Requirements */}
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Password Requirements:
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• At least 8 characters long</li>
                <li>• Should be different from your current password</li>
                <li>• Use a strong, unique password</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
