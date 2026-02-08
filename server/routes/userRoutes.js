import express from "express";
import {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  getSeekerApplications,
  getSeekerStats,
  getRecruiterAnalytics,
  getRecruiterApplicants,
  getJobApplicants
} from "../controllers/userController.js";

const router = express.Router();

// User Profile Routes
router.post("/profile", createUserProfile);           // Create user profile
router.get("/profile/:userId", getUserProfile);      // Get user profile
router.patch("/profile/:userId", updateUserProfile); // Update user profile

// Job Seeker Routes
router.get("/seeker/:userId/applications", getSeekerApplications);  // Get seeker applications
router.get("/seeker/:userId/stats", getSeekerStats);                // Get seeker statistics

// Recruiter Routes
router.get("/recruiter/:userId/analytics", getRecruiterAnalytics);  // Get recruiter analytics
router.get("/recruiter/:userId/applicants", getRecruiterApplicants); // Get all applicants
router.get("/recruiter/job/:jobId/applicants", getJobApplicants);   // Get applicants for specific job

export default router;
