const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

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

// Trainers API
export const trainerAPI = {
  getAll: () => fetchAPI('/trainers'),
  create: (data) => fetchAPI('/trainers', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => fetchAPI(`/trainers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => fetchAPI(`/trainers/${id}`, { method: 'DELETE' }),
};

// Plans API
export const planAPI = {
  getAll: () => fetchAPI('/plans'),
  getAllAdmin: () => fetchAPI('/plans/all'),
  create: (data) => fetchAPI('/plans', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => fetchAPI(`/plans/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => fetchAPI(`/plans/${id}`, { method: 'DELETE' }),
};

// Users API (Admin)
export const userAPI = {
  getAll: () => fetchAPI('/users'),
  update: (id, data) => fetchAPI(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => fetchAPI(`/users/${id}`, { method: 'DELETE' }),
};

// Payments API
export const paymentAPI = {
  create: (paymentData) => fetchAPI('/payments', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  }),
  getMyPayments: () => fetchAPI('/payments/user'),
  getAll: () => fetchAPI('/payments'),
  approve: (id) => fetchAPI(`/payments/${id}/approve`, { method: 'PUT' }),
  reject: (id, reason) => fetchAPI(`/payments/${id}/reject`, {
    method: 'PUT',
    body: JSON.stringify({ reason }),
  }),
};

// Contact API
export const contactAPI = {
  submit: (messageData) => fetchAPI('/contact', {
    method: 'POST',
    body: JSON.stringify(messageData),
  }),
};
