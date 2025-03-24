const mongoose = require("mongoose");

const ShopSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("Shop", ShopSchema);
