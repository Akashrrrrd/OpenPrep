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
    let questionData
    if (session.type === 'resume-based') {
      // For resume-based interviews, use the stored question data
      questionData = {
        question: session.questions[questionIndex].question,
        keywords: session.questions[questionIndex].keywords || [],
        category: session.questions[questionIndex].category || 'Technical',
        difficulty: session.questions[questionIndex].difficulty || 'medium'
      }
    } else {
      // For traditional interviews, find from predefined questions
      const allQuestions = getRandomQuestions(session.type, 15)
      questionData = allQuestions.find(q => q.question === session.questions[questionIndex].question)
      
      if (!questionData) {
        return NextResponse.json({ error: 'Question data not found' }, { status: 404 })
      }
    }

    // Evaluate the answer with enhanced voice response analysis
    const evaluation = InterviewEvaluator.evaluateVoiceAnswer(
      answer,
      questionData.keywords,
      questionData.category,
      timeSpent,
      session.resumeAnalysis
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
      // Return next question with additional data for resume-based interviews
      const nextQuestionData = {
        index: nextQuestionIndex,
        question: session.questions[nextQuestionIndex].question,
        category: session.questions[nextQuestionIndex].category || 'Technical',
        difficulty: session.questions[nextQuestionIndex].difficulty || 'medium',
        totalQuestions: session.questions.length
      }

      return NextResponse.json({
        completed: false,
        evaluation,
        nextQuestion: nextQuestionData
      })
    }

  } catch (error) {
    console.error('Error submitting answer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}