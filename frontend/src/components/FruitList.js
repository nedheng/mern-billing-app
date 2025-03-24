import { useEffect, useState } from "react";
import { getFruits } from "../services/api";

function ShopList() {
    const [fruits, setFruits] = useState([]);

    useEffect(() => {
        getFruits().then(res => setFruits(res.data));
    }, []);

    return (
        <div>
            <h2>Fruits</h2>
            <ul>
                {fruits.map(fruits => (
                    <li key={fruits._id}>{fruits.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default ShopList;
