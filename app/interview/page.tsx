"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ChromeAIService } from '@/lib/chrome-ai'
import { AIEnhancedButton } from '@/components/ai-enhanced-button'
import {
    Brain,
    Users,
    Clock,
    Trophy,
    TrendingUp,
    Play,
    History,
    Target,
    CheckCircle,
    Star,
    Volume2,
    Sparkles,
    Wand2,
    Lightbulb
} from 'lucide-react'
import Link from 'next/link'

interface InterviewStats {
    totalInterviews: number
    technicalInterviews: number
    hrInterviews: number
    averageScore: number
    bestScore: number
    averageDuration: number
}

export default function InterviewPage() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const [stats, setStats] = useState<InterviewStats | null>(null)
    const [loadingStats, setLoadingStats] = useState(true)
    const [aiQuestions, setAiQuestions] = useState<string[]>([])
    const [showAIFeatures, setShowAIFeatures] = useState(false)
    const [aiCapabilities, setAiCapabilities] = useState<any>(null)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (mounted && !loading && !user) {
            router.push('/auth/login')
        }
    }, [user, loading, router, mounted])

    useEffect(() => {
        if (user) {
            fetchStats()
            checkAICapabilities()
        }
    }, [user])

    const checkAICapabilities = async () => {
        const capabilities = await ChromeAIService.getCapabilities()
        setAiCapabilities(capabilities)
        setShowAIFeatures(capabilities.languageModel || capabilities.summarizer || capabilities.writer)
    }

    const generateAIQuestions = async (type: 'technical' | 'hr') => {
        const questions = await ChromeAIService.generateInterviewQuestions(type, 'JavaScript and React', 'mid')
        if (questions) {
            setAiQuestions(questions)
        }
    }

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/interview/history')
            if (response.ok) {
                const data = await response.json()
                setStats(data.stats)
            }
        } catch (error) {
            console.error('Error fetching stats:', error)
        } finally {
            setLoadingStats(false)
        }
    }

    if (!mounted || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                <div className="container mx-auto px-4 py-8">
                    <div className="animate-pulse space-y-8">
                        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-80"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                            ))}
                        </div>
                    </div>
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
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 flex-wrap">
                                <span className="whitespace-nowrap">AI Interview Practice</span>
                                <span>🎯</span>
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 mt-1">
                                Practice with AI-powered interviews and get detailed feedback
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                <Volume2 className="w-3 h-3 mr-1" />
                                Voice Enabled
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                {!loadingStats && stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
                                <Trophy className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.totalInterviews}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stats.technicalInterviews} Technical, {stats.hrInterviews} HR
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.averageScore}%</div>
                                <Progress value={stats.averageScore} className="mt-2 h-2" />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Best Score</CardTitle>
                                <Star className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.bestScore}%</div>
                                <p className="text-xs text-muted-foreground">Personal best</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {Math.floor(stats.averageDuration / 60)}m
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {stats.averageDuration % 60}s average
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Chrome AI Powered Features */}
                {showAIFeatures && (
                    <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800 mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Sparkles className="h-6 w-6 text-purple-500" />
                                Chrome AI Enhanced Features
                                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                                    NEW
                                </Badge>
                            </CardTitle>
                            <CardDescription>
                                Powered by Chrome's built-in AI models for enhanced interview preparation
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <h4 className="font-semibold flex items-center gap-2">
                                        <Wand2 className="h-4 w-4 text-purple-500" />
                                        AI Question Generator
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        Generate personalized interview questions using Chrome's Prompt API
                                    </p>
                                    <div className="flex gap-2">
                                        <AIEnhancedButton
                                            aiAction="generate"
                                            onAIResult={(result) => setAiQuestions(result.split('\n').filter(q => q.trim()))}
                                            variant="outline"
                                        >
                                            Generate Questions
                                        </AIEnhancedButton>
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    <h4 className="font-semibold flex items-center gap-2">
                                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                                        Smart Capabilities
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        {aiCapabilities?.languageModel && (
                                            <div className="flex items-center gap-2 text-green-600">
                                                <CheckCircle className="h-3 w-3" />
                                                Dynamic Question Generation
                                            </div>
                                        )}
                                        {aiCapabilities?.summarizer && (
                                            <div className="flex items-center gap-2 text-green-600">
                                                <CheckCircle className="h-3 w-3" />
                                                Performance Summarization
                                            </div>
                                        )}
                                        {aiCapabilities?.writer && (
                                            <div className="flex items-center gap-2 text-green-600">
                                                <CheckCircle className="h-3 w-3" />
                                                Answer Improvement
                                            </div>
                                        )}


                                    </div>
                                </div>
                            </div>
                            
                            {/* AI Generated Questions Display */}
                            {aiQuestions.length > 0 && (
                                <div className="mt-6 p-4 bg-white dark:bg-slate-800 rounded-lg border">
                                    <h5 className="font-semibold mb-3 flex items-center gap-2">
                                        <Brain className="h-4 w-4 text-blue-500" />
                                        AI Generated Questions
                                    </h5>
                                    <div className="space-y-2">
                                        {aiQuestions.map((question, index) => (
                                            <div key={index} className="p-3 bg-slate-50 dark:bg-slate-700 rounded text-sm">
                                                <span className="font-medium text-purple-600 dark:text-purple-400">Q{index + 1}:</span> {question}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Interview Options */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Brain className="h-6 w-6 text-blue-500" />
                                Technical Interview
                            </CardTitle>
                            <CardDescription>
                                Practice technical questions covering programming, algorithms, and system design
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    JavaScript, React, Node.js questions
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    Database and API concepts
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    Algorithms and data structures
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    Voice-enabled interview experience
                                </div>
                            </div>
                            <Button asChild className="w-full bg-blue-500 hover:bg-blue-600 text-white h-10">
                                <Link href="/interview/technical">
                                    <Play className="mr-2 h-4 w-4" />
                                    Start Technical
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Users className="h-6 w-6 text-purple-500" />
                                HR Interview
                            </CardTitle>
                            <CardDescription>
                                Practice behavioral and HR questions to improve your soft skills
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    Behavioral and situational questions
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    Leadership and teamwork scenarios
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    Communication and problem-solving
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    Voice-enabled interview experience
                                </div>
                            </div>
                            <Button asChild className="w-full bg-purple-500 hover:bg-purple-600 text-white h-10">
                                <Link href="/interview/hr">
                                    <Play className="mr-2 h-4 w-4" />
                                    Start HR
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Features */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Target className="h-5 w-5 text-green-500" />
                            AI Interview Features
                        </CardTitle>
                        <CardDescription>
                            Get comprehensive feedback and improve your interview skills
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Brain className="h-5 w-5 text-blue-500" />
                                    <h3 className="font-semibold">AI-Powered Evaluation</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Advanced AI analyzes your answers for technical accuracy and communication quality
                                </p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Volume2 className="h-5 w-5 text-green-500" />
                                    <h3 className="font-semibold">Voice-Enabled Experience</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Listen to questions and speak your answers naturally, just like a real interview
                                </p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-purple-500" />
                                    <h3 className="font-semibold">Detailed Feedback</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Get specific feedback on strengths, weaknesses, and areas for improvement
                                </p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-orange-500" />
                                    <h3 className="font-semibold">Time Tracking</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Monitor your response time and improve your pacing for real interviews
                                </p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Trophy className="h-5 w-5 text-indigo-500" />
                                    <h3 className="font-semibold">Progress Tracking</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Track your improvement over time with detailed analytics and scoring
                                </p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Star className="h-5 w-5 text-yellow-500" />
                                    <h3 className="font-semibold">Industry Standards</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Questions based on real interviews from top tech companies
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button asChild variant="outline" className="flex-1 h-9">
                        <Link href="/interview/history">
                            <History className="mr-2 h-4 w-4" />
                            View History
                        </Link>
                    </Button>
                    <Button 
                        variant="outline" 
                        className="flex-1 h-9"
                        onClick={async () => {
                            if (confirm('This will clear any active interview sessions. Continue?')) {
                                try {
                                    await fetch('/api/interview/cleanup', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        }
                                    })
                                    alert('Active sessions cleared successfully!')
                                } catch (error) {
                                    console.error('Error clearing sessions:', error)
                                    alert('Failed to clear sessions')
                                }
                            }
                        }}
                    >
                        <Target className="mr-2 h-4 w-4" />
                        Clear Sessions
                    </Button>
                    <Button asChild variant="outline" className="flex-1 h-9">
                        <Link href="/dashboard">
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Dashboard
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}