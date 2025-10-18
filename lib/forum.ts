import connectDB from './mongodb'
import Question, { IQuestion, IAnswer } from './models/Question'

// Define types that match the client component expectations
interface Like {
  userId: string
  username: string
  timestamp: string
}

interface Comment {
  id: string
  content: string
  author: string
  authorReputation: number
  likes: Like[]
  createdAt: string
  updatedAt: string
}

export interface Answer {
  id: string
  content: string
  author: string
  authorReputation: number
  upvotes: Like[]
  downvotes: Like[]
  comments: Comment[]
  isAccepted: boolean
  expertVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface Question {
  id: string
  title: string
  content: string
  author: string
  authorReputation: number
  tags: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  upvotes: Like[]
  downvotes: Like[]
  views: number
  comments: Comment[]
  answers: Answer[]
  hasAcceptedAnswer: boolean
  createdAt: string
  updatedAt: string
}

// Helper function to clean MongoDB objects for client serialization
const cleanObject = (obj: any): any => {
  if (obj === null || obj === undefined) return obj
  if (Array.isArray(obj)) return obj.map(cleanObject)
  if (typeof obj === 'object') {
    const cleaned: any = {}
    for (const [key, value] of Object.entries(obj)) {
      if (key === '_id') continue // Skip MongoDB _id
      if (value instanceof Date) {
        cleaned[key] = value.toISOString()
      } else if (typeof value === 'object' && value !== null) {
        cleaned[key] = cleanObject(value)
      } else {
        cleaned[key] = value
      }
    }
    return cleaned
  }
  return obj
}

function formatQuestion(q: IQuestion): any {
  const formatted = {
    id: q.id,
    title: q.title,
    content: q.content,
    author: q.author,
    authorReputation: q.authorReputation,
    tags: [...q.tags],
    difficulty: q.difficulty,
    upvotes: q.upvotes || [],
    downvotes: q.downvotes || [],
    views: q.views,
    comments: q.comments || [],
    answers: q.answers ? q.answers.map(formatAnswer) : [],
    hasAcceptedAnswer: q.hasAcceptedAnswer,
    createdAt: q.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: q.updatedAt?.toISOString() || new Date().toISOString()
  }
  return cleanObject(formatted)
}

function formatAnswer(a: IAnswer): any {
  const formatted = {
    id: a.id,
    content: a.content,
    author: a.author,
    authorReputation: a.authorReputation,
    upvotes: a.upvotes || [],
    downvotes: a.downvotes || [],
    comments: a.comments || [],
    isAccepted: a.isAccepted,
    expertVerified: a.expertVerified,
    createdAt: a.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: a.updatedAt?.toISOString() || new Date().toISOString()
  }
  return cleanObject(formatted)
}

export async function getAllQuestions(): Promise<Question[]> {
  try {
    await connectDB()
    const questions = await Question.find({})
      .sort({ _id: 1 }) // Sort by MongoDB _id for consistent ordering
      .lean()
    
    const formattedQuestions = questions.map(formatQuestion)
    
    // Additional client-side sort to ensure consistency
    return formattedQuestions.sort((a, b) => a.id.localeCompare(b.id))
  } catch (error) {
    console.error('Error fetching all questions:', error)
    return []
  }
}

export async function getQuestionsByTag(tag: string): Promise<Question[]> {
  try {
    await connectDB()
    const questions = await Question.find({ tags: tag })
      .sort({ createdAt: -1 })
      .lean()
    
    return questions.map(formatQuestion)
  } catch (error) {
    console.error('Error fetching questions by tag:', error)
    return []
  }
}

export async function getQuestionById(id: string): Promise<Question | null> {
  try {
    await connectDB()
    const question = await Question.findOneAndUpdate(
      { id },
      { $inc: { views: 1 } }, // Increment view count
      { new: true }
    ).lean()
    
    if (!question) return null
    
    return formatQuestion(question)
  } catch (error) {
    console.error('Error fetching question by id:', error)
    return null
  }
}

// New function for detailed question view with all fields
export async function getQuestionByIdDetailed(id: string): Promise<any | null> {
  try {
    await connectDB()
    const question = await Question.findOne({ id }).lean()
    
    if (!question) return null
    
    // Helper function to clean MongoDB objects for client serialization
    const cleanObject = (obj: any): any => {
      if (obj === null || obj === undefined) return obj
      if (Array.isArray(obj)) return obj.map(cleanObject)
      if (typeof obj === 'object') {
        const cleaned: any = {}
        for (const [key, value] of Object.entries(obj)) {
          if (key === '_id') continue // Skip MongoDB _id
          if (value instanceof Date) {
            cleaned[key] = value.toISOString()
          } else if (typeof value === 'object' && value !== null) {
            cleaned[key] = cleanObject(value)
          } else {
            cleaned[key] = value
          }
        }
        return cleaned
      }
      return obj
    }
    
    // Return the full question object with all fields for QuestionDetail component
    return cleanObject({
      id: question.id,
      title: question.title,
      content: question.content,
      author: question.author,
      authorReputation: question.authorReputation,
      tags: [...question.tags],
      difficulty: question.difficulty,
      upvotes: question.upvotes || [],
      downvotes: question.downvotes || [],
      views: question.views,
      viewedBy: question.viewedBy || [],
      comments: question.comments || [],
      answers: question.answers || [],
      hasAcceptedAnswer: question.hasAcceptedAnswer,
      createdAt: question.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: question.updatedAt?.toISOString() || new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching detailed question by id:', error)
    return null
  }
}

export async function getPopularQuestions(limit: number = 10): Promise<Question[]> {
  try {
    await connectDB()
    const questions = await Question.find({})
      .sort({ upvotes: -1, createdAt: -1 })
      .limit(limit)
      .lean()
    
    return questions.map(formatQuestion)
  } catch (error) {
    console.error('Error fetching popular questions:', error)
    return []
  }
}

export async function getRecentQuestions(limit: number = 10): Promise<Question[]> {
  try {
    await connectDB()
    const questions = await Question.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
    
    return questions.map(formatQuestion)
  } catch (error) {
    console.error('Error fetching recent questions:', error)
    return []
  }
}

export async function getUnansweredQuestions(limit: number = 10): Promise<Question[]> {
  try {
    await connectDB()
    const questions = await Question.find({ hasAcceptedAnswer: false })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
    
    return questions.map(formatQuestion)
  } catch (error) {
    console.error('Error fetching unanswered questions:', error)
    return []
  }
}

export async function searchQuestions(query: string): Promise<Question[]> {
  try {
    await connectDB()
    const questions = await Question.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ]
    })
      .sort({ upvotes: -1, createdAt: -1 })
      .lean()
    
    return questions.map(formatQuestion)
  } catch (error) {
    console.error('Error searching questions:', error)
    return []
  }
}

