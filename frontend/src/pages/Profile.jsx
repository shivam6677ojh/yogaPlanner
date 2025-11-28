import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'
import LoadingSpinner from '../components/LoadingSpinner'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'

// SVG Icons
const EditIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
)

const CancelIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const SaveIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const UserIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const YogaIllustration = ({ className = "w-16 h-16" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="30" r="12" fill="url(#headGradient)" stroke="#8B5CF6" strokeWidth="2"/>
    <path d="M50 42L50 65" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round"/>
    <path d="M35 50L50 42L65 50" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" fill="none"/>
    <path d="M35 50L25 75" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round"/>
    <path d="M65 50L75 75" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round"/>
    <path d="M25 75L35 85" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round"/>
    <path d="M75 75L65 85" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="40" cy="25" r="2" fill="#60A5FA"/>
    <circle cx="60" cy="25" r="2" fill="#60A5FA"/>
    <path d="M45 32Q50 35 55 32" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <defs>
      <linearGradient id="headGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3"/>
        <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.3"/>
      </linearGradient>
    </defs>
  </svg>
)

const Profile = () => {
  const { stats } = useSelector((state) => state.plan)
  const { user, token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    fitnessLevel: '',
    goal: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        age: user.age || '',
        fitnessLevel: user.fitnessLevel || 'beginner',
        goal: user.goal || 'stress relief'
      })
    }
  }, [user])

  const fitnessLevels = ['beginner', 'intermediate', 'advanced']
  const goals = ['stress relief', 'flexibility', 'strength', 'weight loss', 'meditation', 'balance']

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await API.put('/users/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // Update user in localStorage and Redux store
      const updatedUser = { ...user, ...data.user }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      if (data.message && data.message.includes('verify')) {
        toast.success('Profile updated! Please verify your new email address.', {
          autoClose: 6000,
        })
      } else {
        toast.success('✨ Profile updated successfully!')
      }
      setEditMode(false)
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      age: user.age || '',
      fitnessLevel: user.fitnessLevel || 'beginner',
      goal: user.goal || 'stress relief'
    })
    setEditMode(false)
  }

  if (!user) {
    return <LoadingSpinner fullScreen={true} message="Loading profile..." />
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            My Profile
          </h1>
          <p className="text-xl text-slate-300">
            Manage your personal information and yoga preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-24 h-24 bg-linear-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                    <UserIcon />
                  </div>
                  <div className="absolute -inset-4 bg-linear-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-lg"></div>
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-white mb-2">{user.name}</h2>
              <p className="text-slate-300 mb-4">{user.email}</p>
              
              <div className="bg-slate-700/30 rounded-lg p-4 mb-4">
                <div className="text-sm text-slate-400 mb-2">Member Since</div>
                <div className="text-white font-semibold">{new Date().getFullYear()}</div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEditMode(!editMode)}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                  editMode 
                    ? 'bg-slate-600 text-white hover:bg-slate-700' 
                    : 'bg-linear-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                }`}
              >
                <div className="flex items-center justify-center">
                  {editMode ? <CancelIcon /> : <EditIcon />}
                  <span className="ml-2">{editMode ? 'Cancel Edit' : 'Edit Profile'}</span>
                </div>
              </motion.button>
            </div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6 mt-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Yoga Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">{stats.totalPlans || 0}</div>
                  <div className="text-sm text-slate-400">Plans Created</div>
                </div>
                <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">{stats.completedPlans || 0}</div>
                  <div className="text-sm text-slate-400">Sessions Completed</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Profile Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
              <div className="p-6 sm:p-8">
                <AnimatePresence>
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mb-6 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-3 rounded-lg flex items-center"
                    >
                      <LoadingSpinner size="small" />
                      <span className="ml-2">Updating profile...</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-white border-b border-slate-700/50 pb-3">
                        Personal Information
                      </h3>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">
                          Full Name
                        </label>
                        {editMode ? (
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300"
                            required
                          />
                        ) : (
                          <p className="text-white bg-slate-700/30 px-4 py-3 rounded-lg">{user.name}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">
                          Email
                        </label>
                        {editMode ? (
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300"
                            required
                          />
                        ) : (
                          <p className="text-white bg-slate-700/30 px-4 py-3 rounded-lg">{user.email}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">
                          Phone
                        </label>
                        {editMode ? (
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300"
                          />
                        ) : (
                          <p className="text-white bg-slate-700/30 px-4 py-3 rounded-lg">{user.phone || 'Not provided'}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">
                          Age
                        </label>
                        {editMode ? (
                          <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300"
                          />
                        ) : (
                          <p className="text-white bg-slate-700/30 px-4 py-3 rounded-lg">{user.age || 'Not provided'}</p>
                        )}
                      </div>
                    </div>

                    {/* Yoga Preferences */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-white border-b border-slate-700/50 pb-3">
                        Yoga Preferences
                      </h3>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">
                          Fitness Level
                        </label>
                        {editMode ? (
                          <div className="relative">
                            <select
                              name="fitnessLevel"
                              value={formData.fitnessLevel}
                              onChange={handleChange}
                              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 appearance-none"
                            >
                              {fitnessLevels.map(level => (
                                <option key={level} value={level} className="bg-slate-800">
                                  {level.charAt(0).toUpperCase() + level.slice(1)}
                                </option>
                              ))}
                            </select>
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        ) : (
                          <p className="text-white bg-slate-700/30 px-4 py-3 rounded-lg capitalize">
                            {user.fitnessLevel || 'Not specified'}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">
                          Primary Goal
                        </label>
                        {editMode ? (
                          <div className="relative">
                            <select
                              name="goal"
                              value={formData.goal}
                              onChange={handleChange}
                              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 appearance-none"
                            >
                              {goals.map(goal => (
                                <option key={goal} value={goal} className="bg-slate-800">
                                  {goal.charAt(0).toUpperCase() + goal.slice(1)}
                                </option>
                              ))}
                            </select>
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        ) : (
                          <p className="text-white bg-slate-700/30 px-4 py-3 rounded-lg capitalize">
                            {user.goal || 'Not specified'}
                          </p>
                        )}
                      </div>

                      {/* Yoga Illustration */}
                      <div className="flex justify-center mt-6">
                        <YogaIllustration className="w-20 h-20 opacity-50" />
                      </div>
                    </div>
                  </div>

                  {editMode && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-end space-x-3 pt-6 border-t border-slate-700/50"
                    >
                      <motion.button
                        type="button"
                        onClick={handleCancel}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 border border-slate-600 text-sm font-medium rounded-lg text-slate-300 bg-slate-700/50 hover:bg-slate-700/70 transition-all duration-300 flex items-center"
                      >
                        <CancelIcon />
                        <span className="ml-2">Cancel</span>
                      </motion.button>
                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.05 }}
                        whileTap={{ scale: loading ? 1 : 0.95 }}
                        className="px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        <SaveIcon />
                        <span className="ml-2">{loading ? 'Saving...' : 'Save Changes'}</span>
                      </motion.button>
                    </motion.div>
                  )}
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Profile