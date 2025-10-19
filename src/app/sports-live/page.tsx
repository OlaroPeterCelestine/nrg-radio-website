'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function SportsLivePage() {
  const [isLive, setIsLive] = useState(true)
  const router = useRouter()

  // YouTube video ID extracted from the URL
  const youtubeVideoId = 'ePqK8obAoWQ'
  const embedUrl = `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=0&controls=1&showinfo=1&rel=0&modestbranding=1`

  // Simulate live status check
  useEffect(() => {
    const checkLiveStatus = () => {
      // In a real implementation, you would check if the stream is actually live
      // For now, we'll assume it's always live
      setIsLive(true)
    }

    checkLiveStatus()
    const interval = setInterval(checkLiveStatus, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <Header createPlayer={() => {}} />
      
      {/* Main Content Container */}
      <div className="pt-20 sm:pt-24 px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Sports Live Header */}
        <div className="max-w-7xl mx-auto mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c4.41 0 8-3.59 8-8s-3.59-8-8-8-8 3.59-8 8 3.59 8 8 8zm0-14c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6 2.69-6 6-6zm0 10c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/>
                </svg>
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Sports Live</h1>
                <p className="text-gray-300 text-sm sm:text-base">Basketball & Sports Coverage</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 self-start sm:self-center">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </div>
              <span className="text-red-400 font-medium text-xs sm:text-sm">LIVE NOW</span>
            </div>
          </div>
        </div>

        {/* Video Container */}
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-black rounded-lg sm:rounded-xl overflow-hidden shadow-2xl border border-gray-800">
            {/* Video Player */}
            <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
              <iframe
                src={embedUrl}
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                title="NRG Radio Sports Live"
              />
            </div>

            {/* Live Banner Overlay */}
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
              <div className="bg-red-600/90 backdrop-blur-md rounded-lg px-2 py-1 sm:px-4 sm:py-2 border border-red-500">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-full w-full bg-white"></span>
                  </div>
                  <span className="text-white font-bold text-xs sm:text-sm">SPORTS LIVE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-gray-900/50 rounded-lg p-4 sm:p-6 border border-gray-800">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">About Sports Live</h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Watch live basketball and sports coverage on NRG Radio. Get the latest updates, 
                scores, and commentary from our sports team. Tune in for comprehensive coverage 
                of local and international sports events.
              </p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4 sm:p-6 border border-gray-800">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Live Features</h3>
              <ul className="text-gray-300 text-sm sm:text-base space-y-2">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                  <span>Real-time commentary</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                  <span>Live score updates</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                  <span>Expert analysis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                  <span>Interactive chat</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
