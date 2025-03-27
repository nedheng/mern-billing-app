import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = process.env.REACT_APP_API_URL;

const AddFruit = () => {
  const [fruitName, setFruitName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fruitName.trim()) {
      toast.error("Fruit name can't be empty", { position: "top-right" });
      return;
    }
    try {
      const { data } = await axios.post(`${API_URL}/api/fruits`, { name: fruitName });
      console.log(data);
      toast.success(`Fruit "${data.name}" added successfully!`, { position: "top-right" });
      setFruitName("");
    } catch (error) {
      console.error("Error adding fruit:", error);
      toast.error("Error adding fruit. Please try again.", { position: "top-right" });
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 py-20">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Add a New Fruit</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={fruitName}
            onChange={(e) => setFruitName(e.target.value)}
            placeholder="Enter fruit name"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Add Fruit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFruit;