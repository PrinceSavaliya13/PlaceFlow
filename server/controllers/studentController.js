import Student from "../models/Student.js";
import Application from "../models/Application.js";
import Announcement from "../models/Announcement.js";
export const profile = async (req, res) => {
  const s = await Student.findOne({ user: req.user._id }).populate(
    "user",
    "name email",
  );
  res.json({ success: true, student: s });
};
export const updateProfile = async (req, res) => {
  const s = await Student.findOneAndUpdate({ user: req.user._id }, req.body, {
    new: true,
    runValidators: true,
  });
  res.json({ success: true, student: s });
};
export const uploadResume = async (req, res) => {
  if (!req.file)
    return res.status(400).json({ success: false, message: "Resume required" });
  const s = await Student.findOneAndUpdate(
    { user: req.user._id },
    { resume: `/uploads/${req.file.filename}` },
    { new: true },
  );
  res.json({ success: true, student: s });
};
export const dashboard = async (req, res) => {
  const s = await Student.findOne({ user: req.user._id });
  const [apps, announcements] = await Promise.all([
    Application.find({ student: s._id })
    .populate({
      path: "job",
      populate: { path: "company", populate: { path: "user", select: "name" } },
    })
    .sort("-createdAt")
    .limit(5),
    Announcement.find({ audience: { $in: ["all", "students"] } })
      .populate("author", "name")
      .sort("-createdAt")
      .limit(5),
  ]);
  const counts = await Application.aggregate([
    { $match: { student: s._id } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  res.json({ success: true, applications: apps, counts, announcements });
};




