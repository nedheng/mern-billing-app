import React from "react";

const Home = () => {
  return (
    <div className="flex flex-col justify-between h-[750px]">
      {/* Welcome Message */}
      <div className=" flex-grow flex items-center justify-center bg-white p-20 rounded-lg rounded-b-none shadow-md">
        <h1 className="text-3xl font-bold">Welcome to the Billing App</h1>
      </div>
      
      {/* Footer */}
      <footer className="text-center p-4 bg-gray-200 bb-20">
        <p className="text-gray-700">&copy; 2025 Nedhen</p>
      </footer>
    </div>
  );
};

export default Home;
