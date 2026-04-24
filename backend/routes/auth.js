const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { handleValidation } = require("../middleware/validate");
const {
  signup,
  login,
  getMe,
  signupValidation,
  loginValidation,
} = require("../controllers/authController");

// POST /api/auth/signup
router.post("/signup", signupValidation, handleValidation, signup);

// POST /api/auth/login
router.post("/login", loginValidation, handleValidation, login);

// GET /api/auth/me
router.get("/me", auth, getMe);

module.exports = router;
