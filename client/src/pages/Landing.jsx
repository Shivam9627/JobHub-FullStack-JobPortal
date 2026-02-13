import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Users, MapPin, DollarSign, Star, ArrowRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SignedOut, SignInButton as ClerkSignInButton, useUser } from '@clerk/clerk-react';
import Layout from '../components/layout/Layout';
import RoleModal from '../components/RoleModal';
// api helper wraps axios and respects VITE_API_BASE_URL
import { jobAPI } from '../services/api';

const LandingPage = () => {
    const navigate = useNavigate();
    const { user, isLoaded } = useUser();
    const [searchQuery, setSearchQuery] = useState('');
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [popularJobs, setPopularJobs] = useState([]);
    const [loadingJobs, setLoadingJobs] = useState(true);

    // Show role modal when user signs in without a role
    useEffect(() => {
        if (isLoaded && user && !user.unsafeMetadata?.role) {
            setShowRoleModal(true);
        }
    }, [isLoaded, user]);

    // Fetch popular jobs from backend (uses base url from env)
    useEffect(() => {
        const fetchPopularJobs = async () => {
            try {
                // use shared api utility so base URL adapts to environment
                const response = await jobAPI.getAllJobs();
                const jobs = response.data;
                setPopularJobs(jobs.slice(0, 6) || []);
            } catch (error) {
                console.error('Error fetching jobs:', error);
                // keep UI from crashing
                setPopularJobs([]);
            } finally {
                setLoadingJobs(false);
            }
        };
        fetchPopularJobs();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.3 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    };

    const handleSearchAndNavigate = () => {
        if (user) {
            // Check user role and navigate accordingly
            const userRole = user?.unsafeMetadata?.role;
            if (userRole === 'seeker') {
                navigate('/jobs-seeker');
            } else if (userRole === 'recruiter') {
                navigate('/recruiter-dashboard');
            } else {
                // If no role set, show the modal
                setShowRoleModal(true);
            }
        }
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950">
                <RoleModal isOpen={showRoleModal} onClose={() => setShowRoleModal(false)} />
                {/* Hero Section */}
                <section className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
                    <motion.div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20" animate={{ y: [0, 30, 0], x: [0, 30, 0] }} transition={{ duration: 8, repeat: Infinity }} />
                    <motion.div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20" animate={{ y: [0, -30, 0], x: [0, -30, 0] }} transition={{ duration: 10, repeat: Infinity }} />

                    <div className="relative z-10 container mx-auto px-4 py-20">
                        <motion.div className="text-center mb-12" variants={containerVariants} initial="hidden" animate="visible">
                            <motion.h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight" variants={itemVariants}>
                                Your <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Dream Career</span> Awaits
                            </motion.h1>
                            <motion.p className="text-xl text-gray-400 max-w-2xl mx-auto mb-4" variants={itemVariants}>
                                Find your perfect job from thousands of opportunities or post jobs as a recruiter. Connect talent with opportunity.
                            </motion.p>
                            <motion.p className="text-lg text-white font-semibold max-w-2xl mx-auto mb-8" variants={itemVariants}>
                                Built & created by <span className="text-purple-400">Shivam Chamoli</span>
                            </motion.p>

                            {/* Search Bar */}
                            <motion.div className="flex gap-4 max-w-2xl mx-auto mb-12" variants={itemVariants}>
                                <div className="flex-1 relative">
                                    <Search className="absolute left-4 top-4 w-5 h-5 text-purple-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Job title, skills..." 
                                        value={searchQuery} 
                                        onChange={(e) => setSearchQuery(e.target.value)} 
                                        className="w-full bg-gray-800 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none" 
                                    />
                                </div>
                                <motion.button 
                                    onClick={handleSearchAndNavigate}
                                    disabled={!user}
                                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed" 
                                    whileHover={{ scale: 1.05 }} 
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Search
                                </motion.button>
                            </motion.div>

                            {/* Role Selection */}
                            <motion.div className="flex gap-6 justify-center flex-wrap" variants={itemVariants}>
                                <SignedOut>
                                    <ClerkSignInButton mode="modal">
                                        <motion.button 
                                            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/50 transition-all" 
                                            whileHover={{ scale: 1.05 }} 
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Briefcase className="w-5 h-5" />
                                            I'm a Job Seeker
                                            <ArrowRight className="w-5 h-5" />
                                        </motion.button>
                                    </ClerkSignInButton>
                                    <ClerkSignInButton mode="modal">
                                        <motion.button 
                                            className="px-8 py-4 border-2 border-purple-500 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-purple-500/10 transition-all" 
                                            whileHover={{ scale: 1.05 }} 
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Users className="w-5 h-5" />
                                            I'm a Recruiter
                                            <ArrowRight className="w-5 h-5" />
                                        </motion.button>
                                    </ClerkSignInButton>
                                </SignedOut>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-y border-purple-500/20">
                    <div className="container mx-auto px-4">
                        <motion.h2 className="text-4xl font-bold text-white text-center mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                            Why Choose Us?
                        </motion.h2>
                        <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-6" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                            {[
                                { icon: Briefcase, title: '10,000+ Jobs', desc: 'Opportunities from top companies' },
                                { icon: Users, title: '50,000+ Users', desc: 'Join active job seekers' },
                                { icon: Star, title: 'Top Rated', desc: '4.8/5 rating from users' },
                                { icon: DollarSign, title: 'Best Pay', desc: 'Competitive salaries offered' },
                            ].map((feature, idx) => {
                                const Icon = feature.icon;
                                return (
                                    <motion.div 
                                        key={idx} 
                                        className="relative group" 
                                        variants={itemVariants} 
                                        whileHover={{ y: -5 }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                                        <div className="relative bg-gradient-to-br from-gray-800 to-slate-900 p-6 rounded-xl border border-purple-500/30 hover:border-purple-500/60 text-center transition-all">
                                            <Icon className="w-12 h-12 text-purple-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                                            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                            <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{feature.desc}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                </section>

                {/* Popular Jobs Preview */}
                <section className="py-20 container mx-auto px-4">
                    <motion.h2 className="text-4xl font-bold text-white mb-12 text-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                        Popular Jobs
                    </motion.h2>
                    {loadingJobs ? (
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
                        </div>
                    ) : popularJobs.length > 0 ? (
                        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                            {popularJobs.map((job, idx) => (
                                <motion.div 
                                    key={job._id || idx} 
                                    className="relative group" 
                                    variants={itemVariants} 
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                                    <div className="relative bg-gradient-to-br from-gray-800 to-slate-900 p-6 rounded-xl border border-purple-500/30 hover:border-purple-500/60 transition-all">
                                        <div className="absolute top-4 right-4 bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-semibold">
                                            {job.type}
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{job.title}</h3>
                                        <p className="text-purple-400 font-semibold mb-4">{job.companyName}</p>
                                        <div className="space-y-2 mb-4 pb-4 border-b border-gray-700">
                                            <div className="flex items-center gap-2 text-gray-300">
                                                <MapPin className="w-4 h-4 text-purple-400" />
                                                {job.location}
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-300">
                                                <DollarSign className="w-4 h-4 text-green-400" />
                                                {job.salary || 'Competitive'}
                                            </div>
                                        </div>
                                        <motion.button 
                                            onClick={() => navigate(`/job-details/${job._id}`)}
                                            className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all" 
                                            whileHover={{ scale: 1.02 }} 
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            View Details
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-400 text-lg">No jobs available yet. Check back soon!</p>
                        </div>
                    )}
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
                    <div className="container mx-auto px-4 text-center">
                        <motion.h2 className="text-4xl font-bold text-white mb-6" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                            Ready to Find Your Next Opportunity?
                        </motion.h2>
                        <motion.p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                            Join thousands of professionals and start your career journey today!
                        </motion.p>
                        <SignedOut>
                            <ClerkSignInButton mode="modal">
                                <motion.button className="px-8 py-4 bg-white text-purple-600 font-bold rounded-lg text-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                                    Get Started Now
                                </motion.button>
                            </ClerkSignInButton>
                        </SignedOut>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default LandingPage;
