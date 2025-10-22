import { NextRequest, NextResponse } from 'next/server'
import { getStudyPlan, updateStudyPlan, deleteStudyPlan } from '@/lib/study-planner'
import { verifyToken } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const studyPlan = await getStudyPlan(params.id)
    
    if (!studyPlan) {
      return NextResponse.json(
        { error: 'Study plan not found' },
        { status: 404 }
      )
    }

    // Check if user has access to this plan
    const token = request.cookies.get('auth-token')?.value
    if (token) {
      const user = await verifyToken(token)
      if (user && studyPlan.userId !== user.id) {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        )
      }
    }

    return NextResponse.json(studyPlan)
  } catch (error) {
    console.error('Error fetching study plan:', error)
    return NextResponse.json(
      { error: 'Failed to fetch study plan' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Get current plan to check ownership
    const currentPlan = await getStudyPlan(params.id)
    if (!currentPlan) {
      return NextResponse.json({ error: 'Study plan not found' }, { status: 404 })
    }

    if (currentPlan.userId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const body = await request.json()
    const updatedPlan = await updateStudyPlan(params.id, body)
    
    if (!updatedPlan) {
      return NextResponse.json(
        { error: 'Failed to update study plan' },
        { status: 500 }
      )
    }

    return NextResponse.json(updatedPlan)
  } catch (error) {
    console.error('Error updating study plan:', error)
    return NextResponse.json(
      { error: 'Failed to update study plan' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Get current plan to check ownership
    const currentPlan = await getStudyPlan(params.id)
    if (!currentPlan) {
      return NextResponse.json({ error: 'Study plan not found' }, { status: 404 })
    }

    if (currentPlan.userId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const success = await deleteStudyPlan(params.id)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete study plan' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting study plan:', error)
    return NextResponse.json(
      { error: 'Failed to delete study plan' },
      { status: 500 }
    )
  }
}