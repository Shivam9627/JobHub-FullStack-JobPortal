import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  applyForJob,
  getApplicationsForJob,
  updateApplicationStatus,
  searchAndFilterJobs,
  getRecruiterJobs,
} from "../controllers/jobController.js";

const router = express.Router();

// Job listing and search
router.get("/", getJobs);                    // Get all jobs
router.get("/search", searchAndFilterJobs);  // Search and filter jobs

// Recruiter routes (MUST come before /:id to avoid route collision)
router.get("/recruiter/:recruiterId", getRecruiterJobs); // Get recruiter's jobs
router.post("/", createJob);                           // Create job
router.patch("/:id", updateJob);                       // Update job
router.delete("/:id", deleteJob);                      // Delete job

// Single job and application routes
router.get("/:id", getJobById);              // Get single job
router.post("/:id/apply", applyForJob);                     // Apply for job
router.get("/:id/applications", getApplicationsForJob);     // Get applications for job
router.patch("/application/:appId/status", updateApplicationStatus); // Update app status

export default router;
