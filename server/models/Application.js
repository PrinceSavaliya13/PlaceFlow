import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "shortlisted", "selected", "rejected", "withdrawn"],
      default: "pending",
    },
    coverLetter: String,
  },
  { timestamps: true },
);
schema.index({ job: 1, student: 1 }, { unique: true });
export default mongoose.model("Application", schema);
