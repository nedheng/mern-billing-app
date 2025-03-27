import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = process.env.REACT_APP_API_URL;

const AddOrderForm = ({ refreshOrders }) => {
  const [shops, setShops] = useState([]);
  const [fruits, setFruits] = useState([]);
  const [selectedShop, setSelectedShop] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  
  useEffect(() => {
    fetchShops();
    fetchFruits();
  }, []);

  const fetchShops = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/shops`);
      setShops(data);
    } catch (error) {
      console.error("Error fetching shops:", error);
    }
  };

  const fetchFruits = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/fruits`);
      setFruits(data);
    } catch (error) {
      console.error("Error fetching fruits:", error);
    }
  };

  const handleAddItem = () => {
    setSelectedItems([...selectedItems, { fruit: "", quantityKg: 0, quantityPiece: 0 }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...selectedItems];
    newItems[index][field] = value;
    setSelectedItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        shop: selectedShop,
        items: selectedItems.map((item) => ({
          fruit: item.fruit,
          quantityKg: Number(item.quantityKg),
          quantityPiece: Number(item.quantityPiece),
        })),
      };
      await axios.post(`${API_URL}/api/orders`, orderData);
      toast.success("Order added successfully!");
      setSelectedShop("");
      setSelectedItems([]);
      refreshOrders();
    } catch (error) {
      console.error("Error adding order:", error);
      toast.error("Failed to add order");
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Add New Order</h2>
        <form onSubmit={handleSubmit}>
          <label className=" text-lg font-semibold block text-gray-700 mb-2">Shop:</label>
          <select
            value={selectedShop}
            onChange={(e) => setSelectedShop(e.target.value)}
            required
            className="w-full p-2 border rounded mb-4"
          >
            <option value="">Select a Shop</option>
            {shops.map((shop) => (
              <option key={shop._id} value={shop._id}>{shop.name}</option>
            ))}
          </select>

          <h3 className="text-lg font-semibold mb-2">Items:</h3>
          {selectedItems.map((item, index) => (
            <div key={index} className="mb-4 p-2">
              <select
                value={item.fruit}
                onChange={(e) => handleItemChange(index, "fruit", e.target.value)}
                required
                className="w-full p-2 border rounded mb-2"
              >
                <option value="">Select a Fruit</option>
                {fruits.map((fruit) => (
                  <option key={fruit._id} value={fruit._id}>{fruit.name}</option>
                ))}
              </select>
              <div className="">
                <span className="p-3">Kg</span> 
                <input
                  type="number"
                  placeholder="Quantity (Kg)"
                  value={item.quantityKg}
                  onChange={(e) => handleItemChange(index, "quantityKg", e.target.value)}
                  className=" p-2 border rounded mb-2"
                  />
              </div>
              <div>
                <span className="p-3">Pc</span> 
                <input
                  type="number"
                  placeholder="Quantity (Piece)"
                  value={item.quantityPiece}
                  onChange={(e) => handleItemChange(index, "quantityPiece", e.target.value)}
                  className=" p-2 border rounded"
                  />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddItem}
            className="w-full bg-gray-300 text-black p-2 rounded hover:bg-gray-400 mb-4"
          >
            Add Fruit
          </button>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Submit Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddOrderForm;
