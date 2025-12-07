import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { 
  fetchPlansStart, 
  fetchPlansSuccess, 
  fetchPlansFail, 
  deletePlanStart, 
  deletePlanSuccess, 
  deletePlanFail,
  fetchStatsStart,
  fetchStatsSuccess,
  fetchStatsFail
} from '../features/plan/planSlice'
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

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
)

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const NotesIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

// Progress Bar Component
const ProgressBar = ({ percentage, color = "purple", className = "" }) => {
  const colorClasses = {
    purple: "from-purple-500 to-purple-600",
    green: "from-green-500 to-green-600",
    blue: "from-blue-500 to-blue-600",
  };

  return (
    <div className={`w-full bg-slate-700 rounded-full h-3 overflow-hidden ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full`}
      />
    </div>
  );
};

// Pie Chart Component
const CompletionPieChart = ({ completed, total, size = 100 }) => {
  const completedPercentage = total > 0 ? (completed / total) * 100 : 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const completedStroke = (completedPercentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#334155"
          strokeWidth="8"
        />
        {/* Completed segment */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="url(#completedGradient)"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - completedStroke}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
        <defs>
          <linearGradient id="completedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-bold text-white">
            {Math.round(completedPercentage)}%
          </div>
          <div className="text-xs text-slate-400">Done</div>
        </div>
      </div>
    </div>
  );
};

