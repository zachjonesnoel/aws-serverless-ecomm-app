import axios from 'axios';

// Replace with your actual API Gateway URL after deployment
const API_URL = process.env.REACT_APP_API_URL || 'https://your-api-gateway-url.execute-api.region.amazonaws.com/prod';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const getProducts = () => api.get('/products');
export const getProductById = (id: string) => api.get(`/products/${id}`);
export const getProductsByCategory = (category: string) => api.get(`/products/category/${category}`);

// Cart API
export const getCart = (userId: string) => api.get(`/cart?userId=${userId}`);
export const addToCart = (userId: string, productId: string, quantity: number) => 
  api.post('/cart', { userId, productId, quantity });
export const removeFromCart = (userId: string, productId: string) => 
  api.delete(`/cart/${productId}?userId=${userId}`);

// Orders API
export const createOrder = (orderData: any) => api.post('/orders', orderData);
export const getOrders = (userId: string) => api.get(`/orders?userId=${userId}`);

// Payment API
export const processPayment = (paymentData: any) => api.post('/payment', paymentData);

export default api;