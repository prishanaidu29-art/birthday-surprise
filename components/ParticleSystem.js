'use client'
import React, { useEffect, useRef, useState, useCallback, memo } from 'react'
import { Heart, Sparkles, Star } from 'lucide-react'

const ParticleSystem = memo(function ParticleSystem() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState([])
  const [clickParticles, setClickParticles] = useState([])
  const intervalRef = useRef()
  const particleIdRef = useRef(0)

  // Track mouse movement with throttling
  useEffect(() => {
    let isMoving = false
    let throttleTimeout = null

    const handleMouseMove = (e) => {
      if (throttleTimeout) return
      
      throttleTimeout = setTimeout(() => {
        setMousePos({ x: e.clientX, y: e.clientY })
        isMoving = true
        throttleTimeout = null
      }, 16) // ~60fps throttling
    }

    const handleClick = (e) => {
      // Create click explosion with more variety
      const particleCount = Math.random() > 0.7 ? 12 : 8 // Sometimes bigger explosions
      const newClickParticles = Array.from({ length: particleCount }, (_, i) => {
        const angle = (i / particleCount) * Math.PI * 2
        const speed = Math.random() * 6 + 3
        
        return {
          id: `click-${particleIdRef.current++}`,
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          type: Math.random() > 0.6 ? 'heart' : Math.random() > 0.5 ? 'star' : 'sparkle',
          size: Math.random() * 16 + 8,
          rotation: 0
        }
      })

      setClickParticles(prev => [...prev, ...newClickParticles])
      
      // Add special effect for double-clicks
      setTimeout(() => {
        if (isMoving === false) { // If mouse hasn't moved, likely intentional click
          const bonusParticles = Array.from({ length: 6 }, () => ({
            id: `bonus-${particleIdRef.current++}`,
            x: e.clientX + (Math.random() - 0.5) * 100,
            y: e.clientY + (Math.random() - 0.5) * 100,
            vx: (Math.random() - 0.5) * 3,
            vy: Math.random() * -3 - 1,
            life: 1,
            type: 'heart',
            size: Math.random() * 12 + 6,
            rotation: Math.random() * 360
          }))
          setClickParticles(prev => [...prev, ...bonusParticles])
        }
        isMoving = false
      }, 100)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('click', handleClick, { passive: true })

    return () => {
      if (throttleTimeout) clearTimeout(throttleTimeout)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleClick)
    }
  }, [])

  // Create mouse trail particles with reduced frequency
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (mousePos.x > 0 && mousePos.y > 0) {
        const newParticle = {
          id: particleIdRef.current++,
          x: mousePos.x + (Math.random() - 0.5) * 20,
          y: mousePos.y + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2 - 1,
          life: 1,
          type: 'sparkle',
          size: Math.random() * 8 + 4
        }

        setParticles(prev => [...prev.slice(-10), newParticle]) // Reduced from 15 to 10
      }
    }, 100) // Reduced frequency from 50ms to 100ms

    return () => clearInterval(intervalRef.current)
  }, [mousePos])

  // Update particles with requestAnimationFrame for better performance
  useEffect(() => {
    let animationId
    let lastUpdate = Date.now()

    const updateParticles = () => {
      const now = Date.now()
      const deltaTime = (now - lastUpdate) / 1000 // Convert to seconds
      
      if (deltaTime >= 1/30) { // 30fps instead of 60fps
        setParticles(prev => 
          prev.map(p => ({
            ...p,
            x: p.x + p.vx * deltaTime * 60, // Normalize for framerate
            y: p.y + p.vy * deltaTime * 60,
            life: p.life - 0.02 * deltaTime * 60
          })).filter(p => p.life > 0)
        )

        setClickParticles(prev => 
          prev.map(p => ({
            ...p,
            x: p.x + p.vx * deltaTime * 60,
            y: p.y + p.vy * deltaTime * 60,
            vx: p.vx * Math.pow(0.98, deltaTime * 60),
            vy: p.vy * Math.pow(0.98, deltaTime * 60) + 0.1 * deltaTime * 60, // gravity
            life: p.life - 0.015 * deltaTime * 60
          })).filter(p => p.life > 0)
        )
        
        lastUpdate = now
      }

      animationId = requestAnimationFrame(updateParticles)
    }

    animationId = requestAnimationFrame(updateParticles)
    return () => cancelAnimationFrame(animationId)
  }, [])

  const renderParticle = useCallback((particle, index) => {
    const opacity = particle.life
    const transform = `translate(${particle.x}px, ${particle.y}px) scale(${opacity})`

    if (particle.type === 'heart') {
      return (
        <div
          key={particle.id}
          className="fixed pointer-events-none z-50"
          style={{
            transform,
            opacity,
            transition: 'none',
          }}
        >
          <Heart 
            size={particle.size} 
            className="text-pink-500" 
            fill="currentColor"
            style={{
              filter: `drop-shadow(0 0 ${particle.size/2}px rgba(236, 72, 153, 0.6))`
            }}
          />
        </div>
      )
    }

    if (particle.type === 'star') {
      return (
        <div
          key={particle.id}
          className="fixed pointer-events-none z-50"
          style={{
            transform: `${transform} rotate(${particle.life * 360}deg)`,
            opacity,
            transition: 'none',
          }}
        >
          <Star 
            size={particle.size} 
            className="text-yellow-400" 
            fill="currentColor"
            style={{
              filter: `drop-shadow(0 0 ${particle.size/2}px rgba(251, 191, 36, 0.6))`
            }}
          />
        </div>
      )
    }

    // Default sparkle
    return (
      <div
        key={particle.id}
        className="fixed pointer-events-none z-50"
        style={{
          transform,
          opacity,
          transition: 'none',
        }}
      >
        <Sparkles 
          size={particle.size} 
          className="text-purple-400" 
          style={{
            filter: `drop-shadow(0 0 ${particle.size/2}px rgba(147, 51, 234, 0.6))`
          }}
        />
      </div>
    )
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {/* Mouse trail particles */}
      {particles.map(renderParticle)}
      
      {/* Click explosion particles */}
      {clickParticles.map(renderParticle)}

      {/* Ambient floating hearts */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-ambient"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 30}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${8 + i * 2}s`
            }}
          >
            <Heart 
              size={12 + i * 2} 
              className="text-pink-300" 
              fill="currentColor"
            />
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes float-ambient {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg); 
            opacity: 0.3;
          }
          25% {
            transform: translateY(-15px) translateX(8px) rotate(3deg);
            opacity: 0.5;
          }
          50% { 
            transform: translateY(-20px) translateX(10px) rotate(5deg); 
            opacity: 0.7;
          }
          75% {
            transform: translateY(-10px) translateX(-5px) rotate(-3deg);
            opacity: 0.5;
          }
        }
        
        @keyframes particle-fade {
          0% { 
            opacity: 0; 
            transform: scale(0.8); 
          }
          20% { 
            opacity: 1; 
            transform: scale(1); 
          }
          80% { 
            opacity: 1; 
            transform: scale(1); 
          }
          100% { 
            opacity: 0; 
            transform: scale(0.8); 
          }
        }
        
        .animate-float-ambient {
          animation: float-ambient 8s ease-in-out infinite;
          will-change: transform, opacity;
        }
        
        .particle-smooth {
          animation: particle-fade 2s ease-in-out;
          will-change: transform, opacity;
        }
      `}</style>
    </div>
  )
})

export default ParticleSystem