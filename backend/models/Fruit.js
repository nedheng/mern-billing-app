const mongoose = require("mongoose");

const FruitSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  priceKg: { type: Number, default: 0 },
  pricePiece: { type: Number, default: 0 } 
});

module.exports = mongoose.model("Fruit", FruitSchema);

