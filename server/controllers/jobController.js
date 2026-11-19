import Job from "../models/Job.js";
import Company from "../models/Company.js";
import { pagination } from "../utils/api.js";
export const list = async (req, res) => {
  const { page, limit, skip } = pagination(req);
  let q = {};
  if (req.query.status) q.status = req.query.status;3
  if (req.query.company) q.company = req.query.company;
  if (req.query.type) q.jobType = req.query.type;
  if (req.query.location) q.location = new RegExp(req.query.location, "i");
  if (req.query.search) q.$text = { $search: req.query.search };
  const [jobs, total] = await Promise.all([
    Job.find(q)
      .populate({ path: "company", populate: { path: "user", select: "name" } })
      .sort("-createdAt")
      .skip(skip)
      .limit(limit),
    Job.countDocuments(q),
  ]);
  res.json({
    success: true,
    jobs,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });cv
 
};
export const get = async (req, res) => {
  const job = await Job.findById(req.params.id).populate({
    path: "company",
    populate: { path: "user", select: "name" },
  });
  if (!job)
    return res.status(404).json({ success: false, message: "Job not found" });
  res.json({ success: true, job });
};
export const create = async (req, res) => {
  const c = await Company.findOne({ user: req.user._id });
  if (!c.isApproved)
    return res
      .status(403)
      .json({ success: false, message: "Company approval required" });
  const job = await Job.create({ ...req.body, company: c._id });
  res.status(201).json({ success: true, job });
};
export const update = async (req, res) => {
  const c = await Company.findOne({ user: req.user._id });
  const job = await Job.findOneAndUpdate(
    { _id: req.params.id, company: c._id },
    req.body,
    { new: true, runValidators: true },
  );
  if (!job)
    return res.status(404).json({ success: false, message: "Job not found" });
  res.json({ success: true, job });
};
export const remove = async (req, res) => {
  const c = await Company.findOne({ user: req.user._id });
  const job = await Job.findOneAndDelete({
    _id: req.params.id,
    company: c._id,
  });
  if (!job)
    return res.status(404).json({ success: false, message: "Job not found" });
  res.json({ success: true, message: "Job deleted" });
};