const { body } = require("express-validator");
const Task = require("../models/Task");
const User = require("../models/User");

// ─── Validation rules ────────────────────────────────────────────────────────

const createTaskValidation = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters"),
  body("assignedTo")
    .notEmpty()
    .withMessage("assignedTo is required")
    .isMongoId()
    .withMessage("assignedTo must be a valid user ID"),
];

// ─── Populate helper ─────────────────────────────────────────────────────────

const POPULATE_OPTS = [
  { path: "assignedTo", select: "name email" },
  { path: "createdBy", select: "name email" },
];

// ─── Controllers ─────────────────────────────────────────────────────────────

const getTasks = async (req, res, next) => {
  try {
    const filter =
      req.user.role === "admin" ? {} : { assignedTo: req.user.id };

    const tasks = await Task.find(filter)
      .populate(POPULATE_OPTS)
      .sort({ createdAt: -1 });

    return res.status(200).json({ data: tasks });
  } catch (err) {
    return next(err);
  }
};

const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate(POPULATE_OPTS);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (req.user.role !== "admin") {
      const assignedId = task.assignedTo?._id?.toString();
      if (assignedId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    return res.status(200).json({ data: task });
  } catch (err) {
    return next(err);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, assignedTo, dueDate } = req.body;

    const assignee = await User.findById(assignedTo);
    if (!assignee) {
      return res.status(404).json({ message: "Assigned user not found" });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      assignedTo,
      dueDate: dueDate || null,
      createdBy: req.user.id,
      status: "pending",
    });

    const populated = await task.populate(POPULATE_OPTS);

    return res.status(201).json({ data: populated });
  } catch (err) {
    return next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (req.user.role === "admin") {
      // Explicit whitelist — only these fields may be written; role/createdBy/etc. are never touched
      const allowedFields = ["title", "description", "status", "priority", "assignedTo", "dueDate"];
      const updates = {};
      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) updates[field] = req.body[field];
      });
      Object.keys(updates).forEach((key) => {
        task[key] = updates[key];
      });
    } else {
      // Regular user — must own the task; only status is accepted, everything else ignored
      if (task.assignedTo.toString() !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const status = req.body.status; // explicit extraction — no spread
      const allowedTransitions = ["in-progress", "completed"];
      if (!status || !allowedTransitions.includes(status)) {
        return res.status(400).json({
          message: "Users can only set status to 'in-progress' or 'completed'",
        });
      }
      task.status = status;
    }

    await task.save();
    await task.populate(POPULATE_OPTS);

    return res.status(200).json({ data: task });
  } catch (err) {
    return next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  createTaskValidation,
};
