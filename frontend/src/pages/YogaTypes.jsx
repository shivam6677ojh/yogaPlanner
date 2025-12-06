import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// Yoga Type Icon Component
const YogaPoseIcon = ({ className = "w-16 h-16" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="25" r="10" fill="url(#yogaGradient)" stroke="currentColor" strokeWidth="2"/>
    <path d="M50 35L50 55" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M35 45L50 35L65 45" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"/>
    <path d="M35 45L25 70" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M65 45L75 70" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M25 70L35 80" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M75 70L65 80" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <defs>
      <linearGradient id="yogaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.5"/>
        <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.5"/>
      </linearGradient>
    </defs>
  </svg>
)

const BookIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
)

const yogaTypesData = [
  {
    id: 1,
    name: 'Hatha',
    title: 'Hatha Yoga',
    description: 'A gentle introduction to the most basic yoga postures. Perfect for beginners and those seeking relaxation.',
    benefits: [
      'Improves flexibility and balance',
      'Reduces stress and anxiety',
      'Strengthens core muscles',
      'Enhances body awareness'
    ],
    duration: '45-60 minutes',
    difficulty: 'Beginner',
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    textColor: 'text-green-400'
  },
  {
    id: 2,
    name: 'Vinyasa',
    title: 'Vinyasa Flow',
    description: 'A dynamic practice linking breath with movement. Each movement flows seamlessly into the next.',
    benefits: [
      'Builds cardiovascular endurance',
      'Increases strength and flexibility',
      'Improves focus and concentration',
      'Burns calories effectively'
    ],
    duration: '60-75 minutes',
    difficulty: 'Intermediate',
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-400'
  },
  {
    id: 3,
    name: 'Ashtanga',
    title: 'Ashtanga Yoga',
    description: 'A rigorous style following a specific sequence of postures. Fast-paced and physically demanding.',
    benefits: [
      'Builds incredible strength',
      'Develops discipline and focus',
      'Detoxifies the body',
      'Enhances stamina and endurance'
    ],
    duration: '90 minutes',
    difficulty: 'Advanced',
    color: 'from-red-500 to-orange-600',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    textColor: 'text-red-400'
  },
  {
    id: 4,
    name: 'Iyengar',
    title: 'Iyengar Yoga',
    description: 'Focuses on precise alignment and uses props like blocks and straps. Great for healing injuries.',
    benefits: [
      'Improves posture and alignment',
      'Therapeutic for injuries',
      'Increases body awareness',
      'Builds strength steadily'
    ],
    duration: '60 minutes',
    difficulty: 'Beginner to Intermediate',
    color: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    textColor: 'text-purple-400'
  },
  {
    id: 5,
    name: 'Bikram',
    title: 'Bikram (Hot Yoga)',
    description: 'A set sequence of 26 poses practiced in a heated room (105°F). Intense and detoxifying.',
    benefits: [
      'Deep detoxification through sweat',
      'Increases flexibility rapidly',
      'Strengthens cardiovascular system',
      'Promotes weight loss'
    ],
    duration: '90 minutes',
    difficulty: 'Intermediate to Advanced',
    color: 'from-orange-500 to-red-600',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    textColor: 'text-orange-400'
  },
  {
    id: 6,
    name: 'Kundalini',
    title: 'Kundalini Yoga',
    description: 'Combines movement, breathing techniques, meditation, and chanting. Awakens spiritual energy.',
    benefits: [
      'Awakens inner energy',
      'Reduces stress profoundly',
      'Enhances mental clarity',
      'Balances emotions'
    ],
    duration: '60-90 minutes',
    difficulty: 'All Levels',
    color: 'from-indigo-500 to-purple-600',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/30',
    textColor: 'text-indigo-400'
  },
  {
    id: 7,
    name: 'Yin',
    title: 'Yin Yoga',
    description: 'A slow-paced style where poses are held for longer periods. Targets deep connective tissues.',
    benefits: [
      'Increases flexibility deeply',
      'Promotes relaxation',
      'Improves joint mobility',
      'Calms the nervous system'
    ],
    duration: '60-75 minutes',
    difficulty: 'All Levels',
    color: 'from-teal-500 to-green-600',
    bgColor: 'bg-teal-500/10',
    borderColor: 'border-teal-500/30',
    textColor: 'text-teal-400'
  },
  {
    id: 8,
    name: 'Restorative',
    title: 'Restorative Yoga',
    description: 'Uses props to support the body in gentle poses. Deeply relaxing and meditative.',
    benefits: [
      'Deep relaxation and stress relief',
      'Activates parasympathetic nervous system',
      'Aids in recovery from illness',
      'Improves sleep quality'
    ],
    duration: '60 minutes',
    difficulty: 'All Levels',
    color: 'from-pink-500 to-rose-600',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
    textColor: 'text-pink-400'
  },
  {
    id: 9,
    name: 'Power Yoga',
    title: 'Power Yoga',
    description: 'An athletic, fitness-based approach derived from Ashtanga. Builds strength and stamina.',
    benefits: [
      'Builds lean muscle mass',
      'Boosts metabolism',
      'Improves athletic performance',
      'Enhances mental toughness'
    ],
    duration: '60 minutes',
    difficulty: 'Intermediate to Advanced',
    color: 'from-yellow-500 to-orange-600',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    textColor: 'text-yellow-400'
  }
]

