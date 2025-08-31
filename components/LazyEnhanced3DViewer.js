'use client'
import React, { lazy, Suspense, memo } from 'react'
import { Loader2 } from 'lucide-react'

// Lazy load the heavy 3D component
const Enhanced3DViewer = lazy(() => 
  import('../app/birthday/memories/components/Enhanced3DViewer')
)

// Loading fallback component
const LoadingFallback = memo(function LoadingFallback() {
  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl overflow-hidden shadow-2xl border border-white/30 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-4" />
        <p className="text-purple-600 font-medium">Loading 3D Gallery...</p>
        <p className="text-sm text-gray-500 mt-1">Preparing your memories</p>
      </div>
    </div>
  )
})

// Lazy wrapper component
const LazyEnhanced3DViewer = memo(function LazyEnhanced3DViewer({ memories, onSelectMemory }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Enhanced3DViewer memories={memories} onSelectMemory={onSelectMemory} />
    </Suspense>
  )
})

export default LazyEnhanced3DViewer