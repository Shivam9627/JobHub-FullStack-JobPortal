import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// ===== JOB ENDPOINTS =====
export const jobAPI = {
  // Get all jobs
  getAllJobs: () => api.get("/jobs"),
  
  // Get single job
  getJobById: (jobId) => api.get(`/jobs/${jobId}`),
  
  // Search and filter jobs
  searchJobs: (params) => api.get("/jobs/search", { params }),
  
  // Create job (Recruiter)
  createJob: (jobData) => api.post("/jobs", jobData),
  
  // Update job (Recruiter)
  updateJob: (jobId, jobData) => api.patch(`/jobs/${jobId}`, jobData),
  
  // Delete job (Recruiter) - pass recruiterId (clerk id) to validate ownership
  deleteJob: (jobId, recruiterId) => api.delete(`/jobs/${jobId}`, { data: { recruiterId } }),
  
  // Get recruiter's jobs
  getRecruiterJobs: (recruiterId) => api.get(`/jobs/recruiter/${recruiterId}`),
  
  // Apply for job
  applyForJob: (jobId, applicationData) => api.post(`/jobs/${jobId}/apply`, applicationData),
  
  // Get applications for a job
  getJobApplications: (jobId) => api.get(`/jobs/${jobId}/applications`),
  
  // Update application status
  updateApplicationStatus: (appId, statusData) => api.patch(`/jobs/application/${appId}/status`, statusData),
};

// ===== USER ENDPOINTS =====
export const userAPI = {
  // Create user profile
  createProfile: (profileData) => api.post("/users/profile", profileData),
  
  // Get user profile
  getUserProfile: (userId) => api.get(`/users/profile/${userId}`),
  
  // Update user profile
  updateProfile: (userId, profileData) => api.patch(`/users/profile/${userId}`, profileData),
  
  // Get seeker applications
  getSeekerApplications: (userId) => api.get(`/users/seeker/${userId}/applications`),
  
  // Get seeker statistics
  getSeekerStats: (userId) => api.get(`/users/seeker/${userId}/stats`),
  
  // Get recruiter analytics
  getRecruiterAnalytics: (userId) => api.get(`/users/recruiter/${userId}/analytics`),
  
  // Get recruiter applicants
  getRecruiterApplicants: (userId) => api.get(`/users/recruiter/${userId}/applicants`),
  
  // Get applicants for specific job
  getJobApplicants: (jobId) => api.get(`/users/recruiter/job/${jobId}/applicants`),
};

// ===== APPLICATION ENDPOINTS =====
export const applicationAPI = {
  // Apply for job
  applyForJob: (jobData) => api.post("/applications", jobData),
  
  // Get all applications (if needed)
  getAllApplications: () => api.get("/applications"),
  
  // Get application by ID
  getApplicationById: (appId) => api.get(`/applications/${appId}`),

  // Update application status
  updateApplicationStatus: (appId, statusData) => api.patch(`/applications/${appId}/status`, statusData),

  // Withdraw application
  withdrawApplication: (appId, withdrawData) => api.delete(`/applications/${appId}/withdraw`, { data: withdrawData }),
};

export default api;
