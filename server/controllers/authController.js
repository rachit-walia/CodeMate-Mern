const User = require("../models/authModel");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

const signUpUser = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, email, password } = req.body;

    if (!firstName || !lastName || !phoneNumber || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill in all fields", success: false });
    }

    const alreadySignedUp = await User.findOne({ email });
    if (alreadySignedUp) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      phoneNumber,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    const token = generateToken(newUser._id,res);

    res.status(201).json({
      message: "User created successfully",
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
    console.log("Error in signUpUser:", err);
    res.status(500).json({ message: "Internal Server error", success: false });
  }
};

const signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "fill all details", success: false });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "incorrect credentials", success: false });
    }
    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "invalid email or password", success: false });
    }
    const token = generateToken(existingUser._id,res);
    res.status(200).json({
      message: "sign in successful",
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
    console.log("Error in signinUser:", err);
    res.status(500).json({ message: "Internal Server error", success: false });
  }
};

module.exports = { signUpUser, signInUser };