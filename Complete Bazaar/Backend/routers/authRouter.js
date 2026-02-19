const express = require("express");

const authController = require("../controllers/authController.js");
const authRouter = express.Router();



authRouter.post(
  "/signup",
  authController.signup
)

authRouter.post(
  "/login",
  authController.login
)

module.exports = authRouter;