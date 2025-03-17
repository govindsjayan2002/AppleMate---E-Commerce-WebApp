import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the authentication context
const AuthContext = createContext(null);

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Function to check if user is authenticated
  const checkAuthStatus = async () => {
    try {
      // Check if token exists in localStorage
      const token = localStorage.getItem('authToken');
      const storedUserType = localStorage.getItem('userType');
      const role = localStorage.getItem('role');
      
      if (token) {
        // Optional: Verify token with backend
        // Since we don't have a specific endpoint for this,
        // we'll just trust the local storage values for now
        
        // For retail sellers, use their role
        if (role === 'user') {
          setUserType('retail_seller');
        } else if (role === 'admin') {
          setUserType('admin');
        } else {
          // Fallback to stored user type
          setUserType(storedUserType);
        }
        
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = (token, role, username) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('role', role);
    localStorage.setItem('username', username);
    
    // Set user type based on role
    const userType = role === 'user' ? 'retail_seller' : role;
    setUserType(userType);
    localStorage.setItem('userType', userType);
    
    setIsAuthenticated(true);
  };

  // Logout function - modified to not call API endpoint
  const logout = () => {
    try {
      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userType');
      localStorage.removeItem('role');
      localStorage.removeItem('username');
      
      // Update state
      setIsAuthenticated(false);
      setUserType(null);
      
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      return false;
    }
  };

  // Context value
  const value = {
    isAuthenticated,
    userType,
    loading,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};