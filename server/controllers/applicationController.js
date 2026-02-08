import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";

// Apply for Job (using clerkUserId from frontend)
export const applyJob = async (req, res) => {
  try {
    const { jobId, applicantId, resumeUrl, coverLetter } = req.body; // applicantId is clerkUserId

    if (!jobId || !applicantId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Resolve applicant user document
    const applicantUser = await User.findOne({ clerkUserId: applicantId });
    if (!applicantUser) {
      return res.status(404).json({ message: "Applicant user not found" });
    }

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
      coverLetter,
      status: "pending"
    });

    // Update job applicants array (store user ObjectId)
    await Job.findByIdAndUpdate(
      jobId,
      {
        $push: {
          applicants: {
            user: applicantUser._id,
            status: "pending",
            appliedAt: new Date()
          }
        }
      },
      { new: true }
    );

    // Update user's appliedJobs (push job ObjectId)
    await User.findByIdAndUpdate(
      applicantUser._id,
      { $push: { appliedJobs: jobId } },
      { new: true }
    );

    // Populate and return the application
    const populatedApplication = await Application.findById(application._id)
      .populate("job")
      .populate("applicant");

    res.status(201).json({ 
      message: "Application submitted successfully",
      application: populatedApplication
    });
  } catch (error) {
    console.error("Error applying for job:", error);
    res.status(400).json({ message: error.message });
  }
};

// Get All Applications (Admin)
export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("job")
      .populate("applicant")
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Application By ID
export const getApplicationById = async (req, res) => {
  try {
    const { appId } = req.params;
    const application = await Application.findById(appId)
      .populate("job")
      .populate("applicant");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Application Status
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
    ).populate("job applicant");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Update job applicants status (match by ObjectId)
    await Job.findByIdAndUpdate(
      application.job._id,
      {
        "applicants.$[elem].status": status
      },
      {
        arrayFilters: [{ "elem.user": application.applicant._id }],
        new: true
      }
    );

    res.json({ message: "Application status updated", application });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(400).json({ message: error.message });
  }
};

// Withdraw Application
export const withdrawApplication = async (req, res) => {
  try {
    const { appId } = req.params;
    const { applicantId } = req.body; // applicantId is clerkUserId

    const application = await Application.findById(appId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Resolve applicant user
    const applicantUser = await User.findOne({ clerkUserId: applicantId });
    if (!applicantUser) {
      return res.status(404).json({ message: "Applicant user not found" });
    }

    // Verify applicant is the owner
    if (application.applicant.toString() !== applicantUser._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Remove from user's appliedJobs
    await User.findByIdAndUpdate(applicantUser._id, {
      $pull: { appliedJobs: application.job }
    });

    // Remove from job's applicants
    await Job.findByIdAndUpdate(application.job, {
      $pull: { applicants: { user: applicantUser._id } }
    });

    await Application.findByIdAndDelete(appId);

    res.json({ message: "Application withdrawn successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
