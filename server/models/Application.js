import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    resumeUrl: { type: String }, // Cloudinary resume URL
    coverLetter: { type: String },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "interview"],
      default: "pending"
    },
    rejectionReason: { type: String },
    interviewDate: { type: Date },
    interviewNotes: { type: String },
    recruiterFeedback: { type: String },
    appliedAt: { type: Date, default: Date.now },
    respondedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);
