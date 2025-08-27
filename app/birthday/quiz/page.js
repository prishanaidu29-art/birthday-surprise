'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../lib/supabase'
import { ArrowLeft, Brain, Heart, CheckCircle, XCircle, Trophy, RotateCcw, Sparkles, Star } from 'lucide-react'

export default function QuizPage() {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [quizStarted, setQuizStarted] = useState(false)

  // Check authentication
  useEffect(() => {
    const authenticated = sessionStorage.getItem('birthday_authenticated')
    if (authenticated !== 'true') {
      router.push('/')
    } else {
      setIsLoaded(true)
    }
  }, [router])

  // Quiz questions - these could also come from database in the future
  const questions = [
    {
      id: 1,
      question: "What's my favorite color?",
      options: ["Purple", "Pink", "Blue", "Green"],
      correct: 0,
      explanation: "Purple has always been my favorite! It's the color of creativity and magic. ✨"
    },
    {
      id: 2,
      question: "What's my biggest dream?",
      options: ["Travel the world", "Start a family", "Write a book", "All of the above"],
      correct: 3,
      explanation: "I want it all - adventures around the world, a beautiful family, and sharing our story! 💫"
    },
    {
      id: 3,
      question: "What makes me laugh the most?",
      options: ["Dad jokes", "Funny movies", "Your silly faces", "Cat videos"],
      correct: 2,
      explanation: "Your silly faces always crack me up! You have this way of making me smile even on tough days. 😄"
    },
    {
      id: 4,
      question: "What's my love language?",
      options: ["Physical touch", "Words of affirmation", "Quality time", "All of them"],
      correct: 3,
      explanation: "I love all the ways you show me love - your hugs, sweet words, and just being together! ❤️"
    },
    {
      id: 5,
      question: "What's my favorite way to spend a Sunday?",
      options: ["Sleeping in late", "Brunch and walks", "Movie marathons", "Cooking together"],
      correct: 1,
      explanation: "Brunch dates followed by long walks talking about everything and nothing - perfect Sunday! 🥐"
    },
    {
      id: 6,
      question: "What am I most grateful for?",
      options: ["My family", "My health", "Finding you", "My dreams coming true"],
      correct: 2,
      explanation: "Finding you changed everything. You're my greatest blessing and my favorite person. 💕"
    }
  ]

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex
    })
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      finishQuiz()
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const finishQuiz = async () => {
    // Calculate score
    let correctAnswers = 0
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct) {
        correctAnswers++
      }
    })
    
    setScore(correctAnswers)
    setShowResults(true)

    // Save to database
    try {
      await supabase.from('quiz_attempts').insert({
        score: correctAnswers,
        total: questions.length,
        answers: selectedAnswers
      })
    } catch (error) {
      console.error('Error saving quiz result:', error)
    }
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setShowResults(false)
    setScore(0)
    setQuizStarted(false)
  }

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100
    if (percentage === 100) return "Perfect! You know me so well! 😍"
    if (percentage >= 80) return "Amazing! You really pay attention to me! 🥰"
    if (percentage >= 60) return "Pretty good! We're getting to know each other better! 😊"
    if (percentage >= 40) return "Not bad! There's still more to discover about me! 😉"
    return "We have so much more to learn about each other! 💕"
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-purple-600">Loading your quiz...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-pink-300 opacity-60 animate-bounce">
          <Heart size={20} fill="currentColor" />
        </div>
        <div className="absolute top-1/3 right-20 text-purple-400 opacity-50">
          <Sparkles size={25} className="animate-spin-slow" />
        </div>
        <div className="absolute bottom-20 left-1/4 text-blue-300 opacity-60">
          <Brain size={18} className="animate-pulse" />
        </div>
        <div className="absolute top-1/2 right-1/4 text-pink-400 opacity-40">
          <Star size={15} fill="currentColor" className="animate-bounce" />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
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
              <Brain className="text-purple-500 w-8 h-8 mr-3" />
              <Heart className="text-pink-500 w-6 h-6" fill="currentColor" />
              <Brain className="text-purple-500 w-8 h-8 ml-3" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                How Well Do You Know Me?
              </span>
            </h1>
            <p className="text-lg text-gray-700">
              A fun quiz to test your knowledge about me! 🧠💕
            </p>
          </div>
        </div>

        {!quizStarted ? (
          // Quiz intro
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 text-center animate-scale-in">
              <Trophy className="text-yellow-500 w-16 h-16 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready for the Challenge?</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                I've prepared {questions.length} questions about myself. Let's see how much you've been paying attention! 
                Each question has one correct answer, and I'll share little secrets about myself along the way.
              </p>
              <div className="bg-purple-50 rounded-2xl p-6 mb-8">
                <h3 className="font-semibold text-purple-800 mb-2">Quiz Rules:</h3>
                <ul className="text-purple-700 text-sm space-y-1">
                  <li>• {questions.length} multiple choice questions</li>
                  <li>• Take your time - no rush!</li>
                  <li>• You can go back and change answers</li>
                  <li>• I'll explain each answer at the end</li>
                </ul>
              </div>
              <button
                onClick={() => setQuizStarted(true)}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-1 text-lg"
              >
                Start the Quiz! 🚀
              </button>
            </div>
          </div>
        ) : !showResults ? (
          // Quiz questions
          <div className="max-w-3xl mx-auto">
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-purple-600">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 animate-fade-in">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
                {questions[currentQuestion].question}
              </h2>

              <div className="space-y-4 mb-8">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(currentQuestion, index)}
                    className={`w-full p-4 text-left rounded-2xl border-2 transition-all transform hover:scale-[1.02] ${
                      selectedAnswers[currentQuestion] === index
                        ? 'border-purple-500 bg-purple-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-25'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                        selectedAnswers[currentQuestion] === index
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedAnswers[currentQuestion] === index && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className={`font-medium ${
                        selectedAnswers[currentQuestion] === index
                          ? 'text-purple-700'
                          : 'text-gray-700'
                      }`}>
                        {option}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between">
                <button
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                  className="px-6 py-3 bg-gray-200 text-gray-600 rounded-xl hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={nextQuestion}
                  disabled={selectedAnswers[currentQuestion] === undefined}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transform transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Results
          <div className="max-w-4xl mx-auto">
            {/* Score card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 text-center mb-8 animate-scale-in">
              <Trophy className={`w-16 h-16 mx-auto mb-6 ${
                score === questions.length ? 'text-yellow-500' : 
                score >= questions.length * 0.8 ? 'text-blue-500' : 
                score >= questions.length * 0.6 ? 'text-green-500' : 'text-purple-500'
              }`} />
              
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Quiz Complete! 🎉</h2>
              
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-6 mb-6">
                <div className="text-4xl font-bold mb-2">{score}/{questions.length}</div>
                <div className="text-lg opacity-90">
                  {Math.round((score / questions.length) * 100)}% Correct
                </div>
              </div>
              
              <p className="text-xl text-gray-700 mb-8">{getScoreMessage()}</p>
              
              <button
                onClick={restartQuiz}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-1"
              >
                <RotateCcw className="inline w-5 h-5 mr-2" />
                Take Quiz Again
              </button>
            </div>

            {/* Answer explanations */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">Let me explain my answers! 💭</h3>
              
              {questions.map((question, index) => (
                <div key={question.id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 animate-fade-in">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      selectedAnswers[index] === question.correct
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}>
                      {selectedAnswers[index] === question.correct ? (
                        <CheckCircle size={20} />
                      ) : (
                        <XCircle size={20} />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-2">{question.question}</h4>
                      <div className="mb-3">
                        <span className="text-sm text-gray-600">Correct answer: </span>
                        <span className="font-semibold text-green-600">
                          {question.options[question.correct]}
                        </span>
                        {selectedAnswers[index] !== question.correct && (
                          <>
                            <br />
                            <span className="text-sm text-gray-600">Your answer: </span>
                            <span className="font-semibold text-red-600">
                              {question.options[selectedAnswers[index]]}
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-gray-700 italic">{question.explanation}</p>
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
            Every question reveals a little more of my heart
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Thanks for taking the time to know me better! 💕
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-scale-in { animation: scale-in 0.4s ease-out; }
      `}</style>
    </div>
  )
}