'use client'
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Heart, Play, Trophy, RotateCcw, Sparkles, Gamepad2, Star, Crown } from 'lucide-react'
import EasterEgg from '../../../components/EasterEgg'

export const dynamic = 'force-dynamic'

export default function GamePage() {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [showLoadingScreen, setShowLoadingScreen] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [showVictoryModal, setShowVictoryModal] = useState(false)
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 50 })
  const [hearts, setHearts] = useState([])
  const [collectedHearts, setCollectedHearts] = useState([])
  const [obstacles, setObstacles] = useState([])
  const [monster, setMonster] = useState({ x: 10, y: 10 })
  const [timeLeft, setTimeLeft] = useState(60)
  const [score, setScore] = useState(0)
  const gameAreaRef = useRef(null)
  const animationFrameRef = useRef(null)
  const keysPressed = useRef({})
  const playerPositionRef = useRef({ x: 50, y: 50 })
  const monsterRef = useRef({ x: 10, y: 10 })
  const lastFrameTime = useRef(0)
  const targetFPS = 60
  const frameInterval = 1000 / targetFPS

  // Generate hearts and obstacles
  const generateGameElements = useCallback(() => {
    // Generate 12 hearts
    const newHearts = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10, // 10% to 90% of container
      y: Math.random() * 80 + 10,
      collected: false,
      pulse: Math.random() * Math.PI * 2 // For pulsing animation
    }))

    // Generate 6 obstacles (representing LDR challenges)
    const newObstacles = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 70 + 15,
      y: Math.random() * 70 + 15,
      width: 8,
      height: 8,
      rotation: Math.random() * 360
    }))

    setHearts(newHearts)
    setObstacles(newObstacles)
  }, [])

  // Check authentication with smooth loading
  useEffect(() => {
    const authenticated = sessionStorage.getItem('birthday_authenticated')
    if (authenticated !== 'true') {
      router.push('/')
      return
    }

    setShowLoadingScreen(true)
    
    // Show enhanced loading screen for 1.5 seconds
    setTimeout(() => {
      setShowLoadingScreen(false)
      
      // Then proceed with detailed loading
      const loadingSteps = [
        { progress: 20, message: 'Checking authentication...' },
        { progress: 40, message: 'Loading game assets...' },
        { progress: 60, message: 'Generating hearts...' },
        { progress: 80, message: 'Setting up obstacles...' },
        { progress: 100, message: 'Ready to play!' }
      ]

      let stepIndex = 0
      const loadingInterval = setInterval(() => {
        if (stepIndex < loadingSteps.length) {
          setLoadingProgress(loadingSteps[stepIndex].progress)
          stepIndex++
        } else {
          clearInterval(loadingInterval)
          generateGameElements()
          setTimeout(() => setIsLoaded(true), 300)
        }
      }, 200)
    }, 1500)
  }, [router, generateGameElements])

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key.toLowerCase()] = true
      keysPressed.current[e.key] = true
    }

    const handleKeyUp = (e) => {
      keysPressed.current[e.key.toLowerCase()] = false
      keysPressed.current[e.key] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Game timer
  useEffect(() => {
    if (!gameStarted || gameWon || gameOver) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true)
          setGameStarted(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameStarted, gameWon, gameOver])

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameWon || gameOver) return

    const gameLoop = (currentTime) => {
      // Frame rate limiting to 60 FPS
      if (currentTime - lastFrameTime.current < frameInterval) {
        animationFrameRef.current = requestAnimationFrame(gameLoop)
        return
      }
      lastFrameTime.current = currentTime

      // Smooth movement using current ref values
      let newX = playerPositionRef.current.x
      let newY = playerPositionRef.current.y
      const speed = 0.8 // Reduced speed for smoother movement

      // Check multiple keys for diagonal movement
      if (keysPressed.current['w'] || keysPressed.current['ArrowUp']) {
        newY = Math.max(2, newY - speed)
      }
      if (keysPressed.current['s'] || keysPressed.current['ArrowDown']) {
        newY = Math.min(96, newY + speed)
      }
      if (keysPressed.current['a'] || keysPressed.current['ArrowLeft']) {
        newX = Math.max(2, newX - speed)
      }
      if (keysPressed.current['d'] || keysPressed.current['ArrowRight']) {
        newX = Math.min(96, newX + speed)
      }

      // Check obstacle collisions using distance-squared for performance
      let hitObstacle = false
      obstacles.forEach(obstacle => {
        const distanceSquared = Math.pow(newX - obstacle.x, 2) + Math.pow(newY - obstacle.y, 2)
        if (distanceSquared < 36) { // 6^2 = 36
          hitObstacle = true
        }
      })

      // Update player position
      if (!hitObstacle) {
        const newPosition = { x: newX, y: newY }
        playerPositionRef.current = newPosition
        setPlayerPosition(newPosition)
      }
      
      // Move monster towards player using current positions directly
      const deltaX = playerPositionRef.current.x - monsterRef.current.x
      const deltaY = playerPositionRef.current.y - monsterRef.current.y
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      
      if (distance > 0) {
        const monsterSpeed = 0.4 // Slower for better gameplay
        const moveX = (deltaX / distance) * monsterSpeed
        const moveY = (deltaY / distance) * monsterSpeed
        
        const newMonsterPos = {
          x: Math.max(2, Math.min(96, monsterRef.current.x + moveX)),
          y: Math.max(2, Math.min(96, monsterRef.current.y + moveY))
        }
        monsterRef.current = newMonsterPos
        setMonster(newMonsterPos)
      }

      // Check heart collisions and update pulse animation in single state update
      setHearts(prevHearts => {
        let newCollectedHearts = []
        let scoreIncrease = 0
        
        const updatedHearts = prevHearts.map(heart => {
          // Update pulse animation for all hearts
          const updatedHeart = { ...heart, pulse: heart.pulse + 0.1 }
          
          // Check collision only for uncollected hearts
          if (!heart.collected) {
            // Use distance-squared for performance (avoid Math.sqrt)
            const distanceSquared = Math.pow(newX - heart.x, 2) + Math.pow(newY - heart.y, 2)
            
            if (distanceSquared < 16) { // 4^2 = 16
              newCollectedHearts.push(heart.id)
              scoreIncrease += 100
              return { ...updatedHeart, collected: true }
            }
          }
          
          return updatedHeart
        })
        
        // Batch state updates outside of setHearts
        if (newCollectedHearts.length > 0) {
          setCollectedHearts(prev => [...prev, ...newCollectedHearts])
          setScore(prev => prev + scoreIncrease)
        }
        
        // Check for victory condition
        const collectedCount = updatedHearts.filter(h => h.collected).length
        const totalHearts = updatedHearts.length
        
        if (collectedCount >= totalHearts && gameStarted && collectedCount > 0) {
          setGameWon(true)
          setGameStarted(false)
          setTimeout(() => setShowVictoryModal(true), 500)
        }
        
        return updatedHearts
      })

      animationFrameRef.current = requestAnimationFrame(gameLoop)
    }

    // Start the game loop with initial timestamp
    animationFrameRef.current = requestAnimationFrame(gameLoop)
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [gameStarted, gameWon, gameOver])

  // Separate collision detection effect using refs
  useEffect(() => {
    if (!gameStarted || gameWon || gameOver) return

    const checkCollision = () => {
      const collisionDistanceSquared = 
        Math.pow(playerPositionRef.current.x - monsterRef.current.x, 2) + 
        Math.pow(playerPositionRef.current.y - monsterRef.current.y, 2)
      
      // Only trigger if sprites are ACTUALLY overlapping visually (3^2 = 9)
      if (collisionDistanceSquared < 9) {
        setGameOver(true)
        setGameStarted(false)
      }
    }

    const collisionTimer = setInterval(checkCollision, 50) // Check every 50ms
    return () => clearInterval(collisionTimer)
  }, [gameStarted, gameWon, gameOver])

  // Check for victory - win with all 12 hearts collected
  useEffect(() => {
    const collectedCount = hearts.filter(heart => heart.collected).length
    if (hearts.length > 0 && collectedCount >= hearts.length && gameStarted) {
      setGameWon(true)
      setGameStarted(false)
      setTimeout(() => setShowVictoryModal(true), 1000)
    }
  }, [hearts, gameStarted])

  const startGame = useCallback(() => {
    setGameStarted(true)
    setGameWon(false)
    setGameOver(false)
    setCollectedHearts([])
    setScore(0)
    setTimeLeft(60)
    const playerPos = { x: 50, y: 50 }
    const monsterPos = { x: 10, y: 10 }
    setPlayerPosition(playerPos)
    setMonster(monsterPos)
    playerPositionRef.current = playerPos
    monsterRef.current = monsterPos
    setShowVictoryModal(false)
    generateGameElements()
  }, [generateGameElements])

  // Memoize game UI components to prevent unnecessary re-renders
  const gameUI = useMemo(() => (
    gameStarted && (
      <div className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="flex justify-center items-center gap-8 mt-16">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg">
            <div className="flex items-center gap-2">
              <Heart className="text-yellow-500 w-5 h-5" fill="currentColor" />
              <span className="font-bold text-gray-800">
                {collectedHearts.length} Hearts
              </span>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg">
            <div className="flex items-center gap-2">
              <Trophy className="text-yellow-500 w-5 h-5" />
              <span className="font-bold text-gray-800">{score}</span>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-800">⏰ {timeLeft}s</span>
            </div>
          </div>
        </div>
      </div>
    )
  ), [gameStarted, collectedHearts.length, score, timeLeft])

  // Memoize visible hearts to prevent unnecessary re-renders
  const visibleHearts = useMemo(() => 
    hearts.filter(heart => !heart.collected), 
    [hearts]
  )

  const resetGame = () => {
    setGameStarted(false)
    setGameWon(false)
    setGameOver(false)
    setCollectedHearts([])
    setScore(0)
    setTimeLeft(60)
    const playerPos = { x: 50, y: 50 }
    const monsterPos = { x: 10, y: 10 }
    setPlayerPosition(playerPos)
    setMonster(monsterPos)
    playerPositionRef.current = playerPos
    monsterRef.current = monsterPos
    setShowVictoryModal(false)
    generateGameElements()
  }

  // Enhanced loading screen with game theme
  if (showLoadingScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 overflow-hidden relative">
        <div className="text-center z-10 max-w-lg mx-auto px-6">
          <div className="relative mb-8">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full animate-game-pulse"></div>
              <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-pink-500 animate-game-bounce" fill="currentColor" />
              </div>
            </div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-4">
                <span className="bg-gradient-to-r from-pink-500 via-purple-600 to-blue-500 bg-clip-text text-transparent animate-game-glow">
                  Starting Heart Quest 💕
                </span>
              </h1>
              <p className="text-pink-600 text-lg animate-gentle-pulse mb-4">
                Get ready for our love adventure...
              </p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-lg">
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full animate-game-progress"></div>
              </div>
              <p className="text-xs text-gray-500">Loading your romantic adventure!</p>
            </div>
          </div>
        </div>
        <style jsx>{`
          @keyframes game-pulse {
            0%, 100% { transform: scale(1); box-shadow: 0 0 25px rgba(236, 72, 153, 0.4); }
            50% { transform: scale(1.1); box-shadow: 0 0 40px rgba(236, 72, 153, 0.8); }
          }
          @keyframes game-bounce { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
          @keyframes game-glow { 0%, 100% { filter: drop-shadow(0 0 10px rgba(236, 72, 153, 0.3)); } 50% { filter: drop-shadow(0 0 20px rgba(236, 72, 153, 0.6)); } }
          @keyframes game-progress { 0% { width: 0%; } 100% { width: 100%; } }
          @keyframes gentle-pulse { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
          .animate-game-pulse { animation: game-pulse 2s ease-in-out infinite; }
          .animate-game-bounce { animation: game-bounce 1.5s ease-in-out infinite; }
          .animate-game-glow { animation: game-glow 3s ease-in-out infinite; }
          .animate-game-progress { animation: game-progress 1.5s ease-out; }
          .animate-gentle-pulse { animation: gentle-pulse 3s ease-in-out infinite; }
        `}</style>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
        <div className="text-center max-w-md w-full p-8">
          {/* Animated game elements */}
          <div className="mb-8 relative">
            <div className="flex justify-center items-center gap-4 mb-6">
              <Heart className="text-pink-400 w-8 h-8 animate-bounce" fill="currentColor" style={{ willChange: 'transform' }} />
              <Gamepad2 className="text-purple-500 w-10 h-10 animate-pulse" style={{ willChange: 'opacity, transform' }} />
              <Sparkles className="text-yellow-400 w-8 h-8 animate-bounce" style={{ animationDelay: '0.2s', willChange: 'transform' }} />
            </div>
            
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Hearts Across Distance
            </h2>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="bg-white/30 rounded-full h-3 overflow-hidden backdrop-blur-sm">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${loadingProgress}%`, willChange: 'width' }}
              />
            </div>
            <div className="mt-2 text-purple-600 font-medium">
              {loadingProgress}% Complete
            </div>
          </div>

          <div className="text-purple-600">
            {loadingProgress < 100 ? 'Preparing your love game...' : 'Ready to play!'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute animate-float-1" style={{top: '10%', left: '10%', willChange: 'transform'}}>
          <Star className="text-pink-300 opacity-60" size={20} />
        </div>
        <div className="absolute animate-float-2" style={{top: '20%', right: '15%', willChange: 'transform'}}>
          <Heart className="text-purple-300 opacity-50" size={16} fill="currentColor" />
        </div>
        <div className="absolute animate-float-3" style={{bottom: '20%', left: '20%', willChange: 'transform'}}>
          <Sparkles className="text-blue-300 opacity-40" size={18} />
        </div>
        <div className="absolute animate-float-1" style={{top: '60%', right: '25%', willChange: 'transform'}}>
          <Star className="text-yellow-300 opacity-50" size={14} />
        </div>
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4">
        <Link 
          href="/birthday" 
          className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors px-4 py-3 rounded-xl hover:bg-white/80 font-medium backdrop-blur-sm bg-white/70 shadow-lg"
        >
          <ArrowLeft size={20} className="mr-3" />
          Back to Birthday Hub
        </Link>
      </div>

      {/* Game UI */}
      {gameUI}

      {/* Game Area */}
      {gameStarted ? (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div 
            ref={gameAreaRef}
            className="relative w-full max-w-4xl aspect-square bg-gradient-to-br from-purple-200/50 to-pink-200/50 rounded-3xl border-4 border-white/30 shadow-2xl overflow-hidden"
            style={{ height: '80vh', maxHeight: '600px' }}
          >
            {/* Player */}
            <div
              className="absolute w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full shadow-lg transition-all duration-100 ease-out z-20 animate-pulse-slow"
              style={{
                left: `${playerPosition.x}%`,
                top: `${playerPosition.y}%`,
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 20px rgba(236, 72, 153, 0.8)',
                willChange: 'transform'
              }}
            >
              {/* Player initial "J" for Jerzen */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-sm">J</span>
              </div>
              <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
            </div>

            {/* Hearts */}
            {visibleHearts.map(heart => (
              <div
                key={heart.id}
                className="absolute z-10 transition-all duration-300"
                style={{
                  left: `${heart.x}%`,
                  top: `${heart.y}%`,
                  transform: 'translate(-50%, -50%)',
                  willChange: 'transform'
                }}
              >
                <Heart 
                  className="text-yellow-500 drop-shadow-lg animate-bounce-slow" 
                  size={24 + Math.sin(heart.pulse) * 4}
                  fill="currentColor"
                  style={{
                    filter: 'drop-shadow(0 0 10px rgba(234, 179, 8, 0.6))'
                  }}
                />
              </div>
            ))}

            {/* Obstacles */}
            {obstacles.map(obstacle => (
              <div
                key={obstacle.id}
                className="absolute bg-gradient-to-br from-red-400 to-red-600 rounded-lg z-10 animate-spin-slow"
                style={{
                  left: `${obstacle.x}%`,
                  top: `${obstacle.y}%`,
                  width: `${obstacle.width}%`,
                  height: `${obstacle.height}%`,
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 0 15px rgba(239, 68, 68, 0.5)',
                  willChange: 'transform'
                }}
              />
            ))}

            {/* Monster */}
            <div
              className="absolute z-15 transition-all duration-100 ease-out"
              style={{
                left: `${monster.x}%`,
                top: `${monster.y}%`,
                transform: 'translate(-50%, -50%)',
                willChange: 'transform'
              }}
            >
              <div className="relative">
                {/* Monster body */}
                <div 
                  className="w-12 h-12 bg-gradient-to-br from-red-800 to-black rounded-full shadow-lg animate-pulse-slow"
                  style={{
                    boxShadow: '0 0 25px rgba(153, 27, 27, 0.9)'
                  }}
                >
                  {/* Angry monster eyes - slanted and glowing */}
                  <div className="absolute top-2 left-1.5 w-3 h-2 bg-red-400 transform -rotate-12 animate-ping"></div>
                  <div className="absolute top-2 right-1.5 w-3 h-2 bg-red-400 transform rotate-12 animate-ping"></div>
                  
                  {/* Angry eyebrows */}
                  <div className="absolute top-1 left-2 w-2 h-0.5 bg-black transform -rotate-45"></div>
                  <div className="absolute top-1 right-2 w-2 h-0.5 bg-black transform rotate-45"></div>
                  
                  {/* Monster mouth - angry grimace with sharp teeth */}
                  <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2">
                    <div className="w-6 h-1.5 bg-black rounded-sm"></div>
                    {/* Sharp teeth */}
                    <div className="absolute top-0 left-1 w-0.5 h-1.5 bg-white"></div>
                    <div className="absolute top-0 left-2 w-0.5 h-1.5 bg-white"></div>
                    <div className="absolute top-0 right-2 w-0.5 h-1.5 bg-white"></div>
                    <div className="absolute top-0 right-1 w-0.5 h-1.5 bg-white"></div>
                  </div>
                </div>
                
                {/* Monster aura effect */}
                <div className="absolute inset-0 bg-red-600/30 rounded-full animate-ping scale-150"></div>
                
                {/* Trailing effect */}
                <div 
                  className="absolute top-1/2 left-1/2 w-8 h-8 bg-red-700/20 rounded-full animate-pulse"
                  style={{
                    transform: 'translate(-50%, -50%) scale(1.5)',
                    animationDelay: '0.2s'
                  }}
                ></div>
              </div>
            </div>

            {/* Game Instructions */}
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 inline-block shadow-lg">
                <p className="text-sm font-medium text-gray-700">
                  Use WASD or Arrow keys • Collect all hearts • Avoid obstacles & the chasing monster!
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Game start/end screen
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 sm:p-12 text-center">
              <div className="inline-flex items-center justify-center mb-6">
                <Gamepad2 className="text-purple-500 w-12 h-12 mr-3" />
                <Heart className="text-yellow-500 w-8 h-8" fill="currentColor" />
                <Sparkles className="text-yellow-500 w-10 h-10 ml-3" />
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  Hearts Across Distance
                </span>
              </h1>

              {gameOver && !gameWon && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <p className="text-red-700 font-semibold">
                    {timeLeft === 0 ? "Time's up!" : "The monster caught you!"} Try again, my love 💕
                  </p>
                  <p className="text-sm text-red-600 mt-1">You collected {collectedHearts.length} hearts</p>
                </div>
              )}
              
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Navigate through the game area and find all the floating hearts while avoiding the red obstacles 
                and a chasing monster! Each heart represents a reason why I love you, spanning across our distance! 💕
              </p>
              
              <div className="bg-purple-50 rounded-2xl p-6 mb-8">
                <h3 className="font-bold text-purple-800 mb-4">How to Play:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-purple-700">
                  <div className="flex items-center gap-2">
                    <span className="font-mono bg-purple-200 px-2 py-1 rounded">WASD</span>
                    <span>or Arrow Keys to move</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-yellow-500" fill="currentColor" />
                    <span>Collect all hearts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>Avoid red obstacles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-br from-red-800 to-black rounded-full"></div>
                    <span>Escape the angry monster</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>⏰</span>
                    <span>60 seconds time limit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span>Special surprise awaits!</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={startGame}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-1 text-lg"
                >
                  <Play className="inline w-6 h-6 mr-2" />
                  {gameOver ? 'Try Again' : 'Start Game'}
                </button>
                {(gameWon || gameOver || collectedHearts.length > 0) && (
                  <button
                    onClick={resetGame}
                    className="px-6 py-4 bg-gray-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-1"
                  >
                    <RotateCcw className="inline w-5 h-5 mr-2" />
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Victory Modal */}
      {showVictoryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 text-center animate-scale-in">
            <div className="mb-6">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-bounce" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Congratulations!</h2>
              <p className="text-gray-600 mb-6">
                You found and collected every single heart! Just like how you've captured my heart completely. 💕
              </p>
            </div>
            
            {/* Video message placeholder */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 mb-6">
              <Heart className="w-12 h-12 text-yellow-500 mx-auto mb-4 animate-pulse" fill="currentColor" />
              <p className="text-gray-700 italic text-lg leading-relaxed">
&quot;My dearest Jerzen, you&apos;ve just completed a journey to collect hearts, 
                just like how you&apos;ve traveled across distance to capture mine. Every heart in this game 
                represents a reason why I love you. Happy Birthday, my cutie ganda! 
                Even miles apart, my love for you knows no bounds. 💜&quot;
              </p>
              <div className="mt-4 p-4 bg-white/50 rounded-xl">
                <p className="text-sm text-gray-600">
                  🎥 <strong>Personal Video Message:</strong> [Record your special message here]
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowVictoryModal(false)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-1"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowVictoryModal(false)
                  resetGame()
                }}
                className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-1"
              >
                <RotateCcw className="inline w-4 h-4 mr-2" />
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-180deg); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(180deg); }
        }
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-float-1 { animation: float-1 8s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 6s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 10s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 4s linear infinite; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
      `}</style>

      {/* Hidden Easter Eggs */}
      <EasterEgg 
        id="egg-6"
        top="5%"
        right="15%"
        icon={Trophy}
        message="Victory awaits! 🏆"
        specialMessage="You're already a winner in my heart, no matter what!"
        size="small"
      />

      <EasterEgg 
        id="egg-7"
        bottom="8%"
        left="5%"
        icon={Crown}
        message="Royal treatment for my queen! 👑"
        specialMessage="You deserve to be treated like royalty every single day"
        size="medium"
      />
    </div>
  )
}