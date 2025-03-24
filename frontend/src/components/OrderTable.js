import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const OrderCards = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [shops, setShops] = useState({});
    const [fruits, setFruits] = useState({});
    const [selectedDate, setSelectedDate] = useState(""); // State for the date selector

    const convertToIST = (utcDateString) => {
      const date = new Date(utcDateString);
      return new Intl.DateTimeFormat("en-IN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Kolkata",  // Converts to IST
      }).format(date);
    };
  
    const formatDateForFilter = (utcDateString) => {
        const date = new Date(utcDateString);
        date.setHours(date.getHours() + 5, date.getMinutes() + 30); // Manually shift to IST
        return date.toISOString().split("T")[0]; // Return YYYY-MM-DD format
    };

    useEffect(() => {
        fetchOrders();
        fetchShopsAndFruits();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/orders`);
            setOrders(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError("Failed to fetch orders.");
            setLoading(false);
        }
    };

    const fetchShopsAndFruits = async () => {
        try {
            const [shopsRes, fruitsRes] = await Promise.all([
                axios.get(`${API_URL}/api/shops`),
                axios.get(`${API_URL}/api/fruits`),
            ]);

            const shopsMap = {};
            shopsRes.data.forEach(shop => (shopsMap[shop._id] = shop.name));

            const fruitsMap = {};
            fruitsRes.data.forEach(fruit => (fruitsMap[fruit._id] = fruit.name));

            setShops(shopsMap);
            setFruits(fruitsMap);
        } catch (error) {
            console.error("Error fetching shop and fruit data:", error);
        }
    };

    // Convert order date to YYYY-MM-DD format for filtering
    const formatDate = (dateString) => {
        return new Date(dateString).toISOString().split("T")[0];
    };

    // Filter orders based on selected date
    const filteredOrders = selectedDate
    ? orders.filter(order => formatDateForFilter(order.orderDate) === selectedDate)
    : orders;

    // Aggregate total fruits ordered for the selected date
    const getDailyFruitSummary = () => {
        const dailySummary = {};
    
        filteredOrders.forEach(order => {
            order.items.forEach(item => {
                const fruitName = fruits[item.fruit] || "Unknown Fruit";
    
                if (!dailySummary[fruitName]) {
                    dailySummary[fruitName] = { kg: 0, pieces: 0 }; // Initialize both kg & pieces
                }
    
                // Ensure quantityKg and quantityPiece are numbers, defaulting to 0 if missing
                const quantityKg = item.quantityKg || 0;
                const quantityPiece = item.quantityPiece || 0;
    
                dailySummary[fruitName].kg += quantityKg;
                dailySummary[fruitName].pieces += quantityPiece;
            });
        });
    
        return dailySummary;
    };
    
    
    

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    const dailyFruitSummary = getDailyFruitSummary();

    return (
        <div style={{ padding: "20px" }}>
            <h2>Orders List</h2>

            {/* Date Selector */}
            <label><strong>Filter by Date:</strong></label>
            <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ marginLeft: "10px", padding: "5px" }}
            />

            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "20px" }}>
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                        <div
                            key={order._id}
                            style={{
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                padding: "16px",
                                width: "300px",
                                boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
                            }}
                        >
                            <h3>Shop: {shops[order.shop] || "Unknown Shop"}</h3>
                            <p><strong>Order Date:</strong> {convertToIST(order.orderDate)}</p>
                            <h4>Items:</h4>
                            <ul>
                                {order.items.map((item) => (
                                    <li key={item._id}>
                                        {fruits[item.fruit] || "Unknown Fruit"} - {item.quantityKg} Kg,  {item.quantityPiece} Pc
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                ) : (
                    <p>No orders found for this date.</p>
                )}
            </div>

            <h2>Daily Fruit Summary</h2>
            <div>
                {Object.keys(dailyFruitSummary).length > 0 ? (
                    <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #000", borderRadius: "8px" }}>
                        <h3>{selectedDate || "All Dates"}</h3>
                        <ul>
                            {Object.entries(dailyFruitSummary).map(([fruit, data]) => (
                                <li key={fruit}>{fruit}: {data.kg} Kg, {data.pieces} Pc</li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>No fruit summary available for this date.</p>
                )}
            </div>
        </div>
    );
};

export default OrderCards;
