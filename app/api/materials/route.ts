import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Material from '@/lib/models/Material'
import { verifyToken } from '@/lib/auth'
import { UsageTracker } from '@/lib/usage-tracker'
// Fallback data import
import { materials } from '@/lib/materials'

// Helper function to clean MongoDB objects for client serialization
const cleanObject = (obj: any): any => {
  if (obj === null || obj === undefined) return obj
  if (Array.isArray(obj)) return obj.map(cleanObject)
  if (typeof obj === 'object') {
    const cleaned: any = {}
    for (const [key, value] of Object.entries(obj)) {
      if (key === '_id') continue // Skip MongoDB _id
      if (value instanceof Date) {
        cleaned[key] = value.toISOString()
      } else if (typeof value === 'object' && value !== null) {
        cleaned[key] = cleanObject(value)
      } else {
        cleaned[key] = value
      }
    }
    return cleaned
  }
  return obj
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '100')
    
    let query: any = {}
    
    // Build query based on parameters
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } }
        ]
      }
    }
    
    if (category && category !== 'all') {
      query.category = category
    }
    
    const materialsFromDB = await Material.find(query)
      .sort({ name: 1 })
      .limit(limit)
      .lean()
    
    // If no materials in database, use fallback data
    if (materialsFromDB.length === 0) {
      throw new Error('No materials in database, using fallback')
    }
    
    // Clean and format the data
    const cleanedMaterials = materialsFromDB.map(m => cleanObject({
      id: m.id,
      name: m.name,
      description: m.description,
      driveLink: m.driveLink,
      category: m.category,
      accessCount: m.accessCount || 0,
      tags: m.tags || [],
      difficulty: m.difficulty || 'intermediate',
      lastUpdated: m.lastUpdated?.toISOString() || new Date().toISOString(),
      createdAt: m.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: m.updatedAt?.toISOString() || new Date().toISOString()
    }))
    
    return NextResponse.json(cleanedMaterials)
  } catch (error) {
    console.error('Error fetching materials from database, using fallback data:', error)
    
    // Use fallback data from static materials
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '100')
    
    let filteredMaterials = [...materials]
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filteredMaterials = filteredMaterials.filter(m => 
        m.name.toLowerCase().includes(searchLower) ||
        m.description.toLowerCase().includes(searchLower) ||
        m.category.toLowerCase().includes(searchLower)
      )
    }
    
    // Apply category filter
    if (category && category !== 'all') {
      filteredMaterials = filteredMaterials.filter(m => m.category === category)
    }
    
    // Apply limit
    filteredMaterials = filteredMaterials.slice(0, limit)
    
    // Format the data to match expected structure
    const formattedMaterials = filteredMaterials.map(m => ({
      id: m.id,
      name: m.name,
      description: m.description,
      driveLink: m.driveLink,
      category: m.category,
      accessCount: 0,
      tags: [],
      difficulty: 'intermediate',
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }))
    
    return NextResponse.json(formattedMaterials)
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

    const body = await request.json()
    const { id, name, description, driveLink, category, tags, difficulty } = body

    if (!id || !name || !description || !driveLink || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const materialData = {
      id,
      name,
      description,
      driveLink,
      category,
      accessCount: 0,
      tags: tags || [],
      difficulty: difficulty || 'intermediate',
      lastUpdated: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    try {
      // Try to save to MongoDB first
      await connectDB()
      
      const material = new Material(materialData)
      const savedMaterial = await material.save()
      
      if (!savedMaterial) {
        throw new Error('Failed to save to database')
      }

      return NextResponse.json(cleanObject(savedMaterial.toObject()), { status: 201 })
    } catch (dbError) {
      console.error('Database error, material created but not persisted:', dbError)
      
      // Fallback: Return the material data even if DB save failed
      return NextResponse.json({
        ...materialData,
        _note: "Material created but not persisted to database due to connection issues"
      }, { status: 201 })
    }
  } catch (error) {
    console.error('Error creating material:', error)
    return NextResponse.json(
      { error: 'Failed to create material' },
      { status: 500 }
    )
  }
}