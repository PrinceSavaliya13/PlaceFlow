import "dotenv/config";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Company from "../models/Company.js";
import Student from "../models/Student.js";
import Job from "../models/Job.js";
await connectDB();
await Promise.all([
  User.deleteMany({}),
  Company.deleteMany({}),
  Student.deleteMany({}),
  Job.deleteMany({}),
]);
const admin = await User.create({
  name: "System Admin",
  email: process.env.ADMIN_EMAIL || "admin@campus.edu",
  password: process.env.ADMIN_PASSWORD || "Admin@123",
  role: "admin",
});
const cu = await User.create({
  name: "Acme Technologies",
  email: "hr@acme.com",
  password: "Company@123",
  role: "company",
});
const co = await Company.create({
  user: cu._id,
  companyName: "Acme Technologies",
  industry: "Software",
  location: "Bengaluru",
  isApproved: true,
});
await Job.create({
  company: co._id,
  title: "Software Engineer",
  description: "Build delightful web products.",
  requirements: ["React", "Node.js", "MongoDB"],
  location: "Bengaluru",
  salary: { min: 600000, max: 1000000 },
  deadline: new Date(Date.now() + 30 * 864e5),
});
const su = await User.create({
  name: "Demo Student",
  email: "student@campus.edu",
  password: "Student@123",
  role: "student",
});
await Student.create({
  user: su._id,
  department: "Computer Science",
  graduationYear: 2027,
  skills: ["JavaScript", "React"],
});
console.log("Seed complete", admin.email);
process.exit();
