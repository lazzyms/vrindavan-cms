/**
 * Handle API errors and return user-friendly error messages
 * @param {Error} error - The error object from axios or other sources
 * @returns {string} - User-friendly error message
 */
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;

    switch (status) {
      case 401:
        // Unauthorized - redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        window.location.href = "/login";
        return "Session expired. Please login again.";
      case 403:
        return "You do not have permission to perform this action";
      case 404:
        return "Resource not found";
      case 409:
        return data.message || data.error?.message || "Conflict occurred";
      case 422:
        return data.message || data.error?.message || "Validation error";
      case 500:
        return "Internal server error. Please try again later.";
      default:
        return data.message || data.error?.message || "An error occurred";
    }
  } else if (error.request) {
    return "Network error - please check your connection";
  } else {
    return error.message || "An unexpected error occurred";
  }
};

/**
 * Extract validation errors from API response
 * @param {Object} error - The error object from axios
 * @returns {Object} - Object with field-specific error messages
 */
export const extractValidationErrors = (error) => {
  const errors = {};

  if (error.response?.data?.errors) {
    // Handle express-validator errors
    error.response.data.errors.forEach((err) => {
      errors[err.param || err.field] = err.msg || err.message;
    });
  } else if (error.response?.data?.error?.details) {
    // Handle Joi validation errors
    error.response.data.error.details.forEach((detail) => {
      const field = detail.path?.[0] || detail.context?.key;
      if (field) {
        errors[field] = detail.message;
      }
    });
  }

  return errors;
};

/**
 * Check if error is a network error
 * @param {Error} error - The error object
 * @returns {boolean} - True if it's a network error
 */
export const isNetworkError = (error) => {
  return !error.response && error.request;
};

/**
 * Check if error is a server error (5xx status codes)
 * @param {Error} error - The error object
 * @returns {boolean} - True if it's a server error
 */
export const isServerError = (error) => {
  return error.response && error.response.status >= 500;
};

/**
 * Check if error is a client error (4xx status codes)
 * @param {Error} error - The error object
 * @returns {boolean} - True if it's a client error
 */
export const isClientError = (error) => {
  return (
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500
  );
};
