import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import OrderTable from "./components/OrderTable";
import AddOrderForm from "./components/AddOrderForm";
import ShopList from "./components/ShopList";
import AddShop from "./components/AddShop";
import FruitList from "./components/FruitList";
import AddFruit from "./components/AddFruit";
import BillingSystem from "./components/BillingSystem";
import Home from "./components/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <div className="flex">
          {/* Sidebar */}
          <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

          {/* Main content area */}
          <div className=" min-h-screen bg-gray-100 ">
            {/* Navbar */}
            <div className="w-screen">
            <nav className="w-full bg-gray-800 p-4 px-10 shadow-md flex items-center justify-start ">
              {/* Sidebar Toggle Button Inside Navbar */}
              <button
                className="border bg-gray-800 text-white p-2 rounded shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                onClick={toggleSidebar}
              >
                ☰
              </button>

              <ul className="flex space-x-6 text-white font-semibold">
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
            </div>

            {/* Main Content */}
            <div className="container mx-auto p-6">
              <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/orders" element={<OrderTable />} />
                <Route path="/add-order" element={<AddOrderForm />} />
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
