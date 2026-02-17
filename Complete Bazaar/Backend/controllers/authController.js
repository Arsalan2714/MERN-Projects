const User = require("../models/User");
const bcrypt = require("bcrypt");
const { firstNameValidator, lastNameValidator, emailValidator, passwordValidator, confirmPasswordValidator, userTypeValidator } = require("./validation");
const { validationResult } = require("express-validator");
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
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}];