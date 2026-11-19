import User from "../models/User.js";
import Student from "../models/Student.js";
import Company from "../models/Company.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import Announcement from "../models/Announcement.js";
export const dashboard = async (req, res) => {
  const [students, companies, jobs, applications, selected] = await Promise.all(
    [
      Student.countDocuments(),
      Company.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments(),
      Application.countDocuments({ status: "selected" }),
    ],
  );
  const status = await Application.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  res.json({
    success: true,
    stats: { students, companies, jobs, applications, selected },
    status,
  });
};
export const users = async (req, res) => {
  const users = await User.find({ role: { $ne: "admin" } })
    .select("-password")
    .sort("-createdAt");
  res.json({ success: true, users });
};
export const deleteUser = async (req, res) => {
  const u = await User.findById(req.params.id);
  if (!u || u.role === "admin")
    return res.status(404).json({ success: false, message: "User not found" });
  await u.deleteOne();
  res.json({ success: true, message: "User deleted" });
};
export const companies = async (req, res) =>
  res.json({
    success: true,
    companies: await Company.find()
      .populate("user", "name email")
      .sort("-createdAt"),
  });
export const approve = async (req, res) => {
  const c = await Company.findByIdAndUpdate(
    req.params.id,
    { isApproved: req.body.isApproved },
    { new: true },
  );
  if (!c)
    return res
      .status(404)
      .json({ success: false, message: "Company not found" });
  res.json({ success: true, company: c });
};
export const jobs = async (req, res) =>
  res.json({
    success: true,
    jobs: await Job.find()
      .populate({ path: "company", populate: { path: "user", select: "name" } })
      .sort("-createdAt"),
  });
export const announcements = async (req, res) =>
  res.json({
    success: true,
    announcements: await Announcement.find()
      .populate("author", "name")
      .sort("-createdAt"),
  });
export const createAnnouncement = async (req, res) =>
  res
    .status(201)
    .json({
      success: true,
      announcement: await Announcement.create({
        ...req.body,
        author: req.user._id,
      }),
    });
