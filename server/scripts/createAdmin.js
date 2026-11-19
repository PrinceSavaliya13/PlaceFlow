import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

const email = (process.env.ADMIN_EMAIL || "admin@campus.edu").toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!password) {
  console.error("ADMIN_PASSWORD must be configured in .env");
  process.exit(1);
}

await connectDB();
const existing = await User.findOne({ email });

if (existing) {
  console.log(`An account already exists for ${email} with role: ${existing.role}`);
} else {
  await User.create({
    name: "System Admin",
    email,
    password,
    role: "admin",
  });
  console.log(`Admin account created for ${email}`);
}

await mongoose.disconnect();
