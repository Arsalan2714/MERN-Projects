const express = require("express");
const multer = require ("multer"); // used for image storing and converting them into a  string file



const sellerController = require("../controllers/sellerController.js");

const sellerRouter = express.Router();


sellerRouter.post(
  "/products",
  sellerController.createProduct
)

module.exports = sellerRouter;