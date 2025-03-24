const express = require("express");
const router = express.Router();
const Shop = require("../models/Shop");

router.get("/", async (req, res) => {
    const shops = await Shop.find();
    res.json(shops);
});

router.post("/", async (req, res) => {
    const newShop = new Shop(req.body);
    await newShop.save();
    res.json(newShop);
    console.log(res)
});

module.exports = router;
