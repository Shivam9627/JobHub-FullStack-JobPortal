import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Layout from '../components/layout/Layout';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            toast.error('Please fill in all fields');
            return;
        }
        toast.success('Message sent successfully! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    const contactInfo = [
        {
            icon: Mail,
            title: 'Email',
            details: 'support@jobhub.com',
            description: 'We reply within 24 hours'
        },
        {
            icon: Phone,
            title: 'Phone',
            details: '+91 (555) 123-4567',
            description: 'Available 9 AM - 6 PM IST'
        },
        {
            icon: MapPin,
            title: 'Address',
            details: 'Dehradun, Uttarakhand',
            description: 'Novanector Internship Program'
        }
    ];

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950 pt-8 pb-20">
                {/* Hero Section */}
                <motion.section
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-6xl mx-auto px-4 mb-16"
                >
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            Get In <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Touch</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            Have a question or feedback? We'd love to hear from you. Our team is here to help.
                        </p>
                    </div>
                </motion.section>

                {/* Contact Info Cards */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="max-w-6xl mx-auto px-4 mb-16"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {contactInfo.map((info, idx) => {
                            const Icon = info.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    className="bg-gradient-to-br from-gray-800 to-slate-900 rounded-xl p-8 border border-purple-500/20 text-center"
                                    whileHover={{ y: -5 }}
                                >
                                    <Icon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-2">{info.title}</h3>
                                    <p className="text-gray-300 font-semibold mb-2">{info.details}</p>
                                    <p className="text-gray-400 text-sm">{info.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.section>

                {/* Contact Form Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto px-4"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Form */}
                        <div className="bg-gradient-to-br from-gray-800 to-slate-900 rounded-xl p-8 border border-purple-500/20">
                            <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none transition-colors"
                                        placeholder="Your name"
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none transition-colors"
                                        placeholder="your@email.com"
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none transition-colors"
                                        placeholder="What is this about?"
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows="5"
                                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none transition-colors resize-none"
                                        placeholder="Your message here..."
                                    />
                                </motion.div>

                                <motion.button
                                    type="submit"
                                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <Send className="w-5 h-5" />
                                    Send Message
                                </motion.button>
                            </form>
                        </div>

                        {/* Info Section */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div className="bg-gradient-to-br from-gray-800 to-slate-900 rounded-xl p-8 border border-purple-500/20">
                                <h3 className="text-xl font-bold text-white mb-4">Why Contact Us?</h3>
                                <ul className="space-y-3 text-gray-300">
                                    <li className="flex items-start gap-3">
                                        <span className="text-purple-400 font-bold mt-1">✓</span>
                                        <span>Report technical issues or bugs</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-purple-400 font-bold mt-1">✓</span>
                                        <span>Request new features or improvements</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-purple-400 font-bold mt-1">✓</span>
                                        <span>Business inquiries and partnerships</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-purple-400 font-bold mt-1">✓</span>
                                        <span>General feedback and suggestions</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-8">
                                <h3 className="text-xl font-bold text-white mb-4">Built by Shivam Chamoli</h3>
                                <p className="text-gray-300">
                                    JobPortal is developed as part of the Novanector Internship Program. 
                                    We welcome your feedback to make this platform even better.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </motion.section>
            </div>
        </Layout>
    );
};

export default ContactPage;
