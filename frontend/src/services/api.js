import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const getShops = () => axios.get(`${API_URL}/api/shops`);
export const getFruits = () => axios.get(`${API_URL}/api/fruits`);
export const getOrders = (date) => axios.get(`${API_URL}/api/orders/${date}`);
export const createOrder = (orderData) => axios.post(`${API_URL}/api/orders`, orderData);

