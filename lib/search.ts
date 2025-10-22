import connectDB from './mongodb'
import Question from './models/Question'
import InterviewExperience from './models/InterviewExperience'
import Material from './models/Material'
import User from './models/User'
import Company from './models/Company'
import { now } from 'mongoose'
import { now } from 'mongoose'
import { now } from 'mongoose'
import { now } from 'mongoose'
import { now } from 'mongoose'

export interface SearchResult {
  id: string
  type: 'question' | 'experience' | 'material' | 'company' | 'user'
  title: string
  description: string
  url: string
  relevanceScore: number
  metadata?: any
}

export interface SearchFilters {
  type?: string[]
  tags?: string[]
  difficulty?: string[]
  company?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
}

export class SearchService {
  static async search(
    query: string, 
    filters: SearchFilters = {}, 
    userId?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ results: SearchResult[], total: number, suggestions: string[] }> {
    await connectDB()
    
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2)
    const results: SearchResult[] = []
    
    // Track search for analytics
    if (userId) {
      await this.trackSearch(userId, query, filters)
    }
    
    // Search Questions
    if (!filters.type || filters.type.includes('question')) {
      const questionResults = await this.searchQuestions(searchTerms, filters)
      results.push(...questionResults)
    }
    
    // Search Interview Experiences
    if (!filters.type || filters.type.includes('experience')) {
      const experienceResults = await this.searchExperiences(searchTerms, filters)
      results.push(...experienceResults)
    }
    
    // Search Materials
    if (!filters.type || filters.type.includes('material')) {
      const materialResults = await this.searchMaterials(searchTerms, filters)
      results.push(...materialResults)
    }
    
    // Search Companies
    if (!filters.type || filters.type.includes('company')) {
      const companyResults = await this.searchCompanies(searchTerms, filters)
      results.push(...companyResults)
    }
    
    // Sort by relevance score
    results.sort((a, b) => b.relevanceScore - a.relevanceScore)
    
    // Generate search suggestions
    const suggestions = await this.generateSuggestions(query, results)
    
    const paginatedResults = results.slice(offset, offset + limit)
    
