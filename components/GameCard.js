'use client'
import React, { memo } from 'react'
import { Play, Trophy } from 'lucide-react'

const GameCard = memo(function GameCard({ 
  game, 
  index, 
  onGameSelect, 
  gameStats 
}) {
  const IconComponent = game.icon
  
  // Get high score for this game
  const getHighScore = () => {
    switch (game.id) {
      case 'reflex-game':
        return gameStats.quickHearts
      case 'memory-match':
        return gameStats.memoryMatch
      case 'hearts-distance':
        return gameStats.heartsDistance
      default:
        return 0
    }
  }

  const highScore = getHighScore()

  return (
    <div
      className="group cursor-pointer animate-slide-up-smooth"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={() => onGameSelect(game.id)}
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-elegant overflow-hidden hover:shadow-floating border border-white/20 transform transition-all duration-300 ease-out group-hover:scale-[1.02] group-hover:-translate-y-1">
        {/* Icon Header */}
        <div className={`h-24 bg-gradient-to-br ${game.gradient} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative h-full flex items-center justify-center">
            <IconComponent size={40} className="text-white drop-shadow-lg" />
          </div>
          <div className="absolute top-4 right-4">
            <Play className="text-white/70 w-6 h-6" />
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
            {game.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {game.description}
          </p>
          
          {/* High Score Display */}
          {highScore > 0 && (
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex items-center text-xs text-gray-500">
                <Trophy size={14} className="mr-1 text-yellow-500" />
                Best: {highScore}
              </div>
              <div className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                Played
              </div>
            </div>
          )}
          
          {highScore === 0 && (
            <div className="pt-3 border-t border-gray-200">
              <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full inline-flex items-center">
                <Play size={10} className="mr-1" />
                Try me!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

export default GameCard