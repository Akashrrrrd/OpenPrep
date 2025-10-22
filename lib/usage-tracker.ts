import connectDB from './mongodb'
import User from './models/User'
import { AuthUser } from './auth'
import { checkUsageLimit, getSubscriptionLimits } from './subscription-limits'

export interface UsageCheck {
  allowed: boolean
  limit: number
  current: number
  remaining: number
  requiresUpgrade: boolean
}

export class UsageTracker {
  static async checkStudyPlanLimit(userId: string): Promise<UsageCheck> {
    await connectDB()
    const user = await User.findOne({ id: userId })
    if (!user) throw new Error('User not found')

    const current = user.usage?.studyPlansGenerated || 0
    const result = checkUsageLimit(
      { 
        id: user._id.toString(), 
        email: user.email, 
        name: user.name,
        subscriptionTier: user.subscriptionTier,
        subscriptionStatus: user.subscriptionStatus
      },
      current,
      'studyPlans'
    )

    return {
      allowed: result.allowed,
      limit: result.limit,
      current,
      remaining: result.remaining,
      requiresUpgrade: !result.allowed && user.subscriptionTier === 'free'
    }
  }

  static async checkCompanyAccess(userId: string, companyId: string): Promise<UsageCheck> {
    await connectDB()
    const user = await User.findOne({ id: userId })
    if (!user) throw new Error('User not found')

    const accessedCompanies = user.usage?.companiesAccessed || []
    const current = accessedCompanies.length
    const alreadyAccessed = accessedCompanies.includes(companyId)

    // If already accessed, allow it
    if (alreadyAccessed) {
      return {
        allowed: true,
        limit: getSubscriptionLimits(user.subscriptionTier).companies,
        current,
        remaining: getSubscriptionLimits(user.subscriptionTier).companies - current,
        requiresUpgrade: false
      }
    }

    const result = checkUsageLimit(
      { 
        id: user._id.toString(), 
        email: user.email, 
        name: user.name,
        subscriptionTier: user.subscriptionTier,
        subscriptionStatus: user.subscriptionStatus
      },
      current,
      'companies'
    )

    return {
      allowed: result.allowed,
      limit: result.limit,
      current,
      remaining: result.remaining,
      requiresUpgrade: !result.allowed && user.subscriptionTier === 'free'
    }
  }

  static async checkForumPostLimit(userId: string): Promise<UsageCheck> {
    await connectDB()
    const user = await User.findOne({ id: userId })
    if (!user) throw new Error('User not found')

    const current = user.usage?.forumPostsCreated || 0
    const result = checkUsageLimit(
      { 
        id: user._id.toString(), 
        email: user.email, 
        name: user.name,
        subscriptionTier: user.subscriptionTier,
        subscriptionStatus: user.subscriptionStatus
      },
      current,
      'forumPosts'
    )

    return {
      allowed: result.allowed,
      limit: result.limit,
      current,
      remaining: result.remaining,
      requiresUpgrade: !result.allowed && user.subscriptionTier === 'free'
    }
  }

  static async trackStudyPlanGeneration(userId: string): Promise<void> {
    await connectDB()
    await User.findOneAndUpdate({ id: userId }, {
      $inc: { 'usage.studyPlansGenerated': 1 },
      'usage.lastActiveDate': new Date()
    })
  }

  static async trackCompanyAccess(userId: string, companyId: string): Promise<void> {
    await connectDB()
    await User.findOneAndUpdate({ id: userId }, {
      $addToSet: { 'usage.companiesAccessed': companyId },
      'usage.lastActiveDate': new Date()
    })
  }

  static async trackForumPost(userId: string): Promise<void> {
    await connectDB()
    await User.findOneAndUpdate({ id: userId }, {
      $inc: { 'usage.forumPostsCreated': 1 },
      'usage.lastActiveDate': new Date()
    })
  }

  static async trackMaterialAccess(userId: string, materialId: string): Promise<void> {
    await connectDB()
    await User.findOneAndUpdate({ id: userId }, {
      $addToSet: { 'usage.materialsAccessed': materialId },
      'usage.lastActiveDate': new Date()
    })
  }

  static async trackPageView(userId: string, page?: string): Promise<void> {
    await connectDB()
    const today = new Date().toISOString().split('T')[0]
    
    await User.findOneAndUpdate({ id: userId }, {
      $inc: { 'usage.totalPageViews': 1 },
      'usage.lastActiveDate': new Date()
    })

    // Update daily activity
    await User.findOneAndUpdate(
      { id: userId, 'usage.dailyActivity.date': { $ne: today } },
      {
        $push: {
          'usage.dailyActivity': {
            date: today,
            actions: 1
          }
        }
      }
    )

    // If today's entry exists, increment it
    await User.findOneAndUpdate(
      { id: userId, 'usage.dailyActivity.date': today },
      {
        $inc: { 'usage.dailyActivity.$.actions': 1 }
      }
    )

    // Track detailed activity
    if (page) {
      await this.trackDetailedActivity(userId, 'page_view', { page })
    }
  }

