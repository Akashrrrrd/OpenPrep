"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Calendar, 
  Clock, 
  Target, 
  BookOpen, 
  CheckCircle, 
  ArrowLeft,
  Play,
  Pause,
  RotateCcw
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

export default function StudyPlanDetailPage() {
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

  const toggleTaskCompletion = async (dayIndex: number, taskIndex: number) => {
    if (!studyPlan) return

    const updatedPlan = { ...studyPlan }
    updatedPlan.generatedPlan[dayIndex].tasks[taskIndex].completed = 
      !updatedPlan.generatedPlan[dayIndex].tasks[taskIndex].completed

    setStudyPlan(updatedPlan)

    // Save to backend
    try {
      await fetch(`/api/study-plans/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generatedPlan: updatedPlan.generatedPlan })
      })
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const calculateProgress = () => {
    if (!studyPlan) return { completed: 0, total: 0, percentage: 0 }
    
    const allTasks = studyPlan.generatedPlan.flatMap(day => day.tasks)
    const completedTasks = allTasks.filter(task => task.completed)
    
    return {
      completed: completedTasks.length,
      total: allTasks.length,
      percentage: allTasks.length > 0 ? Math.round((completedTasks.length / allTasks.length) * 100) : 0
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
            <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
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

  const progress = calculateProgress()
  const daysRemaining = getDaysRemaining()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/study-planner/my-plans">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to My Plans
              </Link>
            </Button>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {studyPlan.targetCompanies.join(', ')} Preparation Plan
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Created on {new Date(studyPlan.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="capitalize">
                {studyPlan.currentLevel}
              </Badge>
              <Badge variant={daysRemaining < 0 ? "destructive" : daysRemaining < 7 ? "secondary" : "default"}>
                {daysRemaining < 0 ? 'Overdue' : `${daysRemaining} days left`}
              </Badge>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progress.percentage}%</div>
              <Progress value={progress.percentage} className="mt-2 h-3" />
              <p className="text-xs text-muted-foreground mt-1">
                {progress.completed}/{progress.total} tasks completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studyPlan.availableHoursPerDay}h</div>
              <p className="text-xs text-muted-foreground">Per day commitment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Target Date</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date(studyPlan.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              <p className="text-xs text-muted-foreground">Placement drive</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Focus Areas</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studyPlan.focusAreas.length}</div>
              <p className="text-xs text-muted-foreground">Areas covered</p>
            </CardContent>
          </Card>
        </div>

        {/* Daily Schedule */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Daily Schedule</h2>
          
          {studyPlan.generatedPlan.map((day, dayIndex) => {
            const dayProgress = day.tasks.filter(task => task.completed).length / day.tasks.length * 100
            const isToday = new Date(day.date).toDateString() === new Date().toDateString()
            
            return (
              <Card key={day.date} className={`${isToday ? 'ring-2 ring-blue-500' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Day {dayIndex + 1} - {new Date(day.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                        {isToday && <Badge variant="default">Today</Badge>}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {day.totalHours} hours • {day.tasks.length} tasks
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{Math.round(dayProgress)}% Complete</div>
                      <Progress value={dayProgress} className="w-24 h-3 mt-1" />
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {day.tasks.map((task, taskIndex) => (
                      <div 
                        key={task.id} 
                        className={`p-4 border rounded-lg transition-colors ${
                          task.completed 
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                            : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => toggleTaskCompletion(dayIndex, taskIndex)}
                            className="mt-1"
                          />
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className={`font-medium ${
                                task.completed 
                                  ? 'line-through text-muted-foreground' 
                                  : 'text-slate-900 dark:text-slate-100'
                              }`}>
                                {task.title}
                              </h4>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {task.duration} min
                                </Badge>
                                <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'secondary' : 'outline'} className="text-xs">
                                  {task.priority}
                                </Badge>
                              </div>
                            </div>
                            
                            <p className={`text-sm mb-3 ${
                              task.completed 
                                ? 'text-muted-foreground' 
                                : 'text-gray-600 dark:text-slate-300'
                            }`}>
                              {task.description}
                            </p>
                            
                            {task.resources.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">Resources:</p>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                  {task.resources.map((resource, index) => (
                                    <li key={index} className="flex items-center gap-1">
                                      <BookOpen className="h-3 w-3" />
                                      {resource}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button asChild className="flex-1">
            <Link href={`/study-planner/progress/${studyPlan.id}`}>
              <Target className="mr-2 h-4 w-4" />
              View Progress Analytics
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