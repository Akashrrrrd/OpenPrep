import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { UsageTracker } from '@/lib/usage-tracker'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import Question from '@/lib/models/Question'
import InterviewExperience from '@/lib/models/InterviewExperience'
import StudyPlan from '@/lib/models/StudyPlan'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || '7d' // 7d, 30d, 90d, 1y

    await connectDB()

    // Get user data
    const user = await User.findOne({ id: decoded.userId })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    switch (timeframe) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    // Get activity insights
    const activityInsights = await UsageTracker.getActivityInsights(decoded.userId)
    
    // Get usage stats
    const usageStats = await UsageTracker.getUserUsageStats(decoded.userId)

    // Get forum activity
    const userQuestions = await Question.find({ 
      authorId: decoded.userId,
      createdAt: { $gte: startDate }
    }).sort({ createdAt: -1 })

    const userAnswers = await Question.find({
      'answers.authorId': decoded.userId,
      'answers.createdAt': { $gte: startDate }
    })

    // Get study plans
    const studyPlans = await StudyPlan.find({
      userId: decoded.userId,
      createdAt: { $gte: startDate }
    }).sort({ createdAt: -1 })

    // Calculate engagement metrics
    const totalVotes = userQuestions.reduce((sum, q) => sum + q.upvotes - q.downvotes, 0)
    const totalViews = userQuestions.reduce((sum, q) => sum + q.views, 0)
    const totalAnswers = userAnswers.reduce((sum, q) => sum + q.answers.filter((a: any) => a.authorId === decoded.userId).length, 0)

    // Calculate learning progress
    const dailyActivity = user.usage?.dailyActivity || []
    const recentActivity = dailyActivity.filter((day: any) => 
      new Date(day.date) >= startDate
    ).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Calculate streaks and patterns
    const currentStreak = activityInsights.streakDays
    const longestStreak = calculateLongestStreak(dailyActivity)
    const averageDaily = recentActivity.length > 0 
      ? recentActivity.reduce((sum: number, day: any) => sum + day.actions, 0) / recentActivity.length 
      : 0

    // Get learning insights
    const learningInsights = {
      mostActiveHour: getMostActiveHour(user.usage?.activityLog || []),
      preferredTopics: getPreferredTopics(userQuestions),
      learningVelocity: calculateLearningVelocity(recentActivity),
      knowledgeAreas: getKnowledgeAreas(userQuestions, userAnswers)
    }

    // Performance metrics
    const performanceMetrics = {
      questionSuccessRate: userQuestions.length > 0 ? 
        (userQuestions.filter(q => q.hasAcceptedAnswer).length / userQuestions.length) * 100 : 0,
      averageQuestionViews: userQuestions.length > 0 ? totalViews / userQuestions.length : 0,
      engagementScore: calculateEngagementScore(user.usage),
      contributionScore: calculateContributionScore(userQuestions, totalAnswers, totalVotes)
    }

    // Goals and achievements
    const achievements = calculateAchievements(user.usage, userQuestions, totalAnswers)
    const goals = generatePersonalizedGoals(user, usageStats, performanceMetrics)

    return NextResponse.json({
      timeframe,
      user: {
        name: user.name,
        subscriptionTier: user.subscriptionTier,
        joinDate: user.createdAt,
        lastActive: user.usage?.lastActiveDate
      },
      activityInsights,
      usageStats,
      engagement: {
        questionsAsked: userQuestions.length,
        answersGiven: totalAnswers,
        totalVotes,
        totalViews,
        currentStreak,
        longestStreak,
        averageDailyActivity: Math.round(averageDaily * 10) / 10
      },
      performance: performanceMetrics,
      learning: learningInsights,
      progress: {
        dailyActivity: recentActivity,
        studyPlansCompleted: studyPlans.filter(sp => sp.progress === 100).length,
        totalStudyPlans: studyPlans.length,
        companiesExplored: (user.usage?.companiesAccessed || []).length,
        materialsAccessed: (user.usage?.materialsAccessed || []).length
      },
      achievements,
      goals,
      recommendations: generateRecommendations(user, performanceMetrics, learningInsights)
    })

  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function calculateLongestStreak(dailyActivity: any[]): number {
  if (!dailyActivity.length) return 0
  
  const sortedDays = dailyActivity
    .filter(day => day.actions > 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  
  let maxStreak = 0
  let currentStreak = 0
  let lastDate: Date | null = null
  
  for (const day of sortedDays) {
    const currentDate = new Date(day.date)
    
    if (lastDate && (currentDate.getTime() - lastDate.getTime()) === 24 * 60 * 60 * 1000) {
      currentStreak++
    } else {
      currentStreak = 1
    }
    
    maxStreak = Math.max(maxStreak, currentStreak)
    lastDate = currentDate
  }
  
  return maxStreak
}

function getMostActiveHour(activityLog: any[]): number {
  const hourCounts: { [key: number]: number } = {}
  
  activityLog.forEach(activity => {
    const hour = new Date(activity.timestamp).getHours()
    hourCounts[hour] = (hourCounts[hour] || 0) + 1
  })
  
  let maxHour = 0
  let maxCount = 0
  
  for (const [hour, count] of Object.entries(hourCounts)) {
    if (count > maxCount) {
      maxCount = count
      maxHour = parseInt(hour)
    }
  }
  
  return maxHour
}

function getPreferredTopics(questions: any[]): string[] {
  const topicCounts: { [key: string]: number } = {}
  
  questions.forEach(question => {
    question.tags?.forEach((tag: string) => {
      topicCounts[tag] = (topicCounts[tag] || 0) + 1
    })
  })
  
  return Object.entries(topicCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([topic]) => topic)
}

function calculateLearningVelocity(recentActivity: any[]): number {
  if (recentActivity.length < 2) return 0
  
  const recent = recentActivity.slice(-7) // Last 7 days
  const previous = recentActivity.slice(-14, -7) // Previous 7 days
  
  const recentAvg = recent.reduce((sum, day) => sum + day.actions, 0) / recent.length
  const previousAvg = previous.length > 0 ? previous.reduce((sum, day) => sum + day.actions, 0) / previous.length : 0
  
  return previousAvg > 0 ? ((recentAvg - previousAvg) / previousAvg) * 100 : 0
}

function getKnowledgeAreas(questions: any[], answers: any[]): any[] {
  const areas: { [key: string]: { questions: number, answers: number, expertise: number } } = {}
  
  questions.forEach(q => {
    q.tags?.forEach((tag: string) => {
      if (!areas[tag]) areas[tag] = { questions: 0, answers: 0, expertise: 0 }
      areas[tag].questions++
    })
  })
  
  answers.forEach(q => {
    q.tags?.forEach((tag: string) => {
      if (!areas[tag]) areas[tag] = { questions: 0, answers: 0, expertise: 0 }
      areas[tag].answers++
    })
  })
  
  // Calculate expertise score
  Object.keys(areas).forEach(area => {
    const data = areas[area]
    data.expertise = (data.questions * 1 + data.answers * 2) // Answers weighted more
  })
  
  return Object.entries(areas)
    .map(([area, data]) => ({ area, ...data }))
    .sort((a, b) => b.expertise - a.expertise)
    .slice(0, 10)
}

function calculateEngagementScore(usage: any): number {
  const weights = {
    pageViews: 0.1,
    questionsViewed: 0.2,
    answersPosted: 0.3,
    commentsPosted: 0.2,
    votesCast: 0.1,
    studyPlans: 0.1
  }
  
  return Math.min(100, Math.round(
    (usage.totalPageViews || 0) * weights.pageViews +
    (usage.questionsViewed || 0) * weights.questionsViewed +
    (usage.answersPosted || 0) * weights.answersPosted +
    (usage.commentsPosted || 0) * weights.commentsPosted +
    (usage.votesCast || 0) * weights.votesCast +
    (usage.studyPlansGenerated || 0) * weights.studyPlans
  ))
}

function calculateContributionScore(questions: any[], answers: number, votes: number): number {
  const questionScore = questions.length * 5
  const answerScore = answers * 10
  const voteScore = Math.max(0, votes) * 2
  
  return questionScore + answerScore + voteScore
}

function calculateAchievements(usage: any, questions: any[], answers: number): any[] {
  const achievements = []
  
  // Question achievements
  if (questions.length >= 1) achievements.push({ name: 'First Question', description: 'Asked your first question', unlocked: true })
  if (questions.length >= 10) achievements.push({ name: 'Curious Mind', description: 'Asked 10 questions', unlocked: true })
  if (questions.length >= 50) achievements.push({ name: 'Question Master', description: 'Asked 50 questions', unlocked: true })
  
  // Answer achievements
  if (answers >= 1) achievements.push({ name: 'Helper', description: 'Gave your first answer', unlocked: true })
  if (answers >= 10) achievements.push({ name: 'Knowledge Sharer', description: 'Gave 10 answers', unlocked: true })
  if (answers >= 50) achievements.push({ name: 'Expert Contributor', description: 'Gave 50 answers', unlocked: true })
  
  // Streak achievements
  const streak = usage.dailyActivity?.length || 0
  if (streak >= 7) achievements.push({ name: 'Week Warrior', description: '7-day learning streak', unlocked: true })
  if (streak >= 30) achievements.push({ name: 'Monthly Master', description: '30-day learning streak', unlocked: true })
  
  // Study plan achievements
  if ((usage.studyPlansGenerated || 0) >= 1) achievements.push({ name: 'Planner', description: 'Created your first study plan', unlocked: true })
  if ((usage.studyPlansGenerated || 0) >= 5) achievements.push({ name: 'Strategic Learner', description: 'Created 5 study plans', unlocked: true })
  
  return achievements
}

function generatePersonalizedGoals(user: any, usageStats: any, performance: any): any[] {
  const goals = []
  
  // Based on current activity
  if (usageStats.usage.studyPlans.used < 3) {
    goals.push({
      title: 'Create More Study Plans',
      description: 'Generate 3 personalized study plans',
      progress: (usageStats.usage.studyPlans.used / 3) * 100,
      target: 3,
      current: usageStats.usage.studyPlans.used
    })
  }
  
  if (performance.questionSuccessRate < 50) {
    goals.push({
      title: 'Improve Question Quality',
      description: 'Get accepted answers for 50% of your questions',
      progress: performance.questionSuccessRate,
      target: 50,
      current: Math.round(performance.questionSuccessRate)
    })
  }
  
  if (performance.engagementScore < 75) {
    goals.push({
      title: 'Increase Engagement',
      description: 'Reach 75% engagement score',
      progress: performance.engagementScore,
      target: 75,
      current: performance.engagementScore
    })
  }
  
  return goals
}

function generateRecommendations(user: any, performance: any, learning: any): string[] {
  const recommendations = []
  
  if (performance.questionSuccessRate < 30) {
    recommendations.push('Try to be more specific in your questions and provide more context')
  }
  
  if (learning.learningVelocity < 0) {
    recommendations.push('Consider setting daily learning goals to maintain consistency')
  }
  
  if ((user.usage?.studyPlansGenerated || 0) === 0) {
    recommendations.push('Create your first study plan to get personalized learning recommendations')
  }
  
  if (performance.engagementScore < 50) {
    recommendations.push('Try answering questions in your areas of expertise to boost engagement')
  }
  
  return recommendations
}