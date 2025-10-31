import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { InterviewSession, InterviewQuestion } from '@/lib/models/Interview'
import { getRandomQuestions } from '@/lib/interview-questions'
import { verifyAuth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    // Allow both authenticated and anonymous users
    const user = await verifyAuth(request)
    const userId = user?.id || `anonymous-${Date.now()}`

    const { type } = await request.json()
    
    if (!type || !['technical', 'hr'].includes(type)) {
      return NextResponse.json({ error: 'Invalid interview type' }, { status: 400 })
    }

    // Check if user has an active interview session
    const activeSession = await InterviewSession.findOne({
      userId: userId,
      status: 'in-progress'
    })

    if (activeSession) {
      // If there's an active session of the same type, resume it
      if (activeSession.type === type) {
        const currentQuestionIndex = activeSession.questions.findIndex(q => !q.answer)
        const currentQuestion = currentQuestionIndex >= 0 ? currentQuestionIndex : 0
        
        return NextResponse.json({
          sessionId: activeSession._id,
          type: activeSession.type,
          currentQuestion: currentQuestion,
          totalQuestions: activeSession.questions.length,
          question: activeSession.questions[currentQuestion]?.question || 'Interview completed',
          startTime: activeSession.startTime,
          resumed: true
        })
      } else {
        // If it's a different type, mark the old session as abandoned and create new one
        await InterviewSession.findByIdAndUpdate(activeSession._id, { 
          status: 'abandoned',
          endTime: new Date()
        })
      }
    }

    // Get random questions for the interview
    const questions = getRandomQuestions(type, 5)
    
    // Create new interview session in MongoDB
    const session = new InterviewSession({
      userId: userId,
      type,
      questions: questions.map(q => ({
        question: q.question,
        answer: '',
        timeSpent: 0,
        score: 0
      }))
    })

    await session.save()

    // Return session with first question
    return NextResponse.json({
      sessionId: session._id,
      type: session.type,
      currentQuestion: 0,
      totalQuestions: questions.length,
      question: questions[0].question,
      startTime: session.startTime,
      questions: questions // Include all questions for client-side handling
    })

  } catch (error) {
    console.error('Error starting interview:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}