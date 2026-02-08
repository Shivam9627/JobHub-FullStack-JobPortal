import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    location: { type: String, required: true },
    type: { type: String, required: true, enum: ["Full-time", "Part-time", "Intern", "Contract"], default: "Full-time" },
    salary: { type: String, default: "Competitive" },
    skills: [{ type: String }],
    
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    companyName: { type: String, required: true },
    
    applicants: [{ 
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      appliedAt: { type: Date, default: Date.now },
      status: { type: String, enum: ["pending", "accepted", "rejected", "interview"], default: "pending" }
    }],
    
    viewCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
