import Job from "../models/Job.js";
import Application from "../models/Application.js";
import User from "../models/User.js";

// Create Job (Recruiter) - recruiterId is clerkUserId from frontend
export const createJob = async (req, res) => {
  try {
    const { title, description, location, type, salary, skills, companyName, recruiterId } = req.body;

    // Check required fields
    if (!title || !location || !companyName || !recruiterId) {
      return res.status(400).json({ message: "Missing required fields: title, location, companyName, recruiterId" });
    }

    const recruiterUser = await User.findOne({ clerkUserId: recruiterId });
    if (!recruiterUser) return res.status(404).json({ message: "Recruiter not found" });

    const job = await Job.create({
      title,
      description: description || `${title} position`,
      location,
      type: type || "Full-time",
      salary: salary || "Competitive",
      skills: skills || [],
      companyName,
      recruiter: recruiterUser._id,
      isActive: true
    });

    // Add job to recruiter's postedJobs
    await User.findByIdAndUpdate(recruiterUser._id, { $push: { postedJobs: job._id } });

    res.status(201).json({ message: "Job posted successfully", job });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(400).json({ message: error.message });
  }
};

// Get All Jobs (Public)
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true })
      .populate("recruiter", "firstName lastName companyName")
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Job By ID (Public)
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true }
    ).populate("recruiter", "firstName lastName companyName email");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    res.status(404).json({ message: "Job not found" });
  }
};

// Update Job (Recruiter)
export const updateJob = async (req, res) => {
  try {
    const { recruiterId } = req.body; // clerkUserId
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const recruiterUser = await User.findOne({ clerkUserId: recruiterId });
    if (!recruiterUser) return res.status(404).json({ message: "Recruiter not found" });

    // Check if recruiter owns the job
    if (job.recruiter.toString() !== recruiterUser._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Job updated successfully", updatedJob });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Job (Recruiter)
export const deleteJob = async (req, res) => {
  try {
    const { recruiterId } = req.body; // clerkUserId expected from client
    if (!recruiterId) return res.status(400).json({ message: "Missing recruiterId" });

    const recruiterUser = await User.findOne({ clerkUserId: recruiterId });
    if (!recruiterUser) return res.status(404).json({ message: "Recruiter not found" });

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Check if recruiter owns the job
    if (job.recruiter.toString() !== recruiterUser._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Job.findByIdAndDelete(req.params.id);

    // Remove from recruiter's jobs
    await User.findByIdAndUpdate(recruiterUser._id, { $pull: { postedJobs: req.params.id } });

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Search and Filter Jobs
export const searchAndFilterJobs = async (req, res) => {
  try {
    const { keyword, location, type, minSalary, maxSalary, skills } = req.query;
    let filter = { isActive: true };

    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { companyName: { $regex: keyword, $options: "i" } }
      ];
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (type) {
      filter.type = type;
    }

    if (skills) {
      const skillsArray = skills.split(",").map(s => s.trim());
      filter.skills = { $in: skillsArray };
    }

    const jobs = await Job.find(filter)
      .populate("recruiter", "firstName lastName companyName")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Recruiter's Jobs
export const getRecruiterJobs = async (req, res) => {
  try {
    const { recruiterId } = req.params; // this is clerkUserId from frontend

    const recruiterUser = await User.findOne({ clerkUserId: recruiterId });
    if (!recruiterUser) return res.status(404).json({ message: "Recruiter not found" });

    let jobs = await Job.find({ recruiter: recruiterUser._id })
      .populate("applicants.user", "firstName lastName email")
      .sort({ createdAt: -1 });

    // Shape response to match frontend expectations
    jobs = jobs.map(job => ({ ...job._doc, applications: job.applicants, views: job.viewCount }));

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Apply for Job (recruiter route) - expects applicantId as clerkUserId
export const applyForJob = async (req, res) => {
  try {
    const { applicantId, resumeUrl, coverLetter } = req.body; // applicantId is clerkUserId
    const jobId = req.params.id;

    const applicantUser = await User.findOne({ clerkUserId: applicantId });
    if (!applicantUser) return res.status(404).json({ message: "Applicant not found" });

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: applicantUser._id
    });

    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this job" });
    }

    const application = await Application.create({
      job: jobId,
      applicant: applicantUser._id,
      resumeUrl,
      coverLetter
    });

    // Add to job's applicants
    await Job.findByIdAndUpdate(jobId, {
      $push: {
        applicants: {
          user: applicantUser._id,
          status: "pending",
          appliedAt: new Date()
        }
      }
    });

    // Add to user's appliedJobs
    await User.findByIdAndUpdate(applicantUser._id, {
      $push: { appliedJobs: jobId }
    });

    res.status(201).json({ message: "Application submitted successfully", application });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Applications for Job (Recruiter)
export const getApplicationsForJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const applications = await Application.find({ job: jobId })
      .populate("applicant", "firstName lastName email resumeUrl skills")
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Application Status (Recruiter)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { appId } = req.params;
    const { status, interviewDate, interviewNotes, rejectionReason, recruiterFeedback } = req.body;

    const application = await Application.findByIdAndUpdate(
      appId,
      {
        status,
        interviewDate,
        interviewNotes,
        rejectionReason,
        recruiterFeedback,
        respondedAt: new Date()
      },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Update job applicants status
    await Job.findByIdAndUpdate(
      application.job,
      {
        "applicants.$[elem].status": status
      },
      {
        arrayFilters: [{ "elem.user": application.applicant }],
        new: true
      }
    );

    res.json({ message: "Application status updated", application });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
