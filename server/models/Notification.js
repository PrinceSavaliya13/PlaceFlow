import mongoose from "mongoose";
export default mongoose.model(
  "Notification",
  new mongoose.Schema(
    {
      recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      message: { type: String, required: true },
      type: { type: String, default: "info" },
      read: { type: Boolean, default: false },
      link: String,
    },
    { timestamps: true },
  ),
);
