import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Toggle Button inside Navbar */}
      <div className="fixed top-4 left-4 z-50">
        <button
          className="bg-gray-800 text-white p-2 rounded shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          onClick={toggleSidebar}
        >
          ☰
        </button>
      </div>
      
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white p-4 transition-transform duration-300 z-40 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <ul className="text-white text-lg font-semibold space-y-3 py-5">
          <li><Link to="/shops" className="block p-2 hover:bg-gray-600 px-4 py-2 rounded transition duration-200 text-white" onClick={closeSidebar}>Shops</Link></li>
          <li><Link to="/add-shops" className="block p-2 hover:bg-gray-600 px-4 py-2 rounded transition duration-200 text-white" onClick={closeSidebar}>Add Shops</Link></li>
          <li><Link to="/fruits" className="block p-2 hover:bg-gray-600 px-4 py-2 rounded transition duration-200 text-white" onClick={closeSidebar}>Fruits</Link></li>
          <li><Link to="/add-fruit" className="block p-2 hover:bg-gray-600 px-4 py-2 rounded transition duration-200 text-white" onClick={closeSidebar}>Add Fruit</Link></li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
