"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  ArrowLeft,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import Link from 'next/link'

interface StudyPlan {
  id: string
  userId?: string
  targetCompanies: string[]
  availableHoursPerDay: number
  targetDate: string
  currentLevel: string
  focusAreas: string[]
  generatedPlan: DailyTask[]
  createdAt: string
}

interface DailyTask {
  date: string
  tasks: Task[]
  totalHours: number
}

interface Task {
  id: string
  title: string
  type: string
  duration: number
  priority: string
  description: string
  resources: string[]
  completed: boolean
}

export default function StudyPlanProgressPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=/study-planner/my-plans')
      return
    }

    if (user && params.id) {
      fetchStudyPlan()
    }
  }, [user, authLoading, params.id, router])

  const fetchStudyPlan = async () => {
    try {
      const response = await fetch(`/api/study-plans/${params.id}`)
      if (response.ok) {
        const plan = await response.json()
        setStudyPlan(plan)
      } else {
        setError('Study plan not found')
      }
    } catch (error) {
      console.error('Error fetching study plan:', error)
      setError('Failed to load study plan')
    } finally {
      setLoading(false)
    }
  }

  const calculateDetailedProgress = () => {
    if (!studyPlan) return null

    const allTasks = studyPlan.generatedPlan.flatMap(day => day.tasks)
    const completedTasks = allTasks.filter(task => task.completed)
    
    // Progress by type
    const typeProgress = studyPlan.focusAreas.map(area => {
      const areaTasks = allTasks.filter(task => task.type === area)
      const areaCompleted = areaTasks.filter(task => task.completed)
      return {
        type: area,
        total: areaTasks.length,
        completed: areaCompleted.length,
        percentage: areaTasks.length > 0 ? Math.round((areaCompleted.length / areaTasks.length) * 100) : 0
      }
    })

    // Progress by priority
    const priorityProgress = ['high', 'medium', 'low'].map(priority => {
      const priorityTasks = allTasks.filter(task => task.priority === priority)
      const priorityCompleted = priorityTasks.filter(task => task.completed)
      return {
        priority,
        total: priorityTasks.length,
        completed: priorityCompleted.length,
        percentage: priorityTasks.length > 0 ? Math.round((priorityCompleted.length / priorityTasks.length) * 100) : 0
      }
    })

    // Daily progress
    const dailyProgress = studyPlan.generatedPlan.map((day, index) => {
      const dayCompleted = day.tasks.filter(task => task.completed).length
      return {
        day: index + 1,
        date: day.date,
        total: day.tasks.length,
        completed: dayCompleted,
        percentage: day.tasks.length > 0 ? Math.round((dayCompleted / day.tasks.length) * 100) : 0,
        hours: day.totalHours
      }
    })

    // Time analysis
    const totalPlannedHours = allTasks.reduce((sum, task) => sum + task.duration / 60, 0)
    const completedHours = completedTasks.reduce((sum, task) => sum + task.duration / 60, 0)

    return {
      overall: {
        total: allTasks.length,
        completed: completedTasks.length,
        percentage: allTasks.length > 0 ? Math.round((completedTasks.length / allTasks.length) * 100) : 0,
        totalHours: totalPlannedHours,
        completedHours,
        hoursPercentage: totalPlannedHours > 0 ? Math.round((completedHours / totalPlannedHours) * 100) : 0
      },
      byType: typeProgress,
      byPriority: priorityProgress,
      daily: dailyProgress
    }
  }

  const getDaysRemaining = () => {
    if (!studyPlan) return 0
    const today = new Date()
    const target = new Date(studyPlan.targetDate)
    const diffTime = target.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-80"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !studyPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-10">
              <h2 className="text-xl font-semibold mb-2">{error || 'Study Plan Not Found'}</h2>
              <p className="text-muted-foreground mb-4">
                The study plan you're looking for doesn't exist or you don't have access to it.
              </p>
              <Button asChild>
                <Link href="/study-planner/my-plans">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to My Plans
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const progress = calculateDetailedProgress()
  const daysRemaining = getDaysRemaining()

  if (!progress) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button asChild variant="outline" size="sm">
              <Link href={`/study-planner/plan/${studyPlan.id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Plan
              </Link>
            </Button>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Progress Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {studyPlan.targetCompanies.join(', ')} Preparation Plan
              </p>
            </div>
            
            <Badge variant={daysRemaining < 0 ? "destructive" : daysRemaining < 7 ? "secondary" : "default"}>
              {daysRemaining < 0 ? 'Overdue' : `${daysRemaining} days remaining`}
            </Badge>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progress.overall.percentage}%</div>
              <Progress value={progress.overall.percentage} className="mt-2 h-3" />
              <p className="text-xs text-muted-foreground mt-1">
                {progress.overall.completed}/{progress.overall.total} tasks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progress.overall.hoursPercentage}%</div>
              <Progress value={progress.overall.hoursPercentage} className="mt-2 h-3" />
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round(progress.overall.completedHours)}h / {Math.round(progress.overall.totalHours)}h
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Days Elapsed</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.max(0, studyPlan.generatedPlan.length - Math.max(0, daysRemaining))}
              </div>
              <p className="text-xs text-muted-foreground">
                of {studyPlan.generatedPlan.length} total days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Daily Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(progress.daily.reduce((sum, day) => sum + day.percentage, 0) / progress.daily.length)}%
              </div>
              <p className="text-xs text-muted-foreground">Average completion</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress by Focus Area */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Progress by Focus Area
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {progress.byType.map((area) => (
                <div key={area.type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{area.type.replace('_', ' ')}</span>
                    <span className="text-sm text-muted-foreground">{area.percentage}%</span>
                  </div>
                  <Progress value={area.percentage} className="h-3" />
                  <p className="text-xs text-muted-foreground">
                    {area.completed}/{area.total} tasks completed
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Progress by Priority */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Progress by Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {progress.byPriority.map((priority) => (
                <div key={priority.priority} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{priority.priority} Priority</span>
                    <span className="text-sm text-muted-foreground">{priority.percentage}%</span>
                  </div>
                  <Progress 
                    value={priority.percentage} 
                    className={`h-3 ${
                      priority.priority === 'high' ? '[&>div]:bg-red-500' :
                      priority.priority === 'medium' ? '[&>div]:bg-yellow-500' :
                      '[&>div]:bg-green-500'
                    }`}
                  />
                  <p className="text-xs text-muted-foreground">
                    {priority.completed}/{priority.total} tasks completed
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daily Progress Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Daily Progress Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {progress.daily.map((day) => {
                const isToday = new Date(day.date).toDateString() === new Date().toDateString()
                const isPast = new Date(day.date) < new Date()
                
                return (
                  <div key={day.day} className={`p-4 rounded-lg border transition-colors ${
                    isToday 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                      : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Day {day.day}</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(day.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                        {isToday && <Badge variant="default" className="text-xs">Today</Badge>}
                        {isPast && day.percentage === 100 && <CheckCircle className="h-4 w-4 text-green-500" />}
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">{day.percentage}%</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          ({day.completed}/{day.total} tasks)
                        </span>
                      </div>
                    </div>
                    <Progress value={day.percentage} className="h-3" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="flex-1">
            <Link href={`/study-planner/plan/${studyPlan.id}`}>
              <Target className="mr-2 h-4 w-4" />
              View Full Plan
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="flex-1">
            <Link href="/study-planner/my-plans">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Plans
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}