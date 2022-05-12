const express = require('express');
const router = express.Router();
const productsRepository = require('../myRepository');
const app = express();


router.get("/", async (req, res) => {
    try {
        const x = await productsRepository.getAllProducts()
        res.send(x);
    } catch (e) {
        console.log(e);

    }
});

// router.get("/makingAnOrder", async (req, res) => {
//     try {
//         const x = await productsRepository.AddProductToCart(req.body);
//         res.send(x);
//     } catch (e) {
//         console.log(e);

//     }
// });


module.exports = router;

