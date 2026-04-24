const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { requireRole } = require("../middleware/role");
const { handleValidation } = require("../middleware/validate");
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  createTaskValidation,
} = require("../controllers/taskController");

// All task routes require authentication
router.use(auth);

// GET  /api/tasks
router.get("/", getTasks);

// POST /api/tasks — admin only
router.post(
  "/",
  requireRole("admin"),
  createTaskValidation,
  handleValidation,
  createTask
);

// GET /api/tasks/:id
router.get("/:id", getTask);

// PUT /api/tasks/:id — auth + RBAC handled inside controller
router.put("/:id", updateTask);

// DELETE /api/tasks/:id — admin only
router.delete("/:id", requireRole("admin"), deleteTask);

module.exports = router;
