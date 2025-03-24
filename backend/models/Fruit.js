const mongoose = require("mongoose");

const FruitSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, default: 0 } // Default price set to 0
});

module.exports = mongoose.model("Fruit", FruitSchema);

