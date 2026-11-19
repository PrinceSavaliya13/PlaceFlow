import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    requirements: [String],
    location: String,
    jobType: {
      type: String,
      enum: ["Full-time", "Internship", "Part-time", "Remote"],
      default: "Full-time",
    },
    salary: {
      min: Number,
      max: Number,
      currency: { type: String, default: "INR" },
    },
    deadline: { type: Date, required: true },
    status: { type: String, enum: ["open", "closed"], default: "open" },
  },
  { timestamps: true },
);
schema.index({ title: "text", description: "text", location: "text" });
export default mongoose.model("Job", schema);
