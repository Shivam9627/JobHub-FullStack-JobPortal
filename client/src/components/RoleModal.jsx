import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, Users } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';
import { userAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const RoleModal = ({ isOpen, onClose }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = async (role) => {
    try {
      setLoading(true);
      setSelectedRole(role);

      // Create/update user profile with selected role
      const response = await userAPI.createProfile({
        clerkUserId: user?.id,
        email: user?.emailAddresses?.[0]?.emailAddress,
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        role: role
      });

      // Update Clerk metadata
      await user?.update({
        unsafeMetadata: {
          role: role
        }
      });

      toast.success(`Welcome ${role === 'seeker' ? 'Job Seeker' : 'Recruiter'}!`);
      
      // Close modal
      onClose();

      // Redirect based on role
      setTimeout(() => {
        if (role === 'seeker') {
          navigate('/jobs-seeker');
        } else {
          navigate('/recruiter-dashboard');
        }
      }, 500);
    } catch (error) {
      console.error('Error setting role:', error);
      toast.error('Failed to set role. Please try again.');
    } finally {
      setLoading(false);
      setSelectedRole(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-gradient-to-br from-gray-900 to-slate-900 rounded-2xl p-8 max-w-2xl w-full border border-purple-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-lg transition"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Choose Your Role</h2>
              <p className="text-gray-400">Select whether you're looking for a job or hiring talent</p>
            </div>

            {/* Role Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Seeker Card */}
              <motion.button
                onClick={() => handleRoleSelect('seeker')}
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-8 rounded-xl border-2 transition-all ${
                  selectedRole === 'seeker'
                    ? 'bg-purple-500/20 border-purple-500'
                    : 'bg-gray-800/50 border-gray-700 hover:border-purple-500'
                } disabled:opacity-50`}
              >
                <Briefcase className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Job Seeker</h3>
                <p className="text-gray-400 text-sm">Browse and apply to jobs that match your skills and interests</p>
                {selectedRole === 'seeker' && loading && (
                  <div className="mt-4 flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-purple-500"></div>
                  </div>
                )}
              </motion.button>

              {/* Recruiter Card */}
              <motion.button
                onClick={() => handleRoleSelect('recruiter')}
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-8 rounded-xl border-2 transition-all ${
                  selectedRole === 'recruiter'
                    ? 'bg-blue-500/20 border-blue-500'
                    : 'bg-gray-800/50 border-gray-700 hover:border-blue-500'
                } disabled:opacity-50`}
              >
                <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Recruiter</h3>
                <p className="text-gray-400 text-sm">Post job openings and find the best candidates for your team</p>
                {selectedRole === 'recruiter' && loading && (
                  <div className="mt-4 flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-500"></div>
                  </div>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RoleModal;
