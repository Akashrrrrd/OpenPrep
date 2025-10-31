import { AuthUser } from './auth'

export interface SubscriptionLimits {
  studyPlans: number
  companies: number
  forumPosts: number
  features: string[]
}

export const SUBSCRIPTION_LIMITS: Record<string, SubscriptionLimits> = {
  free: {
    studyPlans: 999, // HACKATHON MODE: Unlimited for demo
    companies: 999, // All companies as mentioned in pricing
    forumPosts: 999, // Full forum participation as mentioned in pricing
    features: ['basic_forum', 'all_companies', 'basic_study_plans', 'unlimited_study_plans', 'analytics', 'ai_features'] // HACKATHON MODE: All features
  },
  pro: {
    studyPlans: 999,
    companies: 999,
    forumPosts: 999,
    features: ['full_forum', 'all_companies', 'unlimited_study_plans', 'analytics', 'priority_support']
  },
  premium: {
    studyPlans: 999,
    companies: 999,
    forumPosts: 999,
    features: ['full_forum', 'all_companies', 'unlimited_study_plans', 'analytics', 'priority_support', 'mentoring', 'ai_features', 'job_referrals']
  }
}

export function getSubscriptionLimits(tier: string): SubscriptionLimits {
  return SUBSCRIPTION_LIMITS[tier] || SUBSCRIPTION_LIMITS.free
}

export function checkUsageLimit(
  user: AuthUser,
  currentUsage: number,
  limitType: keyof Omit<SubscriptionLimits, 'features'>
): { allowed: boolean; limit: number; remaining: number } {
  const limits = getSubscriptionLimits(user.subscriptionTier)
  const limit = limits[limitType]
  const remaining = Math.max(0, limit - currentUsage)
  
  return {
    allowed: currentUsage < limit,
    limit,
    remaining
  }
}

export function hasFeature(user: AuthUser, feature: string): boolean {
  const limits = getSubscriptionLimits(user.subscriptionTier)
  return limits.features.includes(feature)
}

export interface UsageStats {
  studyPlansGenerated: number
  companiesAccessed: number
  forumPostsCreated: number
}

export function getUsageProgress(user: AuthUser, usage: UsageStats) {
  const limits = getSubscriptionLimits(user.subscriptionTier)
  
  return {
    studyPlans: {
      current: usage.studyPlansGenerated,
      limit: limits.studyPlans,
      percentage: limits.studyPlans === 999 ? 0 : Math.min((usage.studyPlansGenerated / limits.studyPlans) * 100, 100)
    },
    companies: {
      current: usage.companiesAccessed,
      limit: limits.companies,
      percentage: limits.companies === 999 ? 0 : Math.min((usage.companiesAccessed / limits.companies) * 100, 100)
    },
    forumPosts: {
      current: usage.forumPostsCreated,
      limit: limits.forumPosts,
      percentage: limits.forumPosts === 999 ? 0 : Math.min((usage.forumPostsCreated / limits.forumPosts) * 100, 100)
    }
  }
}