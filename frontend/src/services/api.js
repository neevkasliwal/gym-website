const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper to get auth token
const getAuthHeader = () => {
  if (typeof window === 'undefined') return {};
  const token = window.localStorage.getItem('token');
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

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  let data;
  try {
    data = isJson ? await response.json() : await response.text();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      (data && typeof data === 'object' && data.message) ||
      (typeof data === 'string' && data.trim()) ||
      `API request failed (${response.status})`;
    throw new Error(message);
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
  create: (paymentData) => fetchAPI('/payments', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  }),
  getMyPayments: () => fetchAPI('/payments/user'),
  getAll: () => fetchAPI('/payments'), // Admin only
  approve: (id) => fetchAPI(`/payments/${id}/approve`, {
    method: 'PUT',
  }), // Admin only
};

// Contact API
export const contactAPI = {
  submit: (messageData) => fetchAPI('/contact', {
    method: 'POST',
    body: JSON.stringify(messageData),
  }),
};
