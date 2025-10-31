"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Trophy, 
  TrendingUp, 
  TrendingDown,
  Clock, 
  CheckCircle,
  AlertTriangle,
  Brain,
  Users,
  ArrowRight,
  RotateCcw,
  Home,
  Loader2
} from 'lucide-react'
import Link from 'next/link'

interface InterviewResults {
  sessionId: string
  type: string
  startTime: string
  endTime: string
  totalDuration: number
  overallScore: number
  strengths: Array<{
    category: string
    score: number
    feedback: string
  }>
  improvements: Array<{
    category: string
    score: number
    feedback: string
    suggestions: string[]
  }>
  feedback: {
    overall: string
    technical: string
    communication: string
    confidence: string
  }
  questions: Array<{
    questionNumber: number
    question: string
    answer: string
    score: number
    feedback: string
    timeSpent: number
  }>
}

export default function InterviewResultsPage({ params }: { params: { sessionId: string } }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [results, setResults] = useState<InterviewResults | null>(null)
  const [loadingResults, setLoadingResults] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router, mounted])

  useEffect(() => {
    if (user && mounted && params.sessionId) {
      fetchResults()
    }
  }, [user, mounted, params.sessionId])

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/interview/results/${params.sessionId}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data)
      } else {
        alert('Failed to load interview results')
        router.push('/interview')
      }
    } catch (error) {
      console.error('Error fetching results:', error)
      alert('Failed to load interview results')
      router.push('/interview')
    } finally {
      setLoadingResults(false)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  }

  if (!mounted || loading || loadingResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
              <p className="text-lg text-muted-foreground">Loading your interview results...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user || !results) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Interview Results
                </h1>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                {results.type === 'technical' ? 'Technical' : 'HR'} Interview Completed
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`${results.type === 'technical' ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'} text-white border-0 shadow-lg`}>
                {results.type === 'technical' ? <Brain className="w-3 h-3 mr-1" /> : <Users className="w-3 h-3 mr-1" />}
                {results.type === 'technical' ? 'Technical' : 'HR'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Overall Score */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Overall Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(results.overallScore)} mb-2`}>
                  {results.overallScore}%
                </div>
                <p className="text-sm text-muted-foreground">Overall Score</p>
                <Progress value={results.overallScore} className="mt-2 h-3" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">
                  {formatDuration(results.totalDuration)}
                </div>
                <p className="text-sm text-muted-foreground">Total Duration</p>
                <div className="flex items-center justify-center mt-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  {results.questions.length} Questions
                </div>
              </div>
              <div className="text-center">
                <Badge className={`text-lg px-4 py-2 ${getScoreBadgeColor(results.overallScore)}`}>
                  {results.overallScore >= 80 ? 'Excellent' : results.overallScore >= 60 ? 'Good' : 'Needs Improvement'}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">Performance Level</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-500" />
              Detailed Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Overall Assessment</h3>
              <p className="text-muted-foreground">{results.feedback.overall}</p>
            </div>
            {results.feedback.technical !== "N/A - HR Interview" && (
              <div>
                <h3 className="font-semibold mb-2">Technical Knowledge</h3>
                <p className="text-muted-foreground">{results.feedback.technical}</p>
              </div>
            )}
            <div>
              <h3 className="font-semibold mb-2">Communication Skills</h3>
              <p className="text-muted-foreground">{results.feedback.communication}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Confidence Level</h3>
              <p className="text-muted-foreground">{results.feedback.confidence}</p>
            </div>
          </CardContent>
        </Card>

        {/* Strengths and Improvements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Strengths */}
          <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                <TrendingUp className="h-5 w-5" />
                Your Strengths
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.strengths.length > 0 ? (
                results.strengths.map((strength, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-green-800 dark:text-green-200">{strength.category}</h3>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        {strength.score}%
                      </Badge>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300">{strength.feedback}</p>
                  </div>
                ))
              ) : (
                <p className="text-green-700 dark:text-green-300">Keep practicing to identify your strengths!</p>
              )}
            </CardContent>
          </Card>

          {/* Areas for Improvement */}
          <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                <TrendingDown className="h-5 w-5" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.improvements.length > 0 ? (
                results.improvements.map((improvement, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-orange-800 dark:text-orange-200">{improvement.category}</h3>
                      <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                        {improvement.score}%
                      </Badge>
                    </div>
                    <p className="text-sm text-orange-700 dark:text-orange-300">{improvement.feedback}</p>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-orange-800 dark:text-orange-200">Suggestions:</p>
                      <ul className="text-xs text-orange-700 dark:text-orange-300 space-y-1">
                        {improvement.suggestions.map((suggestion, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-orange-500 mt-0.5">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-orange-700 dark:text-orange-300">Great job! No major areas for improvement identified.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Question-by-Question Results */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              Question-by-Question Analysis
            </CardTitle>
            <CardDescription>
              Detailed breakdown of your performance on each question
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {results.questions.map((q, index) => (
                <div key={index} className="border-l-4 border-slate-200 dark:border-slate-700 pl-4 space-y-2">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-semibold text-sm">Q{q.questionNumber}: {q.question}</h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge className={getScoreBadgeColor(q.score)}>
                        {q.score}%
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDuration(q.timeSpent)}
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded text-sm">
                    <p className="font-medium mb-1">Your Answer:</p>
                    <p className="text-muted-foreground">{q.answer}</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded text-sm">
                    <p className="font-medium mb-1 text-blue-800 dark:text-blue-200">Feedback:</p>
                    <p className="text-blue-700 dark:text-blue-300">{q.feedback}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg">
            <Link href="/interview">
              <RotateCcw className="mr-2 h-4 w-4" />
              Take Another Interview
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/interview/history">
              <Trophy className="mr-2 h-4 w-4" />
              View Interview History
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard">
              <Home className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}