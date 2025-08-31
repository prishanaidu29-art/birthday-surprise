'use client'
import React, { useState, useEffect, useCallback, memo } from 'react'
import { Search, Trophy, Heart } from 'lucide-react'

const TOTAL_EASTER_EGGS = 8

const DiscoveryTracker = memo(function DiscoveryTracker() {
  const [discoveries, setDiscoveries] = useState([])
  const [showTracker, setShowTracker] = useState(false)

  useEffect(() => {
    // Load discoveries from localStorage
    const loadDiscoveries = () => {
      const found = JSON.parse(localStorage.getItem('easter-eggs-found') || '[]')
      setDiscoveries(found)
    }

    loadDiscoveries()

    // Listen for storage changes (when new eggs are found)
    const handleStorageChange = (e) => {
      if (e.key === 'easter-eggs-found') {
        loadDiscoveries()
      }
    }

    // Listen for custom events (more efficient than polling)
    const handleEasterEggFound = () => {
      loadDiscoveries()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('easterEggFound', handleEasterEggFound)

    // Only check periodically when tracker is visible (much less frequent)
    let interval
    if (showTracker) {
      interval = setInterval(loadDiscoveries, 5000) // Reduced from 1000ms to 5000ms
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('easterEggFound', handleEasterEggFound)
      if (interval) clearInterval(interval)
    }
  }, [showTracker])

  const progress = Math.round((discoveries.length / TOTAL_EASTER_EGGS) * 100)
  
  const toggleTracker = useCallback(() => {
    setShowTracker(prev => !prev)
  }, [])

  const closeTracker = useCallback(() => {
    setShowTracker(false)
  }, [])

  return (
    <>
      {/* Floating discovery button */}
      <div 
        className="fixed bottom-6 right-6 z-40 cursor-pointer"
        onClick={toggleTracker}
      >
        <div className="relative">
          <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transform transition-all hover:scale-110">
            <Search className="text-white" size={24} />
          </div>
          
          {discoveries.length > 0 && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-gray-800 animate-bounce">
              {discoveries.length}
            </div>
          )}

          {/* Progress ring */}
          <svg className="absolute inset-0 w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-gray-300"
              strokeDasharray="100, 100"
              strokeDashoffset="0"
              strokeLinecap="round"
              strokeWidth="2"
              fill="transparent"
              stroke="currentColor"
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-yellow-400"
              strokeDasharray={`${progress}, 100`}
              strokeDashoffset="0"
              strokeLinecap="round"
              strokeWidth="2"
              fill="transparent"
              stroke="currentColor"
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
        </div>
      </div>

      {/* Discovery tracker modal */}
      {showTracker && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeTracker}
        >
          <div 
            className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-md w-full p-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <Search className="text-purple-500 w-12 h-12" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Easter Egg Hunt</h2>
              <p className="text-gray-600">Find hidden surprises throughout the site!</p>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-500">{discoveries.length}/{TOTAL_EASTER_EGGS}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{progress}% complete</p>
            </div>

            {/* Found eggs */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Discoveries ({discoveries.length})</h3>
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: TOTAL_EASTER_EGGS }, (_, i) => {
                  const eggId = `egg-${i + 1}`
                  const isFound = discoveries.includes(eggId)
                  
                  return (
                    <div 
                      key={eggId}
                      className={`aspect-square rounded-xl flex items-center justify-center ${
                        isFound 
                          ? 'bg-gradient-to-r from-yellow-200 to-orange-200 text-yellow-600' 
                          : 'bg-gray-100 text-gray-300'
                      }`}
                    >
                      {isFound ? (
                        <Heart className="w-6 h-6" fill="currentColor" />
                      ) : (
                        <div className="w-6 h-6 border-2 border-dashed border-current rounded-full"></div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* All found message */}
            {discoveries.length === TOTAL_EASTER_EGGS && (
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 mb-4 text-center">
                <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <p className="font-bold text-yellow-800">Congratulations! 🎉</p>
                <p className="text-yellow-700 text-sm">You found all the hidden surprises!</p>
              </div>
            )}

            {/* Hints */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                💡 Tip: Explore each section closely to catch those subtle blinking icons!
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  )
})

export default DiscoveryTracker