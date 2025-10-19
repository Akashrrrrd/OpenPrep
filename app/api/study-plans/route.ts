import { NextRequest, NextResponse } from 'next/server'
import { saveStudyPlan, getUserStudyPlans } from '@/lib/study-planner'
import { verifyToken } from '@/lib/auth'
import { UsageTracker } from '@/lib/usage-tracker'

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
    // Check authentication
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Check usage limits
    const usageCheck = await UsageTracker.checkStudyPlanLimit(user.id)
    if (!usageCheck.allowed) {
      return NextResponse.json({
        error: 'Study plan limit exceeded',
        requiresUpgrade: usageCheck.requiresUpgrade,
        limit: usageCheck.limit,
        current: usageCheck.current
      }, { status: 403 })
    }

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

    // Track usage after successful creation
    await UsageTracker.trackStudyPlanGeneration(user.id)

    return NextResponse.json(studyPlan, { status: 201 })
  } catch (error) {
    console.error('Error creating study plan:', error)
    return NextResponse.json(
      { error: 'Failed to create study plan' },
      { status: 500 }
    )
  }
}