import { NextRequest, NextResponse } from 'next/server'
import { SearchService } from '@/lib/search'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const type = searchParams.get('type')?.split(',') || []
    const tags = searchParams.get('tags')?.split(',') || []
    const difficulty = searchParams.get('difficulty')?.split(',') || []
    const company = searchParams.get('company')?.split(',') || []
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    // Get user ID if authenticated
    let userId: string | undefined
    const token = request.cookies.get('auth-token')?.value
    if (token) {
      const decoded = await verifyToken(token)
      userId = decoded?.id
    }
    
    // Build filters
    const filters: any = {}
    if (type.length > 0) filters.type = type
    if (tags.length > 0) filters.tags = tags
    if (difficulty.length > 0) filters.difficulty = difficulty
    if (company.length > 0) filters.company = company
    
    // Handle date range
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    if (startDate && endDate) {
      filters.dateRange = {
        start: new Date(startDate),
        end: new Date(endDate)
      }
    }
    
    if (!query.trim()) {
      return NextResponse.json({ 
        results: [], 
        total: 0, 
        suggestions: [],
        message: 'Please enter a search query' 
      })
    }
    
    const searchResults = await SearchService.search(query, filters, userId, limit, offset)
    
    return NextResponse.json(searchResults)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    // Handle trending content (no auth required)
    if (action === 'trending') {
      const trending = await SearchService.getTrendingContent()
      return NextResponse.json({ trending })
    }

    // For other actions, require authentication
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    if (action === 'recommendations') {
      const recommendations = await SearchService.getPersonalizedRecommendations(decoded.id)
      return NextResponse.json({ recommendations })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Search POST error:', error)
    return NextResponse.json({ error: 'Request failed' }, { status: 500 })
  }
}