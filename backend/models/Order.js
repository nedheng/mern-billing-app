const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    items: [
        {
            fruit: { type: mongoose.Schema.Types.ObjectId, ref: "Fruit", required: true },
            quantityKg: { type: Number, required: true },
            quantityPiece: { type: Number, required: true },
        },
    ],
    orderDate: { type: Date },
});

module.exports = mongoose.model("Order", OrderSchema);
