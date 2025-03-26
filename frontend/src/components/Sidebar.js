import React, { useState } from "react";
import { Link } from "react-router-dom";


const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`bg-gray-800 text-white h-screen p-4 transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`}>
      <button
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded mb-2 mt-5 border-none"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        ☰
      </button>
      <ul className="text-white text-lg font-semibold space-y-3">
        <li><Link to="/shops" className="block p-2 hover:bg-gray-600 text-white">Shops</Link></li>
        <li><Link to="/add-shops" className="block p-2 hover:bg-gray-600 text-white">Add Shops</Link></li>
        <li><Link to="/fruits" className="block p-2 hover:bg-gray-600 text-white">Fruits</Link></li>
        <li><Link to="/add-fruit" className="block p-2 hover:bg-gray-600 text-white">Add Fruit</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
