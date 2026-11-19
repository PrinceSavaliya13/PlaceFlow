import mongoose from "mongoose";
export default mongoose.model(
  "Announcement",
  new mongoose.Schema(
    {
      title: { type: String, required: true },
      content: { type: String, required: true },
      author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      audience: {
        type: String,
        enum: ["all", "students", "companies"],
        default: "all",
      },
    },
    { timestamps: true },
  ),
);
