'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Music, Heart, Play, Pause, Volume2, ExternalLink, Clock, Calendar, Sparkles, Headphones } from 'lucide-react'

export default function PlaylistPage() {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Check authentication
  useEffect(() => {
    const authenticated = sessionStorage.getItem('birthday_authenticated')
    if (authenticated !== 'true') {
      router.push('/')
    } else {
      setIsLoaded(true)
    }
  }, [router])

  // Curated playlist - songs that remind me of you
  const playlist = [
    {
      id: 1,
      title: "Perfect",
      artist: "Ed Sheeran",
      album: "÷ (Divide)",
      duration: "4:23",
      reason: "Because you are perfect to me in every way. This song plays in my head every time I see you smile.",
      spotify_url: "https://open.spotify.com/track/0tgVpDi06FyKpA1z0VMD4v",
      youtube_url: "https://www.youtube.com/watch?v=2Vv-BfVoq4g",
      gradient: "from-green-400 to-blue-500",
      mood: "Romantic"
    },
    {
      id: 2,
      title: "All of Me",
      artist: "John Legend",
      album: "Love in the Future",
      duration: "4:29",
      reason: "You have all of me - my heart, my soul, my everything. This song captures how completely I love you.",
      spotify_url: "https://open.spotify.com/track/3U4isOIWM3VvDubwSI3y7a",
      youtube_url: "https://www.youtube.com/watch?v=450p7goxZqg",
      gradient: "from-red-400 to-pink-500",
      mood: "Soulful"
    },
    {
      id: 3,
      title: "Can't Help Myself",
      artist: "Four Tops",
      album: "Four Tops Second Album",
      duration: "2:57",
      reason: "I can't help myself when it comes to you! This classic always makes me think of dancing with you.",
      spotify_url: "https://open.spotify.com/track/7fzZnH4JWGJPiI4xFpMKT1",
      youtube_url: "https://www.youtube.com/watch?v=bx1Bh8ZvH84",
      gradient: "from-orange-400 to-red-500",
      mood: "Fun"
    },
    {
      id: 4,
      title: "Golden",
      artist: "Harry Styles",
      album: "Fine Line",
      duration: "3:28",
      reason: "You're golden like sunshine, brightening every day. This song feels like pure joy - just like being with you.",
      spotify_url: "https://open.spotify.com/track/6Qs4SXO9dwPj2a4WLBDkmT",
      youtube_url: "https://www.youtube.com/watch?v=P3cffdsEXXw",
      gradient: "from-yellow-400 to-orange-500",
      mood: "Uplifting"
    },
    {
      id: 5,
      title: "Make You Feel My Love",
      artist: "Adele",
      album: "19",
      duration: "3:32",
      reason: "I'd do anything to make you feel my love. Adele's version of this Bob Dylan classic gives me chills every time.",
      spotify_url: "https://open.spotify.com/track/4i6cwNY2Hf83HbdIFg9zGQ",
      youtube_url: "https://www.youtube.com/watch?v=0put0_a--Ng",
      gradient: "from-purple-400 to-indigo-600",
      mood: "Emotional"
    },
    {
      id: 6,
      title: "At Last",
      artist: "Etta James",
      album: "At Last!",
      duration: "3:01",
      reason: "At last, I found you! This timeless classic perfectly captures how I felt when we first met.",
      spotify_url: "https://open.spotify.com/track/5W3cjX2J3tjhG8zb6u0qHn",
      youtube_url: "https://www.youtube.com/watch?v=S-cbOl96RFM",
      gradient: "from-indigo-400 to-purple-600",
      mood: "Classic"
    },
    {
      id: 7,
      title: "Thinking Out Loud",
      artist: "Ed Sheeran",
      album: "x (Multiply)",
      duration: "4:41",
      reason: "When we're old and grey, I'll still love you the same. This song is our future together.",
      spotify_url: "https://open.spotify.com/track/6PGoSes0D9eUDeeAafB2As",
      youtube_url: "https://www.youtube.com/watch?v=lp-EO5I60KA",
      gradient: "from-teal-400 to-green-500",
      mood: "Romantic"
    },
    {
      id: 8,
      title: "Here Comes the Sun",
      artist: "The Beatles",
      album: "Abbey Road",
      duration: "3:05",
      reason: "You are my sunshine after every storm. This Beatles classic reminds me that everything is better with you.",
      spotify_url: "https://open.spotify.com/track/6dGnYIeXmHdcikdzNNDMm2",
      youtube_url: "https://www.youtube.com/watch?v=KQetemT1sWc",
      gradient: "from-yellow-300 to-yellow-600",
      mood: "Happy"
    }
  ]

  const moodColors = {
    "Romantic": "text-red-600 bg-red-100",
    "Soulful": "text-purple-600 bg-purple-100",
    "Fun": "text-orange-600 bg-orange-100",
    "Uplifting": "text-yellow-600 bg-yellow-100",
    "Emotional": "text-indigo-600 bg-indigo-100",
    "Classic": "text-gray-600 bg-gray-100",
    "Happy": "text-green-600 bg-green-100"
  }

  const handleSongClick = (song) => {
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying)
    } else {
      setCurrentSong(song)
      setIsPlaying(true)
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-purple-600">Loading your playlist...</div>
        </div>
      </div>
    )
  }

  const totalDuration = playlist.reduce((total, song) => {
    const [minutes, seconds] = song.duration.split(':').map(Number)
    return total + minutes * 60 + seconds
  }, 0)

  const formatTotalDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-pink-300 opacity-60 animate-float">
          <Music size={25} />
        </div>
        <div className="absolute top-1/3 right-20 text-purple-400 opacity-50">
          <Sparkles size={20} className="animate-spin-slow" />
        </div>
        <div className="absolute bottom-20 left-1/4 text-blue-300 opacity-60">
          <Headphones size={22} className="animate-pulse" />
        </div>
        <div className="absolute top-1/2 right-1/4 text-pink-400 opacity-40">
          <Heart size={18} fill="currentColor" className="animate-bounce" />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/birthday" 
            className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors mb-6"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Birthday Hub
          </Link>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-4">
              <Music className="text-purple-500 w-8 h-8 mr-3" />
              <Heart className="text-pink-500 w-6 h-6" fill="currentColor" />
              <Music className="text-purple-500 w-8 h-8 ml-3" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Songs That Remind Me of You
              </span>
            </h1>
            <p className="text-lg text-gray-700 mb-4">
              Every melody tells our story 🎵
            </p>
            
            {/* Playlist stats */}
            <div className="inline-flex items-center gap-6 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg">
              <div className="flex items-center gap-2">
                <Music className="text-purple-500 w-4 h-4" />
                <span className="text-sm font-medium text-gray-700">
                  {playlist.length} songs
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="text-purple-500 w-4 h-4" />
                <span className="text-sm font-medium text-gray-700">
                  {formatTotalDuration(totalDuration)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Current playing */}
        {currentSong && (
          <div className="mb-8 animate-slide-in">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${currentSong.gradient}`}></div>
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-4 bg-gradient-to-br ${currentSong.gradient} rounded-2xl shadow-lg`}>
                    {isPlaying ? (
                      <Pause className="text-white w-8 h-8" />
                    ) : (
                      <Play className="text-white w-8 h-8" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{currentSong.title}</h3>
                    <p className="text-gray-600">{currentSong.artist}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${moodColors[currentSong.mood]}`}>
                        {currentSong.mood}
                      </span>
                      <span className="text-sm text-gray-500">{currentSong.duration}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 italic leading-relaxed">
                  "{currentSong.reason}"
                </p>
                <div className="flex gap-3 mt-4">
                  <a
                    href={currentSong.spotify_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors text-sm font-medium"
                  >
                    <ExternalLink size={16} className="mr-2" />
                    Spotify
                  </a>
                  <a
                    href={currentSong.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm font-medium"
                  >
                    <ExternalLink size={16} className="mr-2" />
                    YouTube
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Playlist */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Volume2 className="mr-3 text-purple-500" />
              Our Love Playlist
            </h2>
            <p className="text-gray-600 mt-2">Click any song to see why it reminds me of you</p>
          </div>
          
          <div className="divide-y divide-gray-100">
            {playlist.map((song, index) => (
              <div
                key={song.id}
                onClick={() => handleSongClick(song)}
                className={`p-6 hover:bg-purple-50 transition-all cursor-pointer group ${
                  currentSong?.id === song.id ? 'bg-purple-50 border-l-4 border-purple-500' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 text-gray-500 font-medium">
                      {currentSong?.id === song.id && isPlaying ? (
                        <Pause className="w-5 h-5 text-purple-600" />
                      ) : currentSong?.id === song.id ? (
                        <Play className="w-5 h-5 text-purple-600" />
                      ) : (
                        <span className="group-hover:hidden">{index + 1}</span>
                      )}
                      {currentSong?.id !== song.id && (
                        <Play className="w-5 h-5 text-purple-600 hidden group-hover:block" />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                        {song.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{song.artist}</span>
                        <span>•</span>
                        <span>{song.album}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${moodColors[song.mood]}`}>
                      {song.mood}
                    </span>
                    <span className="text-sm text-gray-500 w-12 text-right">
                      {song.duration}
                    </span>
                  </div>
                </div>
                
                {currentSong?.id === song.id && (
                  <div className="mt-4 pt-4 border-t border-purple-200 animate-fade-in">
                    <p className="text-gray-700 italic leading-relaxed mb-4">
                      "{song.reason}"
                    </p>
                    <div className="flex gap-3">
                      <a
                        href={song.spotify_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                      >
                        <ExternalLink size={14} className="mr-1" />
                        Spotify
                      </a>
                      <a
                        href={song.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                      >
                        <ExternalLink size={14} className="mr-1" />
                        YouTube
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 max-w-2xl mx-auto">
          <Heart className="text-red-500 mx-auto mb-3 w-8 h-8" fill="currentColor" />
          <p className="text-gray-600 font-medium mb-2">
            Music is the language of love, and these songs speak my heart
          </p>
          <p className="text-sm text-gray-500">
            Every time I hear these songs, I think of you and smile 🎵💕
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-slide-in { animation: slide-in 0.6s ease-out; }
      `}</style>
    </div>
  )
}