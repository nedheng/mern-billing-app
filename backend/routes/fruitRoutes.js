const express = require("express");
const router = express.Router();
const Fruit = require("../models/Fruit");

router.get("/", async (req, res) => {
    const fruits = await Fruit.find();
    res.json(fruits);
});

router.post("/", async (req, res) => {
  console.log(req.body)
    try {
      const name  = req.body.name;
      const fruit = new Fruit({ name, priceKg: 0, pricePiece: 0 }); // Always default to 0
      await fruit.save();
      res.json(fruit);
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error", error });
    }
  });

router.put("/:id", async (req, res) => {
try {
      const { priceKg, pricePiece } = req.body;
      const updatedFruit = await Fruit.findByIdAndUpdate(
        req.params.id,
        { priceKg, pricePiece },
        { new: true } // Return updated document
      );
      res.json({ success: true, updatedFruit });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error", error });
    }
  });
  
  

module.exports = router;
