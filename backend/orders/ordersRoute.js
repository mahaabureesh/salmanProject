const express = require('express');
const router = express.Router();
const ordersRepository = require('./ordersRepository');
const app = express();


router.get("/", async (req, res) => {
    try {
        const x = await ordersRepository.getAllOrders()
        res.send(x);
    } catch (e) {
        console.log(e);

    }
});

module.exports = router;