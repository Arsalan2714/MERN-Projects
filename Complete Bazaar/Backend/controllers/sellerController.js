const Product = require("../models/Product");

exports.createProduct = async (req, res, next) => {
  const { name, description, price, category, brand, rating, numReviews, stock, isFeatured, isDeleted } = req.body;
  try{
    const product = new Product({name, description, price, category, brand, rating, numReviews, stock, isFeatured, isDeleted});
    await product.save();
    res.status(201).json({ message: "Product is created" });
  }catch(error){
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};