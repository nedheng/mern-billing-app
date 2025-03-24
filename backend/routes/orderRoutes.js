const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const moment = require("moment-timezone");

// Get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// Add a new order
router.post("/", async (req, res) => {
  //console.log("Received Order Data:", req.body);
  try {
    const { shop, items } = req.body;

    const orderTimeIST = moment().tz("Asia/Kolkata").add(12, "hours");
    const orderTimeUTC = orderTimeIST.utc().toDate();

    console.log("IST:" , orderTimeIST)
    console.log("UTC:" , orderTimeUTC)

    if (!shop || !items.length) {
      return res.status(400).json({ error: "Shop and items are required" });
    }
    const newOrder = new Order({ shop, items, orderDate: orderTimeUTC});
    await newOrder.save();
    res.status(201).json({ message: "Order added", order: newOrder });
  } catch (error) {
    //console.log(error)
    res.status(500).json({ message: "Error adding order" },);
  }
});

router.get("/:date", async (req, res) => {
  //console.log("Fetching orders for:", req.params.date); // Debugging
  try {
    const startDate = new Date(req.params.date); // Convert string to Date object
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1); // Move to the next day to form a range

    const orders = await Order.find({
      orderDate: {
        $gte: startDate, // Greater than or equal to start of the day
        $lt: endDate // Less than the start of the next day
      }
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: "No orders found" });
    }

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
});


module.exports = router;
