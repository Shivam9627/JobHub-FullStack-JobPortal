import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, LogOut, User as UserIcon, Home, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Navbar = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
    const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole') || '');
    const [userName, setUserName] = useState(() => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user).name : '';
    });

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        setIsLoggedIn(false);
        setUserRole('');
        setUserName('');
        toast.success('Logged out successfully!');
        navigate('/');
    };

    const handleNavigation = (path) => {
        navigate(path);
        setIsOpen(false);
    };

    return (
        <nav className="fixed top-0 w-full bg-slate-950/95 backdrop-blur-md border-b border-purple-500/20 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <motion.div 
                        className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent cursor-pointer"
                        onClick={() => handleNavigation('/')}
                        whileHover={{ scale: 1.05 }}
                    >
                        JobPortal
                    </motion.div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <motion.button onClick={() => handleNavigation('/')} className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2" whileHover={{ scale: 1.05 }}>
                            <Home className="w-4 h-4" />
                            Home
                        </motion.button>

                        {isLoggedIn && (
                            <>
                                {userRole === 'jobseeker' && (
                                    <motion.button onClick={() => handleNavigation('/jobs-seeker')} className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2" whileHover={{ scale: 1.05 }}>
                                        <Briefcase className="w-4 h-4" />
                                        Find Jobs
                                    </motion.button>
                                )}
                                {userRole === 'recruiter' && (
                                    <motion.button onClick={() => handleNavigation('/recruiter-dashboard')} className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2" whileHover={{ scale: 1.05 }}>
                                        <Briefcase className="w-4 h-4" />
                                        Dashboard
                                    </motion.button>
                                )}
                            </>
                        )}

                        {/* Auth Buttons */}
                        {!isLoggedIn ? (
                            <div className="flex gap-4">
                                <motion.button 
                                    onClick={() => handleNavigation('/login')} 
                                    className="px-6 py-2 text-gray-300 hover:text-purple-400 transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    Login
                                </motion.button>
                                <motion.button 
                                    onClick={() => handleNavigation('/signup')} 
                                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    Sign Up
                                </motion.button>
                            </div>
                        ) : (
                            <div className="flex gap-4 items-center">
                                <div className="text-gray-300 text-sm">
                                    Welcome, <span className="text-purple-400 font-semibold">{userName}</span>
                                </div>
                                <motion.button 
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all flex items-center gap-2"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </motion.button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <motion.button 
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-gray-300 hover:text-purple-400"
                        whileTap={{ scale: 0.95 }}
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </motion.button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="md:hidden pt-4 space-y-4 border-t border-purple-500/20 mt-4"
                    >
                        <motion.button onClick={() => handleNavigation('/')} className="block w-full text-left text-gray-300 hover:text-purple-400 transition-colors py-2">
                            Home
                        </motion.button>

                        {isLoggedIn && (
                            <>
                                {userRole === 'jobseeker' && (
                                    <motion.button onClick={() => handleNavigation('/jobs-seeker')} className="block w-full text-left text-gray-300 hover:text-purple-400 transition-colors py-2">
                                        Find Jobs
                                    </motion.button>
                                )}
                                {userRole === 'recruiter' && (
                                    <motion.button onClick={() => handleNavigation('/recruiter-dashboard')} className="block w-full text-left text-gray-300 hover:text-purple-400 transition-colors py-2">
                                        Dashboard
                                    </motion.button>
                                )}
                            </>
                        )}

                        {!isLoggedIn ? (
                            <>
                                <motion.button 
                                    onClick={() => handleNavigation('/login')} 
                                    className="block w-full text-left text-gray-300 hover:text-purple-400 transition-colors py-2"
                                >
                                    Login
                                </motion.button>
                                <motion.button 
                                    onClick={() => handleNavigation('/signup')} 
                                    className="block w-full text-left px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg"
                                >
                                    Sign Up
                                </motion.button>
                            </>
                        ) : (
                            <>
                                <div className="py-2 text-gray-300">
                                    Welcome, <span className="text-purple-400 font-semibold">{userName}</span>
                                </div>
                                <motion.button 
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 bg-red-500/20 text-red-400 rounded-lg"
                                >
                                    Logout
                                </motion.button>
                            </>
                        )}
                    </motion.div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;