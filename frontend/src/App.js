import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import OrderTable from "./components/OrderTable";
import AddOrderForm from "./components/AddOrderForm";
import ShopList from "./components/ShopList";
import FruitList from "./components/FruitList"
import AddShop from "./components/AddShop"
import AddFruit from "./components/AddFruit"
import BillingSystem from "./components/BillingSystem"

function App() {
  const [refresh, setRefresh] = useState(false);

  const refreshOrders = () => setRefresh(!refresh);

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/orders">Orders</Link></li>
            <li><Link to="/add-order">Add Order</Link></li>
            <li><Link to="/shops">Shops</Link></li>
            <li><Link to="/add-shops">Add Shops</Link></li>
            <li><Link to="/fruits">Fruits</Link></li>
            <li><Link to="/add-fruit">Add Fruit</Link></li>
            <li><Link to="/billing">Billing</Link></li>
          </ul>
        </nav>


        <Routes>
          <Route path="/" element={<h2>Home</h2>} />
          <Route path="/orders" element={<OrderTable key={refresh} />} />
          <Route path="/add-order" element={<AddOrderForm refreshOrders={refreshOrders} />} />
          <Route path="/shops" element={<ShopList />} />
          <Route path="/add-shops" element={<AddShop />} />
          <Route path="/fruits" element={<FruitList />} />
          <Route path="/add-fruit" element={<AddFruit />} />
          <Route path="/billing" element={<BillingSystem />} />
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
