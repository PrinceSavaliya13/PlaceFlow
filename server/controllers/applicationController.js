import Application from "../models/Application.js";
import Job from "../models/Job.js";
import Student from "../models/Student.js";
import Notification from "../models/Notification.js";
export const apply = async (req, res) => {
  const student = await Student.findOne({ user: req.user._id });
  const existingSelection = await Application.findOne({
    student: student._id,
    status: "selected",
  }).populate("job", "title");
  if (existingSelection) {
    return res.status(403).json({
      success: false,
      message: `You have already been selected for ${existingSelection.job?.title || "another job"}. You can apply again only if that application is changed to rejected.`,
    });
  }
  const job = await Job.findById(req.params.jobId).populate("company");
  if (!job || job.status !== "open" || job.deadline < new Date())
    return res
      .status(400)
      .json({ success: false, message: "This job is unavailable" });
  const previousApplication = await Application.findOne({
    job: job._id,
    student: student._id,
  });
  if (previousApplication) {
    if (!["withdrawn", "rejected"].includes(previousApplication.status)) {
      return res.status(409).json({
        success: false,
        message: "You already have an active application for this job.",
      });
    }
    previousApplication.status = "pending";
    previousApplication.coverLetter = req.body.coverLetter || "";
    await previousApplication.save();
    await Notification.create({
      recipient: job.company.user,
      message: `New application for ${job.title}`,
      type: "application",
    });
    return res.json({
      success: true,
      message: "Your application has been submitted again.",
      application: previousApplication,
    });
  }
  const app = await Application.create({
    job: job._id,
    student: student._id,
    coverLetter: req.body.coverLetter,
  });
  await Notification.create({
    recipient: job.company.user,
    message: `New application for ${job.title}`,
    type: "application",
  });
  res.status(201).json({ success: true, application: app });
};
export const mine = async (req, res) => {
  const s = await Student.findOne({ user: req.user._id });
  const applications = await Application.find({ student: s._id })
    .populate({
      path: "job",
      populate: { path: "company", populate: { path: "user", select: "name" } },
    })
    .sort("-createdAt");
  res.json({ success: true, applications });
};
export const withdraw = async (req, res) => {
  const s = await Student.findOne({ user: req.user._id });
  const app = await Application.findOneAndUpdate(
    { _id: req.params.id, student: s._id, status: "pending" },
    { status: "withdrawn" },
    { new: true },
  );
  if (!app)
    return res
      .status(400)
      .json({
        success: false,
        message: "Only pending applications can be withdrawn",
      });
  res.json({ success: true, application: app });
};
