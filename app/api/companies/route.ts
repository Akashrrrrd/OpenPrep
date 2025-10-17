import { NextRequest, NextResponse } from 'next/server'
import { getCompanies, createCompany } from '@/lib/companies'

export async function GET() {
  try {
    const companies = await getCompanies()
    return NextResponse.json(companies)
  } catch (error) {
    console.error('Error fetching companies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, logo, driveLink } = body

    if (!id || !name || !logo || !driveLink) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const company = await createCompany({ id, name, logo, driveLink })
    
    if (!company) {
      return NextResponse.json(
        { error: 'Failed to create company' },
        { status: 500 }
      )
    }

    return NextResponse.json(company, { status: 201 })
  } catch (error) {
    console.error('Error creating company:', error)
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    )
  }
}