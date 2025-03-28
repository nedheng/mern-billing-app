import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Overlay (click to close) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#FFE66D] text-[#333333] p-4 transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >

        <ul className="text-white text-lg font-semibold space-y-3 py-5">
          <li>
            <Link
              to="/shops"
              className="block p-2 hover:bg-yellow-400 px-4 py-2 rounded transition duration-200 text-[#333333]"
              onClick={toggleSidebar}
            >
              Shops
            </Link>
          </li>
          <li>
            <Link
              to="/add-shops"
              className="block p-2 hover:bg-yellow-400 px-4 py-2 rounded transition duration-200 text-[#333333]"
              onClick={toggleSidebar}
            >
              Add Shops
            </Link>
          </li>
          <li>
            <Link
              to="/fruits"
              className="block p-2 hover:bg-yellow-400 px-4 py-2 rounded transition duration-200 text-[#333333]"
              onClick={toggleSidebar}
            >
              Fruits
            </Link>
          </li>
          <li>
            <Link
              to="/add-fruit"
              className="block p-2 hover:bg-yellow-400 px-4 py-2 rounded transition duration-200 text-[#333333]"
              onClick={toggleSidebar}
            >
              Add Fruit
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
