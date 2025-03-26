import { useEffect, useState } from "react";
import { getShops } from "../services/api";

function ShopList() {
    const [shops, setShops] = useState([]);

    useEffect(() => {
        getShops().then(res => setShops(res.data));
    }, []);

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-3xl font-bold mb-4">Shops</h2>
            <ul className="space-y-2">
                {shops.map(shop => (
                    <li key={shop._id} className="bg-gray-100 p-3 rounded-md shadow-sm">{shop.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default ShopList;
