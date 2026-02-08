import User from "../models/User.js";
import Application from "../models/Application.js";
import Job from "../models/Job.js";

// Register/Create User Profile
export const createUserProfile = async (req, res) => {
  try {
    const { clerkUserId, email, firstName, lastName, role } = req.body;

    if (!clerkUserId || !email || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if user already exists
    let user = await User.findOne({ clerkUserId });
    
    if (!user) {
      user = await User.create({
        clerkUserId,
        email,
        firstName,
        lastName,
        role
      });
    }

    res.status(201).json({ message: "Profile created successfully", user });
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(400).json({ message: error.message });
  }
};

// Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ clerkUserId: userId })
      .populate("appliedJobs")
      .populate("postedJobs");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      firstName,
      lastName,
      profilePicture,
      resumeUrl,
      skills,
      bio,
      experience,
      companyName,
      companyDescription,
      companyLogo,
      companyWebsite
    } = req.body;

    const user = await User.findOne({ clerkUserId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update common fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (profilePicture) user.profilePicture = profilePicture;

    // Update role-specific fields
    if (user.role === "seeker") {
      if (resumeUrl) user.resumeUrl = resumeUrl;
      if (skills) user.skills = skills;
      if (bio) user.bio = bio;
      if (experience) user.experience = experience;
    } else if (user.role === "recruiter") {
      if (companyName) user.companyName = companyName;
      if (companyDescription) user.companyDescription = companyDescription;
      if (companyLogo) user.companyLogo = companyLogo;
      if (companyWebsite) user.companyWebsite = companyWebsite;
    }

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Job Seeker Applications
export const getSeekerApplications = async (req, res) => {
  try {
    const { userId } = req.params;
    const seeker = await User.findOne({ clerkUserId: userId });
    if (!seeker) return res.status(404).json({ message: "User not found" });
    
    const applications = await Application.find({ applicant: seeker._id })
      .populate("job", "title companyName location salary type")
      .populate("applicant", "firstName lastName email")
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Application Statistics for Seeker
export const getSeekerStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const seeker = await User.findOne({ clerkUserId: userId });
    if (!seeker) return res.status(404).json({ message: "User not found" });

    const totalApplications = await Application.countDocuments({ applicant: seeker._id });
    const acceptedApplications = await Application.countDocuments({
      applicant: seeker._id,
      status: "accepted"
    });
    const rejectedApplications = await Application.countDocuments({
      applicant: seeker._id,
      status: "rejected"
    });
    const pendingApplications = await Application.countDocuments({
      applicant: seeker._id,
      status: "pending"
    });
    const interviewApplications = await Application.countDocuments({
      applicant: seeker._id,
      status: "interview"
    });

    res.json({
      totalApplications,
      acceptedApplications,
      rejectedApplications,
      pendingApplications,
      interviewApplications
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Recruiter Analytics
export const getRecruiterAnalytics = async (req, res) => {
  try {
    const { userId } = req.params;
    const recruiter = await User.findOne({ clerkUserId: userId });
    if (!recruiter) return res.status(404).json({ message: "Recruiter not found" });

    const recruiterJobs = await Job.find({ recruiter: recruiter._id }).populate("applicants.user", "_id");
    const totalJobs = recruiterJobs.length;

    let totalApplications = 0;
    let acceptedApplications = 0;
    let rejectedApplications = 0;
    let pendingApplications = 0;
    let interviewApplications = 0;

    for (const job of recruiterJobs) {
      totalApplications += job.applicants.length;
      acceptedApplications += job.applicants.filter(a => a.status === "accepted").length;
      rejectedApplications += job.applicants.filter(a => a.status === "rejected").length;
      pendingApplications += job.applicants.filter(a => a.status === "pending").length;
      interviewApplications += job.applicants.filter(a => a.status === "interview").length;
    }

    const totalViewCount = recruiterJobs.reduce((sum, job) => sum + (job.viewCount || 0), 0);

    res.json({
      totalJobs,
      totalApplications,
      acceptedApplications,
      rejectedApplications,
      pendingApplications,
      interviewApplications,
      totalViewCount,
      averageApplicationsPerJob: totalJobs > 0 ? (totalApplications / totalJobs).toFixed(1) : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Recruiter Applicants
export const getRecruiterApplicants = async (req, res) => {
  try {
    const { userId } = req.params;
    const recruiter = await User.findOne({ clerkUserId: userId });
    if (!recruiter) return res.status(404).json({ message: "Recruiter not found" });

    const applications = await Application.find()
      .populate({
        path: "job",
        match: { recruiter: recruiter._id }
      })
      .populate("applicant", "firstName lastName email resumeUrl skills")
      .sort({ appliedAt: -1 });

    // Filter out null jobs
    const filteredApplications = applications.filter(app => app.job !== null);

    res.json(filteredApplications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Applicants for Specific Job
export const getJobApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await Application.find({ job: jobId })
      .populate("applicant", "firstName lastName email resumeUrl skills bio experience")
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
