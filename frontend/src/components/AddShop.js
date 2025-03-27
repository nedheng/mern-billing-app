import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = process.env.REACT_APP_API_URL;

const AddShop = () => {
    const [shopName, setShopName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!shopName.trim()) {
            toast.error("Shop name cannot be empty");
            return;
        }

        try {
            const { data } = await axios.post(`${API_URL}/api/shops`, { name: shopName });
            toast.success(`Shop "${data.name}" added successfully`);
            setShopName("");
        } catch (error) {
            console.error("Error adding shop:", error);
            toast.error("Error adding shop. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center bg-gray-100 py-20">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-semibold text-center mb-4">Add a New Shop</h2>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <input
                      type="text"
                      className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      placeholder="Enter shop name"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                      Add Shop
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddShop;