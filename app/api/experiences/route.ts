import { NextRequest, NextResponse } from 'next/server'
import { getAllExperiences, getExperiencesByCompany, createExperience } from '@/lib/experiences'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    
    let experiences
    if (companyId) {
      experiences = await getExperiencesByCompany(companyId)
    } else {
      experiences = await getAllExperiences()
    }
    
    return NextResponse.json(experiences)
  } catch (error) {
    console.error('Error fetching experiences:', error)
    return NextResponse.json(
      { error: 'Failed to fetch experiences' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, companyId, role, date, rounds, overallDifficulty, outcome, tips, anonymous, verified } = body

    if (!id || !companyId || !role || !date || !rounds || !overallDifficulty || !outcome) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const experience = await createExperience({
      id,
      companyId,
      role,
      date,
      rounds,
      overallDifficulty,
      outcome,
      tips: tips || [],
      anonymous: anonymous || false,
      verified: verified || false
    })
    
    if (!experience) {
      return NextResponse.json(
        { error: 'Failed to create experience' },
        { status: 500 }
      )
    }

    return NextResponse.json(experience, { status: 201 })
  } catch (error) {
    console.error('Error creating experience:', error)
    return NextResponse.json(
      { error: 'Failed to create experience' },
      { status: 500 }
    )
  }
}