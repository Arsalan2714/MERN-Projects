const Product = require("../models/Product.js");
const User = require("../models/User.js");
const Order = require("../models/Order.js");

exports.getData = async (req, res, next) => {
    const userId = req.userId;
    const user = await User.findById(userId).populate({
        path: "orders",
        populate: { path: "products" }
    });
    const products = await Product.find();
    res.status(200).json({ products, cart: user.cart, wishlist: user.wishlist, orders: user.orders });
}

exports.addToCart = async (req, res, next) => {
    const productId = req.params.id;
    const userId = req.userId;
    const user = await User.findById(userId);
    user.cart.push(productId);
    await user.save();
    res.status(200).json(user.cart);
}

exports.removeFromCart = async (req, res, next) => {
    const productId = req.params.id;
    const userId = req.userId;
    const user = await User.findById(userId);
    const index = user.cart.indexOf(productId);
    if (index !== -1) {
        user.cart.splice(index, 1);
    }
    await user.save();
    res.status(200).json(user.cart);
}

exports.createOrder = async (req, res, next) => {
    const userId = req.userId;
    const { paymentMethod, shippingAddress } = req.body;
    const user = await User.findById(userId).populate("cart");
    const totalAmount = user.cart.reduce((sum, product) => sum + product.price, 0);

    const order = new Order({
        customer: userId,
        products: user.cart,
        totalAmount: totalAmount,
        paymentMethod: paymentMethod || "Cash on Delivery",
        shippingAddress: shippingAddress,
    });
    await order.save();
    user.orders.push(order._id);
    user.cart = [];
    await user.save();
    res.status(200).json(user.orders);
}

exports.cancelOrder = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findByIdAndUpdate(
            orderId,
            { status: "Cancelled" },
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.removeOrder = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const userId = req.userId;
        await Order.findByIdAndDelete(orderId);
        const user = await User.findById(userId);
        user.orders = user.orders.filter((id) => id.toString() !== orderId);
        await user.save();
        res.status(200).json({ message: "Order removed" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.toggleWishlist = async (req, res, next) => {
    const productId = req.params.id;
    const userId = req.userId;
    const user = await User.findById(userId);
    const index = user.wishlist.indexOf(productId);
    if (index === -1) {
        user.wishlist.push(productId);
    } else {
        user.wishlist.splice(index, 1);
    }
    await user.save();
    res.status(200).json(user.wishlist);
}
