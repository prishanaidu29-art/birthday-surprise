'use client'
import { useEffect, useState } from 'react'

export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Heart, Camera, MessageCircle, Gamepad2, Music, Calendar, Sparkles, Gift, Crown, Star, Brain, Joystick, RotateCcw } from 'lucide-react'
import EasterEgg from '../../components/EasterEgg'

export default function BirthdayPage() {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [timeUntil, setTimeUntil] = useState('')

  const handleLogout = () => {
    sessionStorage.removeItem('birthday_authenticated')
    router.push('/')
  }

  const handleResetEasterEggs = () => {
    if (typeof window !== 'undefined') {
      // Clear all easter egg discoveries
      const eggIds = ['egg-1', 'egg-2', 'egg-3', 'egg-4', 'egg-5', 'egg-6', 'egg-7', 'egg-8']
      eggIds.forEach(id => {
        localStorage.removeItem(`easter-egg-${id}`)
      })
      localStorage.removeItem('easter-eggs-found')
      
      // Reload page to reflect changes
      window.location.reload()
    }
  }

  // Check authentication
  useEffect(() => {
    const authenticated = sessionStorage.getItem('birthday_authenticated')
    if (authenticated !== 'true') {
      router.push('/')
    } else {
      setIsLoaded(true)
    }
  }, [router])

  // Countdown timer
  useEffect(() => {
    const calculateTime = () => {
      // Get current year and set birthday to current or next year
      const now = new Date()
      const currentYear = now.getFullYear()
      let birthday = new Date(`${currentYear}-09-03T00:00:00+10:00`) // Melbourne time
      
      // If birthday has passed this year, use next year
      if (birthday < now) {
        birthday = new Date(`${currentYear + 1}-09-03T00:00:00+10:00`)
      }
      
      const diff = birthday - now

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        
        if (days > 0) {
          setTimeUntil(`${days} days and ${hours} hours until your special day!`)
        } else if (hours > 0) {
          setTimeUntil(`${hours} hours and ${minutes} minutes until your birthday! 🎉`)
        } else {
          setTimeUntil(`${minutes} minutes until your birthday! 🎂✨`)
        }
      } else {
        setTimeUntil("IT'S YOUR BIRTHDAY TODAY! 🎉🎂🎈")
      }
    }

    calculateTime()
    const timer = setInterval(calculateTime, 1000 * 60) // Update every minute
    return () => clearInterval(timer)
  }, [])

  const features = [
    {
      title: 'Our Memories',
      description: 'A collection of our favorite moments together',
      icon: Camera,
      link: '/birthday/memories',
      gradient: 'from-pink-400 to-rose-600',
      delay: '0ms'
    },
    {
      title: 'Love Quiz',
      description: 'How well do I know you? Test time!',
      icon: Brain,
      link: '/birthday/quiz',
      gradient: 'from-orange-400 to-red-600',
      delay: '100ms'
    },
    {
      title: 'Birthday Messages',
      description: 'Special messages from someone who loves you',
      icon: MessageCircle,
      link: '/birthday/messages',
      gradient: 'from-blue-400 to-cyan-600',
      delay: '200ms'
    },
    {
      title: 'Our Playlist',
      description: 'Songs that remind me of you',
      icon: Music,
      link: '/birthday/playlist',
      gradient: 'from-green-400 to-emerald-600',
      delay: '300ms'
    },
    {
      title: 'Mini Games',
      description: 'Fun games including Hearts Across Distance!',
      icon: Gamepad2,
      link: '/birthday/games',
      gradient: 'from-violet-400 to-purple-600',
      delay: '400ms'
    }
  ]

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-purple-600">Loading your surprise...</div>
      </div>
    )
  }

  return (
    <div className="center-container bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-300 rounded-full opacity-20 animate-blob"></div>
        <div className="absolute top-20 right-10 w-32 h-32 bg-purple-300 rounded-full opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-20 w-36 h-36 bg-blue-300 rounded-full opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Top Navigation */}
      <div className="fixed top-4 left-4 right-4 flex justify-between items-center z-50">
        <button onClick={handleLogout} className="logout-button">
          ← Back to Login
        </button>
        
        <button 
          onClick={handleResetEasterEggs}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-0.5 flex items-center gap-2"
          title="Reset all discovered Easter eggs"
        >
          <RotateCcw size={16} />
          Reset Easter Eggs
        </button>
      </div>

      <div className="center-content relative z-10">
        {/* Header */}
        <div className="text-center header-section animate-fade-in max-w-4xl mx-auto w-full">
          <div className="inline-flex items-center justify-center mb-4">
            <Sparkles className="text-yellow-400 w-6 h-6 sm:w-8 sm:h-8" />
            <Gift className="text-purple-500 mx-3 w-8 h-8 sm:w-10 sm:h-10" />
            <Sparkles className="text-yellow-400 w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 px-2">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Happy Birthday, Jerzen!
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-700 mb-4 px-2">
            Welcome to your special surprise, my cutie ganda 💕
          </p>
          
          <div className="inline-flex items-center gap-2 px-4 py-4 bg-white/80 backdrop-blur-sm rounded-full shadow-md">
            <Calendar className="text-purple-500 w-4 h-4 sm:w-5 sm:h-5" />
            <p className="text-xs sm:text-sm font-medium text-gray-700">{timeUntil}</p>
          </div>
        </div>

        {/* Feature Cards - Full Width */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 section-spacing max-w-5xl mx-auto w-full">
          {features.map((feature, index) => (
            <Link
              key={index}
              href={feature.link}
              className="group block animate-slide-up-smooth"
              style={{ 
                animationDelay: feature.delay,
                willChange: 'transform, opacity'
              }}
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-elegant overflow-hidden hover:shadow-floating h-full border border-white/20 transform transition-all duration-300 ease-out group-hover:scale-[1.02] group-hover:-translate-y-1">
                <div className={`h-2 bg-gradient-to-r ${feature.gradient}`}></div>
                <div className="p-6 sm:p-7 md:p-8">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className={`p-3 sm:p-4 bg-gradient-to-br ${feature.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300 ease-out flex-shrink-0`}>
                      <feature.icon className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Special Message - Full Width */}
        <div className="text-center bg-white/95 backdrop-blur-sm rounded-3xl shadow-floating p-8 sm:p-10 animate-slide-up-smooth max-w-5xl mx-auto border border-white/20 section-spacing" style={{ animationDelay: '500ms' }}>
          <div className="relative mb-6">
            <Heart className="text-yellow-500 mx-auto w-10 h-10 sm:w-12 sm:h-12 animate-gentle-glow" fill="currentColor" />
            <div className="absolute inset-0 animate-gentle-pulse">
              <Heart className="text-yellow-300 mx-auto w-10 h-10 sm:w-12 sm:h-12 opacity-20" fill="currentColor" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
            A Special Message For My Looove
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto px-2 sm:px-0">
            Even though we&apos;re miles apart on your special day, my love for you knows no distance. 
            This little corner of the internet is my way of being there with you, celebrating you, 
            and reminding you how incredibly special you are to me, Jerzen. Every pixel here was placed with love, 
            every feature built while thinking of your beautiful smile. Happy Birthday, my cutie ganda! 🎂💛
          </p>
        </div>

        {/* Hidden Easter Eggs */}
        <EasterEgg 
          id="egg-1"
          top="10%"
          left="5%"
          icon={Crown}
          message="You found the birthday crown! 👑"
          specialMessage="You're the queen of my heart, today and always!"
          size="medium"
        />
        
        <EasterEgg 
          id="egg-2"
          bottom="15%"
          right="8%"
          icon={Star}
          message="A shining star, just like you! ⭐"
          specialMessage="You light up my world in ways you can't even imagine"
          size="medium"
        />

        <EasterEgg 
          id="egg-3"
          top="50%"
          left="2%"
          icon={Gift}
          message="A special gift waiting to be unwrapped! 🎁"
          specialMessage="The best gift you've given me is your love"
          size="large"
        />
      </div>
    </div>
  )
}