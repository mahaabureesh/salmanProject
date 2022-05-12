const myRepository = require('./products.controller');
const express = require('express');
const router = express.Router();
const app = express();


//--------------------------------------
// Get all products
router.get("/", async (req, res) => {
    const x = await myRepository.GetAllProducts()
    res.send(x);
}

);

//--------------------------------------
// Get a product by id
router.get("/:id", async (req, res) => {
    const x = await myRepository.getProductById(req.params.id)

    res.send(x);
});
//--------------------------------------
module.exports = router;