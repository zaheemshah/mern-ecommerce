import API from './axios';

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  logout: () => API.post('/auth/logout'),
  getMe: () => API.get('/auth/me'),
  forgotPassword: (email) => API.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => API.put(`/auth/reset-password/${token}`, { password }),
};

export const productAPI = {
  getAll: (params) => API.get('/products', { params }),
  getOne: (id) => API.get(`/products/${id}`),
  getFeatured: () => API.get('/products/featured'),
  getNewArrivals: () => API.get('/products/new-arrivals'),
  getBestSellers: () => API.get('/products/best-sellers'),
  getSuggestions: (q) => API.get('/products/search/suggestions', { params: { q } }),
  create: (data) => API.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => API.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => API.delete(`/products/${id}`),
};

export const categoryAPI = {
  getAll: () => API.get('/categories'),
  getOne: (slug) => API.get(`/categories/${slug}`),
  create: (data) => API.post('/categories', data),
  update: (id, data) => API.put(`/categories/${id}`, data),
  delete: (id) => API.delete(`/categories/${id}`),
};

export const cartAPI = {
  get: () => API.get('/cart'),
  add: (productId, quantity = 1) => API.post('/cart', { productId, quantity }),
  update: (itemId, quantity) => API.put(`/cart/${itemId}`, { quantity }),
  remove: (itemId) => API.delete(`/cart/${itemId}`),
  clear: () => API.delete('/cart'),
};

export const wishlistAPI = {
  get: () => API.get('/wishlist'),
  add: (productId) => API.post('/wishlist', { productId }),
  remove: (productId) => API.delete(`/wishlist/${productId}`),
};

export const orderAPI = {
  create: (shippingAddress) => API.post('/orders', { shippingAddress }),
  getMy: (params) => API.get('/orders/my', { params }),
  getOne: (id) => API.get(`/orders/${id}`),
  getAll: () => API.get('/orders/all'),
  updateStatus: (id, data) => API.put(`/orders/${id}`, data),
};

export const reviewAPI = {
  getByProduct: (productId) => API.get(`/reviews/product/${productId}`),
  create: (data) => API.post('/reviews', data),
  delete: (id) => API.delete(`/reviews/${id}`),
};

export const userAPI = {
  updateProfile: (data) => API.put('/users/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getDashboard: () => API.get('/users/dashboard'),
};

export const adminAPI = {
  getDashboard: () => API.get('/admin/dashboard'),
  getUsers: () => API.get('/admin/users'),
  updateUserRole: (id, role) => API.put(`/admin/users/${id}`, { role }),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
};
