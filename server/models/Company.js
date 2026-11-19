import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    companyName: { type: String, required: true },
    website: String,
    industry: String,
    description: String,
    location: String,
    logo: String,
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true },
);
export default mongoose.model("Company", schema);
