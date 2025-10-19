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

  static async trackPageView(userId: string): Promise<void> {
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
}