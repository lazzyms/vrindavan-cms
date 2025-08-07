import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  isLoading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state from localStorage
    const storedToken = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("email");
    const storedRole = localStorage.getItem("role");

    if (storedToken && storedEmail && storedRole) {
      setToken(storedToken);
      setUser({
        email: storedEmail,
        role: storedRole,
      });
    }
    setIsLoading(false);
  }, []);

  const login = (userData) => {
    const { token: newToken, email, role } = userData;

    // Store in localStorage
    localStorage.setItem("token", newToken);
    localStorage.setItem("email", email);
    localStorage.setItem("role", role);

    // Update state
    setToken(newToken);
    setUser({ email, role });
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    // Clear state
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token && !!user;

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
