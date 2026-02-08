import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Building2, Globe, Eye, Users, CheckCircle, XCircle, Calendar, BarChart3, Plus, Edit2, Download, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { userAPI, jobAPI } from '../services/api';

const RecruiterProfile = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('jobs');
  const [selectedJob, setSelectedJob] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    companyDescription: '',
    companyWebsite: '',
    companyLogo: ''
  });
  const [jobFormData, setJobFormData] = useState({
    title: '',
    description: '',
    location: '',
    type: 'Full-time',
    salary: '',
    skills: []
  });
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchProfileData();
    }
  }, [user?.id]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const [profileRes, analyticsRes, jobsRes, applicantsRes] = await Promise.all([
        userAPI.getUserProfile(user?.id),
        userAPI.getRecruiterAnalytics(user?.id),
        jobAPI.getRecruiterJobs(user?.id),
        userAPI.getRecruiterApplicants(user?.id)
      ]);

      setProfile(profileRes.data);
      setAnalytics(analyticsRes.data);
      setJobs(jobsRes.data || []);
      setApplicants(applicantsRes.data || []);

      // Initialize form data
      setFormData({
        companyName: profileRes.data?.companyName || '',
        companyDescription: profileRes.data?.companyDescription || '',
        companyWebsite: profileRes.data?.companyWebsite || '',
        companyLogo: profileRes.data?.companyLogo || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await userAPI.updateProfile(user?.id, {
        companyName: formData.companyName,
        companyDescription: formData.companyDescription,
        companyWebsite: formData.companyWebsite,
        companyLogo: formData.companyLogo
      });

      toast.success('Company profile updated!');
      setEditMode(false);
      fetchProfileData();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCreateJob = async () => {
    if (!jobFormData.title || !jobFormData.description || !jobFormData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await jobAPI.createJob({
        ...jobFormData,
        companyName: formData.companyName,
        recruiterId: user?.id
      });

      toast.success('Job posted successfully!');
      setShowJobModal(false);
      setJobFormData({
        title: '',
        description: '',
        location: '',
        type: 'Full-time',
        salary: '',
        skills: []
      });
      setSkillInput('');
      fetchProfileData();
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Failed to post job');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobAPI.deleteJob(jobId);
        toast.success('Job deleted');
        fetchProfileData();
      } catch (error) {
        toast.error('Failed to delete job');
      }
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await jobAPI.updateApplicationStatus(appId, { status: newStatus });
      toast.success(`Application ${newStatus}`);
      fetchProfileData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setJobFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setJobFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-500/20 border-green-500 text-green-400';
      case 'rejected':
        return 'bg-red-500/20 border-red-500 text-red-400';
      case 'interview':
        return 'bg-blue-500/20 border-blue-500 text-blue-400';
      default:
        return 'bg-yellow-500/20 border-yellow-500 text-yellow-400';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-xl p-8 mb-8 border border-purple-500/20"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-2">
                  {formData.companyName || 'Company'}
                </h1>
                <p className="text-gray-300 flex items-center gap-2 mb-4">
                  <Mail className="w-4 h-4" />
                  {user?.emailAddresses?.[0]?.emailAddress}
                </p>
                {formData.companyDescription && (
                  <p className="text-gray-300 text-sm max-w-2xl">{formData.companyDescription}</p>
                )}
              </div>
              <button
                onClick={() => setEditMode(!editMode)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition whitespace-nowrap"
              >
                <Edit2 className="w-4 h-4" />
                {editMode ? 'Cancel' : 'Edit Company'}
              </button>
            </div>
          </motion.div>

          {/* Edit Mode */}
          {editMode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-gray-900 to-slate-900 rounded-xl p-8 mb-8 border border-purple-500/20"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Edit Company Profile</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                    className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                {/* Company Website */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                  <input
                    type="url"
                    value={formData.companyWebsite}
                    onChange={(e) => setFormData(prev => ({ ...prev, companyWebsite: e.target.value }))}
                    className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-purple-500 focus:outline-none"
                    placeholder="https://example.com"
                  />
                </div>

                {/* Company Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Company Description</label>
                  <textarea
                    value={formData.companyDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, companyDescription: e.target.value }))}
                    className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-purple-500 focus:outline-none resize-none"
                    rows="4"
                    placeholder="Tell us about your company..."
                  />
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveProfile}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition"
              >
                Save Changes
              </button>
            </motion.div>
          )}

          {/* Analytics */}
          {analytics && !editMode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
            >
              {[
                { label: 'Posted Jobs', value: analytics.totalJobs, icon: Users, color: 'purple' },
                { label: 'Total Applications', value: analytics.totalApplications, icon: BarChart3, color: 'blue' },
                { label: 'Accepted', value: analytics.acceptedApplications, icon: CheckCircle, color: 'green' },
                { label: 'Pending', value: analytics.pendingApplications, icon: Calendar, color: 'yellow' }
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={idx}
                    className={`bg-${stat.color}-500/10 border border-${stat.color}-500/30 rounded-lg p-4 text-center`}
                  >
                    <Icon className={`w-6 h-6 text-${stat.color}-400 mx-auto mb-2`} />
                    <p className={`text-3xl font-bold text-${stat.color}-400 mb-1`}>{stat.value}</p>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* Tabs */}
          {!editMode && (
            <>
              <div className="flex gap-4 mb-8 border-b border-purple-500/20">
                {['jobs', 'applicants'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 font-semibold capitalize transition-colors ${
                      activeTab === tab
                        ? 'text-purple-400 border-b-2 border-purple-500'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Jobs Tab */}
              {activeTab === 'jobs' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <button
                    onClick={() => setShowJobModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition mb-6"
                  >
                    <Plus className="w-5 h-5" />
                    Post New Job
                  </button>

                  {jobs.length > 0 ? (
                    jobs.map((job, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-gradient-to-br from-gray-900 to-slate-900 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-1">{job.title}</h3>
                            <p className="text-gray-400 text-sm mb-3">{job.location}</p>
                            <div className="flex gap-3 flex-wrap">
                              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">
                                {job.type}
                              </span>
                              {job.salary && (
                                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-medium">
                                  {job.salary}
                                </span>
                              )}
                              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium">
                                {job.applicants?.length || 0} applications
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate(`/job-details/${job._id}`)}
                              className="p-2 text-gray-400 hover:text-blue-400 transition"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteJob(job._id)}
                              className="p-2 text-gray-400 hover:text-red-400 transition"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Job Description Preview */}
                        <p className="text-gray-300 text-sm line-clamp-2 mb-3">{job.description}</p>

                        {/* Skills */}
                        {job.skills && job.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill, sidx) => (
                              <span key={sidx} className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 mb-4">No jobs posted yet</p>
                      <button
                        onClick={() => setShowJobModal(true)}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
                      >
                        <Plus className="w-4 h-4" />
                        Post First Job
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Applicants Tab */}
              {activeTab === 'applicants' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {applicants.length > 0 ? (
                    applicants.map((app, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-gradient-to-br from-gray-900 to-slate-900 rounded-xl p-6 border border-purple-500/20"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-1">
                              {app.applicant?.firstName} {app.applicant?.lastName}
                            </h3>
                            <p className="text-gray-400 text-sm mb-2">{app.job?.title}</p>
                            <div className="flex gap-4 text-sm">
                              <span className="text-gray-400">
                                <Mail className="w-4 h-4 inline mr-1" />
                                {app.applicant?.email}
                              </span>
                              <span className="text-gray-400">
                                Applied: {new Date(app.appliedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className={`px-4 py-2 rounded-lg border ${getStatusColor(app.status)}`}>
                            <span className="font-semibold capitalize">{app.status}</span>
                          </div>
                        </div>

                        {/* Applicant Skills */}
                        {app.applicant?.skills && app.applicant.skills.length > 0 && (
                          <div className="mb-4">
                            <p className="text-gray-400 text-sm mb-2">Skills:</p>
                            <div className="flex flex-wrap gap-2">
                              {app.applicant.skills.map((skill, sidx) => (
                                <span key={sidx} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {app.applicant?.resumeUrl && (
                            <a
                              href={app.applicant.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/30 transition text-sm"
                            >
                              <Download className="w-4 h-4" />
                              Resume
                            </a>
                          )}
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app._id, e.target.value)}
                            className="px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-purple-500 focus:outline-none text-sm"
                          >
                            <option value="pending">Pending</option>
                            <option value="interview">Interview</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No applicants yet</p>
                    </div>
                  )}
                </motion.div>
              )}
            </>
          )}
        </div>

        {/* Create Job Modal */}
        <AnimatePresence>
          {showJobModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto"
              onClick={() => setShowJobModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-gradient-to-br from-gray-900 to-slate-900 rounded-2xl p-8 max-w-2xl w-full border border-purple-500/20 my-8"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold text-white mb-6">Post New Job</h2>

                <div className="space-y-6 max-h-96 overflow-y-auto">
                  {/* Job Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Job Title *</label>
                    <input
                      type="text"
                      value={jobFormData.title}
                      onChange={(e) => setJobFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-purple-500 focus:outline-none"
                      placeholder="e.g., Senior React Developer"
                    />
                  </div>

                  {/* Job Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                    <textarea
                      value={jobFormData.description}
                      onChange={(e) => setJobFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-purple-500 focus:outline-none resize-none"
                      rows="4"
                      placeholder="Describe the job details..."
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Location *</label>
                    <input
                      type="text"
                      value={jobFormData.location}
                      onChange={(e) => setJobFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-purple-500 focus:outline-none"
                      placeholder="e.g., New York, Remote"
                    />
                  </div>

                  {/* Job Type & Salary */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Job Type</label>
                      <select
                        value={jobFormData.type}
                        onChange={(e) => setJobFormData(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-purple-500 focus:outline-none"
                      >
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Contract</option>
                        <option>Intern</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Salary (Optional)</label>
                      <input
                        type="text"
                        value={jobFormData.salary}
                        onChange={(e) => setJobFormData(prev => ({ ...prev, salary: e.target.value }))}
                        className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-purple-500 focus:outline-none"
                        placeholder="e.g., $100k-150k"
                      />
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Required Skills</label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                        className="flex-1 bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-purple-500 focus:outline-none"
                        placeholder="Add skill and press Enter..."
                      />
                      <button
                        onClick={handleAddSkill}
                        className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {jobFormData.skills.map((skill, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm"
                        >
                          {skill}
                          <button
                            onClick={() => handleRemoveSkill(skill)}
                            className="text-purple-400 hover:text-purple-200"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setShowJobModal(false)}
                    className="flex-1 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateJob}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition font-semibold"
                  >
                    Post Job
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default RecruiterProfile;
