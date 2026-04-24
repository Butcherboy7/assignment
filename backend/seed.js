require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const Task = require("./models/Task");

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not set in .env");
  process.exit(1);
}

const seed = async () => {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // Guard: skip if already seeded
  const existing = await User.findOne({ email: "admin@test.com" });
  if (existing) {
    console.log("⚠️  Database already seeded. Skipping.");
    await mongoose.disconnect();
    return;
  }

  // ── Users ─────────────────────────────────────────────────────────────────

  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  const [admin, user1, user2, user3] = await User.insertMany([
    {
      name: "Admin",
      email: "admin@test.com",
      password: adminPassword,
      role: "admin",
    },
    {
      name: "User One",
      email: "user1@test.com",
      password: userPassword,
      role: "user",
    },
    {
      name: "User Two",
      email: "user2@test.com",
      password: userPassword,
      role: "user",
    },
    {
      name: "User Three",
      email: "user3@test.com",
      password: userPassword,
      role: "user",
    },
  ]);

  console.log("✅ Created users:", [admin, user1, user2, user3].map((u) => u.email));

  // ── Tasks ─────────────────────────────────────────────────────────────────

  const tasks = await Task.insertMany([
    {
      title: "Set up project repository",
      description: "Initialize Git repo and configure CI/CD pipeline",
      status: "completed",
      priority: "high",
      assignedTo: user1._id,
      createdBy: admin._id,
      dueDate: new Date("2026-04-01"),
    },
    {
      title: "Design database schema",
      description: "Define all collections and relationships in MongoDB",
      status: "completed",
      priority: "high",
      assignedTo: user2._id,
      createdBy: admin._id,
      dueDate: new Date("2026-04-05"),
    },
    {
      title: "Build REST API endpoints",
      description: "Implement auth, tasks, and user routes",
      status: "in-progress",
      priority: "high",
      assignedTo: user1._id,
      createdBy: admin._id,
      dueDate: new Date("2026-04-20"),
    },
    {
      title: "Write unit tests",
      description: "Cover all controllers with Jest tests",
      status: "pending",
      priority: "medium",
      assignedTo: user3._id,
      createdBy: admin._id,
      dueDate: new Date("2026-05-01"),
    },
    {
      title: "Deploy to production",
      description: "Push to Railway / Render and configure env vars",
      status: "pending",
      priority: "low",
      assignedTo: user2._id,
      createdBy: admin._id,
      dueDate: new Date("2026-05-15"),
    },
  ]);

  console.log("✅ Created tasks:", tasks.map((t) => t.title));
  console.log("\n🌱 Seed complete!");
  console.log("\nCredentials:");
  console.log("  admin@test.com  / admin123  (role: admin)");
  console.log("  user1@test.com  / user123   (role: user)");
  console.log("  user2@test.com  / user123   (role: user)");
  console.log("  user3@test.com  / user123   (role: user)");

  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
