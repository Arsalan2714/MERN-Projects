const User = require("../models/User");
const bcrypt = require("bcrypt");
const { firstNameValidator, lastNameValidator, emailValidator, passwordValidator, confirmPasswordValidator, userTypeValidator } = require("./validation");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// In-memory OTP store: email -> { otp, expiresAt }
const otpStore = new Map();

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.signup = [
  firstNameValidator,
  lastNameValidator,
  emailValidator,
  passwordValidator,
  confirmPasswordValidator,
  userTypeValidator,
  async (req, res, next) => {
    const { firstName, lastName, email, password, confirmPassword, userType } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errorMessages: errors.array().map(err => err.msg),
      });
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ firstName, lastName, email, password: hashedPassword, userType });
      await user.save();
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ errorMessages: error.message });
    }
  }];

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ errorMessages: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ errorMessages: "Invalid email or password" });
    }
    const token = jwt.sign({ userId: user._id, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token, userType: user.userType });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessages: error.message });
  }
}

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ errorMessages: "No account found with this email" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with 5-minute expiry
    otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    // Send email
    await transporter.sendMail({
      from: `"Complete Bazaar" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP - Complete Bazaar",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 30px; background: #1e293b; border-radius: 16px; color: #e2e8f0;">
          <h2 style="color: #818cf8; margin-bottom: 20px;">🔐 Password Reset</h2>
          <p>Hi <strong>${user.firstName}</strong>,</p>
          <p>We received a request to reset your password. Use the OTP below:</p>
          <div style="text-align: center; margin: 25px 0;">
            <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #818cf8; background: #334155; padding: 15px 30px; border-radius: 12px; border: 1px solid #475569;">
              ${otp}
            </span>
          </div>
          <p style="color: #94a3b8; font-size: 14px;">This OTP is valid for <strong>5 minutes</strong>. If you didn't request this, please ignore this email.</p>
          <hr style="border-color: #334155; margin: 20px 0;" />
          <p style="color: #64748b; font-size: 12px;">— Complete Bazaar Team</p>
        </div>
      `,
    });

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessages: "Failed to send OTP. Please try again." });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const stored = otpStore.get(email);

    if (!stored) {
      return res.status(400).json({ errorMessages: "OTP expired or not found. Please request a new one." });
    }
    if (Date.now() > stored.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ errorMessages: "OTP has expired. Please request a new one." });
    }
    if (stored.otp !== otp) {
      return res.status(400).json({ errorMessages: "Invalid OTP. Please try again." });
    }

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ errorMessages: "Verification failed. Please try again." });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const stored = otpStore.get(email);

    if (!stored || Date.now() > stored.expiresAt || stored.otp !== otp) {
      return res.status(400).json({ errorMessages: "Invalid or expired OTP. Please request a new one." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    // Clean up OTP
    otpStore.delete(email);

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ errorMessages: "Failed to reset password. Please try again." });
  }
};