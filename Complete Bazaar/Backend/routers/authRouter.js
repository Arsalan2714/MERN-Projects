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

authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.post("/verify-otp", authController.verifyOtp);
authRouter.post("/reset-password", authController.resetPassword);

module.exports = authRouter;