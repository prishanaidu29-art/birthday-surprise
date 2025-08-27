'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../lib/supabase'
import { ArrowLeft, Camera, Heart, Calendar, Image, Grid, List, Sparkles, MapPin } from 'lucide-react'

export default function MemoriesPage() {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [memories, setMemories] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'timeline'
  const [selectedMemory, setSelectedMemory] = useState(null)

  // Check authentication
  useEffect(() => {
    const authenticated = sessionStorage.getItem('birthday_authenticated')
    if (authenticated !== 'true') {
      router.push('/')
    } else {
      setIsLoaded(true)
      fetchMemories()
    }
  }, [router])

  // Fetch memories from Supabase
  const fetchMemories = async () => {
    try {
      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .order('date_taken', { ascending: false })

      if (error) {
        console.error('Error fetching memories:', error)
        setMemories(getDefaultMemories())
      } else {
        setMemories(data || getDefaultMemories())
      }
    } catch (err) {
      console.error('Error:', err)
      setMemories(getDefaultMemories())
    } finally {
      setLoading(false)
    }
  }

  // Default fallback memories
  const getDefaultMemories = () => [
    {
      id: '1',
      title: 'Our First Date',
      description: 'The day everything changed. Coffee, laughter, and the beginning of our beautiful story.',
      photo_url: null,
      date_taken: '2024-03-09',
      order_index: 1
    },
    {
      id: '2',
      title: 'Sunset at the Beach',
      description: 'Walking hand in hand as the sun painted the sky in our favorite colors.',
      photo_url: null,
      date_taken: '2024-04-15',
      order_index: 2
    },
    {
      id: '3',
      title: 'Cooking Together',
      description: 'Making a mess in the kitchen but creating perfect memories.',
      photo_url: null,
      date_taken: '2024-05-20',
      order_index: 3
    }
  ]

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-purple-600">Loading your memories...</div>
        </div>
      </div>
    )
  }

  if (memories.length === 0) {
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
            <Camera className="text-purple-300 w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No memories yet</h2>
            <p className="text-gray-500">Memories will appear here when they're added to the database.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-pink-300 opacity-60 animate-float-slow">
          <Heart size={25} fill="currentColor" />
        </div>
        <div className="absolute top-1/3 right-20 text-purple-400 opacity-50">
          <Sparkles size={20} className="animate-spin-slow" />
        </div>
        <div className="absolute bottom-20 left-1/4 text-blue-300 opacity-60">
          <Camera size={22} className="animate-pulse" />
        </div>
        <div className="absolute top-1/2 right-1/4 text-pink-400 opacity-40">
          <Heart size={18} fill="currentColor" className="animate-bounce" />
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
              <Camera className="text-purple-500 w-8 h-8 mr-3" />
              <Heart className="text-pink-500 w-6 h-6" fill="currentColor" />
              <Camera className="text-purple-500 w-8 h-8 ml-3" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Our Beautiful Memories
              </span>
            </h1>
            <p className="text-lg text-gray-700">
              Every moment captured with love 📸
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-full transition-all ${
                viewMode === 'grid'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-purple-600 hover:bg-purple-100'
              }`}
            >
              <Grid size={18} className="inline mr-2" />
              Grid
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-4 py-2 rounded-full transition-all ${
                viewMode === 'timeline'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-purple-600 hover:bg-purple-100'
              }`}
            >
              <List size={18} className="inline mr-2" />
              Timeline
            </button>
          </div>
        </div>

        {/* Memories Display */}
        {viewMode === 'grid' ? (
          // Grid view
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {memories.map((memory, index) => (
              <div
                key={memory.id}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-[1.02] animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setSelectedMemory(memory)}
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
                  {/* Photo placeholder */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-purple-200 to-pink-200 relative overflow-hidden">
                    {memory.photo_url ? (
                      <img 
                        src={memory.photo_url} 
                        alt={memory.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="text-purple-400 w-16 h-16 opacity-50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                        {memory.title}
                      </h3>
                      {memory.date_taken && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={14} className="mr-1" />
                          {new Date(memory.date_taken).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {memory.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Timeline view
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-0.5 h-full w-1 bg-gradient-to-b from-purple-300 to-pink-300"></div>
              
              {memories.map((memory, index) => (
                <div
                  key={memory.id}
                  className={`relative mb-12 animate-slide-up ${
                    index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'
                  }`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 top-6 transform -translate-x-1/2 w-4 h-4 bg-purple-500 rounded-full border-4 border-white shadow-lg z-10"></div>
                  
                  {/* Content card */}
                  <div 
                    className={`inline-block w-full md:w-2/5 cursor-pointer group ${
                      index % 2 === 0 ? 'md:ml-0' : 'md:ml-auto'
                    }`}
                    onClick={() => setSelectedMemory(memory)}
                  >
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden group-hover:shadow-2xl transform transition-all duration-300 group-hover:scale-[1.02]">
                      {/* Photo */}
                      <div className="aspect-[16/9] bg-gradient-to-br from-purple-200 to-pink-200 relative overflow-hidden">
                        {memory.photo_url ? (
                          <img 
                            src={memory.photo_url} 
                            alt={memory.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Image className="text-purple-400 w-12 h-12 opacity-50" />
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                            {memory.title}
                          </h3>
                          {memory.date_taken && (
                            <div className="flex items-center text-sm text-purple-600">
                              <Calendar size={14} className="mr-1" />
                              {new Date(memory.date_taken).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {memory.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 max-w-xl mx-auto">
          <Heart className="text-red-500 mx-auto mb-3 w-8 h-8" fill="currentColor" />
          <p className="text-gray-600 font-medium">
            Every photo tells our story, every memory holds our love
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Creating beautiful moments, one memory at a time 📷✨
          </p>
        </div>
      </div>

      {/* Memory Detail Modal */}
      {selectedMemory && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMemory(null)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Photo */}
            <div className="aspect-[16/9] bg-gradient-to-br from-purple-200 to-pink-200 relative overflow-hidden rounded-t-3xl">
              {selectedMemory.photo_url ? (
                <img 
                  src={selectedMemory.photo_url} 
                  alt={selectedMemory.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Image className="text-purple-400 w-20 h-20 opacity-50" />
                </div>
              )}
              <button
                onClick={() => setSelectedMemory(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* Content */}
            <div className="p-8">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{selectedMemory.title}</h2>
                {selectedMemory.date_taken && (
                  <div className="flex items-center text-purple-600">
                    <Calendar size={16} className="mr-2" />
                    {new Date(selectedMemory.date_taken).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                )}
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                {selectedMemory.description}
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 10s linear infinite; }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-slide-up { animation: slide-up 0.8s ease-out; }
        .animate-scale-in { animation: scale-in 0.4s ease-out; }
      `}</style>
    </div>
  )
}