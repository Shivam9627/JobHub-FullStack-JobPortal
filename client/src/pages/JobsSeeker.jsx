import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, DollarSign, Briefcase, ChevronDown, Bookmark, Eye, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Layout from '../components/layout/Layout';
import { jobAPI } from '../services/api';

const JobsSeeker = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('All');
    const [selectedJobType, setSelectedJobType] = useState('All');
    const [selectedSalary, setSelectedSalary] = useState('All');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savedJobs, setSavedJobs] = useState([]);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await jobAPI.getAllJobs();
            setJobs(response.data || []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            toast.error('Failed to load jobs');
        } finally {
            setLoading(false);
        }
    };

    const locations = ['All', ...new Set(jobs.map(job => job.location))];
    const jobTypes = ['All', 'Full-time', 'Part-time', 'Intern', 'Contract'];
    const salaryRanges = ['All', '0-50k', '50-100k', '100-150k', '150k+'];

    // Filter jobs
    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            const matchSearch = 
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (job.skills && job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())));
            
            const matchLocation = selectedLocation === 'All' || job.location === selectedLocation;
            const matchJobType = selectedJobType === 'All' || job.type === selectedJobType;
            
            let matchSalary = true;
            if (selectedSalary !== 'All' && job.salary) {
                const salaryStart = parseInt(job.salary.split('-')[0]) || 0;
                if (selectedSalary === '0-50k') matchSalary = salaryStart <= 50;
                else if (selectedSalary === '50-100k') matchSalary = salaryStart > 50 && salaryStart <= 100;
                else if (selectedSalary === '100-150k') matchSalary = salaryStart > 100 && salaryStart <= 150;
                else if (selectedSalary === '150k+') matchSalary = salaryStart > 150;
            }

            return matchSearch && matchLocation && matchJobType && matchSalary;
        });
    }, [jobs, searchQuery, selectedLocation, selectedJobType, selectedSalary]);

    const toggleSaveJob = (jobId) => {
        setSavedJobs(prev => 
            prev.includes(jobId) 
                ? prev.filter(id => id !== jobId)
                : [...prev, jobId]
        );
    };

    const handleViewJob = (jobId) => {
        navigate(`/job-details/${jobId}`);
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-4xl font-bold text-white mb-2">Find Your Dream Job</h1>
                        <p className="text-gray-400">Explore thousands of job opportunities</p>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-gray-900 to-slate-900 rounded-xl p-6 mb-8 border border-purple-500/20"
                    >
                        <div className="flex gap-4 flex-col md:flex-row">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-4 w-5 h-5 text-purple-400" />
                                <input
                                    type="text"
                                    placeholder="Search by job title, company, or skills..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-gray-800 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none transition"
                                />
                            </div>
                            <button
                                onClick={fetchJobs}
                                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition"
                            >
                                Search
                            </button>
                        </div>
                    </motion.div>

                    {/* Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-gray-900 to-slate-900 rounded-xl p-6 mb-8 border border-purple-500/20"
                    >
                        <h3 className="text-lg font-bold text-white mb-4">Filter Jobs</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Location Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                                <select
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-purple-500 focus:outline-none"
                                >
                                    {locations.map(location => (
                                        <option key={location} value={location}>{location}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Job Type Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Job Type</label>
                                <select
                                    value={selectedJobType}
                                    onChange={(e) => setSelectedJobType(e.target.value)}
                                    className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-purple-500 focus:outline-none"
                                >
                                    {jobTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Salary Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Salary Range</label>
                                <select
                                    value={selectedSalary}
                                    onChange={(e) => setSelectedSalary(e.target.value)}
                                    className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-purple-500 focus:outline-none"
                                >
                                    {salaryRanges.map(salary => (
                                        <option key={salary} value={salary}>{salary}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </motion.div>

                    {/* Results Info */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-6 flex justify-between items-center"
                    >
                        <p className="text-gray-300">
                            Found <span className="font-bold text-purple-400">{filteredJobs.length}</span> jobs
                        </p>
                    </motion.div>

                    {/* Jobs List */}
                    {loading ? (
                        <div className="flex justify-center items-center min-h-96">
                            <div className="text-center">
                                <Loader className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
                                <p className="text-gray-300">Loading jobs...</p>
                            </div>
                        </div>
                    ) : filteredJobs.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 gap-4"
                        >
                            {filteredJobs.map((job, idx) => (
                                <motion.div
                                    key={job._id || idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-gradient-to-br from-gray-900 to-slate-900 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all hover:shadow-lg hover:shadow-purple-500/20"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-white mb-1">{job.title}</h3>
                                            <p className="text-purple-400 font-semibold mb-2">{job.companyName}</p>
                                            
                                            {/* Job Meta Info */}
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    {job.location}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Briefcase className="w-4 h-4" />
                                                    {job.type}
                                                </span>
                                                {job.salary && (
                                                    <span className="flex items-center gap-1">
                                                        <DollarSign className="w-4 h-4" />
                                                        {job.salary}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Description Preview */}
                                            <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                                                {job.description}
                                            </p>

                                            {/* Skills Tags */}
                                            {job.skills && job.skills.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {job.skills.slice(0, 5).map((skill, sidx) => (
                                                        <span
                                                            key={sidx}
                                                            className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                    {job.skills.length > 5 && (
                                                        <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs font-medium">
                                                            +{job.skills.length - 5} more
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Job Stats */}
                                            <div className="flex gap-4 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Eye className="w-3 h-3" />
                                                    {job.viewCount || 0} views
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    {job.applicants?.length || 0} applicants
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2 ml-4">
                                            <motion.button
                                                onClick={() => toggleSaveJob(job._id)}
                                                className={`p-3 rounded-lg transition-colors ${
                                                    savedJobs.includes(job._id)
                                                        ? 'bg-purple-500/20 text-purple-400'
                                                        : 'bg-gray-800 text-gray-400 hover:text-purple-400'
                                                }`}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Bookmark className="w-5 h-5" fill={savedJobs.includes(job._id) ? "currentColor" : "none"} />
                                            </motion.button>
                                        </div>
                                    </div>

                                    {/* View Details Button */}
                                    <motion.button
                                        onClick={() => handleViewJob(job._id)}
                                        className="w-full py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        View Details & Apply
                                    </motion.button>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">No jobs found</h3>
                            <p className="text-gray-400 mb-4">Try adjusting your search filters</p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedLocation('All');
                                    setSelectedJobType('All');
                                    setSelectedSalary('All');
                                }}
                                className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
                            >
                                Clear Filters
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default JobsSeeker;
