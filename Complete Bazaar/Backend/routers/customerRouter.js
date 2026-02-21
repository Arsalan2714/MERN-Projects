const express = require("express");
const customerController = require("../controllers/customerController.js");
const customerRouter = express.Router();

customerRouter.get("/products", customerController.getProducts);
customerRouter.post("/cart/:id", customerController.addToCart);
customerRouter.get("/cart/:id", customerController.getCart);
customerRouter.delete("/cart/:id", customerController.removeFromCart);



module.exports = customerRouter;