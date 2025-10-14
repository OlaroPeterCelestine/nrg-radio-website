'use client'

import { useState, useEffect } from 'react'
import { apiUtils } from '@/lib/api-utils'
import Image from 'next/image'

interface Show {
  id: number
  show_name: string
  image: string
  time: string
  presenters: string
  day_of_week: string
}

export default function OnAirCarousel() {
  const [shows, setShows] = useState<Show[]>([])
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)
  
  // Get current day and map to our day filter options
  // For homepage, show Monday-Thursday grouped shows for weekdays
  const getCurrentDayFilter = () => {
    const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' })
    
    if (['Monday', 'Tuesday', 'Wednesday', 'Thursday'].includes(currentDay)) {
      return 'Monday-Thursday' // Show grouped weekday shows
    } else if (currentDay === 'Friday') {
      return 'Friday'
    } else if (currentDay === 'Saturday') {
      return 'Saturday'
    } else if (currentDay === 'Sunday') {
      return 'Sunday'
    }
    
    return 'Monday-Thursday' // fallback to grouped weekdays
  }
  
  const [selectedDay, setSelectedDay] = useState<string>(getCurrentDayFilter())

  useEffect(() => {
    console.log('🔄 OnAirCarousel - Component mounted, fetching shows...')
    fetchShows()
    
    // Set up auto-refresh every 5 minutes to update when shows end
    const interval = setInterval(() => {
      console.log('⏰ OnAirCarousel - Auto-refresh triggered')
      fetchShows()
    }, 300000) // Refresh every 5 minutes (300 seconds)
    
    return () => {
      console.log('🧹 OnAirCarousel - Component unmounting, clearing interval')
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (shows.length > 0 && !selectedDay) {
      const availableDays = getUniqueDays()
      if (availableDays.length > 0) {
        setSelectedDay(availableDays[0])
      }
    }
  }, [shows, selectedDay])

  const fetchShows = async (retryCount = 0) => {
    try {
      console.log(`🎯 Fetching shows from API... (Attempt ${retryCount + 1})`)
      setLoading(true)
      
      // Force fresh data by adding timestamp
      const timestamp = Date.now()
      console.log('🕐 Cache bust timestamp:', timestamp)
      
      const data = await apiUtils.fetchShows()
      console.log('✅ Shows data received:', data)
      console.log('📊 Total shows count:', data?.length || 0)
      console.log('📅 Shows by day:', data?.reduce((acc: Record<string, number>, show: Show) => {
        acc[show.day_of_week] = (acc[show.day_of_week] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {})
      setShows(data || []) // Show all available shows
      setUsingFallback(false) // Reset fallback state on success
    } catch (error) {
      console.error('💥 Error fetching shows:', error)
      
      // Retry logic for timeout errors
      if (retryCount < 2 && error instanceof Error && error.message && error.message.includes('timed out')) {
        console.warn(`⏰ Retrying in ${(retryCount + 1) * 2} seconds...`)
        setTimeout(() => {
          fetchShows(retryCount + 1)
        }, (retryCount + 1) * 2000) // Exponential backoff: 2s, 4s
        return
      }
      
      // Use fallback data after retries or on other errors
      console.warn('⚠️ Using fallback data due to API error')
      const fallbackShows = getFallbackShows()
      setShows(fallbackShows)
      setUsingFallback(true) // Set fallback state
    } finally {
      if (retryCount === 0) { // Only set loading false on first attempt
        setLoading(false)
      }
    }
  }

  // Fallback data when API fails
  const getFallbackShows = (): Show[] => {
    return [
      {
        id: 1,
        show_name: "Breakfast show",
        time: "06:00 - 10:00",
        presenters: "Prim,Eka, dj Beats, Bigboy Shaque",
        image: "https://via.placeholder.com/400x200/ef4444/ffffff?text=Breakfast+Show",
        day_of_week: "Monday-Thursday"
      },
      {
        id: 2,
        show_name: "Warm up mix",
        time: "10:00 - 11:00",
        presenters: "DJ Mix Master",
        image: "https://via.placeholder.com/400x200/8b5cf6/ffffff?text=Warm+Up+Mix",
        day_of_week: "Monday-Thursday"
      },
      {
        id: 3,
        show_name: "AM show",
        time: "11:00 - 14:00",
        presenters: "Crysto Panda, City Girl, Khuhani",
        image: "https://via.placeholder.com/400x200/06b6d4/ffffff?text=AM+Show",
        day_of_week: "Monday-Thursday"
      },
      {
        id: 4,
        show_name: "Warm up mix",
        time: "14:00 - 15:00",
        presenters: "DJ Mix Master",
        image: "https://via.placeholder.com/400x200/8b5cf6/ffffff?text=Warm+Up+Mix",
        day_of_week: "Monday-Thursday"
      },
      {
        id: 5,
        show_name: "Transit show",
        time: "15:00 - 19:00",
        presenters: "Salta, Mc Benjhi, Eyo Marcus",
        image: "https://via.placeholder.com/400x200/f59e0b/ffffff?text=Transit+Show",
        day_of_week: "Monday-Thursday"
      },
      {
        id: 6,
        show_name: "Circle show",
        time: "19:00 - 23:00",
        presenters: "Etania, DjVXFaisal, King Hanny",
        image: "https://via.placeholder.com/400x200/10b981/ffffff?text=Circle+Show",
        day_of_week: "Monday-Thursday"
      }
    ]
  }

  // Function to check if a show is currently on air or upcoming
  const isShowOnAirOrUpcoming = (show: Show) => {
    const now = new Date()
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' })
    const currentTime = now.toTimeString().slice(0, 5) // HH:MM format
    
    // Check if it's the right day
    if (show.day_of_week !== currentDay) {
      return false
    }
    
    // Parse show time - handle both "08:00" and "08:00 - 10:00" formats
    let startTime, endTime
    if (show.time.includes(' - ')) {
      [startTime, endTime] = show.time.split(' - ')
    } else {
      // If no end time, assume 2-hour duration
      startTime = show.time
      const [hours, minutes] = startTime.split(':').map(Number)
      const endHours = hours + 2
      endTime = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    }
    
    // Check if current time is within the show's time range
    return currentTime >= startTime && currentTime <= endTime
  }

  // Function to check if a show is upcoming today
  const isShowUpcomingToday = (show: Show) => {
    const now = new Date()
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' })
    const currentTime = now.toTimeString().slice(0, 5) // HH:MM format
    
    // Check if it's the right day
    if (show.day_of_week !== currentDay) {
      return false
    }
    
    // Parse show start time - handle both formats
    let startTime
    if (show.time.includes(' - ')) {
      [startTime] = show.time.split(' - ')
    } else {
      startTime = show.time
    }
    
    // Check if show starts after current time
    return currentTime < startTime
  }

  const getFilteredShows = () => {
    let filteredShows: Show[] = []
    
    console.log('🔍 OnAirCarousel - Filtering shows for selectedDay:', selectedDay)
    console.log('📋 OnAirCarousel - All shows:', shows.map(s => ({ id: s.id, name: s.show_name, day: s.day_of_week })))
    
    if (selectedDay === 'Monday-Thursday') {
      // Show grouped weekday shows (represents Mon-Thu)
      filteredShows = shows.filter(show => show.day_of_week === 'Monday-Thursday')
      console.log('📅 OnAirCarousel - Filtering for Monday-Thursday grouped shows')
    } else if (selectedDay === 'Saturday') {
      filteredShows = shows.filter(show => show.day_of_week === 'Saturday')
    } else if (selectedDay === 'Sunday') {
      filteredShows = shows.filter(show => show.day_of_week === 'Sunday')
    } else if (selectedDay === 'Friday') {
      filteredShows = shows.filter(show => show.day_of_week === 'Friday')
    } else {
      // If no day selected or invalid selection, return empty array
      filteredShows = []
    }
    
    console.log('✅ OnAirCarousel - Filtered shows result:', filteredShows.length, 'shows for', selectedDay)
    console.log('📝 OnAirCarousel - Filtered shows:', filteredShows.map(s => ({ id: s.id, name: s.show_name, day: s.day_of_week })))
    
    // Remove duplicates by show ID and day
    const uniqueShows = filteredShows.filter((show, index, self) => 
      index === self.findIndex(s => s.id === show.id && s.day_of_week === show.day_of_week)
    )
    
    console.log('🔍 OnAirCarousel - After deduplication:', uniqueShows.length, 'unique shows')
    
    // Sort shows by start time within the same day
    const sortedShows = uniqueShows.sort((a, b) => {
      const aStartTime = a.time.includes(' - ') ? a.time.split(' - ')[0] : a.time
      const bStartTime = b.time.includes(' - ') ? b.time.split(' - ')[0] : b.time
      return aStartTime.localeCompare(bStartTime)
    })
    
    console.log('🔄 OnAirCarousel - Final sorted shows:', sortedShows.map(s => ({ id: s.id, name: s.show_name, time: s.time })))
    
    return sortedShows
  }

  const getUniqueDays = () => {
    const days = shows.map(show => show.day_of_week)
    const uniqueDays = Array.from(new Set(days))
    
    const groupedDays = []
    
    // Check for each day and add them in order
    if (uniqueDays.includes('Monday-Thursday')) {
      groupedDays.push('Monday-Thursday')
    }
    if (uniqueDays.includes('Friday')) {
      groupedDays.push('Friday')
    }
    if (uniqueDays.includes('Saturday')) {
      groupedDays.push('Saturday')
    }
    if (uniqueDays.includes('Sunday')) {
      groupedDays.push('Sunday')
    }
    
    return groupedDays
  }

  const isValidImageUrl = (url: string | null | undefined): boolean => {
    if (!url || url.trim() === '') return false
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const getImageSrc = (show: Show): string => {
    if (isValidImageUrl(show.image)) {
      return show.image
    }
    // Use a more reliable fallback image that won't timeout
    return 'https://via.placeholder.com/400x200/1f2937/ffffff?text=NRG+Radio'
  }

  return (
    <section className="text-white py-6 px-4 w-full mt-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 max-w-7xl mx-auto gap-4">
        <div>
          <h1 className="text-3xl font-bold">On Air</h1>
          {usingFallback && (
            <p className="text-yellow-500 text-sm mt-1">
              ⚠️ Showing cached schedule (API temporarily unavailable)
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Day Filter */}
          <div className="flex flex-wrap gap-2">
            {getUniqueDays().map((day) => {
              const isSelected = selectedDay === day
              
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    isSelected
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {day === 'Monday-Thursday' ? 'Mon-Thu' : day === 'Friday' ? 'Fri' : day === 'Saturday' ? 'Sat' : day === 'Sunday' ? 'Sun' : day}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">
              <i className="fas fa-radio text-4xl mb-4 block"></i>
              Loading shows...
            </div>
          </div>
        ) : shows.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">
              <i className="fas fa-radio text-4xl mb-4 block"></i>
              No shows available at the moment
            </div>
            <p className="text-gray-500">Check back later for our schedule</p>
            <p className="text-gray-600 text-sm mt-2">If this persists, there may be a connection issue</p>
          </div>
        ) : getFilteredShows().length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">
              <i className="fas fa-calendar text-4xl mb-4 block"></i>
              No shows scheduled for {selectedDay === 'Monday-Thursday' ? 'Mon-Thu' : selectedDay}
            </div>
            <p className="text-gray-500">Check back later or try a different day</p>
            <div className="mt-4 text-sm text-gray-600">
              <p>Current time: {new Date().toLocaleTimeString()}</p>
              <p>Current day: {new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
              <p>Total shows available: {shows.length}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
            {getFilteredShows().map((show, index) => {
              // Only show LIVE/UPCOMING status for shows on the current day
              const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' })
              const isCurrentDay = show.day_of_week === currentDay
              const isCurrentlyOnAir = isCurrentDay && isShowOnAirOrUpcoming(show)
              const isUpcoming = isCurrentDay && isShowUpcomingToday(show)
              
              console.log(`🎭 OnAirCarousel - Rendering show ${index + 1}:`, { id: show.id, name: show.show_name, day: show.day_of_week })
              
              return (
                <div key={`${show.id}-${show.day_of_week}-${index}`} className="group">
                  <div className="relative">
                    <Image
                      src={getImageSrc(show)}
                      alt={show.presenters || `Show ${show.id}`}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover transition-transform duration-300 cursor-pointer rounded-xl hover:scale-105"
                      onError={(e) => {
                        console.warn('Image failed to load, using fallback:', show.show_name)
                        e.currentTarget.src = 'https://via.placeholder.com/400x200/1f2937/ffffff?text=NRG+Radio'
                      }}
                      loading="lazy"
                    />
                    {isCurrentlyOnAir && (
                      <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                        LIVE
                      </div>
                    )}
                    {isUpcoming && (
                      <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        UPCOMING
                      </div>
                    )}
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="text-lg font-bold mb-2">{show.show_name}</h3>
                    <p className="font-semibold text-red-500">{show.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
