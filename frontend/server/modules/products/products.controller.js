const Product = require('./products.model');

const GetAllProducts = async () => {
    const x = await Product.find();
    console.log(`getAllProducts ${JSON.stringify(x)}`);
    return JSON.parse(JSON.stringify(x));
};
exports.GetAllProducts = GetAllProducts;
//------------------------------------------

const getProductById = async (theID) => {
    return await Product.findById(theID);
};
exports.getProductById = getProductById;
//------------------------------------------
