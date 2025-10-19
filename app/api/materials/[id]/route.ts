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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const material = await Material.findOneAndUpdate(
      { id: params.id },
      { $inc: { accessCount: 1 } }, // Increment access count
      { new: true }
    ).lean()
    
    if (!material) {
      // Fallback to static data
      const fallbackMaterial = materials.find(m => m.id === params.id)
      if (!fallbackMaterial) {
        return NextResponse.json({ error: 'Material not found' }, { status: 404 })
      }
      
      return NextResponse.json({
        id: fallbackMaterial.id,
        name: fallbackMaterial.name,
        description: fallbackMaterial.description,
        driveLink: fallbackMaterial.driveLink,
        category: fallbackMaterial.category,
        accessCount: 0,
        tags: [],
        difficulty: 'intermediate',
        lastUpdated: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    }
    
    // Track material access for authenticated users
    const token = request.cookies.get('auth-token')?.value
    if (token) {
      try {
        const user = await verifyToken(token)
        if (user) {
          await UsageTracker.trackMaterialAccess(user.id, params.id)
        }
      } catch (error) {
        console.error('Error tracking material access:', error)
        // Don't fail the request if tracking fails
      }
    }
    
    return NextResponse.json(cleanObject({
      id: material.id,
      name: material.name,
      description: material.description,
      driveLink: material.driveLink,
      category: material.category,
      accessCount: material.accessCount || 0,
      tags: material.tags || [],
      difficulty: material.difficulty || 'intermediate',
      lastUpdated: material.lastUpdated?.toISOString() || new Date().toISOString(),
      createdAt: material.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: material.updatedAt?.toISOString() || new Date().toISOString()
    }))
  } catch (error) {
    console.error('Error fetching material:', error)
    
    // Fallback to static data
    const fallbackMaterial = materials.find(m => m.id === params.id)
    if (!fallbackMaterial) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 })
    }
    
    return NextResponse.json({
      id: fallbackMaterial.id,
      name: fallbackMaterial.name,
      description: fallbackMaterial.description,
      driveLink: fallbackMaterial.driveLink,
      category: fallbackMaterial.category,
      accessCount: 0,
      tags: [],
      difficulty: 'intermediate',
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }
}

export async function PUT(
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

    const body = await request.json()
    const { name, description, driveLink, category, tags, difficulty } = body

    await connectDB()
    
    const material = await Material.findOneAndUpdate(
      { id: params.id },
      {
        ...(name && { name }),
        ...(description && { description }),
        ...(driveLink && { driveLink }),
        ...(category && { category }),
        ...(tags && { tags }),
        ...(difficulty && { difficulty }),
        lastUpdated: new Date(),
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).lean()
    
    if (!material) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 })
    }
    
    return NextResponse.json(cleanObject(material))
  } catch (error) {
    console.error('Error updating material:', error)
    return NextResponse.json(
      { error: 'Failed to update material' },
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

    await connectDB()
    
    const result = await Material.deleteOne({ id: params.id })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Material deleted successfully' })
  } catch (error) {
    console.error('Error deleting material:', error)
    return NextResponse.json(
      { error: 'Failed to delete material' },
      { status: 500 }
    )
  }
}