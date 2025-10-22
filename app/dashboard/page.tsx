"use client"

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Building2, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  Crown,
  Target,
  Clock,
  Award,
  Brain,
  Users,
  Play,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router, mounted])

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const getSubscriptionBadge = () => {
    switch (user.subscriptionTier) {
      case 'premium':
        return (
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Crown className="w-3 h-3 mr-1" />
            Premium
          </Badge>
        )
      case 'pro':
        return (
          <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
            <Award className="w-3 h-3 mr-1" />
            Pro
          </Badge>
        )
      default:
        return <Badge variant="outline">Free</Badge>
    }
  }

  const safeUsage = user.usage || {
    studyPlansGenerated: 0,
    companiesAccessed: [],
    forumPostsCreated: 0,
    lastActiveDate: new Date()
  }

  const safeProfile = user.profile || {
    preparationLevel: 'beginner',
    targetCompanies: [],
    focusAreas: []
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm sm:text-base">
                Continue your placement preparation journey
              </p>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              {getSubscriptionBadge()}
              {user.subscriptionTier === 'free' && (
                <Button asChild size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-xs px-3 py-1 h-7">
                  <Link href="/pricing">Upgrade</Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="p-3 sm:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium">Study Plans</CardTitle>
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <div className="text-lg sm:text-2xl font-bold">{safeUsage.studyPlansGenerated}</div>
              <p className="text-xs text-muted-foreground">Plans created</p>
            </CardContent>
          </Card>

          <Card className="p-3 sm:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium">Companies</CardTitle>
              <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <div className="text-lg sm:text-2xl font-bold">{safeUsage.companiesAccessed.length}</div>
              <p className="text-xs text-muted-foreground">Companies explored</p>
            </CardContent>
          </Card>

          <Card className="p-3 sm:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium">Forum Posts</CardTitle>
              <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <div className="text-lg sm:text-2xl font-bold">{safeUsage.forumPostsCreated}</div>
              <p className="text-xs text-muted-foreground">Questions asked</p>
            </CardContent>
          </Card>

          <Card className="p-3 sm:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium">Level</CardTitle>
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <div className="text-lg sm:text-2xl font-bold capitalize">{safeProfile.preparationLevel}</div>
              <p className="text-xs text-muted-foreground">Preparation level</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Brain className="h-4 w-4 sm:h-6 sm:w-6 text-blue-500 flex-shrink-0" />
                  <span className="text-sm sm:text-lg font-semibold whitespace-nowrap">AI Interview Practice</span>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs w-fit">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Enhanced
                </Badge>
              </CardTitle>
              <CardDescription className="text-sm">
                Practice with AI-powered interviews and get personalized feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button asChild className="bg-blue-500 hover:bg-blue-600 text-white h-10 sm:h-10 text-sm">
                  <Link href="/interview/technical">
                    <Brain className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Technical
                  </Link>
                </Button>
                <Button asChild className="bg-purple-500 hover:bg-purple-600 text-white h-10 sm:h-10 text-sm">
                  <Link href="/interview/hr">
                    <Users className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    HR Interview
                  </Link>
                </Button>
              </div>
              <Button asChild variant="outline" className="w-full h-9 text-sm">
                <Link href="/interview">
                  <Play className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  View All Interview Options
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Target className="h-4 w-4 sm:h-5 sm:w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription className="text-sm">
                Jump into your preparation activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              <Button asChild className="w-full justify-start h-9 sm:h-10 text-sm" variant="outline">
                <Link href="/study-planner">
                  <Calendar className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Create Study Plan
                </Link>
              </Button>
              <Button asChild className="w-full justify-start h-9 sm:h-10 text-sm" variant="outline">
                <Link href="/materials">
                  <BookOpen className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Study Materials
                </Link>
              </Button>
              <Button asChild className="w-full justify-start h-9 sm:h-10 text-sm" variant="outline">
                <Link href="/forum">
                  <MessageSquare className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Visit Forum
                </Link>
              </Button>
              <Button asChild className="w-full justify-start h-9 sm:h-10 text-sm" variant="outline">
                <Link href="/experiences">
                  <Users className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Read Experiences
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6 sm:mb-8">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-sm">
              Your latest actions on OpenPrep
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span className="flex-1">Account created</span>
                <span className="text-muted-foreground text-xs sm:text-sm">
                  Recently
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="flex-1">Last active</span>
                <span className="text-muted-foreground text-xs sm:text-sm">
                  {new Date(safeUsage.lastActiveDate).toLocaleDateString()}
                </span>
              </div>
              {safeUsage.studyPlansGenerated > 0 && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                  <span className="flex-1">Generated {safeUsage.studyPlansGenerated} study plan{safeUsage.studyPlansGenerated > 1 ? 's' : ''}</span>
                </div>
              )}
              {safeUsage.forumPostsCreated > 0 && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                  <span className="flex-1">Posted {safeUsage.forumPostsCreated} forum question{safeUsage.forumPostsCreated > 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {(!safeProfile.targetCompanies.length || !safeProfile.focusAreas.length) && (
          <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/50">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-orange-800 dark:text-orange-200 text-base sm:text-lg">
                Complete Your Profile
              </CardTitle>
              <CardDescription className="text-orange-700 dark:text-orange-300 text-sm">
                Set up your preferences to get personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 sm:gap-4">
                <Button asChild variant="outline" className="border-orange-300 text-orange-800 hover:bg-orange-100 dark:border-orange-600 dark:text-orange-200 dark:hover:bg-orange-900 w-full sm:w-auto text-sm">
                  <Link href="/settings">Complete Profile</Link>
                </Button>
                <div className="text-xs sm:text-sm text-orange-700 dark:text-orange-300">
                  Add target companies and focus areas to unlock personalized features
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}