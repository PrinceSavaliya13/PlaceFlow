import Company from "../models/Company.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import Notification from "../models/Notification.js";
export const profile = async (req, res) => {
  const c = await Company.findOne({ user: req.user._id }).populate(
    "user",
    "name email",
  );
  res.json({ success: true, company: c });
};
export const updateProfile = async (req, res) => {
  const c = await Company.findOneAndUpdate({ user: req.user._id }, req.body, {
    new: true,
    runValidators: true,
  });
  res.json({ success: true, company: c });
};
export const dashboard = async (req, res) => {
  const c = await Company.findOne({ user: req.user._id });
  const jobs = await Job.find({ company: c._id });
  const apps = await Application.countDocuments({
    job: { $in: jobs.map((j) => j._id) },
  });
  res.json({
    success: true,
    stats: {
      jobs: jobs.length,
      applications: apps,
      open: jobs.filter((j) => j.status === "open").length,
    },
    jobs,
  });
};
export const applicants = async (req, res) => {
  const c = await Company.findOne({ user: req.user._id });
  const job = await Job.findOne({ _id: req.params.jobId, company: c._id });
  if (!job)
    return res.status(404).json({ success: false, message: "Job not found" });
  const applications = await Application.find({ job: job._id })
    .populate({
      path: "student",
      populate: { path: "user", select: "name email" },
    })
    .sort("-createdAt");
  res.json({ success: true, applications });
};
export const setStatus = async (req, res) => {
  const c = await Company.findOne({ user: req.user._id });
  const app = await Application.findById(req.params.id).populate("job");
  if (!app || String(app.job.company) !== String(c._id))
    return res
      .status(404)
      .json({ success: false, message: "Application not found" });
  app.status = req.body.status;
  await app.save();
  const s = await (
    await import("../models/Student.js")
  ).default.findById(app.student);
  await Notification.create({
    recipient: s.user,
    message: `Your application for ${app.job.title} is ${app.status}.`,
    type: app.status,
  });
  res.json({ success: true, application: app });
};
