"use client"

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Clock, 
  ArrowRight, 
  CheckCircle,
  AlertCircle,
  Loader2,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Play,
  Square
} from 'lucide-react'

interface InterviewSession {
  sessionId: string
  type: string
  currentQuestion: number
  totalQuestions: number
  question: string
  startTime: string
  questions?: any[]
}

export default function TechnicalInterviewPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [session, setSession] = useState<InterviewSession | null>(null)
  const [answer, setAnswer] = useState('')
  const [timeSpent, setTimeSpent] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  
  // Voice functionality states
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [speechSupported, setSpeechSupported] = useState(false)
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Allow anonymous interviews for testing
    // if (mounted && !loading && !user) {
    //   router.push('/auth/login')
    // }
  }, [user, loading, router, mounted])

  useEffect(() => {
    if (mounted) {
      initializeVoiceFeatures()
      startInterview()
    }
  }, [mounted])

  // Initialize voice features
  const initializeVoiceFeatures = () => {
    if (typeof window !== 'undefined') {
      // Check for speech synthesis support
      if ('speechSynthesis' in window) {
        synthRef.current = window.speechSynthesis
      }

      // Check for speech recognition support
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        setSpeechSupported(true)
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'en-US'

        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = ''
          let interimTranscript = ''

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript
            } else {
              interimTranscript += transcript
            }
          }

          if (finalTranscript) {
            setAnswer(prev => prev + ' ' + finalTranscript)
          }
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (startTime) {
      interval = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime.getTime()) / 1000))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [startTime])

  const startInterview = async () => {
    try {
      const response = await fetch('/api/interview/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'technical' }),
      })

      if (response.ok) {
        const data = await response.json()
        setSession(data)
        setStartTime(new Date())
        
        // Show message if session was resumed
        if (data.resumed) {
          console.log('Resumed existing interview session')
        }
      } else {
        const error = await response.json()
        
        // If there's an active session error, offer to clean up and restart
        if (error.error?.includes('active interview session')) {
          const shouldRestart = confirm('You have an active interview session. Would you like to start a new interview? (This will abandon the current session)')
          
          if (shouldRestart) {
            // Clean up existing sessions
            await fetch('/api/interview/cleanup', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              }
            })
            
            // Try starting again
            startInterview()
            return
          } else {
            router.push('/interview')
            return
          }
        }
        
        alert(error.error || 'Failed to start interview')
        router.push('/interview')
      }
    } catch (error) {
      console.error('Error starting interview:', error)
      alert('Failed to start interview')
      router.push('/interview')
    }
  }

  const submitAnswer = async () => {
    if (!session || !answer.trim()) {
      alert('Please provide an answer before continuing')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/interview/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: session.sessionId,
          questionIndex: session.currentQuestion,
          answer: answer.trim(),
          timeSpent,
          questions: session.questions,
          type: session.type
        }),
      })

      if (response.ok) {
        const data = await response.json()
        
        if (data.completed) {
          // Interview completed, redirect to results
          router.push(`/interview/results/${session.sessionId}`)
        } else {
          // Move to next question
          setSession({
            ...session,
            currentQuestion: data.nextQuestion.index,
            question: data.nextQuestion.question
          })
          setAnswer('')
          setStartTime(new Date())
          setTimeSpent(0)
        }
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to submit answer')
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
      alert('Failed to submit answer')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Voice functionality
  const speakQuestion = (text: string) => {
    if (synthRef.current && voiceEnabled) {
      // Stop any current speech
      synthRef.current.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8
      
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      
      synthRef.current.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  const startListening = () => {
    if (recognitionRef.current && speechSupported) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled)
    if (isSpeaking) {
      stopSpeaking()
    }
  }

  // Auto-speak question when it changes
  useEffect(() => {
    if (session?.question && voiceEnabled && mounted) {
      // Small delay to ensure UI is ready
      setTimeout(() => {
        speakQuestion(session.question)
      }, 500)
    }
  }, [session?.question, voiceEnabled, mounted])

  if (!mounted || loading || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
              <p className="text-lg text-muted-foreground">Starting your technical interview...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Allow anonymous interviews for testing
  // if (!user) {
  //   return null
  // }

  const progress = ((session.currentQuestion + 1) / session.totalQuestions) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Brain className="h-8 w-8 text-blue-500" />
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Technical Interview
                </h1>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Question {session.currentQuestion + 1} of {session.totalQuestions}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {formatTime(timeSpent)}
              </Badge>
              <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                Technical
              </Badge>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Voice Controls */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-blue-500" />
                Voice Controls
              </span>
              <Badge variant={speechSupported ? "default" : "secondary"}>
                {speechSupported ? "Voice Supported" : "Voice Not Available"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {/* Voice Toggle */}
              <Button
                variant={voiceEnabled ? "default" : "outline"}
                size="sm"
                onClick={toggleVoice}
                className="flex items-center gap-2"
              >
                {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                {voiceEnabled ? "Voice On" : "Voice Off"}
              </Button>

              {/* Replay Question */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => speakQuestion(session.question)}
                disabled={!voiceEnabled || isSpeaking}
                className="flex items-center gap-2"
              >
                {isSpeaking ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isSpeaking ? "Speaking..." : "Replay Question"}
              </Button>

              {/* Stop Speaking */}
              {isSpeaking && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={stopSpeaking}
                  className="flex items-center gap-2 text-red-600"
                >
                  <Square className="h-4 w-4" />
                  Stop
                </Button>
              )}

              {/* Voice Recording */}
              {speechSupported && (
                <Button
                  variant={isListening ? "destructive" : "outline"}
                  size="sm"
                  onClick={isListening ? stopListening : startListening}
                  className="flex items-center gap-2"
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  {isListening ? "Stop Recording" : "Start Recording"}
                </Button>
              )}
            </div>
            
            {isListening && (
              <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Recording your answer...</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Voice Interview Card */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-xl">
              <Brain className="h-6 w-6 text-blue-500" />
              Voice Interview in Progress
              {isSpeaking && (
                <Badge variant="secondary" className="ml-2 animate-pulse">
                  🔊 Speaking Question
                </Badge>
              )}
              {isListening && (
                <Badge variant="destructive" className="ml-2 animate-pulse">
                  🎤 Recording Answer
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-6">
              {/* Current Status */}
              <div className="space-y-4">
                {isSpeaking && (
                  <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-blue-700 dark:text-blue-300 font-medium">
                      Listen carefully to the question...
                    </span>
                  </div>
                )}
                
                {!isSpeaking && !isListening && (
                  <div className="flex items-center justify-center gap-3 p-4 bg-gray-50 dark:bg-gray-950/20 rounded-lg">
                    <Mic className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      Ready to record your answer
                    </span>
                  </div>
                )}
                
                {isListening && (
                  <div className="flex items-center justify-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-700 dark:text-red-300 font-medium">
                      Speak your answer now...
                    </span>
                  </div>
                )}
              </div>

              {/* Voice Visualization */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                    isSpeaking ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' :
                    isListening ? 'border-red-500 bg-red-50 dark:bg-red-950/20' :
                    'border-gray-300 bg-gray-50 dark:bg-gray-950/20'
                  }`}>
                    {isSpeaking ? (
                      <Volume2 className="h-8 w-8 text-blue-500" />
                    ) : isListening ? (
                      <Mic className="h-8 w-8 text-red-500" />
                    ) : (
                      <Brain className="h-8 w-8 text-gray-500" />
                    )}
                  </div>
                  {(isSpeaking || isListening) && (
                    <div className={`absolute inset-0 rounded-full animate-ping ${
                      isSpeaking ? 'border-4 border-blue-400' : 'border-4 border-red-400'
                    }`}></div>
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>🎧 Listen to the question being spoken</p>
                <p>🎤 Click "Start Recording" to give your answer</p>
                <p>⏹️ Click "Stop Recording" when finished</p>
                <p>➡️ Submit to move to the next question</p>
              </div>

              {/* Hidden answer field for processing */}
              <input
                type="hidden"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Button
            variant="outline"
            onClick={() => router.push('/interview')}
            disabled={isSubmitting}
          >
            Exit Interview
          </Button>
          
          <Button
            onClick={submitAnswer}
            disabled={isSubmitting || !answer.trim()}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : session.currentQuestion + 1 === session.totalQuestions ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Complete Interview
              </>
            ) : (
              <>
                <ArrowRight className="mr-2 h-4 w-4" />
                Next Question
              </>
            )}
          </Button>
        </div>

        {/* Tips */}
        <Card className="mt-8 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-lg text-blue-900 dark:text-blue-100">
              💡 Interview Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li>• Explain your thought process clearly</li>
              <li>• Use specific examples from your experience</li>
              <li>• Mention relevant technologies and concepts</li>
              <li>• Don't rush - take time to think through your answer</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
