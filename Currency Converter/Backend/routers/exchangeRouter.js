const express = require("express");
const exchangeController = require("../controllers/exchangeController");

const exchangeRouter = express.Router();

// Test router route
//exchangeRouter.get("/ping", (req, res) => {
  // res.send("Router working");
//});

exchangeRouter.post("/convert", exchangeController.convertCurrency);

module.exports = exchangeRouter;
