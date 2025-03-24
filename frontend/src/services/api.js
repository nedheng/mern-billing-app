import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getShops = () => axios.get(`${API_URL}/shops`);
export const getFruits = () => axios.get(`${API_URL}/fruits`);
export const getOrders = (date) => axios.get(`${API_URL}/orders/${date}`);
export const createOrder = (orderData) => axios.post(`${API_URL}/orders`, orderData);

