'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Heart, Camera, MessageCircle, Gamepad2, Music, Calendar, Sparkles, Gift } from 'lucide-react'

export default function BirthdayPage() {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [timeUntil, setTimeUntil] = useState('')

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
      const birthday = new Date('2024-09-03T00:00:00+10:00') // Melbourne time
      const now = new Date()
      const diff = birthday - now

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        setTimeUntil(`${days} days and ${hours} hours until your special day!`)
      } else {
        setTimeUntil("IT'S YOUR BIRTHDAY! 🎉🎂")
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
      icon: Gamepad2,
      link: '/birthday/quiz',
      gradient: 'from-purple-400 to-indigo-600',
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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 w-full">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-300 rounded-full opacity-20 animate-blob"></div>
        <div className="absolute top-20 right-10 w-32 h-32 bg-purple-300 rounded-full opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-20 w-36 h-36 bg-blue-300 rounded-full opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full px-4 py-8 sm:px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center mb-4">
            <Sparkles className="text-yellow-400 w-6 h-6 sm:w-8 sm:h-8" />
            <Gift className="text-purple-500 mx-3 w-8 h-8 sm:w-10 sm:h-10" />
            <Sparkles className="text-yellow-400 w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 px-2">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Happy Birthday, Love!
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-700 mb-2 px-2">
            Welcome to your special surprise 💕
          </p>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md">
            <Calendar className="text-purple-500 w-4 h-4 sm:w-5 sm:h-5" />
            <p className="text-xs sm:text-sm font-medium text-gray-700">{timeUntil}</p>
          </div>
        </div>

        {/* Feature Cards - Full Width */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 md:mb-12">
          {features.map((feature, index) => (
            <Link
              key={index}
              href={feature.link}
              className="group transform transition-all duration-300 hover:scale-[1.02] animate-slide-up block"
              style={{ animationDelay: feature.delay }}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow h-full">
                <div className={`h-2 bg-gradient-to-r ${feature.gradient}`}></div>
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className={`p-2.5 sm:p-3 bg-gradient-to-br ${feature.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
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
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 animate-slide-up" style={{ animationDelay: '400ms' }}>
          <Heart className="text-red-500 mx-auto mb-4 w-8 h-8 sm:w-10 sm:h-10" fill="currentColor" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
            A Special Message For You
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto px-2">
            Even though we're miles apart on your special day, my love for you knows no distance. 
            This little corner of the internet is my way of being there with you, celebrating you, 
            and reminding you how incredibly special you are to me. Every pixel here was placed with love, 
            every feature built while thinking of your smile. Happy Birthday, my darling! 🎂❤️
          </p>
        </div>
      </div>
    </div>
  )
}