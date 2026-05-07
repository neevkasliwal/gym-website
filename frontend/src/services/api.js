const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper to get auth token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Generic fetch wrapper
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};

// Auth API
export const authAPI = {
  login: (credentials) => fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  register: (userData) => fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  getProfile: () => fetchAPI('/auth/me'),
};

// Classes API
export const classAPI = {
  getAll: () => fetchAPI('/classes'),
  getById: (id) => fetchAPI(`/classes/${id}`),
  create: (classData) => fetchAPI('/classes', {
    method: 'POST',
    body: JSON.stringify(classData),
  }),
  update: (id, classData) => fetchAPI(`/classes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(classData),
  }),
  delete: (id) => fetchAPI(`/classes/${id}`, { method: 'DELETE' }),
};

// Bookings API
export const bookingAPI = {
  getMyBookings: () => fetchAPI('/bookings/my-bookings'),
  create: (bookingData) => fetchAPI('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  }),
  cancel: (id) => fetchAPI(`/bookings/${id}/cancel`, { method: 'PUT' }),
  getAll: () => fetchAPI('/bookings'), // Admin only
  updateStatus: (id, status) => fetchAPI(`/bookings/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }), // Admin only
};

// Payments API
export const paymentAPI = {
  createIntent: (amount) => fetchAPI('/payments/create-intent', {
    method: 'POST',
    body: JSON.stringify({ amount }),
  }),
  verify: (paymentData) => fetchAPI('/payments/verify', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  }),
};

// Contact API
export const contactAPI = {
  submit: (messageData) => fetchAPI('/contact', {
    method: 'POST',
    body: JSON.stringify(messageData),
  }),
};
