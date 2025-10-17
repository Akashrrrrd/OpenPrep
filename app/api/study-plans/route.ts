import { NextRequest, NextResponse } from 'next/server'
import { saveStudyPlan, getUserStudyPlans } from '@/lib/study-planner'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    const studyPlans = await getUserStudyPlans(userId || undefined)
    return NextResponse.json(studyPlans)
  } catch (error) {
    console.error('Error fetching study plans:', error)
    return NextResponse.json(
      { error: 'Failed to fetch study plans' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, targetCompanies, availableHoursPerDay, targetDate, currentLevel, focusAreas, generatedPlan } = body

    if (!id || !targetCompanies || !availableHoursPerDay || !targetDate || !currentLevel || !focusAreas || !generatedPlan) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const studyPlan = await saveStudyPlan({
      id,
      targetCompanies,
      availableHoursPerDay,
      targetDate,
      currentLevel,
      focusAreas,
      generatedPlan,
      createdAt: new Date().toISOString()
    })
    
    if (!studyPlan) {
      return NextResponse.json(
        { error: 'Failed to create study plan' },
        { status: 500 }
      )
    }

    return NextResponse.json(studyPlan, { status: 201 })
  } catch (error) {
    console.error('Error creating study plan:', error)
    return NextResponse.json(
      { error: 'Failed to create study plan' },
      { status: 500 }
    )
  }
}