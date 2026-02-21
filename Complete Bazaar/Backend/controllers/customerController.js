const Product = require("../models/Product.js");
const User = require("../models/User.js");

exports.getProducts = async (req, res, next) => {
 products = await Product.find();
 res.status(200).json({products});
}

exports.addToCart = async (req, res, next) => {
    const productId = req.params.id;
    const userId = req.body.userId;
   const user = await User.findById(userId);
   user.cart.push(productId);
   await user.save();
   res.status(200).json(user.cart);
} 

exports.getCart = async (req, res, next) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    res.status(200).json(user.cart);
} 

exports.removeFromCart = async (req, res, next) => {
    const productId = req.params.id;
    const userId = req.body.userId;
    const user = await User.findById(userId);
    user.cart= user.cart.filter((id) => id.toString() !== productId);
    await user.save();
    res.status(200).json(user.cart);
} 