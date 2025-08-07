import React from "react";

export default function RoleGuard({ allowedRoles, children, fallback = null }) {
  const userRole = localStorage.getItem("role");

  if (!userRole || !allowedRoles.includes(userRole)) {
    return (
      fallback || (
        <div className="text-center py-8">
          <div className="text-red-600 text-lg font-medium">Access Denied</div>
          <p className="text-gray-500 mt-2">
            You don't have permission to access this page.
          </p>
        </div>
      )
    );
  }

  return children;
}