const YogaTypes = () => {
  const navigate = useNavigate()
  const [selectedType, setSelectedType] = useState(null)

  const handleBookPlan = (yogaType) => {
    // Navigate to create plan page with pre-selected yoga type
    navigate('/create-plan', { state: { preSelectedYogaType: yogaType } })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <YogaPoseIcon className="w-20 h-20 text-purple-400" />
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-lg"></div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Explore Yoga Styles
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Discover the perfect yoga practice for your goals and experience level
          </p>
        </motion.div>

        {/* Yoga Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <AnimatePresence>
            {yogaTypesData.map((yoga, index) => (
              <motion.div
                key={yoga.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border ${yoga.borderColor} overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer`}
                onClick={() => setSelectedType(yoga)}
              >
                {/* Card Header */}
                <div className={`bg-gradient-to-r ${yoga.color} p-6`}>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-white">
                      {yoga.title}
                    </h3>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium text-white backdrop-blur-sm">
                      {yoga.difficulty}
                    </span>
                  </div>
                  <p className="text-white/90 text-sm">
                    {yoga.description}
                  </p>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Duration */}
                  <div className="flex items-center text-slate-300 mb-4">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">Duration: {yoga.duration}</span>
                  </div>

                  {/* Benefits Preview */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-slate-300 mb-2">Key Benefits:</h4>
                    <ul className="space-y-1">
                      {yoga.benefits.slice(0, 2).map((benefit, idx) => (
                        <li key={idx} className="text-xs text-slate-400 flex items-start">
                          <span className={`${yoga.textColor} mr-2`}>•</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedType(yoga)
                      }}
                      className={`flex-1 py-2 px-4 border ${yoga.borderColor} ${yoga.textColor} ${yoga.bgColor} rounded-lg text-sm font-medium hover:bg-opacity-20 transition-all duration-300 cursor-pointer`}
                    >
                      Learn More
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleBookPlan(yoga.name)
                      }}
                      className={`flex-1 py-2 px-4 bg-gradient-to-r ${yoga.color} text-white rounded-lg text-sm font-medium shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-center`}
                    >
                      <BookIcon />
                      <span className="ml-1">Book Plan</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Detailed Modal */}
        <AnimatePresence>
          {selectedType && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedType(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className={`bg-gradient-to-r ${selectedType.color} p-8 relative`}>
                  <button
                    onClick={() => setSelectedType(null)}
                    className="absolute top-4 right-4 text-white hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="flex items-center mb-4">
                    <YogaPoseIcon className="w-12 h-12 text-white mr-4" />
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">
                        {selectedType.title}
                      </h2>
                      <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium text-white backdrop-blur-sm">
                        {selectedType.difficulty}
                      </span>
                    </div>
                  </div>
                  <p className="text-white/90">
                    {selectedType.description}
                  </p>
                </div>

                {/* Modal Body */}
                <div className="p-8">
                  {/* Duration Info */}
                  <div className={`${selectedType.bgColor} border ${selectedType.borderColor} rounded-lg p-4 mb-6`}>
                    <div className="flex items-center">
                      <svg className="w-6 h-6 mr-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <div className="text-sm text-slate-400">Typical Session Duration</div>
                        <div className="text-lg font-semibold text-white">{selectedType.duration}</div>
                      </div>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-4">Benefits</h3>
                    <ul className="space-y-3">
                      {selectedType.benefits.map((benefit, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start text-slate-300"
                        >
                          <span className={`${selectedType.textColor} mr-3 text-xl`}>✓</span>
                          <span>{benefit}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleBookPlan(selectedType.name)}
                    className={`w-full py-4 px-6 bg-gradient-to-r ${selectedType.color} text-white font-semibold rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center cursor-pointer`}
                  >
                    <BookIcon />
                    <span className="ml-2">Book a Plan with {selectedType.title}</span>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default YogaTypes
