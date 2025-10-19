"use client"

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  BookOpen, 
  Building2, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  Crown,
  Target,
  Clock,
  Award
} from 'lucide-react'
import Link from 'next/link'
import { UsageAnalytics } from '@/components/usage-analytics'

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

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
        return <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"><Crown className="w-3 h-3 mr-1" />Premium</Badge>
      case 'pro':
        return <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white"><Award className="w-3 h-3 mr-1" />Pro</Badge>
      default:
        return <Badge variant="outline">Free</Badge>
    }
  }

  const getUsageProgress = () => {
    const limits = {
      free: { studyPlans: 1, companies: 5 },
      pro: { studyPlans: 10, companies: 999 },
      premium: { studyPlans: 999, companies: 999 }
    }
    
    const userLimits = limits[user.subscriptionTier] || limits.free
    
    // Provide default values if user.usage is undefined
    const usage = user.usage || {
      studyPlansGenerated: 0,
      companiesAccessed: [],
      forumPostsCreated: 0,
      lastActiveDate: new Date()
    }
    
    const studyPlanProgress = Math.min((usage.studyPlansGenerated / userLimits.studyPlans) * 100, 100)
    const companyProgress = Math.min((usage.companiesAccessed.length / userLimits.companies) * 100, 100)
    
    return { studyPlanProgress, companyProgress, limits: userLimits }
  }

  const usage = getUsageProgress()
  
  // Safe usage object with defaults
  const safeUsage = user.usage || {
    studyPlansGenerated: 0,
    companiesAccessed: [],
    forumPostsCreated: 0,
    lastActiveDate: new Date()
  }
  
  // Safe profile object with defaults
  const safeProfile = user.profile || {
    preparationLevel: 'beginner',
    targetCompanies: [],
    focusAreas: []
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Continue your placement preparation journey
              </p>
            </div>
            <div className="flex items-center gap-3">
              {getSubscriptionBadge()}
              {user.subscriptionTier === 'free' && (
                <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Link href="/pricing">Upgrade to Pro</Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Plans</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{safeUsage.studyPlansGenerated}</div>
              <p className="text-xs text-muted-foreground">
                of {usage.limits.studyPlans === 999 ? '∞' : usage.limits.studyPlans} allowed
              </p>
              <Progress value={usage.studyPlanProgress} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Companies Accessed</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{safeUsage.companiesAccessed.length}</div>
              <p className="text-xs text-muted-foreground">
                of {usage.limits.companies === 999 ? '∞' : usage.limits.companies} allowed
              </p>
              <Progress value={usage.companyProgress} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Forum Posts</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{safeUsage.forumPostsCreated}</div>
              <p className="text-xs text-muted-foreground">
                Questions asked
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Preparation Level</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{safeProfile.preparationLevel}</div>
              <p className="text-xs text-muted-foreground">
                Current level
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Usage Analytics */}
        <div className="mb-8">
          <UsageAnalytics subscriptionTier={user.subscriptionTier} />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Jump into your preparation activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full justify-start" variant="outline">
                <Link href="/study-planner">
                  <Calendar className="mr-2 h-4 w-4" />
                  Create Study Plan
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link href="/">
                  <Building2 className="mr-2 h-4 w-4" />
                  Browse Companies
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link href="/forum">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Visit Forum
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link href="/experiences">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Read Experiences
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your latest actions on OpenPrep
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Account created</span>
                  <span className="text-muted-foreground ml-auto">
                    {new Date(user.createdAt || '').toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Last active</span>
                  <span className="text-muted-foreground ml-auto">
                    {new Date(safeUsage.lastActiveDate).toLocaleDateString()}
                  </span>
                </div>
                {safeUsage.studyPlansGenerated > 0 && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Generated {safeUsage.studyPlansGenerated} study plan{safeUsage.studyPlansGenerated > 1 ? 's' : ''}</span>
                  </div>
                )}
                {safeUsage.forumPostsCreated > 0 && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Posted {safeUsage.forumPostsCreated} forum question{safeUsage.forumPostsCreated > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Setup */}
        {(!safeProfile.targetCompanies.length || !safeProfile.focusAreas.length) && (
          <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/50">
            <CardHeader>
              <CardTitle className="text-orange-800 dark:text-orange-200">Complete Your Profile</CardTitle>
              <CardDescription className="text-orange-700 dark:text-orange-300">
                Set up your preferences to get personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="outline" className="border-orange-300 text-orange-800 hover:bg-orange-100 dark:border-orange-600 dark:text-orange-200 dark:hover:bg-orange-900">
                  <Link href="/settings">Complete Profile</Link>
                </Button>
                <div className="text-sm text-orange-700 dark:text-orange-300">
                  Add target companies and focus areas to unlock personalized features
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subscription Limits Warning */}
        {user.subscriptionTier === 'free' && (usage.studyPlanProgress > 80 || usage.companyProgress > 80) && (
          <Card className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/50">
            <CardHeader>
              <CardTitle className="text-purple-800 dark:text-purple-200 flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Upgrade to Continue
              </CardTitle>
              <CardDescription className="text-purple-700 dark:text-purple-300">
                You're approaching your free tier limits. Upgrade for unlimited access.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Link href="/pricing">View Pricing Plans</Link>
                </Button>
                <div className="text-sm text-purple-700 dark:text-purple-300">
                  Get unlimited study plans, company access, and premium features
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}