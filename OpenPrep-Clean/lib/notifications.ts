import connectDB from './mongodb'
import Notification, { INotification } from './models/Notification'
import User from './models/User'
import { randomUUID } from 'crypto'

export class NotificationService {
  static async createNotification(data: Omit<INotification, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Promise<INotification> {
    await connectDB()
    
    const notification = new Notification({
      ...data,
      id: randomUUID()
    })
    
    await notification.save()
    return notification.toObject()
  }

  static async getUserNotifications(userId: string, options: {
    limit?: number
    offset?: number
    unreadOnly?: boolean
  } = {}): Promise<{ notifications: INotification[], total: number, unreadCount: number }> {
    await connectDB()
    
    const { limit = 20, offset = 0, unreadOnly = false } = options
    
    const query: any = { userId }
    if (unreadOnly) {
      query.read = false
    }
    
    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset)
        .lean(),
      Notification.countDocuments(query),
      Notification.countDocuments({ userId, read: false })
    ])
    
    return {
      notifications: notifications as INotification[],
      total,
      unreadCount
    }
  }

  static async markAsRead(userId: string, notificationIds: string[]): Promise<void> {
    await connectDB()
    
    await Notification.updateMany(
      { userId, id: { $in: notificationIds } },
      { read: true }
    )
  }

  static async markAllAsRead(userId: string): Promise<void> {
    await connectDB()
    
    await Notification.updateMany(
      { userId, read: false },
      { read: true }
    )
  }

  static async deleteNotification(userId: string, notificationId: string): Promise<void> {
    await connectDB()
    
    await Notification.deleteOne({ userId, id: notificationId })
  }

  static async deleteExpiredNotifications(): Promise<void> {
    await connectDB()
    
    await Notification.deleteMany({
      expiresAt: { $lt: new Date() }
    })
  }

  // Specific notification creators
  static async notifyQuestionAnswered(questionId: string, questionTitle: string, answererName: string, questionAuthorId: string): Promise<void> {
    if (!questionAuthorId) return
    
    await this.createNotification({
      userId: questionAuthorId,
      type: 'social',
      title: 'New Answer on Your Question',
      message: `${answererName} answered your question "${questionTitle}"`,
      actionUrl: `/forum/question/${questionId}`,
      actionText: 'View Answer',
      priority: 'medium',
      metadata: {
        questionId,
        fromUserName: answererName
      }
    })
  }

  static async notifyAnswerUpvoted(answerId: string, questionId: string, voterName: string, answerAuthorId: string): Promise<void> {
    if (!answerAuthorId) return
    
    await this.createNotification({
      userId: answerAuthorId,
      type: 'success',
      title: 'Answer Upvoted',
      message: `${voterName} upvoted your answer`,
      actionUrl: `/forum/question/${questionId}`,
      actionText: 'View Question',
      priority: 'low',
      metadata: {
        answerId,
        questionId,
        fromUserName: voterName
      }
    })
  }

  static async notifyCommentAdded(questionId: string, questionTitle: string, commenterName: string, targetUserId: string): Promise<void> {
    if (!targetUserId) return
    
    await this.createNotification({
      userId: targetUserId,
      type: 'social',
      title: 'New Comment',
      message: `${commenterName} commented on "${questionTitle}"`,
      actionUrl: `/forum/question/${questionId}`,
      actionText: 'View Comment',
      priority: 'low',
      metadata: {
        questionId,
        fromUserName: commenterName
      }
    })
  }

  static async notifyStudyPlanGenerated(userId: string, studyPlanId: string): Promise<void> {
    await this.createNotification({
      userId,
      type: 'success',
      title: 'Study Plan Generated',
      message: 'Your personalized study plan is ready!',
      actionUrl: `/study-planner/plan?id=${studyPlanId}`,
      actionText: 'View Plan',
      priority: 'medium'
    })
  }

  static async notifySubscriptionExpiring(userId: string, daysLeft: number): Promise<void> {
    await this.createNotification({
      userId,
      type: 'warning',
      title: 'Subscription Expiring Soon',
      message: `Your subscription expires in ${daysLeft} days. Renew to continue accessing premium features.`,
      actionUrl: '/pricing',
      actionText: 'Renew Now',
      priority: 'high',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Expire in 7 days
    })
  }

  static async notifyUsageLimitReached(userId: string, limitType: string): Promise<void> {
    const messages = {
      studyPlans: 'You\'ve reached your study plan generation limit.',
      companies: 'You\'ve reached your company access limit.',
      forumPosts: 'You\'ve reached your forum post limit.'
    }
    
    await this.createNotification({
      userId,
      type: 'warning',
      title: 'Usage Limit Reached',
      message: messages[limitType as keyof typeof messages] || 'You\'ve reached a usage limit.',
      actionUrl: '/pricing',
      actionText: 'Upgrade Plan',
      priority: 'medium'
    })
  }

  static async notifyAchievement(userId: string, achievement: string, description: string): Promise<void> {
    await this.createNotification({
      userId,
      type: 'achievement',
      title: `Achievement Unlocked: ${achievement}`,
      message: description,
      priority: 'medium',
      metadata: {
        achievement
      }
    })
  }

  static async notifyStudyReminder(userId: string): Promise<void> {
    await this.createNotification({
      userId,
      type: 'reminder',
      title: 'Study Reminder',
      message: 'Don\'t forget to continue your study plan today!',
      actionUrl: '/study-planner',
      actionText: 'Continue Studying',
      priority: 'low',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // Expire in 24 hours
    })
  }

  static async notifyWeeklyProgress(userId: string, stats: any): Promise<void> {
    await this.createNotification({
      userId,
      type: 'info',
      title: 'Weekly Progress Report',
      message: `This week: ${stats.questionsViewed} questions viewed, ${stats.studyHours} hours studied`,
      actionUrl: '/dashboard',
      actionText: 'View Dashboard',
      priority: 'low',
      metadata: stats
    })
  }
}

// Background job functions
export async function sendDailyReminders() {
  await connectDB()
  
  const users = await User.find({
    'preferences.studyReminders': true,
    'usage.lastActiveDate': {
      $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) // Not active in last 24 hours
    }
  })
  
  for (const user of users) {
    await NotificationService.notifyStudyReminder(user.id)
  }
}

export async function checkSubscriptionExpirations() {
  await connectDB()
  
  const expiringUsers = await User.find({
    subscriptionStatus: 'active',
    subscriptionEndDate: {
      $gte: new Date(),
      $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Expires within 7 days
    }
  })
  
  for (const user of expiringUsers) {
    const daysLeft = Math.ceil((user.subscriptionEndDate!.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
    await NotificationService.notifySubscriptionExpiring(user.id, daysLeft)
  }
}

export async function generateWeeklyReports() {
  await connectDB()
  
  const users = await User.find({
    'preferences.weeklyProgress': true
  })
  
  for (const user of users) {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const recentActivity = user.usage.dailyActivity?.filter((day: any) => 
      new Date(day.date) > weekAgo
    ) || []
    
    const stats = {
      questionsViewed: user.usage.questionsViewed || 0,
      studyHours: recentActivity.reduce((sum: number, day: any) => sum + (day.actions * 0.1), 0), // Rough estimate
      activeDays: recentActivity.length
    }
    
    await NotificationService.notifyWeeklyProgress(user.id, stats)
  }
}