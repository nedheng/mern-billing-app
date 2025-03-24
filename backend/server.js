require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Import Routes
const shopRoutes = require("./routes/shopRoutes");
const fruitRoutes = require("./routes/fruitRoutes");
const orderRoutes = require("./routes/orderRoutes");
const billRoutes = require("./routes/billRoutes");

// Use Routes
app.use("/api/shops", shopRoutes);
app.use("/api/fruits", fruitRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/bills", billRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
