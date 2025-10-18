import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Question from '@/lib/models/Question'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const { userId, username } = await request.json()
    const questionId = params.id

    const question = await Question.findOne({ id: questionId })
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    // Check if user already viewed this question
    const existingView = question.viewedBy.find((view: any) => view.userId === userId)
    
    if (!existingView) {
      // Add new view record
      question.viewedBy.push({
        userId,
        username,
        timestamp: new Date(),
        ipAddress: request.ip || 'unknown'
      })
      
      // Increment view count
      question.views = (question.views || 0) + 1
      
      await question.save()
    }

    return NextResponse.json({ 
      success: true, 
      views: question.views 
    })
  } catch (error) {
    console.error('Error tracking view:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}