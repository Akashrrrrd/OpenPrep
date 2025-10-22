import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { InterviewSession } from '@/lib/models/Interview'
import { InterviewEvaluator } from '@/lib/interview-evaluator'
import { getRandomQuestions } from '@/lib/interview-questions'
import { verifyAuth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const { sessionId, questionIndex, answer, timeSpent, questions, type } = await request.json()
    
    if (!sessionId || questionIndex === undefined || !answer) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Find the interview session in MongoDB
    const session = await InterviewSession.findById(sessionId)
    
    if (!session) {
      return NextResponse.json({ error: 'Interview session not found' }, { status: 404 })
    }

    if (questionIndex >= session.questions.length) {
      return NextResponse.json({ error: 'Invalid question index' }, { status: 400 })
    }

    // Get the question details for evaluation
    const allQuestions = getRandomQuestions(session.type, 15)
    const questionData = allQuestions.find(q => q.question === session.questions[questionIndex].question)
    
    if (!questionData) {
      return NextResponse.json({ error: 'Question data not found' }, { status: 404 })
    }

    // Evaluate the answer
    const evaluation = InterviewEvaluator.evaluateAnswer(
      answer,
      questionData.keywords,
      questionData.category
    )

    // Update the session with the answer and evaluation
    session.questions[questionIndex] = {
      ...session.questions[questionIndex],
      answer,
      timeSpent: timeSpent || 0,
      score: evaluation.score,
      feedback: evaluation.feedback
    }

    await session.save()

    // Check if this was the last question
    const nextQuestionIndex = questionIndex + 1
    const isLastQuestion = nextQuestionIndex >= session.questions.length

    if (isLastQuestion) {
      // Complete the interview
      session.status = 'completed'
      session.endTime = new Date()
      session.totalDuration = Math.floor((session.endTime.getTime() - session.startTime.getTime()) / 1000)
      
      // Generate overall assessment
      const assessment = InterviewEvaluator.generateOverallAssessment(session.questions, session.type)
      session.overallScore = assessment.overallScore
      session.strengths = assessment.strengths
      session.improvements = assessment.improvements
      session.feedback = assessment.feedback
      
      await session.save()

      return NextResponse.json({
        completed: true,
        evaluation,
        sessionId: session._id,
        message: 'Interview completed successfully!'
      })
    } else {
      // Return next question
      return NextResponse.json({
        completed: false,
        evaluation,
        nextQuestion: {
          index: nextQuestionIndex,
          question: session.questions[nextQuestionIndex].question,
          totalQuestions: session.questions.length
        }
      })
    }

  } catch (error) {
    console.error('Error submitting answer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}