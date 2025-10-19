import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Params = { params: { id: string } }

interface Material {
  id: string
  name: string
  description: string
  driveLink: string
  category: string
  accessCount?: number
  tags?: string[]
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
}

async function getMaterialById(id: string): Promise<Material | null> {
  // Always use static materials for now to avoid hosting issues
  try {
    const { materials } = await import('@/lib/materials')
    return materials.find(m => m.id === id) || null
  } catch (error) {
    console.error('Error loading static materials:', error)
    return null
  }
}

async function getMaterials(): Promise<Material[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   (typeof window === 'undefined' ? 'http://localhost:3000' : window.location.origin)
    
    const response = await fetch(`${baseUrl}/api/materials`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (response.ok) {
      return await response.json()
    }
    
    // Fallback to static materials
    const { materials } = await import('@/lib/materials')
    return materials
  } catch (error) {
    console.error('Error fetching materials:', error)
    
    // Fallback to static materials
    try {
      const { materials } = await import('@/lib/materials')
      return materials
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError)
      return []
    }
  }
}

// Generate static params for all materials
export async function generateStaticParams() {
  try {
    // Import static materials to ensure all pages are pre-built
    const { materials } = await import('@/lib/materials')
    return materials.map((material) => ({
      id: material.id,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export default async function MaterialPage({ params }: Params) {
  const material = await getMaterialById(params.id)
  if (!material) return notFound()

  const allMaterials = await getMaterials()
  const relatedMaterials = allMaterials
    .filter(m => m.category === material.category && m.id !== material.id)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto w-full max-w-4xl px-4 py-10 space-y-8">
        {/* Material Info Card */}
        <Card className="border">
          <CardHeader>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CardTitle className="text-2xl">{material.name}</CardTitle>
                <Badge variant="secondary">{material.category}</Badge>
              </div>
              <p className="text-muted-foreground">{material.description}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <a href={material.driveLink} target="_blank" rel="noopener noreferrer">
                <Button className="min-w-56">
                  Access Study Materials
                </Button>
              </a>
              <Link href="/materials" className="text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground">
                {"← Back to all materials"}
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* What's Included Section */}
        <Card className="border">
          <CardHeader>
            <CardTitle>What's Included</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="text-green-500">✓</div>
                <span>Comprehensive study notes</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-green-500">✓</div>
                <span>Practice questions & solutions</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-green-500">✓</div>
                <span>Interview preparation materials</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-green-500">✓</div>
                <span>Code examples & projects</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-green-500">✓</div>
                <span>Reference guides & cheat sheets</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-green-500">✓</div>
                <span>Latest industry trends</span>
              </div>
            </div>
          </CardContent>
        </Card>



        {/* Call to Action */}
        <Card className="border-dashed bg-muted/50">
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">Ready to Start Learning?</h3>
            <p className="text-muted-foreground mb-4">
              Access all {material.name} materials and start your preparation journey today!
            </p>
            <a href={material.driveLink} target="_blank" rel="noopener noreferrer">
              <Button size="lg">
                Start Learning {material.name}
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}