    return {
      results: paginatedResults,
      total: results.length,
      suggestions
    }
  }
  
  private static async searchQuestions(searchTerms: string[], filters: SearchFilters): Promise<SearchResult[]> {
    const query: any = {
      $or: [
        { title: { $regex: searchTerms.join('|'), $options: 'i' } },
        { content: { $regex: searchTerms.join('|'), $options: 'i' } },
        { tags: { $in: searchTerms } }
      ]
    }
    
    if (filters.tags?.length) {
      query.tags = { $in: filters.tags }
    }
    
    if (filters.difficulty?.length) {
      query.difficulty = { $in: filters.difficulty }
    }
    
    if (filters.dateRange) {
      query.createdAt = {
        $gte: filters.dateRange.start,
        $lte: filters.dateRange.end
      }
    }
    
    const questions = await Question.find(query).limit(50).lean()
    
    return questions.map(q => ({
      id: q.id,
      type: 'question' as const,
      title: q.title,
      description: q.content.substring(0, 200) + '...',
      url: `/forum/question/${q.id}`,
      relevanceScore: this.calculateRelevanceScore(searchTerms, [q.title, q.content, ...q.tags]),
      metadata: {
        tags: q.tags,
        upvotes: q.upvotes,
        views: q.views,
        hasAcceptedAnswer: q.hasAcceptedAnswer
      }
    }))
  }
  
  private static async searchExperiences(searchTerms: string[], filters: SearchFilters): Promise<SearchResult[]> {
    const query: any = {
      $or: [
        { role: { $regex: searchTerms.join('|'), $options: 'i' } },
        { 'rounds.questions': { $regex: searchTerms.join('|'), $options: 'i' } },
        { 'rounds.tips': { $regex: searchTerms.join('|'), $options: 'i' } }
      ]
    }
    
    if (filters.company?.length) {
      query.companyId = { $in: filters.company }
    }
    
    if (filters.dateRange) {
      query.date = {
        $gte: filters.dateRange.start.toISOString().split('T')[0],
        $lte: filters.dateRange.end.toISOString().split('T')[0]
      }
    }
    
    const experiences = await InterviewExperience.find(query).limit(50).lean()
    
    return experiences.map(exp => ({
      id: exp.id,
      type: 'experience' as const,
      title: `${exp.role} Interview Experience`,
      description: `${exp.outcome} - ${exp.overallDifficulty}/5 difficulty`,
      url: `/experiences#${exp.id}`,
      relevanceScore: this.calculateRelevanceScore(searchTerms, [
        exp.role,
        ...exp.rounds.flatMap((r: any) => [...r.questions, ...r.tips])
      ]),
      metadata: {
        companyId: exp.companyId,
        outcome: exp.outcome,
        difficulty: exp.overallDifficulty,
        upvotes: exp.upvotes
      }
    }))
  }
  
  private static async searchMaterials(searchTerms: string[], filters: SearchFilters): Promise<SearchResult[]> {
    const query: any = {
      $or: [
        { name: { $regex: searchTerms.join('|'), $options: 'i' } },
        { description: { $regex: searchTerms.join('|'), $options: 'i' } },
        { category: { $regex: searchTerms.join('|'), $options: 'i' } },
        { tags: { $in: searchTerms } }
      ]
    }
    
    if (filters.tags?.length) {
      query.tags = { $in: filters.tags }
    }
    
    if (filters.difficulty?.length) {
      query.difficulty = { $in: filters.difficulty }
    }
    
    const materials = await Material.find(query).limit(50).lean()
    
    return materials.map(mat => ({
      id: mat.id,
      type: 'material' as const,
      title: mat.name,
      description: mat.description,
      url: `/materials/${mat.id}`,
      relevanceScore: this.calculateRelevanceScore(searchTerms, [
        mat.name,
        mat.description,
        mat.category,
        ...(mat.tags || [])
      ]),
      metadata: {
        category: mat.category,
        difficulty: mat.difficulty,
        accessCount: mat.accessCount
      }
    }))
  }
  
  private static async searchCompanies(searchTerms: string[], filters: SearchFilters): Promise<SearchResult[]> {
    const query: any = {
      $or: [
        { name: { $regex: searchTerms.join('|'), $options: 'i' } },
        { description: { $regex: searchTerms.join('|'), $options: 'i' } },
        { industry: { $regex: searchTerms.join('|'), $options: 'i' } }
      ]
    }
    
    const companies = await Company.find(query).limit(20).lean()
    
    return companies.map(comp => ({
      id: comp.id,
      type: 'company' as const,
      title: comp.name,
      description: comp.description || `${comp.industry} company`,
      url: `/company/${comp.id}`,
      relevanceScore: this.calculateRelevanceScore(searchTerms, [
        comp.name,
        comp.description || '',
        comp.industry || ''
      ]),
      metadata: {
        industry: comp.industry,
        size: comp.size,
        headquarters: comp.headquarters
      }
    }))
  }
  
  private static calculateRelevanceScore(searchTerms: string[], content: string[]): number {
    const text = content.join(' ').toLowerCase()
    let score = 0
    
    searchTerms.forEach(term => {
      const termCount = (text.match(new RegExp(term, 'g')) || []).length
      score += termCount * (term.length / 10) // Longer terms get higher weight
    })
    
    return score
  }
  
  private static async generateSuggestions(query: string, results: SearchResult[]): Promise<string[]> {
    const suggestions: Set<string> = new Set()
    
    // Extract common tags from results
    results.forEach(result => {
      if (result.metadata?.tags) {
        result.metadata.tags.forEach((tag: string) => {
          if (tag.toLowerCase().includes(query.toLowerCase()) || query.toLowerCase().includes(tag.toLowerCase())) {
            suggestions.add(tag)
          }
        })
      }
    })
    
    // Add popular search terms (you could store these in database)
    const popularTerms = [
      'javascript', 'python', 'react', 'node.js', 'sql', 'algorithms',
      'data structures', 'system design', 'machine learning', 'aws',
      'docker', 'kubernetes', 'mongodb', 'postgresql', 'redis'
    ]
    
    popularTerms.forEach(term => {
      if (term.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(term)
      }
    })
    
    return Array.from(suggestions).slice(0, 5)
  }
  
  private static async trackSearch(userId: string, query: string, filters: SearchFilters): Promise<void> {
    try {
      await User.findOneAndUpdate(
        { id: userId },
        {
          $push: {
            'usage.searchHistory': {
              $each: [{
                query,
                filters,
                timestamp: new Date()
              }],
              $slice: -50 // Keep last 50 searches
            }
          },
          $inc: { 'usage.searchesPerformed': 1 },
          'usage.lastActiveDate': new Date()
        }
      )
    } catch (error) {
      console.error('Error tracking search:', error)
    }
  }
  
  static async getPersonalizedRecommendations(userId: string, limit: number = 10): Promise<SearchResult[]> {
    try {
      await connectDB()
      
      const user = await User.findOne({ id: userId })
      if (!user) {
        // Return default recommendations for new users
        return this.getDefaultRecommendations(limit)
      }
    
    const recommendations: SearchResult[] = []
    
    // Get user's interests from profile and activity
    const interests = [
      ...(user.profile?.focusAreas || []),
      ...(user.profile?.targetCompanies || [])
    ]
    
    const userLevel = user.profile?.preparationLevel || 'beginner'
    
    // 1. Recommend study materials based on user's preparation level
    const levelMaterials = await Material.find({
      difficulty: userLevel,
      category: { $in: ['interview-prep', 'coding', 'system-design'] }
    })
    .sort({ accessCount: -1 })
    .limit(3)
    .lean()
    
    levelMaterials.forEach(mat => {
      recommendations.push({
        id: mat.id,
        type: 'material',
        title: mat.name,
        description: `${mat.difficulty} level - ${mat.description}`,
        url: `/materials/${mat.id}`,
        relevanceScore: 100 + (mat.accessCount || 0),
        metadata: { 
          category: mat.category, 
          difficulty: mat.difficulty,
          reason: 'Based on your preparation level'
        }
      })
    })
    
    // 2. Recommend questions from user's focus areas
    if (interests.length > 0) {
      const focusQuestions = await Question.find({
        tags: { $in: interests },
        authorId: { $ne: userId },
        hasAcceptedAnswer: true // Prioritize answered questions
      })
      .sort({ upvotes: -1 })
      .limit(2)
      .lean()
      
      focusQuestions.forEach(q => {
        recommendations.push({
          id: q.id,
          type: 'question',
          title: q.title,
          description: `Popular in ${q.tags.find(tag => interests.includes(tag)) || 'your interests'}`,
          url: `/forum/question/${q.id}`,
          relevanceScore: 90 + q.upvotes,
          metadata: { 
            tags: q.tags, 
            upvotes: q.upvotes,
            reason: 'Matches your focus areas'
          }
        })
      })
    }
    
    // 3. Recommend companies based on user's target companies
    if (user.profile?.targetCompanies?.length > 0) {
      const targetCompanies = await Company.find({
        id: { $in: user.profile.targetCompanies }
      })
      .limit(2)
      .lean()
      
      targetCompanies.forEach(comp => {
        recommendations.push({
          id: comp.id,
          type: 'company',
          title: comp.name,
          description: `Your target company - ${comp.industry}`,
          url: `/company/${comp.id}`,
          relevanceScore: 95,
          metadata: { 
            industry: comp.industry,
            reason: 'From your target companies'
          }
        })
      })
    }
    
    // If not enough recommendations, fill with popular content
    if (recommendations.length < limit) {
      const additional = await this.getDefaultRecommendations(limit - recommendations.length)
      recommendations.push(...additional)
    }
    
      // Sort by relevance and return limited results
      return recommendations
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, limit)
    } catch (error) {
      console.error('Error fetching personalized recommendations:', error)
      // Return fallback recommendations
      return this.getDefaultRecommendations(limit)
    }
  }
  
  private static async getDefaultRecommendations(limit: number): Promise<SearchResult[]> {
    try {
      const recommendations: SearchResult[] = []
      
      // Popular beginner materials
      const beginnerMaterials = await Material.find({
        difficulty: 'beginner',
        category: { $in: ['interview-prep', 'coding'] }
      })
      .sort({ accessCount: -1 })
      .limit(2)
      .lean()
    
    beginnerMaterials.forEach(mat => {
      recommendations.push({
        id: mat.id,
        type: 'material',
        title: mat.name,
        description: `Popular beginner resource - ${mat.description}`,
        url: `/materials/${mat.id}`,
        relevanceScore: 80,
        metadata: { 
          category: mat.category, 
          difficulty: mat.difficulty,
          reason: 'Popular for beginners'
        }
      })
    })
    
    // Popular questions
    const popularQuestions = await Question.find({
      hasAcceptedAnswer: true,
      upvotes: { $gte: 5 }
    })
    .sort({ upvotes: -1, views: -1 })
    .limit(2)
    .lean()
    
    popularQuestions.forEach(q => {
      recommendations.push({
        id: q.id,
        type: 'question',
        title: q.title,
        description: `Popular question with ${q.upvotes} upvotes`,
        url: `/forum/question/${q.id}`,
        relevanceScore: 75 + q.upvotes,
        metadata: { 
          tags: q.tags, 
          upvotes: q.upvotes,
          reason: 'Popular among users'
        }
      })
    })
    
      return recommendations.slice(0, limit)
    } catch (error) {
      console.error('Error fetching default recommendations:', error)
      // Return hardcoded fallback recommendations
      return [
        {
          id: 'default-1',
          type: 'material',
          title: 'Getting Started with Interviews',
          description: 'Essential guide for interview preparation',
          url: '/materials',
          relevanceScore: 70,
          metadata: { 
            category: 'interview-prep', 
            difficulty: 'beginner',
            reason: 'Popular for beginners'
          }
        },
        {
          id: 'default-2',
          type: 'question',
          title: 'How to prepare for technical interviews?',
          description: 'Common question about technical preparation',
          url: '/forum',
          relevanceScore: 65,
          metadata: { 
            tags: ['technical', 'preparation'],
            reason: 'Popular among users'
          }
        }
      ].slice(0, limit)
    }
  }
  
  static async getTrendingContent(): Promise<SearchResult[]> {
    try {
      await connectDB()
      
      const results: SearchResult[] = []
      const now = new Date()
      const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    
    // 1. Hot questions (recent with high engagement)
    const hotQuestions = await Question.find({
      createdAt: { $gte: last24Hours },
      $or: [
        { views: { $gte: 50 } },
        { upvotes: { $gte: 3 } },
        { answerCount: { $gte: 2 } }
      ]
    })
    .sort({ 
      views: -1, 
      upvotes: -1, 
      createdAt: -1 
    })
    .limit(3)
    .lean()
    
    hotQuestions.forEach(q => {
      results.push({
        id: q.id,
        type: 'question',
        title: q.title,
        description: `🔥 Hot topic - ${q.views} views, ${q.upvotes} upvotes`,
        url: `/forum/question/${q.id}`,
        relevanceScore: (q.views || 0) + (q.upvotes * 20) + (q.answerCount * 10),
        metadata: { 
          tags: q.tags, 
          upvotes: q.upvotes, 
          views: q.views,
          trend: 'hot'
        }
      })
    })
    
    // 2. Trending interview experiences (recent with high upvotes)
    const trendingExperiences = await InterviewExperience.find({
      createdAt: { $gte: last7Days },
      upvotes: { $gte: 2 }
    })
    .sort({ upvotes: -1, createdAt: -1 })
    .limit(2)
    .lean()
    
    trendingExperiences.forEach(exp => {
      results.push({
        id: exp.id,
        type: 'experience',
        title: `${exp.role} at ${exp.companyId}`,
        description: `📈 Trending experience - ${exp.upvotes} upvotes`,
        url: `/experiences#${exp.id}`,
        relevanceScore: exp.upvotes * 25 + 50,
        metadata: { 
          companyId: exp.companyId,
          outcome: exp.outcome,
          difficulty: exp.overallDifficulty,
          upvotes: exp.upvotes,
          trend: 'rising'
        }
      })
    })
    
    // 3. Most accessed materials this week
    const weeklyPopularMaterials = await Material.find({
      // Assuming we track weekly access (you might need to add this field)
      accessCount: { $gte: 10 }
    })
    .sort({ accessCount: -1 })
    .limit(2)
    .lean()
    
    weeklyPopularMaterials.forEach(mat => {
      results.push({
        id: mat.id,
        type: 'material',
        title: mat.name,
        description: `⚡ Popular this week - ${mat.accessCount} views`,
        url: `/materials/${mat.id}`,
        relevanceScore: (mat.accessCount || 0) + 30,
        metadata: { 
          category: mat.category,
          difficulty: mat.difficulty,
          accessCount: mat.accessCount,
          trend: 'popular'
        }
      })
    })
    
    // 4. If not enough trending content, add some recent popular content
    if (results.length < 5) {
      const recentPopular = await Question.find({
        createdAt: { $gte: last7Days }
      })
      .sort({ upvotes: -1, views: -1 })
      .limit(5 - results.length)
      .lean()
      
      recentPopular.forEach(q => {
        results.push({
          id: q.id,
          type: 'question',
          title: q.title,
          description: `Recent popular - ${q.upvotes} upvotes`,
          url: `/forum/question/${q.id}`,
          relevanceScore: (q.upvotes * 15) + (q.views || 0) / 10,
          metadata: { 
            tags: q.tags, 
            upvotes: q.upvotes,
            trend: 'recent'
          }
        })
      })
    }
    
      return results
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 6) // Limit to 6 trending items
    } catch (error) {
      console.error('Error fetching trending content:', error)
      // Return fallback trending content
      return [
        {
          id: 'fallback-1',
          type: 'question',
          title: 'What are the most common interview questions?',
          description: 'Popular question about interview preparation',
          url: '/forum',
          relevanceScore: 50,
          metadata: { tags: ['interview', 'preparation'], trend: 'popular' }
        },
        {
          id: 'fallback-2',
          type: 'material',
          title: 'Interview Preparation Guide',
          description: 'Essential materials for interview success',
          url: '/materials',
          relevanceScore: 45,
          metadata: { category: 'interview-prep', trend: 'popular' }
        }
      ]
    }
  }
}