"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  History,
  Brain,
  Users,
  Clock,
  Trophy,
  TrendingUp,
  Calendar,
  ArrowLeft,
  Eye,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'

interface InterviewHistoryItem {
  sessionId: string
  type: 'technical' | 'hr'
  date: string
  duration: number
  score: number
  startTime: string
  endTime: string
}

interface InterviewStats {
  totalInterviews: number
  technicalInterviews: number
  hrInterviews: number
  averageScore: number
  bestScore: number
  averageDuration: number
}

export default function InterviewHistoryPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [history, setHistory] = useState<InterviewHistoryItem[]>([])
  const [stats, setStats] = useState<InterviewStats | null>(null)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      fetchHistory()
    }
  }, [mounted])

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/interview/history')
      if (response.ok) {
        const data = await response.json()
        setHistory(data.history)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching interview history:', error)
    } finally {
      setLoadingData(false)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!mounted || loadingData) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/interview">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Interview
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <History className="h-8 w-8 text-blue-500" />
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Interview History
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg mt-2">
            Track your progress and review past interview performances
          </p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Interviews</CardTitle>
                <Trophy className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.totalInterviews}</div>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  {stats.technicalInterviews} Technical, {stats.hrInterviews} HR
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Average Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.averageScore}%</div>
                <Progress value={stats.averageScore} className="mt-2 h-2" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Best Score</CardTitle>
                <BarChart3 className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.bestScore}%</div>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  Personal best
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-800 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Avg Duration</CardTitle>
                <Clock className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {Math.floor(stats.averageDuration / 60)}m
                </div>
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  {stats.averageDuration % 60}s average
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Interview History */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Calendar className="h-5 w-5 text-blue-500" />
              Recent Interviews
            </CardTitle>
            <CardDescription>
              Your interview history and performance over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <div className="text-center py-12">
                <History className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-2">
                  No interviews yet
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                  Start your first AI interview to see your history here
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white">
                    <Link href="/interview/technical">
                      <Brain className="mr-2 h-4 w-4" />
                      Start Technical Interview
                    </Link>
                  </Button>
                  <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                    <Link href="/interview/hr">
                      <Users className="mr-2 h-4 w-4" />
                      Start HR Interview
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((interview) => (
                  <div
                    key={interview.sessionId}
                    className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        interview.type === 'technical' 
                          ? 'bg-blue-100 dark:bg-blue-900/30' 
                          : 'bg-purple-100 dark:bg-purple-900/30'
                      }`}>
                        {interview.type === 'technical' ? (
                          <Brain className="h-5 w-5 text-blue-500" />
                        ) : (
                          <Users className="h-5 w-5 text-purple-500" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold capitalize">
                            {interview.type} Interview
                          </h3>
                          <Badge variant={interview.score >= 80 ? "default" : interview.score >= 60 ? "secondary" : "destructive"}>
                            {interview.score}%
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(interview.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDuration(interview.duration)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/interview/results/${interview.sessionId}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Results
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}