export async function createQuestion(questionData: Omit<Question, 'answers' | 'hasAcceptedAnswer' | 'views' | 'upvotes' | 'downvotes' | 'createdAt' | 'updatedAt'>): Promise<Question | null> {
  try {
    await connectDB()
    const question = new Question({
      ...questionData,
      answers: [],
      hasAcceptedAnswer: false,
      views: 0,
      upvotes: 0,
      downvotes: 0
    })
    const savedQuestion = await question.save()
    
    return formatQuestion(savedQuestion)
  } catch (error) {
    console.error('Error creating question:', error)
    return null
  }
}

export async function addAnswer(questionId: string, answerData: Omit<Answer, 'upvotes' | 'downvotes' | 'isAccepted' | 'createdAt' | 'updatedAt'>): Promise<Question | null> {
  try {
    await connectDB()
    const newAnswer: IAnswer = {
      ...answerData,
      upvotes: 0,
      downvotes: 0,
      isAccepted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const question = await Question.findOneAndUpdate(
      { id: questionId },
      { 
        $push: { answers: newAnswer },
        $set: { updatedAt: new Date() }
      },
      { new: true, runValidators: true }
    ).lean()
    
    if (!question) return null
    
    return formatQuestion(question)
  } catch (error) {
    console.error('Error adding answer:', error)
    return null
  }
}

export async function upvoteQuestion(id: string): Promise<boolean> {
  try {
    await connectDB()
    const result = await Question.updateOne(
      { id },
      { $inc: { upvotes: 1 } }
    )
    return result.modifiedCount > 0
  } catch (error) {
    console.error('Error upvoting question:', error)
    return false
  }
}

export async function upvoteAnswer(questionId: string, answerId: string): Promise<boolean> {
  try {
    await connectDB()
    const result = await Question.updateOne(
      { id: questionId, 'answers.id': answerId },
      { $inc: { 'answers.$.upvotes': 1 } }
    )
    return result.modifiedCount > 0
  } catch (error) {
    console.error('Error upvoting answer:', error)
    return false
  }
}

export async function acceptAnswer(questionId: string, answerId: string): Promise<boolean> {
  try {
    await connectDB()
    // First, unaccept all answers for this question
    await Question.updateOne(
      { id: questionId },
      { $set: { 'answers.$[].isAccepted': false } }
    )
    
    // Then accept the specific answer
    const result = await Question.updateOne(
      { id: questionId, 'answers.id': answerId },
      { 
        $set: { 
          'answers.$.isAccepted': true,
          hasAcceptedAnswer: true
        }
      }
    )
    return result.modifiedCount > 0
  } catch (error) {
    console.error('Error accepting answer:', error)
    return false
  }
}

export function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
}

export function getTagColor(tag: string) {
  const colors = [
    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
    'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300'
  ]
  
  // Simple hash function to consistently assign colors
  let hash = 0
  for (let i = 0; i < tag.length; i++) {
    hash = ((hash << 5) - hash + tag.charCodeAt(i)) & 0xffffffff
  }
  
  return colors[Math.abs(hash) % colors.length]
}