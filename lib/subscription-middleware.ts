import { AuthUser } from './auth'
import { getSubscriptionLimits, checkUsageLimit } from './subscription-limits'
import connectDB from './mongodb'
import User from './models/User'

export interface UsageCheckResult {
  allowed: boolean
  message?: string
  limit: number
  current: number
  remaining: number
}

export class SubscriptionEnforcer {
  static async checkStudyPlanLimit(user: AuthUser): Promise<UsageCheckResult> {
    await connectDB()
    const userData = await User.findById(user.id)
    const currentUsage = userData?.usage?.studyPlansGenerated || 0
    
    const result = checkUsageLimit(user, currentUsage, 'studyPlans')
    
    return {
      allowed: result.allowed,
      message: result.allowed ? undefined : `You've reached your study plan limit (${result.limit}). Upgrade to Pro for unlimited access.`,
      limit: result.limit,
      current: currentUsage,
      remaining: result.remaining
    }
  }

  static async checkCompanyAccess(user: AuthUser, companyId: string): Promise<UsageCheckResult> {
    await connectDB()
    const userData = await User.findById(user.id)
    const accessedCompanies = userData?.usage?.companiesAccessed || []
    
    // If already accessed this company, allow it
    if (accessedCompanies.includes(companyId)) {
      return {
        allowed: true,
        limit: getSubscriptionLimits(user.subscriptionTier).companies,
        current: accessedCompanies.length,
        remaining: getSubscriptionLimits(user.subscriptionTier).companies - accessedCompanies.length
      }
    }
    
    const result = checkUsageLimit(user, accessedCompanies.length, 'companies')
    
    return {
      allowed: result.allowed,
      message: result.allowed ? undefined : `You've reached your company access limit (${result.limit}). Upgrade to Pro for unlimited access.`,
      limit: result.limit,
      current: accessedCompanies.length,
      remaining: result.remaining
    }
  }

  static async checkForumPostLimit(user: AuthUser): Promise<UsageCheckResult> {
    await connectDB()
    const userData = await User.findById(user.id)
    const currentUsage = userData?.usage?.forumPostsCreated || 0
    
    const result = checkUsageLimit(user, currentUsage, 'forumPosts')
    
    return {
      allowed: result.allowed,
      message: result.allowed ? undefined : `You've reached your forum post limit (${result.limit}). Upgrade to Pro for unlimited posting.`,
      limit: result.limit,
      current: currentUsage,
      remaining: result.remaining
    }
  }

  static async trackStudyPlanUsage(userId: string): Promise<void> {
    await connectDB()
    await User.findByIdAndUpdate(userId, {
      $inc: { 'usage.studyPlansGenerated': 1 },
      'usage.lastActiveDate': new Date()
    })
  }

  static async trackCompanyAccess(userId: string, companyId: string): Promise<void> {
    await connectDB()
    await User.findByIdAndUpdate(userId, {
      $addToSet: { 'usage.companiesAccessed': companyId },
      'usage.lastActiveDate': new Date()
    })
  }

  static async trackForumPost(userId: string): Promise<void> {
    await connectDB()
    await User.findByIdAndUpdate(userId, {
      $inc: { 'usage.forumPostsCreated': 1 },
      'usage.lastActiveDate': new Date()
    })
  }

  static async getUserUsageStats(userId: string) {
    await connectDB()
    const user = await User.findById(userId)
    if (!user) return null

    const limits = getSubscriptionLimits(user.subscriptionTier)
    
    return {
      subscriptionTier: user.subscriptionTier,
      limits,
      usage: {
        studyPlans: {
          used: user.usage?.studyPlansGenerated || 0,
          limit: limits.studyPlans,
          remaining: Math.max(0, limits.studyPlans - (user.usage?.studyPlansGenerated || 0))
        },
        companies: {
          used: user.usage?.companiesAccessed?.length || 0,
          limit: limits.companies,
          remaining: Math.max(0, limits.companies - (user.usage?.companiesAccessed?.length || 0))
        },
        forumPosts: {
          used: user.usage?.forumPostsCreated || 0,
          limit: limits.forumPosts,
          remaining: Math.max(0, limits.forumPosts - (user.usage?.forumPostsCreated || 0))
        }
      }
    }
  }
}