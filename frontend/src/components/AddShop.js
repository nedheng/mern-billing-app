import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const AddShop = () => {
    const [shopName, setShopName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!shopName.trim()) {
            alert("Shop name cannot be empty");
            return;
        }

        try {
            const { data } = await axios.post(`${API_URL}/shops`, { name: shopName });
            alert(`Shop "${data.name}" added successfully`);
            setShopName("");
        } catch (error) {
            console.error("Error adding shop:", error);
            alert("Error adding shop. Please try again.");
        }
    };

    return (
        <div>
            <h2>Add a New Shop</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="Enter shop name"
                    required
                />
                <button type="submit">Add Shop</button>
            </form>
        </div>
    );
};

export default AddShop;

 