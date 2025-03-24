const mongoose = require("mongoose");

const PriceSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  prices: { type: Map, of: Number, required: true }
});

module.exports = mongoose.model("Price", PriceSchema);
