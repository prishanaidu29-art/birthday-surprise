'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../lib/supabase'
import { ArrowLeft, Heart, Star, Sparkles, MessageCircle, Gift, Calendar, User } from 'lucide-react'

export default function MessagesPage() {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentMessage, setCurrentMessage] = useState(0)
  const [showAll, setShowAll] = useState(false)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  // Check authentication
  useEffect(() => {
    const authenticated = sessionStorage.getItem('birthday_authenticated')
    if (authenticated !== 'true') {
      router.push('/')
    } else {
      setIsLoaded(true)
      fetchMessages()
    }
  }, [router])

  // Fetch messages from Supabase
  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('is_visible', true)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching messages:', error)
        // Fallback to default messages if database fetch fails
        setMessages(getDefaultMessages())
      } else {
        setMessages(data || getDefaultMessages())
      }
    } catch (err) {
      console.error('Error:', err)
      setMessages(getDefaultMessages())
    } finally {
      setLoading(false)
    }
  }

  // Default fallback messages
  const getDefaultMessages = () => [
    {
      id: '1',
      author: 'Your Love',
      message: "From the moment I saw you, I knew my life would never be the same. Your smile lit up the room, and your laugh became my favorite sound. Happy birthday to the person who changed everything for me. ❤️",
      created_at: new Date().toISOString()
    },
    {
      id: '2', 
      author: 'Your Admirer',
      message: "You have the most beautiful soul I've ever encountered. Your kindness, your compassion, the way you see the world - it makes me fall in love with you more every single day. You inspire me to be better. ✨",
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      author: 'Your Partner',
      message: "Even though we're apart right now, you're always in my heart and thoughts. Distance is just a number when love is this strong. I can't wait until we're together again. Until then, know that you're loved beyond measure. 💙",
      created_at: new Date().toISOString()
    }
  ]

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-purple-600">Loading your messages...</div>
        </div>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
        <div className="container mx-auto px-4 py-8">
          <Link 
            href="/birthday" 
            className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors mb-6"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Birthday Hub
          </Link>
          <div className="text-center mt-12">
            <MessageCircle className="text-purple-300 w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No messages yet</h2>
            <p className="text-gray-500">Messages will appear here when they're added to the database.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-pink-300 opacity-60 animate-bounce">
          <Heart size={20} fill="currentColor" />
        </div>
        <div className="absolute top-1/3 right-20 text-purple-400 opacity-50">
          <Sparkles size={25} className="animate-spin-slow" />
        </div>
        <div className="absolute bottom-20 left-1/4 text-blue-300 opacity-60">
          <Star size={18} fill="currentColor" className="animate-pulse" />
        </div>
        <div className="absolute top-1/2 right-1/4 text-pink-400 opacity-40">
          <Heart size={15} fill="currentColor" className="animate-bounce" />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
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
              <MessageCircle className="text-purple-500 w-8 h-8 mr-3" />
              <Heart className="text-pink-500 w-6 h-6" fill="currentColor" />
              <MessageCircle className="text-purple-500 w-8 h-8 ml-3" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Messages from the Heart
              </span>
            </h1>
            <p className="text-lg text-gray-700">
              Special words written just for you 💕
            </p>
          </div>
        </div>

        {/* Message Navigation */}
        {!showAll && (
          <div className="flex justify-center items-center gap-4 mb-8">
            <button
              onClick={() => setCurrentMessage(Math.max(0, currentMessage - 1))}
              disabled={currentMessage === 0}
              className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <div className="flex gap-2">
              {messages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMessage(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentMessage 
                      ? 'bg-purple-500 w-8' 
                      : 'bg-purple-200 hover:bg-purple-300'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrentMessage(Math.min(messages.length - 1, currentMessage + 1))}
              disabled={currentMessage === messages.length - 1}
              className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}

        {/* Toggle View Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-0.5"
          >
            {showAll ? 'Show One at a Time' : 'Show All Messages'}
          </button>
        </div>

        {/* Messages Display */}
        {showAll ? (
          // All messages view
          <div className="grid gap-8 max-w-4xl mx-auto">
            {messages.map((msg, index) => {
              const gradients = [
                'from-pink-400 to-rose-600',
                'from-purple-400 to-indigo-600',
                'from-blue-400 to-cyan-600',
                'from-green-400 to-emerald-600',
                'from-orange-400 to-red-600',
                'from-teal-400 to-blue-600'
              ]
              const gradient = gradients[index % gradients.length]
              
              return (
                <div
                  key={msg.id}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`h-1 bg-gradient-to-r ${gradient}`}></div>
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`p-3 bg-gradient-to-br ${gradient} rounded-xl shadow-lg`}>
                        <User className="text-white w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{msg.author}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(msg.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {msg.message}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          // Single message view
          <div className="max-w-2xl mx-auto">
            {(() => {
              const gradients = [
                'from-pink-400 to-rose-600',
                'from-purple-400 to-indigo-600',
                'from-blue-400 to-cyan-600',
                'from-green-400 to-emerald-600',
                'from-orange-400 to-red-600',
                'from-teal-400 to-blue-600'
              ]
              const currentGradient = gradients[currentMessage % gradients.length]
              const currentMsg = messages[currentMessage]
              
              return (
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 animate-scale-in">
                  <div className={`h-2 bg-gradient-to-r ${currentGradient}`}></div>
                  <div className="p-8 md:p-12">
                    <div className="flex items-center gap-4 mb-8">
                      <div className={`p-4 bg-gradient-to-br ${currentGradient} rounded-xl shadow-lg`}>
                        <User className="text-white w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">{currentMsg.author}</h3>
                        <p className="text-gray-500">
                          {new Date(currentMsg.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-xl leading-relaxed mb-8">
                      {currentMsg.message}
                    </p>
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 rounded-full">
                        <Heart className="text-pink-500 w-4 h-4" fill="currentColor" />
                        <span className="text-sm text-pink-700 font-medium">
                          Message {currentMessage + 1} of {messages.length}
                        </span>
                        <Heart className="text-pink-500 w-4 h-4" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 max-w-xl mx-auto">
          <Heart className="text-red-500 mx-auto mb-3 w-8 h-8" fill="currentColor" />
          <p className="text-gray-600 font-medium">
            Every word written with love, every message crafted for you
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Happy Birthday, Beautiful! 🎂✨
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scale-in {
          from { transform: scale(0.9) translateY(20px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-scale-in { animation: scale-in 0.6s ease-out; }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      `}</style>
    </div>
  )
}