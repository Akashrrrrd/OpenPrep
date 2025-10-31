"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Crown, TrendingUp, Users, BookOpen, MessageSquare } from 'lucide-react'
import Link from 'next/link'

interface UsageStats {
  studyPlans: { used: number; limit: number; remaining: number }
  companies: { used: number; limit: number; remaining: number }
  forumPosts: { used: number; limit: number; remaining: number }
}

interface UsageAnalyticsProps {
  subscriptionTier: 'free' | 'pro' | 'premium'
}

export function UsageAnalytics({ subscriptionTier }: UsageAnalyticsProps) {
  const [stats, setStats] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsageStats()
  }, [])

  const fetchUsageStats = async () => {
    try {
      const response = await fetch('/api/usage/stats')
      if (response.ok) {
        const data = await response.json()
        console.log('Usage stats data:', data) // Debug log
        setStats(data.stats?.usage || data.usage || null)
      }
    } catch (error) {
      console.error('Failed to fetch usage stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-2 bg-muted rounded"></div>
            <div className="h-2 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Unable to load usage statistics
        </CardContent>
      </Card>
    )
  }

  const getUsageColor = (used: number, limit: number) => {
    const percentage = (used / limit) * 100
    if (percentage >= 90) return 'text-red-500'
    if (percentage >= 70) return 'text-yellow-500'
    return 'text-green-500'
  }

  const getProgressColor = (used: number, limit: number) => {
    const percentage = (used / limit) * 100
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="space-y-6">
      {/* Subscription Status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
          <Crown className={`h-4 w-4 ${subscriptionTier === 'premium' ? 'text-purple-500' : subscriptionTier === 'pro' ? 'text-blue-500' : 'text-gray-400'}`} />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold capitalize">{subscriptionTier}</div>
              <p className="text-xs text-muted-foreground">
                {subscriptionTier === 'free' ? 'Limited access' : 'Full access to all features'}
              </p>
            </div>
            {subscriptionTier === 'free' && (
              <Link href="/pricing">
                <Button size="sm">
                  <Crown className="h-3 w-3 mr-1" />
                  Upgrade
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Study Plans */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Plans</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span className={getUsageColor(stats.studyPlans.used, stats.studyPlans.limit)}>
                {stats.studyPlans.used}
              </span>
              <span className="text-muted-foreground">/{stats.studyPlans.limit === 999 ? '∞' : stats.studyPlans.limit}</span>
            </div>
            {stats.studyPlans.limit !== 999 && (
              <>
                <Progress 
                  value={(stats.studyPlans.used / stats.studyPlans.limit) * 100} 
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.studyPlans.remaining} remaining this month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Companies */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span className={getUsageColor(stats.companies.used, stats.companies.limit)}>
                {stats.companies.used}
              </span>
              <span className="text-muted-foreground">/{stats.companies.limit === 999 ? '∞' : stats.companies.limit}</span>
            </div>
            {stats.companies.limit !== 999 && (
              <>
                <Progress 
                  value={(stats.companies.used / stats.companies.limit) * 100} 
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.companies.remaining} remaining this month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Forum Posts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forum Posts</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span className={getUsageColor(stats.forumPosts.used, stats.forumPosts.limit)}>
                {stats.forumPosts.used}
              </span>
              <span className="text-muted-foreground">/{stats.forumPosts.limit === 999 ? '∞' : stats.forumPosts.limit}</span>
            </div>
            {stats.forumPosts.limit !== 999 && (
              <>
                <Progress 
                  value={(stats.forumPosts.used / stats.forumPosts.limit) * 100} 
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.forumPosts.remaining} remaining this month
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upgrade Prompt for Free Users */}
      {subscriptionTier === 'free' && (
        <Card className="border-dashed border-2 border-primary/20 bg-primary/5">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold mb-2">Unlock Your Full Potential</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upgrade to Pro or Premium for unlimited access to all features and resources.
            </p>
            <Link href="/pricing">
              <Button>
                <Crown className="h-4 w-4 mr-2" />
                View Pricing Plans
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}