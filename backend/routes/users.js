const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { requireRole } = require("../middleware/role");
const { getUsers, getUser } = require("../controllers/userController");

// GET /api/users — admin only
router.get("/", auth, requireRole("admin"), getUsers);

// GET /api/users/:id — admin only
router.get("/:id", auth, requireRole("admin"), getUser);

module.exports = router;
