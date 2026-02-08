import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Landing from "../pages/Landing";
import About from "../pages/About";
import Contact from "../pages/Contact";
import JobsSeeker from "../pages/JobsSeeker";
import RecruiterDashboard from "../pages/RecruiterDashboard";
import JobDetailsPage from "../pages/JobDetailsPage";
import JobSeekerProfile from "../pages/JobSeekerProfile";
import RecruiterProfile from "../pages/RecruiterProfile";

// Protected route component
const ProtectedRoute = ({ children }) => (
  <>
    <SignedIn>{children}</SignedIn>
    <SignedOut>
      <RedirectToSignIn />
    </SignedOut>
  </>
);

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes - No login required */}
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Protected Routes - Requires Clerk authentication */}
        <Route 
          path="/jobs-seeker" 
          element={
            <ProtectedRoute>
              <JobsSeeker />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/recruiter-dashboard" 
          element={
            <ProtectedRoute>
              <RecruiterDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/job-details/:id" 
          element={
            <ProtectedRoute>
              <JobDetailsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile/seeker" 
          element={
            <ProtectedRoute>
              <JobSeekerProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile/recruiter" 
          element={
            <ProtectedRoute>
              <RecruiterProfile />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}
