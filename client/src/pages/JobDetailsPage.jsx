import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, DollarSign, Briefcase, Users, Clock, Bookmark, Send, Share2, ChevronLeft, Upload } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';
import Layout from '../components/layout/Layout';
import { jobAPI, applicationAPI, userAPI } from '../services/api';

const JobDetailsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useUser();
    const [job, setJob] = useState(null);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [formData, setFormData] = useState({
        resumeUrl: '',
        coverLetter: ''
    });
    const [resumeFile, setResumeFile] = useState(null);

    useEffect(() => {
        if (id) {
            fetchJobDetails();
            if (user?.id) {
                fetchUserProfile();
            }
        }
    }, [id, user?.id]);

    const fetchJobDetails = async () => {
        try {
            const response = await jobAPI.getJobById(id);
            setJob(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching job:', error);
            toast.error('Failed to load job details');
            setLoading(false);
        }
    };

    const fetchUserProfile = async () => {
        try {
            const response = await userAPI.getUserProfile(user.id);
            setUserProfile(response.data);
            if (response.data.resumeUrl) {
                setFormData(prev => ({ ...prev, resumeUrl: response.data.resumeUrl }));
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // In production, upload to Cloudinary
        // For now, create a local preview
        setResumeFile(file);
        setFormData(prev => ({
            ...prev,
            resumeUrl: URL.createObjectURL(file)
        }));
        toast.success('Resume selected!');
    };

    const handleApply = async () => {
        if (!formData.resumeUrl) {
            toast.error('Please upload or select a resume');
            return;
        }

        try {
            setApplying(true);
            const response = await applicationAPI.applyForJob({
                jobId: id,
                applicantId: user.id,
                resumeUrl: formData.resumeUrl,
                coverLetter: formData.coverLetter
            });

            toast.success('Application submitted successfully!');
            setShowApplyModal(false);
            setFormData({ resumeUrl: '', coverLetter: '' });
            fetchJobDetails();
        } catch (error) {
            console.error('Error applying:', error);
            toast.error(error.response?.data?.message || 'Failed to submit application');
        } finally {
            setApplying(false);
        }
    };

    const handleSave = () => {
        setSaved(!saved);
        toast.success(saved ? 'Job removed from saved' : 'Job saved!');
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
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

    if (!job) {
        return (
            <Layout>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white mb-4">Job not found</h2>
                        <button 
                            onClick={() => navigate('/jobs-seeker')}
                            className="px-6 py-2 bg-purple-500 text-white rounded-lg"
                        >
                            Back to Jobs
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950 pt-8 pb-20">
                <div className="max-w-4xl mx-auto px-4">
                    {/* Back Button */}
                    <motion.button
                        onClick={() => navigate('/jobs-seeker')}
                        className="flex items-center gap-2 text-gray-400 hover:text-purple-400 mb-8 transition-colors"
                        whileHover={{ x: -5 }}
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Back to Jobs
                    </motion.button>

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-gray-800 to-slate-900 rounded-xl p-8 border border-purple-500/20 mb-8"
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-2">{job.title}</h1>
                                <p className="text-xl text-gray-400">{job.companyName}</p>
                            </div>
                            <div className="flex gap-3">
                                <motion.button
                                    onClick={handleSave}
                                    className={`p-3 rounded-lg transition-colors ${saved ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-700 text-gray-400'}`}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Bookmark className="w-6 h-6" fill={saved ? 'currentColor' : 'none'} />
                                </motion.button>
                                <motion.button
                                    onClick={handleShare}
                                    className="p-3 bg-gray-700 text-gray-400 rounded-lg hover:bg-gray-600 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Share2 className="w-6 h-6" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Job Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Location</p>
                                <div className="flex items-center gap-2 text-white">
                                    <MapPin className="w-4 h-4 text-purple-400" />
                                    {job.location}
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Salary</p>
                                <div className="flex items-center gap-2 text-white">
                                    <DollarSign className="w-4 h-4 text-green-400" />
                                    {job.salary || 'Competitive'}
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Job Type</p>
                                <div className="flex items-center gap-2 text-white">
                                    <Briefcase className="w-4 h-4 text-blue-400" />
                                    {job.type}
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Posted</p>
                                <div className="flex items-center gap-2 text-white">
                                    <Clock className="w-4 h-4 text-orange-400" />
                                    {new Date(job.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        {/* Apply Button */}
                        <motion.button
                            onClick={() => setShowApplyModal(true)}
                            className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Send className="w-5 h-5" />
                            Apply Now
                        </motion.button>
                    </motion.div>

                    {/* Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Description */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-gradient-to-br from-gray-800 to-slate-900 rounded-xl p-6 border border-purple-500/20"
                            >
                                <h2 className="text-2xl font-bold text-white mb-4">Job Description</h2>
                                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{job.description}</p>
                            </motion.div>

                            {/* Skills */}
                            {job.skills && job.skills.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-gradient-to-br from-gray-800 to-slate-900 rounded-xl p-6 border border-purple-500/20"
                                >
                                    <h2 className="text-2xl font-bold text-white mb-4">Required Skills</h2>
                                    <div className="flex flex-wrap gap-3">
                                        {job.skills.map((skill, idx) => (
                                            <motion.span
                                                key={idx}
                                                className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg text-sm font-medium"
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                {skill}
                                            </motion.span>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Company Info */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-gradient-to-br from-gray-800 to-slate-900 rounded-xl p-6 border border-purple-500/20"
                            >
                                <h3 className="text-xl font-bold text-white mb-4">Recruiter Info</h3>
                                <div className="space-y-2">
                                    <p className="text-gray-300">{job.recruiter?.firstName} {job.recruiter?.lastName}</p>
                                    <p className="text-sm text-gray-400">Company: {job.companyName}</p>
                                </div>
                            </motion.div>

                            {/* Job Stats */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-gradient-to-br from-gray-800 to-slate-900 rounded-xl p-6 border border-purple-500/20"
                            >
                                <h3 className="text-xl font-bold text-white mb-4">Job Stats</h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-gray-400 text-sm mb-1">Applicants</p>
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-purple-400" />
                                            <p className="text-white font-semibold">{job.applicants?.length || 0} applied</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm mb-1">Views</p>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-blue-400" />
                                            <p className="text-white font-semibold">{job.viewCount || 0} views</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Apply CTA */}
                            <motion.button
                                onClick={() => setShowApplyModal(true)}
                                className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                Apply Now
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Apply Modal */}
                {showApplyModal && (
                    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gradient-to-br from-gray-900 to-slate-900 rounded-2xl p-8 max-w-md w-full border border-purple-500/20"
                        >
                            <h2 className="text-2xl font-bold text-white mb-6">Apply for {job.title}</h2>

                            {/* Resume Upload */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Resume *</label>
                                <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-purple-500 transition">
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        id="resume-input"
                                    />
                                    <label htmlFor="resume-input" className="cursor-pointer">
                                        <p className="text-gray-300 font-medium">Click to upload or drag and drop</p>
                                        <p className="text-sm text-gray-400">PDF, DOC, DOCX (Max 5MB)</p>
                                    </label>
                                </div>
                                {formData.resumeUrl && (
                                    <p className="text-sm text-green-400 mt-2">✓ Resume selected</p>
                                )}
                            </div>

                            {/* Cover Letter */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Cover Letter (Optional)</label>
                                <textarea
                                    value={formData.coverLetter}
                                    onChange={(e) => setFormData(prev => ({ ...prev, coverLetter: e.target.value }))}
                                    className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-purple-500 focus:outline-none resize-none"
                                    rows="4"
                                    placeholder="Tell the recruiter why you're interested in this role..."
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowApplyModal(false)}
                                    className="flex-1 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleApply}
                                    disabled={applying}
                                    className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50"
                                >
                                    {applying ? 'Submitting...' : 'Submit Application'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default JobDetailsPage;
