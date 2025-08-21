const User = require("../models/authModel");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const validator = require("validator"); // npm i validator

// Sign Up Controller
const signUpUser = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, email, password } = req.body;

    // Basic validation
    if (!firstName || !lastName || !phoneNumber || !email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    // Email validation
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ message: "Invalid email format", success: false });
    }

    // Password validation (min 6 chars, at least 1 number, 1 letter)
    if (!validator.isStrongPassword(password, { minLength: 6, minLowercase: 1, minUppercase: 0, minNumbers: 1, minSymbols: 0 })) {
      return res.status(400).json({
        message: "Password must be at least 6 characters and include a number",
        success: false,
      });
    }

    // Check if user already exists
    const alreadySignedUp = await User.findOne({ email });
    if (alreadySignedUp) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      phoneNumber,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    console.log("✅ New user created:", email);

    // Generate token
    const token = generateToken(newUser._id, res);

    res.status(201).json({
      message: "User registered successfully",
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        token,
      },
      success: true,
    });
  } catch (err) {
    console.log("❌ Error in signUpUser:", err);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// Sign In Controller
const signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill in all fields", success: false });
    }

    // Email validation
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ message: "Invalid email format", success: false });
    }

    // Password length check
    if (!validator.isLength(password, { min: 6 })) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
        success: false,
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "Incorrect credentials", success: false });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid email or password", success: false });
    }

    console.log("✅ User logged in:", email);

    // Generate token
    const token = generateToken(existingUser._id, res);

    res.status(200).json({
      message: "Sign in successful",
      data: {
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        email: existingUser.email,
        phoneNumber: existingUser.phoneNumber,
        token,
      },
      success: true,
    });
  } catch (err) {
    console.log("❌ Error in signInUser:", err);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

module.exports = { signUpUser, signInUser };
