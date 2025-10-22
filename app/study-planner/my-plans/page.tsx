"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock, Target, TrendingUp, BookOpen, Users } from 'lucide-react'
import Link from 'next/link'

interface StudyPlan {
  id: string
  userId?: string
  targetCompanies: string[]
  availableHoursPerDay: number
  targetDate: string
  currentLevel: string
  focusAreas: string[]
  generatedPlan: any[]
  createdAt: string
}

export default function MyStudyPlansPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=/study-planner/my-plans')
      return
    }

    if (user) {
      fetchStudyPlans()
    }
  }, [user, authLoading, router])

  const fetchStudyPlans = async () => {
    try {
      const response = await fetch(`/api/study-plans?userId=${user?.id}`)
      if (response.ok) {
        const plans = await response.json()
        setStudyPlans(plans)
      }
    } catch (error) {
      console.error('Error fetching study plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateProgress = (plan: StudyPlan) => {
    const allTasks = plan.generatedPlan.flatMap(day => day.tasks)
    const completedTasks = allTasks.filter(task => task.completed)
    return {
      completed: completedTasks.length,
      total: allTasks.length,
      percentage: allTasks.length > 0 ? Math.round((completedTasks.length / allTasks.length) * 100) : 0
    }
  }

  const getDaysRemaining = (targetDate: string) => {
    const today = new Date()
    const target = new Date(targetDate)
    const diffTime = target.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-80"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                My Study Plans
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Track your preparation progress and manage your study schedules
              </p>
            </div>
            <Button asChild>
              <Link href="/study-planner">
                <Target className="mr-2 h-4 w-4" />
                Create New Plan
              </Link>
            </Button>
          </div>
        </div>

        {/* Study Plans Grid */}
        {studyPlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studyPlans.map((plan) => {
              const progress = calculateProgress(plan)
              const daysRemaining = getDaysRemaining(plan.targetDate)
              
              return (
                <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2">
                          {plan.targetCompanies.join(', ')} Preparation
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Created {new Date(plan.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {plan.currentLevel}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{progress.completed}/{progress.total} tasks</span>
                      </div>
                      <Progress value={progress.percentage} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {progress.percentage}% completed
                      </p>
                    </div>

                    {/* Key Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{plan.availableHoursPerDay}h/day</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className={daysRemaining < 0 ? 'text-red-500' : daysRemaining < 7 ? 'text-orange-500' : ''}>
                          {daysRemaining < 0 ? 'Overdue' : `${daysRemaining} days`}
                        </span>
                      </div>
                    </div>

                    {/* Target Companies */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Target Companies:</p>
                      <div className="flex flex-wrap gap-1">
                        {plan.targetCompanies.slice(0, 3).map((company, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {company}
                          </Badge>
                        ))}
                        {plan.targetCompanies.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{plan.targetCompanies.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Focus Areas */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Focus Areas:</p>
                      <div className="flex flex-wrap gap-1">
                        {plan.focusAreas.map((area, index) => (
                          <Badge key={index} variant="outline" className="text-xs capitalize">
                            {area.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button asChild size="sm" className="flex-1">
                        <Link href={`/study-planner/plan/${plan.id}`}>
                          <BookOpen className="mr-2 h-4 w-4" />
                          View Plan
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="flex-1">
                        <Link href={`/study-planner/progress/${plan.id}`}>
                          <TrendingUp className="mr-2 h-4 w-4" />
                          Progress
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Study Plans Yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first personalized study plan to start your preparation journey
              </p>
              <Button asChild>
                <Link href="/study-planner">
                  <Target className="mr-2 h-4 w-4" />
                  Create Your First Plan
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        {studyPlans.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{studyPlans.length}</div>
                <p className="text-xs text-muted-foreground">Study plans created</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {studyPlans.filter(plan => getDaysRemaining(plan.targetDate) >= 0).length}
                </div>
                <p className="text-xs text-muted-foreground">Plans in progress</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {studyPlans.length > 0 
                    ? Math.round(studyPlans.reduce((sum, plan) => sum + calculateProgress(plan).percentage, 0) / studyPlans.length)
                    : 0}%
                </div>
                <p className="text-xs text-muted-foreground">Average completion</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}