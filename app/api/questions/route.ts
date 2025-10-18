import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Question from '@/lib/models/Question'

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

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const tag = searchParams.get('tag')
    const sort = searchParams.get('sort')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '100')
    
    let query: any = {}
    let sortOptions: any = { _id: 1 } // Default consistent sort
    
    // Build query based on parameters
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } }
        ]
      }
    }
    
    if (tag) {
      query.tags = tag
    }
    
    // Set sort options
    if (sort === 'popular') {
      sortOptions = { 'upvotes': -1, _id: 1 }
    } else if (sort === 'recent') {
      sortOptions = { createdAt: -1, _id: 1 }
    } else if (sort === 'unanswered') {
      query.hasAcceptedAnswer = false
      sortOptions = { createdAt: -1, _id: 1 }
    }
    
    const questions = await Question.find(query)
      .sort(sortOptions)
      .limit(limit)
      .lean()
    
    // Clean and format the data
    const cleanedQuestions = questions.map(q => cleanObject({
      id: q.id,
      title: q.title,
      content: q.content,
      author: q.author,
      authorReputation: q.authorReputation,
      tags: q.tags || [],
      difficulty: q.difficulty,
      upvotes: q.upvotes || [],
      downvotes: q.downvotes || [],
      views: q.views || 0,
      comments: q.comments || [],
      answers: q.answers || [],
      hasAcceptedAnswer: q.hasAcceptedAnswer || false,
      createdAt: q.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: q.updatedAt?.toISOString() || new Date().toISOString()
    }))
    
    return NextResponse.json(cleanedQuestions)
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { id, title, content, author, authorReputation, tags, difficulty } = body

    if (!id || !title || !content || !author || !tags || !difficulty) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const question = new Question({
      id,
      title,
      content,
      author,
      authorReputation: authorReputation || 0,
      tags,
      difficulty,
      upvotes: [],
      downvotes: [],
      views: 0,
      comments: [],
      answers: [],
      hasAcceptedAnswer: false
    })
    
    const savedQuestion = await question.save()
    
    if (!savedQuestion) {
      return NextResponse.json(
        { error: 'Failed to create question' },
        { status: 500 }
      )
    }

    return NextResponse.json(cleanObject(savedQuestion.toObject()), { status: 201 })
  } catch (error) {
    console.error('Error creating question:', error)
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    )
  }
}