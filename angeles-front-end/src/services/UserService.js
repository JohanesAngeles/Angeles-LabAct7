import axios from 'axios';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL + '/api/users/';

// Get current user
const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Get auth header
const getAuthHeader = () => {
  const user = getCurrentUser();
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
};

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL, userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

// Get all users
const getUsers = async () => {
  const response = await axios.get(API_URL, {
    headers: getAuthHeader()
  });
  return response.data;
};

// Update user
const updateUser = async (id, userData) => {
  const response = await axios.put(API_URL + id, userData, {
    headers: getAuthHeader()
  });
  return response.data;
};

// Delete user
const deleteUser = async (id) => {
  const response = await axios.delete(API_URL + id, {
    headers: getAuthHeader()
  });
  return response.data;
};

// Create the service object
const UserService = {
  register,
  login,
  logout,
  getCurrentUser,
  getUsers,
  updateUser,
  deleteUser,
  getAuthHeader
};

export default UserService;