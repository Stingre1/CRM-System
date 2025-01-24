import { jwtDecode } from 'jwt-decode';

export const getToken = () => localStorage.getItem('token');

export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    return decoded.exp > Date.now() / 1000;
  } catch (error) {
    return false;
  }
};

export const getUserRole = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    return decoded.role;
  } catch (error) {
    return null;
  }
};

export const hasPermission = (requiredRole) => {
  const userRole = getUserRole();
  if (!userRole) return false;

  const roleHierarchy = {
    'Admin': ['Admin', 'Sales Manager', 'Sales Rep'],
    'Sales Manager': ['Sales Manager', 'Sales Rep'],
    'Sales Rep': ['Sales Rep']
  };

  

  return roleHierarchy[userRole]?.includes(requiredRole) || false;
};