  static async trackDetailedActivity(userId: string, action: string, metadata?: any): Promise<void> {
    try {
      await connectDB()
      
      // Create activity log entry
      const activityData = {
        userId,
        action,
        metadata: metadata || {},
        timestamp: new Date(),
        sessionId: metadata?.sessionId || 'unknown'
      }

      // Store in user's activity log (keep last 100 activities)
      await User.findOneAndUpdate(
        { id: userId },
        {
          $push: {
            'usage.activityLog': {
              $each: [activityData],
              $slice: -100 // Keep only last 100 activities
            }
          },
          'usage.lastActiveDate': new Date()
        }
      )

      // Update specific counters based on action
      switch (action) {
        case 'question_viewed':
          await User.findOneAndUpdate({ id: userId }, {
            $inc: { 'usage.questionsViewed': 1 }
          })
          break
        case 'answer_posted':
          await User.findOneAndUpdate({ id: userId }, {
            $inc: { 'usage.answersPosted': 1 }
          })
          break
        case 'comment_posted':
          await User.findOneAndUpdate({ id: userId }, {
            $inc: { 'usage.commentsPosted': 1 }
          })
          break
        case 'vote_cast':
          await User.findOneAndUpdate({ id: userId }, {
            $inc: { 'usage.votesCast': 1 }
          })
          break
        case 'search_performed':
          await User.findOneAndUpdate({ id: userId }, {
            $inc: { 'usage.searchesPerformed': 1 }
          })
          break
        case 'profile_updated':
          await User.findOneAndUpdate({ id: userId }, {
            'usage.lastProfileUpdate': new Date()
          })
          break
      }
    } catch (error) {
      console.error('Error tracking detailed activity:', error)
    }
  }

  static async getUserUsageStats(userId: string) {
    await connectDB()
    const user = await User.findOne({ id: userId }) // Use custom id field instead of MongoDB _id
    if (!user) throw new Error('User not found')

    const limits = getSubscriptionLimits(user.subscriptionTier)
    const usage = user.usage || {}

    return {
      subscriptionTier: user.subscriptionTier,
      subscriptionStatus: user.subscriptionStatus,
      limits,
      usage: {
        studyPlans: {
          used: usage.studyPlansGenerated || 0,
          limit: limits.studyPlans,
          remaining: Math.max(0, limits.studyPlans - (usage.studyPlansGenerated || 0))
        },
        companies: {
          used: (usage.companiesAccessed || []).length,
          limit: limits.companies,
          remaining: Math.max(0, limits.companies - (usage.companiesAccessed || []).length)
        },
        forumPosts: {
          used: usage.forumPostsCreated || 0,
          limit: limits.forumPosts,
          remaining: Math.max(0, limits.forumPosts - (usage.forumPostsCreated || 0))
        },
        materials: {
          used: (usage.materialsAccessed || []).length,
          accessed: usage.materialsAccessed || []
        },
        totalPageViews: usage.totalPageViews || 0,
        dailyActivity: usage.dailyActivity || []
      },
      features: limits.features
    }
  }

  static async getActivityInsights(userId: string) {
    await connectDB()
    const user = await User.findOne({ id: userId })
    if (!user) throw new Error('User not found')

    const usage = user.usage || {}
    const activityLog = usage.activityLog || []
    
    // Calculate insights
    const last7Days = new Date()
    last7Days.setDate(last7Days.getDate() - 7)
    
    const recentActivity = activityLog.filter((activity: any) => 
      new Date(activity.timestamp) > last7Days
    )

    const actionCounts = recentActivity.reduce((acc: any, activity: any) => {
      acc[activity.action] = (acc[activity.action] || 0) + 1
      return acc
    }, {})

    return {
      totalActivities: activityLog.length,
      recentActivities: recentActivity.length,
      actionBreakdown: actionCounts,
      mostActiveDay: this.getMostActiveDay(usage.dailyActivity || []),
      streakDays: this.calculateStreak(usage.dailyActivity || []),
      lastActive: usage.lastActiveDate
    }
  }

  private static getMostActiveDay(dailyActivity: any[]) {
    if (!dailyActivity.length) return null
    return dailyActivity.reduce((max, day) => 
      day.actions > max.actions ? day : max
    )
  }

  private static calculateStreak(dailyActivity: any[]) {
    if (!dailyActivity.length) return 0
    
    const sortedDays = dailyActivity
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    let streak = 0
    const today = new Date().toISOString().split('T')[0]
    let currentDate = new Date(today)
    
    for (const day of sortedDays) {
      const dayDate = currentDate.toISOString().split('T')[0]
      if (day.date === dayDate && day.actions > 0) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }
    
    return streak
  }
}