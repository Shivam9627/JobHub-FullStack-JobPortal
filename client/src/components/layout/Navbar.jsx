import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserButton, SignedIn, SignedOut, SignInButton, useUser } from "@clerk/clerk-react";
import { Menu, X, Briefcase, Home, Info, Mail, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const { user, isLoaded } = useUser();
  const location = useLocation();

  // Get user role from Clerk metadata
  useEffect(() => {
    if (user?.unsafeMetadata?.role) {
      setUserRole(user.unsafeMetadata.role);
    }
  }, [user]);

  const isActive = (path) => location.pathname === path;

  const publicNavLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/about", label: "About", icon: Info },
    { path: "/contact", label: "Contact", icon: Mail },
  ];

  const seekerLinks = [
    { path: "/jobs-seeker", label: "Find Jobs", icon: Briefcase },
    { path: "/profile/seeker", label: "My Profile", icon: UserButton },
  ];

  const recruiterLinks = [
    { path: "/recruiter-dashboard", label: "Dashboard", icon: Briefcase },
    { path: "/profile/recruiter", label: "My Profile", icon: UserButton },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-slate-950 via-purple-900 to-slate-950 border-b border-purple-500/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent hover:scale-105 transition-transform"
          >
            <Briefcase className="text-purple-400 w-8 h-8" />
            JobHub
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {/* Public Links */}
            {publicNavLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 transition-all ${
                  isActive(path)
                    ? "text-purple-400 font-semibold"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}

            {/* Role-based Links */}
            <SignedIn>
              {userRole === "seeker" && (
                <>
                  <Link
                    to="/jobs-seeker"
                    className={`flex items-center gap-2 transition-all ${
                      isActive("/jobs-seeker")
                        ? "text-purple-400 font-semibold"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    Find Jobs
                  </Link>
                  <Link
                    to="/profile/seeker"
                    className={`flex items-center gap-2 transition-all ${
                      isActive("/profile/seeker")
                        ? "text-purple-400 font-semibold"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    My Dashboard
                  </Link>
                </>
              )}

              {userRole === "recruiter" && (
                <>
                  <Link
                    to="/recruiter-dashboard"
                    className={`flex items-center gap-2 transition-all ${
                      isActive("/recruiter-dashboard")
                        ? "text-purple-400 font-semibold"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link
                    to="/jobs-seeker"
                    className={`flex items-center gap-2 transition-all ${
                      isActive("/jobs-seeker")
                        ? "text-purple-400 font-semibold"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    View All Jobs
                  </Link>
                  <Link
                    to="/profile/recruiter"
                    className={`flex items-center gap-2 transition-all ${
                      isActive("/profile/recruiter")
                        ? "text-purple-400 font-semibold"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    My Profile
                  </Link>
                </>
              )}
            </SignedIn>
          </div>

          {/* Auth Button */}
          <div className="hidden md:flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  Sign In
                </motion.button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              {isLoaded && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-300">
                    {user?.firstName || "User"}
                  </span>
                  <UserButton afterSignOutUrl="/" />
                </div>
              )}
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden pb-4 border-t border-purple-500/20"
          >
            <div className="flex flex-col gap-3 mt-4">
              {publicNavLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive(path)
                      ? "bg-purple-500/20 text-purple-400"
                      : "text-gray-300 hover:bg-purple-500/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}

              <SignedIn>
                {userRole === "seeker" && (
                  <>
                    <Link
                      to="/jobs-seeker"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        isActive("/jobs-seeker")
                          ? "bg-purple-500/20 text-purple-400"
                          : "text-gray-300 hover:bg-purple-500/10 hover:text-white"
                      }`}
                    >
                      <Briefcase className="w-4 h-4" />
                      Find Jobs
                    </Link>
                    <Link
                      to="/profile/seeker"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        isActive("/profile/seeker")
                          ? "bg-purple-500/20 text-purple-400"
                          : "text-gray-300 hover:bg-purple-500/10 hover:text-white"
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      My Dashboard
                    </Link>
                  </>
                )}

                {userRole === "recruiter" && (
                  <>
                    <Link
                      to="/recruiter-dashboard"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        isActive("/recruiter-dashboard")
                          ? "bg-purple-500/20 text-purple-400"
                          : "text-gray-300 hover:bg-purple-500/10 hover:text-white"
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      to="/jobs-seeker"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        isActive("/jobs-seeker")
                          ? "bg-purple-500/20 text-purple-400"
                          : "text-gray-300 hover:bg-purple-500/10 hover:text-white"
                      }`}
                    >
                      <Briefcase className="w-4 h-4" />
                      View All Jobs
                    </Link>
                    <Link
                      to="/profile/recruiter"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        isActive("/profile/recruiter")
                          ? "bg-purple-500/20 text-purple-400"
                          : "text-gray-300 hover:bg-purple-500/10 hover:text-white"
                      }`}
                    >
                      <Briefcase className="w-4 h-4" />
                      My Profile
                    </Link>
                  </>
                )}
              </SignedIn>

              <div className="border-t border-purple-500/20 pt-3">
                <SignedOut>
                  <SignInButton mode="modal">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In
                    </motion.button>
                  </SignInButton>
                </SignedOut>

                <SignedIn>
                  <div className="flex items-center justify-between px-4 py-2">
                    <span className="text-sm text-gray-300">
                      {user?.firstName || "User"}
                    </span>
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </SignedIn>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
