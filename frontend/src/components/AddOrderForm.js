import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

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
      const { data } = await axios.get(`${API_URL}/shops`);
      setShops(data);
    } catch (error) {
      console.error("Error fetching shops:", error);
    }
  };

  const fetchFruits = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/fruits`);
      setFruits(data);
    } catch (error) {
      console.error("Error fetching fruits:", error);
    }
  };

  const handleAddItem = () => {
    setSelectedItems([...selectedItems, { fruit: "", quantityKg: 0, quantityPiece: 0}]);
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
        shop: selectedShop, // This should now be an ObjectId
        items: selectedItems.map(item => ({
            fruit: item.fruit, // This should now be an ObjectId
            quantityKg: Number(item.quantityKg),
            quantityPiece: Number(item.quantityPiece), // Ensure it's a number
        }))
    };
      console.log("Sending Order Data:", orderData);
      await axios.post(`${API_URL}/orders`, orderData);
      alert("Order added successfully!");
      setSelectedShop("");
      setSelectedItems([]);
      refreshOrders(); // Refresh the orders list
    } catch (error) {
      console.error("Error adding order:", error);
    }
  };

  return (
    <div>
      <h2>Add New Order</h2>
      <form onSubmit={handleSubmit}>
        <label>Shop:</label>
        <select value={selectedShop} onChange={(e) => setSelectedShop(e.target.value)} required>
          <option value="">Select a Shop</option>
          {shops.map((shop) => (
            <option key={shop._id} value={shop._id}>{shop.name}</option>
          ))}
        </select>

        <h3>Items:</h3>
        {selectedItems.map((item, index) => (
          <div key={index}>
            <select value={item.fruit} onChange={(e) => handleItemChange(index, "fruit", e.target.value)} required>
              <option value="">Select a Fruit</option>
              {fruits.map((fruit) => (
                <option key={fruit._id} value={fruit._id}>{fruit.name}</option>

              ))}
            </select>
            <input
              type="number"
              placeholder="Quantity (Kg)"
              value={item.quantityKg}
              onChange={(e) => handleItemChange(index, "quantityKg", e.target.value)}
            />
            <input
              type="number"
              placeholder="Quantity (Piece)"
              value={item.quantityPiece}
              onChange={(e) => handleItemChange(index, "quantityPiece", e.target.value)}
            />
      
          </div>
        ))}

        <button type="button" onClick={handleAddItem}>
          Add Fruit
        </button>
        <button type="submit">Submit Order</button>
      </form>
    </div>
  );
};

export default AddOrderForm;
