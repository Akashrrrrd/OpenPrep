import { NextRequest, NextResponse } from 'next/server'
import { getAllQuestions, getQuestionsByTag, getPopularQuestions, getRecentQuestions, getUnansweredQuestions, searchQuestions, createQuestion } from '@/lib/forum'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tag = searchParams.get('tag')
    const sort = searchParams.get('sort')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    let questions
    
    if (search) {
      questions = await searchQuestions(search)
    } else if (tag) {
      questions = await getQuestionsByTag(tag)
    } else if (sort === 'popular') {
      questions = await getPopularQuestions(limit)
    } else if (sort === 'unanswered') {
      questions = await getUnansweredQuestions(limit)
    } else if (sort === 'recent') {
      questions = await getRecentQuestions(limit)
    } else {
      questions = await getAllQuestions()
    }
    
    return NextResponse.json(questions)
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
    const body = await request.json()
    const { id, title, content, author, authorReputation, tags, difficulty } = body

    if (!id || !title || !content || !author || !tags || !difficulty) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const question = await createQuestion({
      id,
      title,
      content,
      author,
      authorReputation: authorReputation || 0,
      tags,
      difficulty
    })
    
    if (!question) {
      return NextResponse.json(
        { error: 'Failed to create question' },
        { status: 500 }
      )
    }

    return NextResponse.json(question, { status: 201 })
  } catch (error) {
    console.error('Error creating question:', error)
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    )
  }
}