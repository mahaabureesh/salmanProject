const express = require('express');
const router = express.Router();
const orderItemsRepository = require('../myRepository');
const orderitems = require("./orderItemsRepository")
const app = express();


router.get("/orderItems", async (req, res) => {
    try {
        const x = await orderitems.getAllOrderItems()
        res.send(x);
    } catch (e) {
        console.log(e);

    }
});

router.post("/:userName/:id/:quantity/:productName/:price", async (req, res) => {

    try {
        console.log(req.params, "$$$$$$$$$$");
        const x = await orderItemsRepository.AddItemToOrder(req.params)
        console.log(x, "the sen from post user...");
        res.send(x);
    } catch (e) {
        console.log(e);

    }


})

router.get("/cart/:userName", async (req, res) => {
    try {
        const x = await orderItemsRepository.getCartById(req.params)
        res.send(x);
    } catch (e) {
        console.log(e);

    }
});

module.exports = router;