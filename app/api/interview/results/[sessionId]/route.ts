import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { InterviewSession } from '@/lib/models/Interview'
import { verifyAuth } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    await connectDB()
    
    const { sessionId } = params

    // Find the completed interview session
    const session = await InterviewSession.findOne({
      _id: sessionId,
      status: 'completed'
    })

    if (!session) {
      return NextResponse.json({ error: 'Interview session not found or not completed' }, { status: 404 })
    }

    // Return detailed results
    return NextResponse.json({
      sessionId: session._id,
      type: session.type,
      startTime: session.startTime,
      endTime: session.endTime,
      totalDuration: session.totalDuration,
      overallScore: session.overallScore,
      strengths: session.strengths,
      improvements: session.improvements,
      feedback: session.feedback,
      questions: session.questions.map((q, index) => ({
        questionNumber: index + 1,
        question: q.question,
        answer: q.answer,
        score: q.score,
        feedback: q.feedback,
        timeSpent: q.timeSpent
      }))
    })

  } catch (error) {
    console.error('Error fetching interview results:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}