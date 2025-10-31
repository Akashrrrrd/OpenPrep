import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { InterviewSession } from '@/lib/models/Interview'
import { generateResumeBasedQuestions } from '@/lib/interview-questions'
import { verifyAuth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    // Allow both authenticated and anonymous users
    const user = await verifyAuth(request)
    const userId = user?.id || `anonymous-${Date.now()}`

    const { resumeAnalysis } = await request.json()
    
    if (!resumeAnalysis || !resumeAnalysis.skills || !resumeAnalysis.technologies) {
      return NextResponse.json({ error: 'Invalid resume analysis data' }, { status: 400 })
    }

    // Check if user has an active interview session
    const activeSession = await InterviewSession.findOne({
      userId: userId,
      status: 'in-progress'
    })

    if (activeSession) {
      // Mark the old session as abandoned and create new one
      await InterviewSession.findByIdAndUpdate(activeSession._id, { 
        status: 'abandoned',
        endTime: new Date()
      })
    }

    // Generate questions based on resume analysis
    const questions = generateResumeBasedQuestions(resumeAnalysis, 8)
    
    // Create new interview session in MongoDB
    const session = new InterviewSession({
      userId: userId,
      type: 'resume-based',
      resumeAnalysis: resumeAnalysis,
      questions: questions.map(q => ({
        question: q.question,
        answer: '',
        timeSpent: 0,
        score: 0,
        category: q.category,
        difficulty: q.difficulty,
        keywords: q.keywords
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
      category: questions[0].category,
      difficulty: questions[0].difficulty,
      startTime: session.startTime,
      resumeSkills: resumeAnalysis.skills.slice(0, 5),
      questions: questions // Include all questions for client-side handling
    })

  } catch (error) {
    console.error('Error starting resume-based interview:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}