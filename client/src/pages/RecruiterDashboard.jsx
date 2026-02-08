import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, Users, Briefcase, TrendingUp, X, Check, ChevronDown, Award, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useUser } from '@clerk/clerk-react';
import Layout from '../components/layout/Layout';
import { jobAPI, applicationAPI } from '../services/api';

const RecruiterDashboard = () => {
    const { user } = useUser();
    const [showJobForm, setShowJobForm] = useState(false);
    const [showApplicationsModal, setShowApplicationsModal] = useState(false);
    const [selectedJobForApplications, setSelectedJobForApplications] = useState(null);
    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingApps, setLoadingApps] = useState(false);
    const [analytics, setAnalytics] = useState({ totalApplications: 0, totalViews: 0 });
    const [editingJobId, setEditingJobId] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        salary: '',
        jobType: 'Full-time',
        skillsRequired: '',
        experience: '',
        companyInfo: ''
    });

    // Fetch recruiter's jobs when component mounts
    useEffect(() => {
        if (user?.id) {
            fetchRecruiterJobs();
        }
    }, [user?.id]);

    const fetchRecruiterJobs = async () => {
        try {
            setLoading(true);
            const response = await jobAPI.getRecruiterJobs(user?.id);
            setJobs(response.data || []);
            
            // Calculate analytics
            const totalApps = response.data?.reduce((sum, job) => sum + (job.applications?.length || 0), 0) || 0;
            const totalViews = response.data?.reduce((sum, job) => sum + (job.viewCount || job.views || 0), 0) || 0;
            setAnalytics({ totalApplications: totalApps, totalViews });
        } catch (error) {
            console.error('Error fetching jobs:', error);
            toast.error('Failed to load jobs');
        } finally {
            setLoading(false);
        }
    };

    const fetchApplicationsForJob = async (jobId) => {
        try {
            setLoadingApps(true);
            const response = await jobAPI.getJobApplications(jobId);
            setApplications(response.data || []);
        } catch (error) {
            console.error('Error fetching applications:', error);
            toast.error('Failed to load applications');
        } finally {
            setLoadingApps(false);
        }
    };

    const handleViewApplications = (job) => {
        setSelectedJobForApplications(job);
        setShowApplicationsModal(true);
        fetchApplicationsForJob(job._id);
    };

    const handleUpdateApplicationStatus = async (appId, status) => {
        try {
            await jobAPI.updateApplicationStatus(appId, { status });
            toast.success(`Application ${status}!`);
            fetchApplicationsForJob(selectedJobForApplications._id);
            fetchRecruiterJobs();
        } catch (error) {
            console.error('Error updating application:', error);
            toast.error('Failed to update application');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePostJob = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.location) {
            toast.error('Please fill all required fields');
            return;
        }

        try {
            const jobData = {
                title: formData.title,
                description: formData.description,
                location: formData.location,
                type: formData.jobType,
                salary: formData.salary,
                companyName: formData.companyInfo || 'Company Name',
                skills: formData.skillsRequired ? formData.skillsRequired.split(',').map(s => s.trim()) : [],
                recruiterId: user?.id
            };
            
            if (editingJobId) {
                await jobAPI.updateJob(editingJobId, jobData);
                toast.success('Job updated successfully!');
                setEditingJobId(null);
            } else {
                await jobAPI.createJob(jobData);
                toast.success('Job posted successfully!');
            }
            
            setFormData({ title: '', description: '', location: '', salary: '', jobType: 'Full-time', skillsRequired: '', experience: '', companyInfo: '' });
            setShowJobForm(false);
            
            // Refresh jobs list
            fetchRecruiterJobs();
        } catch (error) {
            console.error('Error posting job:', error);
            toast.error('Failed to post job');
        }
    };

    const handleEditJob = (job) => {
        setFormData({
            title: job.title,
            description: job.description,
            location: job.location,
            salary: job.salary,
            jobType: job.type,
            skillsRequired: job.skills?.join(', ') || '',
            experience: job.experience || '',
            companyInfo: job.companyName || ''
        });
        setEditingJobId(job._id);
        setShowJobForm(true);
    };

    const handleDeleteJob = async (jobId) => {
        try {
            await jobAPI.deleteJob(jobId, user?.id);
            setJobs(jobs.filter(job => job._id !== jobId));
            toast.success('Job deleted');
            fetchRecruiterJobs();
        } catch (error) {
            console.error('Error deleting job:', error);
            toast.error('Failed to delete job');
        }
    };

    const totalApplications = analytics.totalApplications;
    const totalViews = analytics.totalViews;

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950 pt-8 pb-20">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">Recruiter Dashboard</h1>
                            <p className="text-gray-400">Manage your job postings and applications</p>
                        </div>
                        <motion.button
                            onClick={() => setShowJobForm(true)}
                            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Plus className="w-5 h-5" />
                            Post New Job
                        </motion.button>
                    </motion.div>

                    {/* Stats */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        {[
                            { icon: Briefcase, label: 'Active Jobs', value: jobs.length, color: 'purple' },
                            { icon: Users, label: 'Total Applications', value: totalApplications, color: 'blue' },
                            { icon: Eye, label: 'Total Views', value: totalViews, color: 'green' },
                            { icon: TrendingUp, label: 'Profile Visits', value: 248, color: 'orange' }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + index * 0.05 }}
                                className={`bg-gradient-to-br from-gray-800 to-slate-900 rounded-lg p-6 border border-${stat.color}-500/20`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                                    </div>
                                    <stat.icon className={`w-8 h-8 text-${stat.color}-400`} />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Job Listings */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <h2 className="text-2xl font-bold text-white mb-6">Your Job Postings</h2>
                        <div className="space-y-4">
                            {loading ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                                    <div className="flex justify-center mb-4">
                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
                                    </div>
                                    <p className="text-gray-400">Loading your jobs...</p>
                                </motion.div>
                            ) : jobs.length > 0 ? (
                                jobs.map((job, index) => (
                                    <motion.div
                                        key={job._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-gradient-to-r from-gray-800 to-slate-900 rounded-lg p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center mb-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-white">{job.title}</h3>
                                                <p className="text-gray-400 text-sm">{job.location} • {job.type}</p>
                                            </div>
                                            <div className="text-gray-300">
                                                <p className="text-sm text-gray-400">Salary</p>
                                                <p className="font-semibold">{job.salary}</p>
                                            </div>
                                            <div className="text-gray-300">
                                                <p className="text-sm text-gray-400">Applications</p>
                                                <p className="font-semibold">{job.applications?.length || 0}</p>
                                            </div>
                                            <div className="text-gray-300">
                                                <p className="text-sm text-gray-400">Views</p>
                                                <p className="font-semibold">{job.viewCount || job.views || 0}</p>
                                            </div>
                                        </div>

                        <div className="flex gap-3 pt-4 border-t border-gray-700 flex-wrap">
                                            <motion.button 
                                                onClick={() => handleViewApplications(job)}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all" 
                                                whileHover={{ scale: 1.05 }} 
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Users className="w-4 h-4" />
                                                View Applications ({job.applications?.length || 0})
                                            </motion.button>
                                            <motion.button onClick={() => handleEditJob(job)} className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Edit2 className="w-4 h-4" />
                                                Edit
                                            </motion.button>
                                            <motion.button onClick={() => handleDeleteJob(job._id)} className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 bg-gradient-to-br from-gray-800 to-slate-900 rounded-lg border border-gray-700">
                                    <p className="text-gray-400 mb-4">No jobs posted yet</p>
                                    <motion.button onClick={() => setShowJobForm(true)} className="text-purple-400 hover:text-purple-300 font-semibold transition-colors" whileHover={{ scale: 1.05 }}>
                                        Post your first job →
                                    </motion.button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Job Posting Modal */}
                {showJobForm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-gradient-to-br from-gray-900 to-slate-900 rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/20">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">{editingJobId ? 'Edit Job' : 'Post a New Job'}</h2>
                                <motion.button onClick={() => { setShowJobForm(false); setEditingJobId(null); }} className="text-gray-400 hover:text-white transition-colors" whileHover={{ rotate: 90 }}>
                                    <X className="w-6 h-6" />
                                </motion.button>
                            </div>

                            <form onSubmit={handlePostJob} className="space-y-4">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Job Title *</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none transition-colors" placeholder="e.g., Senior React Developer" />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Job Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none transition-colors" placeholder="Describe the job responsibilities and requirements..." />
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Location *</label>
                                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} required className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none transition-colors" placeholder="e.g., New York, Remote" />
                                </div>

                                {/* Salary */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Salary Range *</label>
                                    <input type="text" name="salary" value={formData.salary} onChange={handleInputChange} required className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none transition-colors" placeholder="e.g., 100-130k" />
                                </div>

                                {/* Job Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Job Type</label>
                                    <select name="jobType" value={formData.jobType} onChange={handleInputChange} className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none transition-colors">
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Freelance">Freelance</option>
                                    </select>
                                </div>

                                {/* Skills Required */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Skills Required (comma separated)</label>
                                    <input type="text" name="skillsRequired" value={formData.skillsRequired} onChange={handleInputChange} className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none transition-colors" placeholder="e.g., React, JavaScript, Node.js" />
                                </div>

                                {/* Experience */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Experience Required</label>
                                    <input type="text" name="experience" value={formData.experience} onChange={handleInputChange} className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none transition-colors" placeholder="e.g., 3+ years" />
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-4 pt-6">
                                    <motion.button type="submit" className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Check className="w-5 h-5" />
                                        {editingJobId ? 'Update Job' : 'Post Job'}
                                    </motion.button>
                                    <motion.button type="button" onClick={() => { setShowJobForm(false); setEditingJobId(null); }} className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        Cancel
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}

                {/* Applications Modal */}
                {showApplicationsModal && selectedJobForApplications && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-gradient-to-br from-gray-900 to-slate-900 rounded-xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-purple-500/20">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Applications for {selectedJobForApplications.title}</h2>
                                    <p className="text-gray-400 text-sm mt-1">{applications.length} applicant{applications.length !== 1 ? 's' : ''}</p>
                                </div>
                                <motion.button onClick={() => setShowApplicationsModal(false)} className="text-gray-400 hover:text-white transition-colors" whileHover={{ rotate: 90 }}>
                                    <X className="w-6 h-6" />
                                </motion.button>
                            </div>

                            {loadingApps ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500 mx-auto mb-4"></div>
                                    <p className="text-gray-400">Loading applications...</p>
                                </div>
                            ) : applications.length > 0 ? (
                                <div className="space-y-4">
                                    {applications.map((app, idx) => (
                                        <motion.div
                                            key={app._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="bg-gradient-to-r from-gray-800 to-slate-900 rounded-lg p-4 border border-gray-700 hover:border-purple-500/50 transition-all"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white">{app.applicant?.firstName} {app.applicant?.lastName}</h3>
                                                    <p className="text-sm text-gray-400">{app.applicant?.email}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    app.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                                                    app.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                                    app.status === 'interview' ? 'bg-blue-500/20 text-blue-400' :
                                                    'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                                </span>
                                            </div>

                                            {app.applicant?.resumeUrl && (
                                                <div className="mb-3">
                                                    <a 
                                                        href={app.applicant.resumeUrl} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                                                    >
                                                        📄 View Resume
                                                    </a>
                                                </div>
                                            )}

                                            {app.coverLetter && (
                                                <div className="mb-3 bg-gray-900/50 rounded p-3 border border-gray-700">
                                                    <p className="text-xs text-gray-400 mb-1">Cover Letter:</p>
                                                    <p className="text-sm text-gray-300">{app.coverLetter}</p>
                                                </div>
                                            )}

                                            <div className="pt-3 border-t border-gray-700 flex gap-2 flex-wrap">
                                                {app.status !== 'accepted' && (
                                                    <motion.button
                                                        onClick={() => handleUpdateApplicationStatus(app._id, 'accepted')}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 text-green-400 rounded text-xs font-semibold hover:bg-green-500/30 transition-all"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <Award className="w-3 h-3" />
                                                        Accept
                                                    </motion.button>
                                                )}
                                                {app.status !== 'interview' && app.status !== 'accepted' && (
                                                    <motion.button
                                                        onClick={() => handleUpdateApplicationStatus(app._id, 'interview')}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded text-xs font-semibold hover:bg-blue-500/30 transition-all"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <Clock className="w-3 h-3" />
                                                        Interview
                                                    </motion.button>
                                                )}
                                                {app.status !== 'rejected' && (
                                                    <motion.button
                                                        onClick={() => handleUpdateApplicationStatus(app._id, 'rejected')}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-red-500/20 text-red-400 rounded text-xs font-semibold hover:bg-red-500/30 transition-all"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        ✕ Reject
                                                    </motion.button>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-400">No applications yet for this job</p>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </Layout>
    );
};

export default RecruiterDashboard;
