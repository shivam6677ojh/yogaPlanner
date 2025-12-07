import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Play, Clock, Users, Filter, X } from 'lucide-react'

const YogaVideos = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [youtubeSearchTerm, setYoutubeSearchTerm] = useState('yoga for beginners')
  const [youtubeResults, setYoutubeResults] = useState([])
  const [youtubeLoading, setYoutubeLoading] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const { user } = useSelector((state) => state.auth)

  const YOUTUBE_API_KEY = 'AIzaSyBZEKYHOFMbXdMtbJDcVBrrOL_SvdxVF8g' // Replace with your actual API key

  // Yoga video categories
  const yogaCategories = [
    { id: 'all', name: 'All Videos', icon: '📺', color: 'from-purple-500 to-pink-500' },
    { id: 'beginner', name: 'Beginner Friendly', icon: '🌱', color: 'from-green-500 to-teal-500' },
    { id: 'meditation', name: 'Meditation', icon: '🧘‍♀️', color: 'from-blue-500 to-cyan-500' },
    { id: 'morning', name: 'Morning Yoga', icon: '🌅', color: 'from-orange-500 to-red-500' },
    { id: 'evening', name: 'Evening Relaxation', icon: '🌙', color: 'from-indigo-500 to-purple-500' },
    { id: 'flexibility', name: 'Flexibility', icon: '🤸‍♀️', color: 'from-yellow-500 to-orange-500' },
    { id: 'strength', name: 'Strength Building', icon: '💪', color: 'from-red-500 to-pink-500' },
    { id: 'stress', name: 'Stress Relief', icon: '😌', color: 'from-teal-500 to-blue-500' }
  ]

  // Enhanced sample videos
  const sampleVideos = [
    {
      id: 1,
      title: '15 Minute Daily Yoga Routine for Beginners',
      description: 'Perfect for starting your yoga journey with basic poses and breathing exercises.',
      youtubeId: 'v7AYKMP6rOE',
      duration: '15:30',
      category: 'beginner',
      instructor: 'Yoga With Adriene',
      level: 'Beginner',
      views: '12M',
      likes: '450K'
    },
    {
      id: 2,
      title: 'Morning Yoga Full Body Wake Up',
      description: 'Energize your body and mind with this invigorating morning flow.',
      youtubeId: '4pKly2JojMw',
      duration: '20:15',
      category: 'morning',
      instructor: 'Boho Beautiful',
      level: 'Intermediate',
      views: '8.5M',
      likes: '320K'
    },
    {
      id: 3,
      title: 'Guided Meditation for Stress & Anxiety',
      description: 'Calm your mind and reduce anxiety with this soothing meditation session.',
      youtubeId: 'O-6f5wQXSu8',
      duration: '25:00',
      category: 'meditation',
      instructor: 'Great Meditation',
      level: 'All Levels',
      views: '15M',
      likes: '680K'
    },
    {
      id: 4,
      title: 'Evening Yoga Wind Down',
      description: 'Gentle yoga sequence to relax your body and prepare for sleep.',
      youtubeId: 'NIQpSbd8Dz0',
      duration: '18:45',
      category: 'evening',
      instructor: 'Yoga With Kassandra',
      level: 'Beginner',
      views: '5.2M',
      likes: '210K'
    },
    {
      id: 5,
      title: 'Full Body Flexibility Deep Stretch',
      description: 'Improve your flexibility with this deep stretching routine.',
      youtubeId: 'Eml2xnoLpYE',
      duration: '30:20',
      category: 'flexibility',
      instructor: 'Tim Senesi',
      level: 'Intermediate',
      views: '7.8M',
      likes: '290K'
    },
    {
      id: 6,
      title: 'Power Yoga for Strength',
      description: 'Build strength and endurance with this powerful vinyasa flow.',
      youtubeId: 'VaoV1PrYft4',
      duration: '35:10',
      category: 'strength',
      instructor: 'Fightmaster Yoga',
      level: 'Advanced',
      views: '4.3M',
      likes: '180K'
    },
    {
      id: 7,
      title: 'Yoga for Stress Relief',
      description: 'Gentle poses and breathing to melt away stress and tension.',
      youtubeId: '4C-gxOE0j7s',
      duration: '22:30',
      category: 'stress',
      instructor: 'Yoga With Adriene',
      level: 'Beginner',
      views: '9.1M',
      likes: '380K'
    },
    {
      id: 8,
      title: '10 Minute Yoga for Beginners',
      description: 'Quick and effective yoga routine for busy schedules.',
      youtubeId: 'oX6I6vs1EFs',
      duration: '10:05',
      category: 'beginner',
      instructor: 'Yoga With Adriene',
      level: 'Beginner',
      views: '20M',
      likes: '850K'
    },
    {
      id: 9,
      title: 'Advanced Ashtanga Yoga Series',
      description: 'Challenge yourself with this traditional Ashtanga practice.',
      youtubeId: '7Mp3Lp6HkK4',
      duration: '45:00',
      category: 'strength',
      instructor: 'Kino MacGregor',
      level: 'Advanced',
      views: '3.2M',
      likes: '150K'
    },
    {
      id: 10,
      title: 'Yin Yoga for Deep Relaxation',
      description: 'Slow-paced style of yoga with postures held for longer periods.',
      youtubeId: 'sKQ7dO2Sv_c',
      duration: '40:15',
      category: 'stress',
      instructor: 'Kassandra Reinhardt',
      level: 'All Levels',
      views: '6.7M',
      likes: '270K'
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setVideos(sampleVideos)
      setLoading(false)
    }, 1000)
  }, [])

  // Search YouTube videos
  const searchYouTubeVideos = async (query) => {
    if (!query.trim()) return
    
    setYoutubeLoading(true)
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(query + ' yoga')}&key=${YOUTUBE_API_KEY}&type=video`
      )
      const data = await response.json()
      setYoutubeResults(data.items || [])
    } catch (error) {
      // console.error('Error fetching YouTube videos:', error)
      setYoutubeResults([])
    } finally {
      setYoutubeLoading(false)
    }
  }

  // Filter videos based on search term and selected category
  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryVideos = (category) => {
    return videos.filter(video => category === 'all' || video.category === category)
  }

  // for playing video in modal
  const playVideo = (video) => {
    setSelectedVideo(video)
    setShowVideoModal(true)
  }

  const closeModal = () => {
    setShowVideoModal(false)
    setSelectedVideo(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-300">Loading yoga videos...</p>
        </div>
      </div>
    )
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            🧘‍♀️ Yoga Video Library
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Discover guided yoga sessions and meditation practices for all levels. 
            Find the perfect video for your practice.
          </p>
        </motion.div>

        {/* YouTube Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <Search className="w-6 h-6 mr-3 text-purple-400" />
            Search YouTube Yoga Videos
          </h2>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search for yoga videos on YouTube..."
                value={youtubeSearchTerm}
                onChange={(e) => setYoutubeSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchYouTubeVideos(youtubeSearchTerm)}
                className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            </div>
            <button
              onClick={() => searchYouTubeVideos(youtubeSearchTerm)}
              disabled={youtubeLoading}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center"
            >
              {youtubeLoading ? 'Searching...' : 'Search YouTube'}
            </button>
          </div>

          {/* YouTube Results */}
          {youtubeResults.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">YouTube Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {youtubeResults.map((video, index) => (
                  <motion.div
                    key={video.id.videoId}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-700/30 rounded-lg overflow-hidden hover:bg-slate-700/50 transition-all duration-300 cursor-pointer group"
                    onClick={() => playVideo({
                      youtubeId: video.id.videoId,
                      title: video.snippet.title,
                      description: video.snippet.description,
                      instructor: video.snippet.channelTitle
                    })}
                  >
                    <div className="relative">
                      <img
                        src={video.snippet.thumbnails.medium.url}
                        alt={video.snippet.title}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                        <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="text-white font-medium text-sm line-clamp-2 mb-2">
                        {video.snippet.title}
                      </h4>
                      <p className="text-slate-400 text-xs line-clamp-2">
                        {video.snippet.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Curated Videos Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Search and Filter */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search curated videos, instructors, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              </div>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full md:w-64 pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 appearance-none"
                >
                  {yogaCategories.map(category => (
                    <option key={category.id} value={category.id} className="bg-slate-800">
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              </div>
            </div>

            {/* Category Quick Filters */}
            <div className="flex flex-wrap gap-2">
              {yogaCategories.map(category => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                  <span className="ml-2 bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
                    {getCategoryVideos(category.id).length}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Video Grid */}
          {filteredVideos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No videos found
              </h3>
              <p className="text-slate-400">
                Try adjusting your search terms or select a different category.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredVideos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden hover:shadow-2xl hover:border-purple-500/30 transition-all duration-300 group cursor-pointer"
                    onClick={() => playVideo(video)}
                  >
                    {/* Video Thumbnail */}
                    <div className="relative overflow-hidden">
                      <img
                        src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                        alt={video.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                        <div className="bg-black/70 rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                          <Play className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-sm">
                        {video.duration}
                      </div>
                    </div>

                    {/* Video Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-white line-clamp-2 mb-2 group-hover:text-purple-300 transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                        {video.description}
                      </p>

                      <div className="flex items-center justify-between text-sm text-slate-400 mb-3">
                        <span className="font-medium text-purple-300">{video.instructor}</span>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>{video.views}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          video.level === 'Beginner' ? 'bg-green-500/20 text-green-300' :
                          video.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {video.level}
                        </span>
                        <div className="flex items-center text-slate-400">
                          <Clock className="w-4 h-4 mr-1" />
                          <span className="text-sm">{video.duration}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Recommended Based on User Profile */}
              {user && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6 mb-8"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <span className="text-purple-400 mr-2">🎯</span>
                    Recommended For You
                  </h2>
                  <p className="text-slate-300 mb-4">
                    Based on your profile: <span className="text-purple-300">{user.fitnessLevel}</span> level, 
                    goal: <span className="text-purple-300">{user.goal}</span>
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredVideos
                      .filter(video => 
                        video.level.toLowerCase().includes(user.fitnessLevel) ||
                        video.category === user.goal
                      )
                      .slice(0, 2)
                      .map(video => (
                        <div key={video.id} className="flex space-x-4 bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer" onClick={() => playVideo(video)}>
                          <div className="flex-shrink-0 w-32">
                            <img
                              src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                              alt={video.title}
                              className="w-full h-20 object-cover rounded"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-white text-sm mb-1 line-clamp-2">
                              {video.title}
                            </h4>
                            <p className="text-slate-400 text-xs mb-2 line-clamp-2">
                              {video.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-purple-400 text-xs font-medium">
                                {video.duration}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                video.level === 'Beginner' ? 'bg-green-500/20 text-green-300' :
                                video.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-red-500/20 text-red-300'
                              }`}>
                                {video.level}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideoModal && selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-300"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="relative pb-[56.25%] bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                    title={selectedVideo.title}
                    className="absolute top-0 left-0 w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {selectedVideo.title}
                  </h3>
                  {selectedVideo.description && (
                    <p className="text-slate-300 mb-4">
                      {selectedVideo.description}
                    </p>
                  )}
                  {selectedVideo.instructor && (
                    <p className="text-purple-400 font-medium">
                      Instructor: {selectedVideo.instructor}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default YogaVideos