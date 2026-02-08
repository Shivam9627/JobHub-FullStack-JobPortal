import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkUserId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    role: { type: String, enum: ["seeker", "recruiter"], required: true }, // seeker | recruiter
    profilePicture: { type: String },
    resumeUrl: { type: String }, // Cloudinary URL for job seeker resume
    
    // Job Seeker Fields
    skills: [{ type: String }],
    bio: { type: String },
    experience: { type: String },
    
    // Recruiter Fields
    companyName: { type: String },
    companyDescription: { type: String },
    companyLogo: { type: String }, // Cloudinary URL
    companyWebsite: { type: String },
    
    appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    postedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
