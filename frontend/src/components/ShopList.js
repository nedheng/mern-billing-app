import { useEffect, useState } from "react";
import { getShops } from "../services/api";

function ShopList() {
    const [shops, setShops] = useState([]);

    useEffect(() => {
        getShops().then(res => setShops(res.data));
    }, []);

    return (
        <div>
            <h2>Shops</h2>
            <ul>
                {shops.map(shop => (
                    <li key={shop._id}>{shop.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default ShopList;
