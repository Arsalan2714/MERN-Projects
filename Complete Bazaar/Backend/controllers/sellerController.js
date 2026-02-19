const Product = require("../models/Product");

exports.createProduct = async (req, res, next) => {
  const { name, description, price, category, brand, rating, numReviews, stock } = req.body;
  const seller = req.userId;

  if(!req.file){
    return res.status(400).json({ message: "Image is required" });
  }

  const imageUrl = req.file.path;

  try{
    const product = new Product({name, description, price, category, brand, rating, numReviews, stock, imageUrl, seller});
    await product.save();
    res.status(201).json( product );
  }catch(error){
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};