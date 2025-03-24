const express = require("express")
const router = express.Router()
const Fruit = require("../models/Fruit")
const Order = require("../models/Order")

router.get("/:date", async (req,res)=>{
    //console.log(req.params.date)
    try{
        //getting orders
        const date = req.params.date;
        const dateParts = date.split("-"); // ["2025", "03", "20"]
        const year = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1; // Months are 0-based in JS Date
        const day = parseInt(dateParts[2], 10);
        
        const startOfDay = new Date(Date.UTC(year, month, day, 0, 0, 0));
        const endOfDay = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));
        //console.log(endOfDay)
      
        const orders = await Order.find({
          orderDate: { $gte: `ISODate${startOfDay}`, $lt: `ISODate${endOfDay}` }
        }).lean();

        const updatedOrders = await Promise.all(orders.map(async order => {
            const updatedItems = await Promise.all(order.items.map(async item => {
                let fruitId = (item.fruit.toString())
                const fruit = await Fruit.findOne({_id:fruitId})
                const price = fruit.price; // Function to get fruit price
                let total = 0;
                console.log(price)
                if (item.quantityKg !== 0) {
                    total = item.quantityKg * price;
                } else if (item.quantityPiece !== 0) {
                    total = item.quantityPiece * price;
                }
                //console.log("total", total)
        
                return { ...item, total }; // Add total field to each item
            }));
            //console.log(updatedItems)
        
            return { ...order, items: updatedItems }; // Return updated order
        }));
        console.log(orders)
        //getting fruits
        // const fruits  = await Fruit.find();
        
        // orders.forEach((order)=>{
        //     //console.log(order.items)
        //     let items = order.items;
        //     items.forEach(async(item)=>{
        //         let fruitId = (item.fruit.toString())
        //         const fruit = await Fruit.findOne({_id:fruitId})
        //         const price = fruit.price;
        //         let totalPrice = 0;
        //         if(item.quantityKg!=0){
        //             totalPrice = item.quantityKg*price
        //         }
        //         else if(item.quantityPiece!=0){
        //             totalPrice= item.quantityPiece*price;
        //         }
        //         //item["total"] = totalPrice;
        //         Object.assign(items, {total: totalPrice})
        //         console.log(item)
                
        //     })
        //     console.log(items)
            
        // })
        // fruits.forEach((order)=>{
        //     console.log(order.id)
            
        // })
        res.json(updatedOrders)

    }
    catch(error){
        res.status(500).json({ success: false, message: "Server Error", error });
    }
})

module.exports = router;