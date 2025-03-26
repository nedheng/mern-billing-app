import { useEffect, useState } from "react";
import { getFruits } from "../services/api";

function ShopList() {
    const [fruits, setFruits] = useState([]);

    useEffect(() => {
        getFruits().then(res => setFruits(res.data));
    }, []);

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-3xl font-bold mb-4">Fruits</h2>
            <ul className="space-y-2">
                {fruits.map(fruits => (
                    <li key={fruits._id} className="bg-gray-100 p-3 rounded-md shadow-sm">{fruits.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default ShopList;
