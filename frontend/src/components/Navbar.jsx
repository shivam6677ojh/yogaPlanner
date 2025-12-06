import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/axios";
import { toast } from 'react-toastify';

// Icons
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const VideoIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const YogaTypesIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const ChevronDown = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const YogaIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
  </svg>
);

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await API.post('/users/logout');
      dispatch(logout());
      toast.success('Logged out successfully. Namaste! 🙏');
      navigate("/");
    } catch {
      // Even if the API call fails, clear local state
      dispatch(logout());
      navigate("/");
    }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 }
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-slate-900/95 backdrop-blur-xl shadow-2xl border-b border-slate-700/50' 
          : 'bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 shadow-2xl'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center"
          >
            <Link to="/" className="flex items-center space-x-3 cursor-pointer">
              <div className={`p-2 rounded-xl ${
                scrolled 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                  : 'bg-white/10 text-white'
              }`}>
                <YogaIcon />
              </div>
              <span className={`font-bold text-xl ${
                scrolled ? 'text-white' : 'text-white'
              }`}>
                Yoga Planner
              </span>
            </Link>
          </motion.div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {user ? (
              <>
                {/* Main Navigation Items */}
                <motion.div whileHover={{ y: -1 }} className="hidden md:block">
                  <Link
                    to="/dashboard"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
                      scrolled
                        ? 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <DashboardIcon />
                    <span>Dashboard</span>
                  </Link>
                </motion.div>

                <motion.div whileHover={{ y: -1 }} className="hidden md:block">
                  <Link
                    to="/create-plan"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
                      scrolled
                        ? 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <PlusIcon />
                    <span>Create Plan</span>
                  </Link>
                </motion.div>

                <motion.div whileHover={{ y: -1 }} className="hidden md:block">
                  <Link
                    to="/yoga-types"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
                      scrolled
                        ? 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <YogaTypesIcon />
                    <span>Yoga Types</span>
                  </Link>
                </motion.div>

                <motion.div whileHover={{ y: -1 }} className="hidden md:block">
                  <Link
                    to="/yoga-videos"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
                      scrolled
                        ? 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <VideoIcon />
                    <span>Yoga Videos</span>
                  </Link>
                </motion.div>

                {/* Profile Dropdown */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDropdown(!showDropdown)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-300 cursor-pointer ${
                      scrolled
                        ? 'bg-slate-800/80 hover:bg-slate-700/80 text-white'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      scrolled
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'bg-white text-purple-600'
                    }`}>
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="hidden sm:block font-medium max-w-32 truncate">
                      {user.name}
                    </span>
                    <motion.div
                      animate={{ rotate: showDropdown ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {showDropdown && (
                      <>
                        <motion.div
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-56 bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-700/50 py-2 z-50"
                        >
                          {/* User Info */}
                          <div className="px-4 py-3 border-b border-slate-700/50">
                            <p className="text-sm font-semibold text-white truncate">
                              {user.name}
                            </p>
                            <p className="text-sm text-slate-400 truncate">
                              {user.email}
                            </p>
                          </div>

                          {/* Dropdown Items */}
                          <Link
                            to="/profile"
                            className="flex items-center space-x-3 px-4 py-3 text-sm text-slate-300 hover:bg-purple-600/20 hover:text-white transition-colors duration-200 cursor-pointer"
                            onClick={() => setShowDropdown(false)}
                          >
                            <UserIcon />
                            <span>My Profile</span>
                          </Link>
                          
                          <Link
                            to="/dashboard"
                            className="flex items-center space-x-3 px-4 py-3 text-sm text-slate-300 hover:bg-purple-600/20 hover:text-white transition-colors duration-200 cursor-pointer"
                            onClick={() => setShowDropdown(false)}
                          >
                            <DashboardIcon />
                            <span>Dashboard</span>
                          </Link>
                          
                          <Link
                            to="/create-plan"
                            className="flex items-center space-x-3 px-4 py-3 text-sm text-slate-300 hover:bg-purple-600/20 hover:text-white transition-colors duration-200 cursor-pointer"
                            onClick={() => setShowDropdown(false)}
                          >
                            <PlusIcon />
                            <span>Create Plan</span>
                          </Link>

                          <div className="border-t border-slate-700/50 my-1"></div>
                          
                          <button
                            onClick={() => {
                              setShowDropdown(false);
                              handleLogout();
                            }}
                            className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors duration-200 cursor-pointer"
                          >
                            <LogoutIcon />
                            <span>Logout</span>
                          </button>
                        </motion.div>

                        {/* Backdrop */}
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowDropdown(false)}
                        />
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              /* Guest Navigation */
              <div className="flex items-center space-x-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/"
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
                      scrolled
                        ? 'text-slate-300 hover:text-white'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Login
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
                      scrolled
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-500/25'
                        : 'bg-white text-purple-600 hover:bg-gray-100'
                    }`}
                  >
                    Register
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;