import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Code, Users, Zap, Target, Lightbulb } from 'lucide-react';
import Layout from '../components/layout/Layout';

const AboutPage = () => {
    const features = [
        {
            icon: Target,
            title: 'Mission',
            description: 'Connect talented job seekers with amazing job opportunities and help recruiters find the perfect candidates.'
        },
        {
            icon: Users,
            title: 'Community',
            description: 'Build a thriving community of 50,000+ users, connecting thousands of employers with talented professionals.'
        },
        {
            icon: Zap,
            title: 'Innovation',
            description: 'Leverage cutting-edge technology to make job searching and hiring faster, easier, and more efficient.'
        },
        {
            icon: Lightbulb,
            title: 'Growth',
            description: 'Help job seekers grow their careers and assist employers in building exceptional teams.'
        }
    ];

    const stats = [
        { number: '10,000+', label: 'Active Jobs' },
        { number: '50,000+', label: 'Users' },
        { number: '4.8/5', label: 'Average Rating' },
        { number: '95%', label: 'Success Rate' }
    ];

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950 pt-8 pb-20">
                {/* Hero Section */}
                <motion.section
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-6xl mx-auto px-4 mb-20"
                >
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            About <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">JobHub</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            A modern job portal platform designed to connect talented job seekers with amazing opportunities
                            and help recruiters find the perfect candidates for their teams.
                        </p>
                    </div>
                </motion.section>

                {/* Stats Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="max-w-6xl mx-auto px-4 mb-20"
                >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={idx}
                                className="bg-gradient-to-br from-gray-800 to-slate-900 rounded-xl p-6 border border-purple-500/20 text-center"
                                whileHover={{ y: -5 }}
                            >
                                <p className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text mb-2">
                                    {stat.number}
                                </p>
                                <p className="text-gray-400">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Mission & Vision */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="max-w-6xl mx-auto px-4 mb-20"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <motion.div
                            className="bg-gradient-to-br from-gray-800 to-slate-900 rounded-xl p-8 border border-purple-500/20"
                            whileHover={{ scale: 1.02 }}
                        >
                            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
                            <p className="text-gray-300 leading-relaxed">
                                To revolutionize the job market by creating a seamless platform where job seekers can find 
                                their dream careers and employers can discover top talent. We believe in making the job search 
                                process transparent, efficient, and rewarding for everyone involved.
                            </p>
                        </motion.div>

                        <motion.div
                            className="bg-gradient-to-br from-gray-800 to-slate-900 rounded-xl p-8 border border-purple-500/20"
                            whileHover={{ scale: 1.02 }}
                        >
                            <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
                            <p className="text-gray-300 leading-relaxed">
                                To become the leading global job portal platform that empowers millions of professionals 
                                to achieve their career goals while helping businesses build exceptional teams. We envision 
                                a world where finding the right job or candidate is just a click away.
                            </p>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Features Grid */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="max-w-6xl mx-auto px-4 mb-20"
                >
                    <h2 className="text-4xl font-bold text-white text-center mb-12">What We Stand For</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {features.map((feature, idx) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    className="bg-gradient-to-br from-gray-800 to-slate-900 rounded-xl p-8 border border-purple-500/20"
                                    whileHover={{ y: -5 }}
                                >
                                    <Icon className="w-12 h-12 text-purple-400 mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                    <p className="text-gray-400">{feature.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.section>

                {/* Creator Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-6xl mx-auto px-4"
                >
                    <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-12 text-center">
                        <Heart className="w-12 h-12 text-purple-400 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-white mb-4">Built With Passion</h2>
                        <p className="text-gray-300 text-lg mb-4">
                            JobPortal is proudly built by <span className="font-bold text-purple-400">Shivam Chamoli </span> 
                            as part of the Novanector Internship Program.
                        </p>
                        <p className="text-gray-400">
                            Designed with modern technologies including React, Vite, Tailwind CSS, and Framer Motion 
                            to provide the best user experience in job searching and recruitment.
                        </p>
                    </div>
                </motion.section>

                {/* Technologies Section */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="max-w-6xl mx-auto px-4 mt-20"
                >
                    <h2 className="text-3xl font-bold text-white text-center mb-12">Powered By</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Node.js', 'MongoDB', 'Express', 'Clerk'].map((tech, idx) => (
                            <motion.div
                                key={idx}
                                className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center hover:border-purple-500/50 transition-colors"
                                whileHover={{ scale: 1.05 }}
                            >
                                <p className="text-gray-300 font-semibold">{tech}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>
            </div>
        </Layout>
    );
};

export default AboutPage;
