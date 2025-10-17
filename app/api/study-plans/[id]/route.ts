import { NextRequest, NextResponse } from 'next/server'
import { getStudyPlan, updateStudyPlan, deleteStudyPlan } from '@/lib/study-planner'

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

    return NextResponse.json(studyPlan)
  } catch (error) {
    console.error('Error fetching study plan:', error)
    return NextResponse.json(
      { error: 'Failed to fetch study plan' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const studyPlan = await updateStudyPlan(params.id, body)
    
    if (!studyPlan) {
      return NextResponse.json(
        { error: 'Study plan not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(studyPlan)
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
    const success = await deleteStudyPlan(params.id)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Study plan not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Study plan deleted successfully' })
  } catch (error) {
    console.error('Error deleting study plan:', error)
    return NextResponse.json(
      { error: 'Failed to delete study plan' },
      { status: 500 }
    )
  }
}