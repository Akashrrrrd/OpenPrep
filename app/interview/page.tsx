"use client"

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Brain, Clock, Mic, MicOff, Play, Volume2, SkipForward } from 'lucide-react'
import { ResumeAnalysis } from '@/components/resume-upload'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'

// Lazy load resume upload component
const ResumeUpload = dynamic(
  () => import('@/components/resume-upload').then(mod => mod.default),
  { 
    loading: () => <Skeleton className="h-64 w-full" />,
    ssr: false 
  }
)

interface InterviewSession {
    sessionId: string
    currentQuestion: number
    totalQuestions: number
    question: string
    category: string
    difficulty: string
    resumeSkills: string[]
    questions: any[]
    startTime: string
}

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export default function InterviewPage() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null)
    const [interviewSession, setInterviewSession] = useState<InterviewSession | null>(null)
    const [currentAnswer, setCurrentAnswer] = useState('')
    const [timeElapsed, setTimeElapsed] = useState(0)
    const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null)

    // Voice functionality
    const [isListening, setIsListening] = useState(false)
    const [recognition, setRecognition] = useState<any>(null)
    const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null)
    const [isQuestionPlaying, setIsQuestionPlaying] = useState(false)

    useEffect(() => {
        setMounted(true)
        
        // Redirect to login if user is not authenticated
        if (!loading && !user) {
            router.push('/auth/login')
        }
    }, [user, loading, router])

    // Initialize speech recognition and synthesis
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
            const speechSynthesis = window.speechSynthesis

            if (SpeechRecognition) {
                const recognition = new SpeechRecognition()
                recognition.continuous = true
                recognition.interimResults = true
                recognition.lang = 'en-US'

                recognition.onresult = (event: any) => {
                    let finalTranscript = ''
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        if (event.results[i].isFinal) {
                            finalTranscript += event.results[i][0].transcript
                        }
                    }
                    if (finalTranscript) {
                        setCurrentAnswer(prev => prev + ' ' + finalTranscript)
                    }
                }

                recognition.onerror = (event: any) => {
                    console.error('Speech recognition error:', event.error)
                    setIsListening(false)
                }

                recognition.onend = () => {
                    setIsListening(false)
                }

                setRecognition(recognition)
            }

            setSynthesis(speechSynthesis)
        }
    }, [])

    // Timer for interview session
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (interviewSession && questionStartTime) {
            interval = setInterval(() => {
                setTimeElapsed(Math.floor((Date.now() - questionStartTime.getTime()) / 1000))
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [interviewSession, questionStartTime])

    // Auto-speak first question when interview starts
    useEffect(() => {
        if (interviewSession && interviewSession.currentQuestion === 0) {
            setTimeout(() => {
                speakQuestion(interviewSession.question)
            }, 1500)
        }
    }, [interviewSession])

    const handleResumeAnalyzed = (analysis: ResumeAnalysis) => {
        setResumeAnalysis(analysis)
    }

    const startInterview = async () => {
        if (!resumeAnalysis) return
        
        try {
            const response = await fetch('/api/interview/resume-analysis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ resumeAnalysis })
            })

            if (response.ok) {
                const data = await response.json()
                setInterviewSession(data)
                setQuestionStartTime(new Date())
                setTimeElapsed(0)
            } else {
                console.error('Failed to start interview')
            }
        } catch (error) {
            console.error('Error starting interview:', error)
        }
    }

    const speakQuestion = (text: string) => {
        if (synthesis) {
            const utterance = new SpeechSynthesisUtterance(text)
            utterance.rate = 0.8
            utterance.pitch = 1
            utterance.volume = 1
            
            utterance.onstart = () => setIsQuestionPlaying(true)
            utterance.onend = () => setIsQuestionPlaying(false)
            
            synthesis.speak(utterance)
        }
    }

    const startListening = () => {
        if (recognition && !isListening) {
            setIsListening(true)
            recognition.start()
        }
    }

    const stopListening = () => {
        if (recognition && isListening) {
            recognition.stop()
            setIsListening(false)
        }
    }

    const submitAnswer = async () => {
        if (!interviewSession || !currentAnswer.trim()) return

        stopListening()

        try {
            const response = await fetch('/api/interview/answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionId: interviewSession.sessionId,
                    questionIndex: interviewSession.currentQuestion,
                    answer: currentAnswer,
                    timeSpent: timeElapsed
                })
            })

            if (response.ok) {
                const data = await response.json()
                
                if (data.nextQuestion) {
                    // Move to next question
                    setInterviewSession(prev => prev ? {
                        ...prev,
                        currentQuestion: prev.currentQuestion + 1,
                        question: data.nextQuestion.question,
                        category: data.nextQuestion.category,
                        difficulty: data.nextQuestion.difficulty
                    } : null)
                    setCurrentAnswer('')
                    setQuestionStartTime(new Date())
                    setTimeElapsed(0)
                    
                    // Automatically speak the next question
                    setTimeout(() => {
                        speakQuestion(data.nextQuestion.question)
                    }, 1000)
                } else {
                    // Interview completed
                    router.push(`/interview/results/${interviewSession.sessionId}`)
                }
            }
        } catch (error) {
            console.error('Error submitting answer:', error)
        }
    }

    const skipQuestion = () => {
        stopListening()
        setCurrentAnswer('I would like to skip this question.')
        setTimeout(submitAnswer, 100)
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    if (!mounted || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
                <div className="container mx-auto px-4 py-8">
                    <Skeleton className="h-12 w-80 mb-8 rounded-lg" />
                    <Skeleton className="h-96 w-full rounded-xl" />
                </div>
            </div>
        )
    }

    if (!user) {
        return null
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Voice-Based Technical Interview
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Upload your resume for a personalized voice interview experience
                    </p>
                </div>

                {!interviewSession ? (
                    <Card className="max-w-2xl mx-auto">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <FileText className="h-5 w-5 text-blue-500" />
                                Upload Your Resume
                            </CardTitle>
                            <CardDescription>
                                We'll analyze your resume to create personalized technical interview questions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResumeUpload 
                                onResumeAnalyzed={handleResumeAnalyzed} 
                                onError={(error) => console.error(error)} 
                            />
                            {resumeAnalysis && (
                                <div className="mt-6 space-y-4">
                                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">
                                            Resume analyzed! We'll focus on:
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {resumeAnalysis.skills.slice(0, 5).map((skill, i) => (
                                                <Badge key={i} variant="secondary">
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <Button 
                                        className="w-full" 
                                        size="lg"
                                        onClick={startInterview}
                                    >
                                        <Volume2 className="mr-2 h-5 w-5" />
                                        Start Voice Interview
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="max-w-4xl mx-auto">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle className="flex items-center gap-2 text-xl">
                                            <Brain className="h-6 w-6 text-blue-500" />
                                            Technical Interview in Progress
                                        </CardTitle>
                                        <CardDescription>
                                            Question {interviewSession.currentQuestion + 1} of {interviewSession.totalQuestions}
                                        </CardDescription>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-mono text-blue-600">
                                            {formatTime(timeElapsed)}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {interviewSession.difficulty} • {interviewSession.category}
                                        </div>
                                    </div>
                                </div>
                                <Progress 
                                    value={(interviewSession.currentQuestion / interviewSession.totalQuestions) * 100} 
                                    className="mt-4"
                                />
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Question Display */}
                                <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <div className="flex items-start gap-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => speakQuestion(interviewSession.question)}
                                            disabled={isQuestionPlaying}
                                        >
                                            {isQuestionPlaying ? (
                                                <Volume2 className="h-4 w-4 animate-pulse" />
                                            ) : (
                                                <Play className="h-4 w-4" />
                                            )}
                                        </Button>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-medium mb-2">Question:</h3>
                                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                                {interviewSession.question}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Voice Recording Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium">Your Answer:</h3>
                                        <div className="flex gap-2">
                                            <Button
                                                variant={isListening ? "destructive" : "default"}
                                                onClick={isListening ? stopListening : startListening}
                                                className="flex items-center gap-2"
                                            >
                                                {isListening ? (
                                                    <>
                                                        <MicOff className="h-4 w-4" />
                                                        Stop Recording
                                                    </>
                                                ) : (
                                                    <>
                                                        <Mic className="h-4 w-4" />
                                                        Start Recording
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Live transcription display */}
                                    <div className="min-h-[120px] p-4 border rounded-lg bg-white dark:bg-gray-900">
                                        {isListening && (
                                            <div className="flex items-center gap-2 mb-2 text-red-500">
                                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                                <span className="text-sm">Recording...</span>
                                            </div>
                                        )}
                                        <Textarea
                                            value={currentAnswer}
                                            onChange={(e) => setCurrentAnswer(e.target.value)}
                                            placeholder="Your answer will appear here as you speak, or you can type directly..."
                                            className="min-h-[80px] border-none p-0 resize-none focus:ring-0"
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-between pt-4 border-t">
                                    <Button 
                                        variant="outline" 
                                        onClick={skipQuestion}
                                        className="flex items-center gap-2"
                                    >
                                        <SkipForward className="h-4 w-4" />
                                        Skip Question
                                    </Button>
                                    <Button 
                                        onClick={submitAnswer}
                                        disabled={!currentAnswer.trim()}
                                        className="flex items-center gap-2"
                                    >
                                        Submit Answer
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Skills Focus */}
                        <Card className="mt-6">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <Brain className="h-5 w-5 text-blue-500" />
                                    <h3 className="font-medium">Interview Focus Areas:</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {interviewSession.resumeSkills.map((skill, i) => (
                                        <Badge key={i} variant="outline">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    )
}
