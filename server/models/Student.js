import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    rollNumber: { type: String, trim: true },
    department: String,
    graduationYear: Number,
    cgpa: Number,
    phone: String,
    skills: [String],
    education: [
      { institution: String, degree: String, year: Number, score: String },
    ],
    resume: String,
    bio: String,
    location: String,
  },
  { timestamps: true },
);
export default mongoose.model("Student", schema);
