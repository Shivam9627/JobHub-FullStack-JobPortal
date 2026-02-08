import express from "express";
import {
  applyJob,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  withdrawApplication
} from "../controllers/applicationController.js";

const router = express.Router();

router.post("/", applyJob);                              // Apply for job
router.get("/", getApplications);                        // Get all applications
router.get("/:appId", getApplicationById);               // Get application by ID
router.patch("/:appId/status", updateApplicationStatus); // Update application status
router.delete("/:appId/withdraw", withdrawApplication);  // Withdraw application

export default router;
