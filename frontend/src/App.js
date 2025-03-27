import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import OrderTable from "./components/OrderTable";
import AddOrderForm from "./components/AddOrderForm";
import ShopList from "./components/ShopList";
import FruitList from "./components/FruitList";
import AddShop from "./components/AddShop";
import AddFruit from "./components/AddFruit";
import BillingSystem from "./components/BillingSystem";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [refresh, setRefresh] = useState(false);
  const refreshOrders = () => setRefresh(!refresh);

  return (
      <div>
        <ToastContainer position="top-right" autoClose={3000} />
    <Router>
      <div className="flex">
        {/* Sidebar on the left */}
        <Sidebar />

        {/* Main content area */}
        <div className="flex-1 min-h-screen bg-gray-100">
          {/* Navbar */}
          <nav className="bg-gray-800 p-4 shadow-md ">
            <ul className="flex justify-center space-x-6 text-white font-semibold">
              {[
                { name: "Home", path: "/" },
                { name: "Orders", path: "/orders" },
                { name: "Add Order", path: "/add-order" },
                { name: "Billing", path: "/billing" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="hover:bg-gray-600 px-4 py-2 rounded transition duration-200 text-white"
                    >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Main Content */}
          <div className="container mx-auto p-6">
            <Routes>
              <Route path="/" element={<h2 className="text-center text-xl font-bold mt-6">Welcome</h2>} />
              <Route path="/orders" element={<OrderTable key={refresh} />} />
              <Route path="/add-order" element={<AddOrderForm refreshOrders={refreshOrders} />} />
              <Route path="/shops" element={<ShopList />} />
              <Route path="/add-shops" element={<AddShop />} />
              <Route path="/fruits" element={<FruitList />} />
              <Route path="/add-fruit" element={<AddFruit />} />
              <Route path="/billing" element={<BillingSystem />} />
              <Route path="*" element={<h2 className="text-red-500 text-center">404 - Page Not Found</h2>} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
    </div>
  );
}

export default App;
