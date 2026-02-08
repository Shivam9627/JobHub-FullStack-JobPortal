import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Download, Calendar, CheckCircle, XCircle, Clock, Users, Upload, Edit2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Layout from '../components/layout/Layout';
import { userAPI, applicationAPI } from '../services/api';

const JobSeekerProfile = () => {
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    skills: [],
    bio: '',
    experience: '',
    resumeUrl: ''
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchProfileData();
    }
  }, [user?.id]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const [profileRes, applicationsRes, statsRes] = await Promise.all([
        userAPI.getUserProfile(user?.id),
        userAPI.getSeekerApplications(user?.id),
        userAPI.getSeekerStats(user?.id)
      ]);

      setProfile(profileRes.data);
      setApplications(applicationsRes.data || []);
      setStats(statsRes.data);

      // Initialize form data
      setFormData({
        firstName: profileRes.data?.firstName || user?.firstName || '',
        lastName: profileRes.data?.lastName || user?.lastName || '',
        skills: profileRes.data?.skills || [],
        bio: profileRes.data?.bio || '',
        experience: profileRes.data?.experience || '',
        resumeUrl: profileRes.data?.resumeUrl || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      // In production, upload to Cloudinary
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          resumeUrl: reader.result
        }));
        toast.success('Resume uploaded!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await userAPI.updateProfile(user?.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        skills: formData.skills,
        bio: formData.bio,
        experience: formData.experience,
        resumeUrl: formData.resumeUrl
      });
      
      toast.success('Profile updated successfully!');
      setEditMode(false);
      fetchProfileData();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-5 h-5" />;
      case 'rejected':
        return <XCircle className="w-5 h-5" />;
      case 'interview':
        return <Calendar className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
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
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                  {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    {formData.firstName} {formData.lastName}
                  </h1>
                  <p className="text-gray-300 flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4" />
                    {user?.emailAddresses?.[0]?.emailAddress}
                  </p>
                  {formData.bio && (
                    <p className="text-gray-300 text-sm">{formData.bio}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setEditMode(!editMode)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
              >
                <Edit2 className="w-4 h-4" />
                {editMode ? 'Cancel' : 'Edit Profile'}
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
              <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                {/* Bio */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-purple-500 focus:outline-none resize-none"
                    rows="3"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Experience */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Experience</label>
                  <textarea
                    value={formData.experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                    className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-purple-500 focus:outline-none resize-none"
                    rows="3"
                    placeholder="Describe your work experience..."
                  />
                </div>

                {/* Skills */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Skills</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                      className="flex-1 bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-purple-500 focus:outline-none"
                      placeholder="Add a skill and press Enter..."
                    />
                    <button
                      onClick={handleAddSkill}
                      className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, idx) => (
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

                {/* Resume */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Resume</label>
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-purple-500 transition cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      className="hidden"
                      id="resume-input"
                    />
                    <label htmlFor="resume-input" className="cursor-pointer block">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-300 font-medium">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-400">PDF, DOC, DOCX (Max 5MB)</p>
                    </label>
                  </div>
                  {formData.resumeUrl && (
                    <p className="text-sm text-green-400 mt-2">✓ Resume uploaded</p>
                  )}
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

          {/* Statistics */}
          {stats && !editMode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8"
            >
              {[
                { label: 'Applications', value: stats.totalApplications, icon: Users, color: 'purple' },
                { label: 'Accepted', value: stats.acceptedApplications, icon: CheckCircle, color: 'green' },
                { label: 'Pending', value: stats.pendingApplications, icon: Clock, color: 'yellow' },
                { label: 'Interview', value: stats.interviewApplications, icon: Calendar, color: 'blue' },
                { label: 'Rejected', value: stats.rejectedApplications, icon: XCircle, color: 'red' }
              ].map((stat, idx) => {
                const Icon = stat.icon;
                const colorClasses = {
                  purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
                  green: 'bg-green-500/10 border-green-500/30 text-green-400',
                  yellow: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
                  blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
                  red: 'bg-red-500/10 border-red-500/30 text-red-400'
                };
                return (
                  <div
                    key={idx}
                    className={`border rounded-lg p-4 text-center ${colorClasses[stat.color]}`}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2" />
                    <p className="text-3xl font-bold mb-1">{stat.value}</p>
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
                {['overview', 'applications'].map((tab) => (
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

              {/* Applications Tab */}
              {activeTab === 'applications' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {applications.length > 0 ? (
                    applications.map((app, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-gradient-to-br from-gray-900 to-slate-900 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-1">{app.job?.title}</h3>
                            <p className="text-purple-400 mb-2">{app.job?.companyName}</p>
                            <p className="text-gray-400 text-sm mb-3">{app.job?.location}</p>
                            <div className="flex gap-2">
                              <span className="text-xs text-gray-500">
                                Applied: {new Date(app.appliedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getStatusColor(app.status)}`}>
                            {getStatusIcon(app.status)}
                            <span className="font-semibold capitalize">{app.status}</span>
                          </div>
                        </div>
                        
                        {app.interviewDate && (
                          <div className="mt-4 pt-4 border-t border-gray-700">
                            <p className="text-gray-300 text-sm">
                              <Calendar className="w-4 h-4 inline mr-2" />
                              Interview: {new Date(app.interviewDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No applications yet. Start applying to jobs!</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                  {/* Profile Info */}
                  <div className="lg:col-span-2 space-y-6">
                    {formData.bio && (
                      <div className="bg-gradient-to-br from-gray-900 to-slate-900 rounded-xl p-6 border border-purple-500/20">
                        <h3 className="text-xl font-bold text-white mb-3">About Me</h3>
                        <p className="text-gray-300">{formData.bio}</p>
                      </div>
                    )}

                    {formData.skills && formData.skills.length > 0 && (
                      <div className="bg-gradient-to-br from-gray-900 to-slate-900 rounded-xl p-6 border border-purple-500/20">
                        <h3 className="text-xl font-bold text-white mb-3">Skills</h3>
                        <div className="flex flex-wrap gap-3">
                          {formData.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg text-sm font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {formData.experience && (
                      <div className="bg-gradient-to-br from-gray-900 to-slate-900 rounded-xl p-6 border border-purple-500/20">
                        <h3 className="text-xl font-bold text-white mb-3">Experience</h3>
                        <p className="text-gray-300 whitespace-pre-wrap">{formData.experience}</p>
                      </div>
                    )}
                  </div>

                  {/* Resume Card */}
                  {formData.resumeUrl && (
                    <div className="bg-gradient-to-br from-gray-900 to-slate-900 rounded-xl p-6 border border-purple-500/20 h-fit">
                      <h3 className="text-xl font-bold text-white mb-4">Resume</h3>
                      <a
                        href={formData.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition"
                      >
                        <Download className="w-5 h-5" />
                        <span className="font-medium">Download Resume</span>
                      </a>
                    </div>
                  )}
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default JobSeekerProfile;
