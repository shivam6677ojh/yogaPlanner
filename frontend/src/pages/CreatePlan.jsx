import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { createPlanStart, createPlanSuccess, createPlanFail, clearPlanError } from '../features/plan/planSlice'
import API from '../api/axios'
import LoadingSpinner from '../components/LoadingSpinner'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'

// SVG Icons
const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const CancelIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const YogaIllustration = ({ className = "w-20 h-20" }) => (
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

const CreatePlan = () => {
  const location = useLocation()
  const preSelectedYogaType = location.state?.preSelectedYogaType || 'Hatha'
  
  const [formData, setFormData] = useState({
    planName: '',
    yogaType: preSelectedYogaType,
    meditationTime: 10,
    durationWeeks: 4,
    dailySchedule: '',
    notes: '',
  })

  const { loading, error } = useSelector((state) => state.plan)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const planCreatedRef = useRef(false)

  useEffect(() => {
    dispatch(clearPlanError())
  }, [dispatch])

  useEffect(() => {
    // Update yoga type if it comes from navigation state
    if (location.state?.preSelectedYogaType) {
      setFormData(prev => ({ ...prev, yogaType: location.state.preSelectedYogaType }))
    }
  }, [location.state])

  // Navigate to dashboard when plan is successfully created
  useEffect(() => {
    if (planCreatedRef.current && !loading) {
      console.log('Plan created and loading cleared - navigating to dashboard')
      planCreatedRef.current = false
      navigate('/dashboard', { replace: true })
    }
  }, [loading, navigate])

  const yogaTypes = [
    'Hatha', 'Vinyasa', 'Ashtanga', 'Iyengar', 'Bikram', 
    'Kundalini', 'Yin', 'Restorative', 'Power Yoga'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: name === 'meditationTime' || name === 'durationWeeks' ? parseInt(value) : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.planName.trim()) {
      toast.error('Please enter a plan name')
      return
    }

    try {
      console.log('Creating plan with data:', formData)
      dispatch(createPlanStart())
      
      // Convert dailySchedule string to array for backend validation
      const payload = {
        ...formData,
        dailySchedule: formData.dailySchedule ? [formData.dailySchedule] : []
      }

      console.log('Sending payload:', payload)
      const { data } = await API.post('/plans', payload)
      console.log('Plan created:', data)
      
      dispatch(createPlanSuccess(data.plan))
      toast.success('🧘‍♀️ Plan created successfully!', {
        autoClose: 2000,
      })
      
      // Set flag to trigger navigation via useEffect
      console.log('Setting planCreatedRef to true')
      planCreatedRef.current = true
    } catch (err) {
      console.error('Error creating plan:', err)
      console.error('Error response:', err.response?.data)
      const errorMessage = err.response?.data?.message || 'Failed to create plan'
      dispatch(createPlanFail(errorMessage))
      toast.error(errorMessage)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 mt-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <div className="relative">
              <YogaIllustration className="w-16 h-16" />
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-lg"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Create New Yoga Plan
          </h1>
          <p className="text-slate-300">
            Design your personalized yoga and meditation journey
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden"
        >
          <div className="p-6 sm:p-8">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg flex items-center"
                >
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Plan Name */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <label htmlFor="planName" className="block text-sm font-medium text-slate-300">
                  Plan Name *
                </label>
                <input
                  type="text"
                  id="planName"
                  name="planName"
                  required
                  value={formData.planName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300"
                  placeholder="e.g., Morning Relaxation Routine"
                />
              </motion.div>

              {/* Yoga Type */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <label htmlFor="yogaType" className="block text-sm font-medium text-slate-300">
                  Yoga Type *
                </label>
                <div className="relative">
                  <select
                    id="yogaType"
                    name="yogaType"
                    required
                    value={formData.yogaType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 appearance-none"
                  >
                    {yogaTypes.map(type => (
                      <option key={type} value={type} className="bg-slate-800">{type}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              {/* Meditation Time & Duration */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="space-y-2">
                  <label htmlFor="meditationTime" className="block text-sm font-medium text-slate-300">
                    Meditation Time (minutes) *
                  </label>
                  <input
                    type="number"
                    id="meditationTime"
                    name="meditationTime"
                    required
                    min="5"
                    max="60"
                    value={formData.meditationTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="durationWeeks" className="block text-sm font-medium text-slate-300">
                    Duration (weeks) *
                  </label>
                  <input
                    type="number"
                    id="durationWeeks"
                    name="durationWeeks"
                    required
                    min="1"
                    max="12"
                    value={formData.durationWeeks}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300"
                  />
                </div>
              </motion.div>

              {/* Daily Schedule */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-2"
              >
                <label htmlFor="dailySchedule" className="block text-sm font-medium text-slate-300">
                  Daily Schedule
                </label>
                <input
                  type="text"
                  id="dailySchedule"
                  name="dailySchedule"
                  value={formData.dailySchedule}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300"
                  placeholder="e.g., 6:00 AM - 7:00 AM"
                />
              </motion.div>

              {/* Additional Notes */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-2"
              >
                <label htmlFor="notes" className="block text-sm font-medium text-slate-300">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 resize-none"
                  placeholder="Any specific goals, preferences, or instructions..."
                />
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6"
              >
                <motion.button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center px-6 py-3 border border-slate-600 text-sm font-medium rounded-lg text-slate-300 bg-slate-700/50 hover:bg-slate-700/70 transition-all duration-300 cursor-pointer"
                >
                  <CancelIcon />
                  <span className="ml-2">Cancel</span>
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.05 }}
                  whileTap={{ scale: loading ? 1 : 0.95 }}
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <LoadingSpinner size="small" />
                      <span className="ml-2">Creating Plan...</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <PlusIcon />
                      <span className="ml-2">Create Plan</span>
                    </div>
                  )}
                </motion.button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CreatePlan