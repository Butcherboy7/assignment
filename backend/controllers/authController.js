const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body } = require("express-validator");
const User = require("../models/User");

// ─── Validation rules ────────────────────────────────────────────────────────

const signupValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  // NOTE: role is intentionally NOT accepted from the request body.
  // All self-registered accounts are created as 'user'. Admins are seeded only.
];

const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const signToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ─── Controllers ─────────────────────────────────────────────────────────────

const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body; // role is NOT accepted from client

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: "user" });

    const token = signToken(user);

    return res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user);

    return res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    return next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ data: user });
  } catch (err) {
    return next(err);
  }
};

module.exports = { signup, login, getMe, signupValidation, loginValidation };