// Yoga Illustration Component
const YogaIllustration = ({ className = "w-24 h-24" }) => (
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

const Dashboard = () => {
  const { plans, loading, error, stats, statsLoading } = useSelector((state) => state.plan)
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    fetchPlans()
    fetchStats()
  }, [])

  // Function to fetch plans from backend
  const fetchPlans = async () => {
    try {
      dispatch(fetchPlansStart())
      const { data } = await API.get('/plans')
      dispatch(fetchPlansSuccess(data))
    } catch (err) {
      dispatch(fetchPlansFail(err.response?.data?.message || 'Failed to fetch plans'))
    }
  }

  // Function to fetch statistics
  const fetchStats = async () => {
    try {
      dispatch(fetchStatsStart())
      const { data } = await API.get('/plans/stats')
      dispatch(fetchStatsSuccess(data))
    } catch (err) {
      dispatch(fetchStatsFail(err.response?.data?.message || 'Failed to fetch statistics'))
    }
  }

  // Function to handle plan deletion
  const handleDeletePlan = async (planId) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        dispatch(deletePlanStart())
        await API.delete(`/plans/${planId}`)
        dispatch(deletePlanSuccess(planId))
        toast.success('Plan deleted successfully!')
        // Refresh stats after deletion
        fetchStats()
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to delete plan'
        dispatch(deletePlanFail(errorMessage))
        toast.error(errorMessage)
      }
    }
  }

  // Function to mark a plan as completed
  const handleMarkAsCompleted = async (planId) => {
    try {
      await API.put(`/plans/complete/${planId}`)
      fetchPlans() // Refresh plans
      fetchStats() // Refresh stats after completion
      toast.success("🎉 Congratulations! You've completed your yoga plan. Namaste! 🙏", {
        autoClose: 5000,
      })
    } catch (err) {
      // console.error("Error marking plan as completed:", err)
      const errorMessage = err.response?.data?.message || "Failed to mark plan as completed"
      toast.error(errorMessage)
    }
  }

  // Safe plan property access
  const getPlanProperty = (plan, property, defaultValue = '') => {
    return plan && plan[property] !== undefined ? plan[property] : defaultValue
  }

  if (loading) {
    return <LoadingSpinner fullScreen={true} message="Loading your yoga plans..." />
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <YogaIllustration className="w-20 h-20" />
              <div className="absolute -inset-4 bg-linear-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-lg"></div>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Welcome back, {user?.name || 'Yogi'}!
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Track your yoga journey and meditation progress
          </p>
        </motion.div>

        {/* Error Message */}
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

        {/* Statistics Section - Only show if there are plans */}
        {plans.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Completion Graph */}
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-xl font-bold text-white mb-6">Plan Completion</h3>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm text-slate-300 mb-2">
                          <span>Completion Progress</span>
                          <span>{stats.completionRate}%</span>
                        </div>
                        <ProgressBar 
                          percentage={stats.completionRate} 
                          color="green" 
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-white">{stats.totalPlans}</div>
                          <div className="text-xs text-slate-400">Total Plans</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-400">{stats.completedPlans}</div>
                          <div className="text-xs text-slate-400">Completed</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-400">{stats.pendingPlans}</div>
                          <div className="text-xs text-slate-400">Pending</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  

                  {/* // this is the graph part */}
                  <div className="ml-6">
                    <CompletionPieChart 
                      completed={stats.completedPlans} 
                      total={stats.totalPlans} 
                      size={120}
                    />
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-xl font-bold text-white mb-6">Yoga Journey Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Total Meditation Time</span>
                    <span className="text-white font-semibold">
                      {plans.reduce((total, plan) => total + (plan.meditationTime || 0), 0)} mins
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Total Practice Weeks</span>
                    <span className="text-white font-semibold">
                      {plans.reduce((total, plan) => total + (plan.durationWeeks || 0), 0)} weeks
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Active Plans</span>
                    <span className="text-white font-semibold">
                      {plans.filter(plan => !plan.completed).length}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-slate-700/50">
                    <div className="text-center">
                      <div className="text-sm text-slate-400 mb-1">Your Progress</div>
                      <div className="text-2xl font-bold text-green-400">
                        {stats.completionRate}% Complete
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Create Plan Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Link
            to="/create-plan"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
          >
            <PlusIcon />
            <span className="ml-2">Create New Plan</span>
          </Link>
        </motion.div>

        {/* Plans Grid */}
        {plans.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="flex justify-center mb-6">
              <div className="relative">
                <YogaIllustration className="w-32 h-32" />
                <div className="absolute -inset-6 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-xl"></div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              No plans yet
            </h3>
            <p className="text-slate-300 mb-8 max-w-md mx-auto">
              Create your first personalized yoga plan to get started on your wellness journey.
            </p>
            <Link
              to="/create-plan"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              <PlusIcon />
              <span className="ml-2">Create Your First Plan</span>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {plans.map((plan, index) => {
                // Skip invalid plans
                if (!plan || !plan._id) {
                  // console.warn('Invalid plan object:', plan)
                  return null
                }

                return (
                  <motion.div
                    key={plan._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden hover:shadow-2xl hover:border-purple-500/30 transition-all duration-300 group"
                  >
                    {/* Plan Header */}
                    <div className="p-6 border-b border-slate-700/50">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                          {getPlanProperty(plan, 'planName', 'Unnamed Plan')}
                        </h3>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 border border-purple-500/30">
                          {getPlanProperty(plan, 'yogaType', 'General Yoga')}
                        </span>
                      </div>
                      
                      {/* Plan Details */}
                      <div className="space-y-3">
                        <div className="flex items-center text-slate-300">
                          <ClockIcon />
                          <span className="ml-2 text-sm">
                            <span className="font-medium">Meditation:</span> {getPlanProperty(plan, 'meditationTime', 0)} mins
                          </span>
                        </div>
                        
                        <div className="flex items-center text-slate-300">
                          <CalendarIcon />
                          <span className="ml-2 text-sm">
                            <span className="font-medium">Duration:</span> {getPlanProperty(plan, 'durationWeeks', 1)} weeks
                          </span>
                        </div>
                        
                        {plan.dailySchedule && (
                          <div className="flex items-center text-slate-300">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span className="ml-2 text-sm">
                              <span className="font-medium">Schedule:</span> {plan.dailySchedule}
                            </span>
                          </div>
                        )}
                        
                        {plan.notes && (
                          <div className="flex items-start text-slate-300">
                            <NotesIcon />
                            <div className="ml-2 text-sm">
                              <span className="font-medium">Notes:</span>
                              <p className="mt-1 text-slate-400">{plan.notes}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-slate-800/30 px-6 py-4">
                      <div className="flex justify-between items-center">
                        {/* Mark as Completed Button */}
                        {!plan.completed && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleMarkAsCompleted(plan._id)}
                            className="inline-flex items-center px-4 py-2 border border-green-500/30 text-sm font-medium rounded-lg text-green-400 bg-green-500/10 hover:bg-green-500/20 transition-all duration-300 cursor-pointer"
                          >
                            <CheckIcon />
                            <span className="ml-2">Mark Completed</span>
                          </motion.button>
                        )}
                        
                        {/* Completed Badge */}
                        {plan.completed && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                            <CheckIcon />
                            <span className="ml-1">Completed</span>
                          </span>
                        )}
                        
                        {/* Delete Button */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeletePlan(plan._id)}
                          className="inline-flex items-center px-4 py-2 border border-red-500/30 text-sm font-medium rounded-lg text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-all duration-300 cursor-pointer"
                        >
                          <TrashIcon />
                          <span className="ml-2">Delete</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Dashboard