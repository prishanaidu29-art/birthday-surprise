'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import { Heart, Lock, Calendar, Sparkles } from 'lucide-react'


export default function LandingPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hint, setHint] = useState(false)
  const router = useRouter()

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = sessionStorage.getItem('birthday_authenticated')
      if (authenticated === 'true') {
        router.push('/birthday')
      }
    }
    checkAuth()
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // The password - you can change this!
    // Using your anniversary date or a special word
    const SECRET_PASSWORD = '090324' // special date/word

    if (password === SECRET_PASSWORD) {
      // Log access to Supabase
      try {
        await supabase.from('access_logs').insert({})
      } catch (err) {
        console.log('Failed to log access:', err)
      }

      // Set authentication
      sessionStorage.setItem('birthday_authenticated', 'true')
      
      // Redirect to birthday page
      router.push('/birthday')
    } else {
      setError('Wrong password! Try again 💕')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Floating hearts animation */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="animate-float-slow absolute top-20 left-10 text-pink-300 opacity-70">
            <Heart size={30} fill="currentColor" />
          </div>
          <div className="animate-float-medium absolute top-40 right-20 text-purple-300 opacity-60">
            <Heart size={25} fill="currentColor" />
          </div>
          <div className="animate-float-fast absolute bottom-20 left-1/3 text-pink-400 opacity-50">
            <Heart size={20} fill="currentColor" />
          </div>
          <div className="animate-float-slow absolute top-1/2 right-1/3 text-purple-400 opacity-60">
            <Sparkles size={25} />
          </div>
        </div>

        {/* Main card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 space-y-6 transform transition-all duration-500 hover:scale-[1.02]">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full shadow-lg">
                <Lock className="text-white" size={30} />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Special Day Incoming! 🎉
            </h1>
            <p className="text-gray-600">
              Enter the magic password to unlock your surprise
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter our special date..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-colors"
                disabled={isLoading}
              />
              <Calendar className="absolute right-3 top-3.5 text-gray-400" size={20} />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Unlocking magic...' : 'Unlock Birthday Surprise 🎂'}
            </button>
          </form>

          {/* Hint button */}
          <div className="text-center">
            <button
              onClick={() => setHint(!hint)}
              className="text-sm text-gray-500 hover:text-purple-600 transition-colors"
            >
              Need a hint? 💭
            </button>
            {hint && (
              <p className="mt-2 text-xs text-gray-500 animate-fade-in">
                Think about our special day... when did we first meet? 😊
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-400 pt-4 border-t border-gray-100">
            Made with <Heart className="inline text-red-500" size={12} fill="currentColor" /> for the most amazing person
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-10deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 4s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 3s ease-in-out infinite; }
        .animate-shake { animation: shake 0.3s ease-in-out; }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </div>
  )
}