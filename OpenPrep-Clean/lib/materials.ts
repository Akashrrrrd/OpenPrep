import connectDB from './mongodb'
import Material, { IMaterial } from './models/Material'

export interface Material {
  id: string
  name: string
  description: string
  driveLink: string
  category: string
  accessCount?: number
  tags?: string[]
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  lastUpdated?: string
  createdAt?: string
  updatedAt?: string
}

// Static fallback data
export const materials: Material[] = [
  {
    id: "agile",
    name: "Agile",
    description: "Agile methodology, Scrum, and project management resources",
    driveLink: "https://drive.google.com/drive/folders/1hYs4Luoyw33PaGBtWtC0iN02JffsJVao?usp=sharing",
    category: "Methodology"
  },
  {
    id: "angular",
    name: "Angular",
    description: "Angular framework tutorials, guides, and best practices",
    driveLink: "https://drive.google.com/drive/folders/16zgt1GLDF6tPmlVSRaRSCGpQ-dzB3KC1?usp=sharing",
    category: "Frontend"
  },
  {
    id: "api",
    name: "API",
    description: "REST APIs, GraphQL, and API design patterns",
    driveLink: "https://drive.google.com/drive/folders/16dShoo7vKJYBw6bCkDymm_DZplOP8n-T?usp=sharing",
    category: "Backend"
  },
  {
    id: "architecture",
    name: "Architecture",
    description: "Software architecture patterns and system design principles",
    driveLink: "https://drive.google.com/drive/folders/1kOT5yNHQIocKoyvoU0G3V4smgXDJG9WL?usp=sharing",
    category: "System Design"
  },
  {
    id: "aws",
    name: "AWS",
    description: "Amazon Web Services cloud computing resources",
    driveLink: "https://drive.google.com/drive/folders/1_8f_4skAgL7GPF9rPWh5fda-LGvQkI47?usp=sharing",
    category: "Cloud"
  },
  {
    id: "bootstrap",
    name: "Bootstrap",
    description: "Bootstrap CSS framework and responsive design",
    driveLink: "https://drive.google.com/drive/folders/1_-grbYiB-OMUjE1PSzO06ODcSd2KP-6b?usp=sharing",
    category: "Frontend"
  },
  {
    id: "css",
    name: "CSS",
    description: "CSS styling, animations, and modern CSS techniques",
    driveLink: "https://drive.google.com/drive/folders/16plSrCEA_Ca2M4okt3IW1dowdeCah8FR?usp=sharing",
    category: "Frontend"
  },
  {
    id: "design-patterns",
    name: "Design Patterns",
    description: "Software design patterns and architectural principles",
    driveLink: "https://drive.google.com/drive/folders/1fjkFAMchlFs8AxmQDIbnQIkYenspagfW?usp=sharing",
    category: "Programming"
  },
  {
    id: "devops",
    name: "DevOps",
    description: "CI/CD, containerization, and deployment strategies",
    driveLink: "https://drive.google.com/drive/folders/18I6WesMzWnGqlMUvbU2pwKkNBkQlyM1u?usp=drive_link",
    category: "DevOps"
  },
  {
    id: "dsa",
    name: "DSA",
    description: "Data Structures and Algorithms for coding interviews",
    driveLink: "https://drive.google.com/drive/folders/1HoY7nVfx3BirxUoafhONR29_CWxP_HTo?usp=drive_link",
    category: "Programming"
  },
  {
    id: "ebooks",
    name: "Ebooks",
    description: "Programming and technical ebooks collection",
    driveLink: "https://drive.google.com/drive/folders/15-EY9MGZ-0M1jTY0U9Hc6ULCyl2NoHcB?usp=drive_link",
    category: "Resources"
  },
  {
    id: "faang-maang",
    name: "FAANG-MAANG",
    description: "Big tech company interview preparation materials",
    driveLink: "https://drive.google.com/drive/folders/1l4GMdp-aDf2mQkqPXximVn9dD-VYgEJM?usp=drive_link",
    category: "Interview"
  },
  {
    id: "github",
    name: "GitHub",
    description: "Git version control and GitHub best practices",
    driveLink: "https://drive.google.com/drive/folders/16snDy9_vXYC7NG2qynvnRGlrSWDwiK3r?usp=drive_link",
    category: "Tools"
  },
  {
    id: "html",
    name: "HTML",
    description: "HTML fundamentals and semantic markup",
    driveLink: "https://drive.google.com/drive/folders/16ymdc0m7VI5Y6yiZ1Sso8jWeLYWMQHmr?usp=drive_link",
    category: "Frontend"
  },
  {
    id: "http",
    name: "HTTP",
    description: "HTTP protocol, status codes, and web communication",
    driveLink: "https://drive.google.com/drive/folders/1XcxcHvRKSm_FmLLW3WWB7Sey8kuNHmDA?usp=drive_link",
    category: "Web"
  },
  {
    id: "interview",
    name: "Interview",
    description: "General interview preparation and tips",
    driveLink: "https://drive.google.com/drive/folders/1dj5pEXae4eGNSWCqg-VUMJ2hlwU027Yp?usp=drive_link",
    category: "Interview"
  },
  {
    id: "javascript",
    name: "JavaScript",
    description: "JavaScript fundamentals, ES6+, and advanced concepts",
    driveLink: "https://drive.google.com/drive/folders/16xNwKER2RqNuBdcguYkgg8eXWIU_q-30?usp=drive_link",
    category: "Programming"
  },
  {
    id: "jquery",
    name: "jQuery",
    description: "jQuery library and DOM manipulation",
    driveLink: "https://drive.google.com/drive/folders/1chg3TYj5nl-mPiM48cyVSG6C_ZSMqkQq?usp=drive_link",
    category: "Frontend"
  },
  {
    id: "microfrontend",
    name: "Microfrontend",
    description: "Microfrontend architecture and implementation",
    driveLink: "https://drive.google.com/drive/folders/16xBuv3_1iTWlxoBydbuhJkkEHDenm42N?usp=drive_link",
    category: "Architecture"
  },
  {
    id: "mongodb",
    name: "MongoDB",
    description: "MongoDB NoSQL database and operations",
    driveLink: "https://drive.google.com/drive/folders/18OBXAQlckGCeVq42b_xbpsY6BAtob1ja?usp=drive_link",
    category: "Database"
  },
  {
    id: "nodejs",
    name: "Node.js",
    description: "Node.js runtime and server-side JavaScript",
    driveLink: "https://drive.google.com/drive/folders/1_UwtyGsgXgx_IJuLiHliVubM9Il2sh2M?usp=drive_link",
    category: "Backend"
  },
  {
    id: "oops",
    name: "OOPS",
    description: "Object-Oriented Programming concepts and principles",
    driveLink: "https://drive.google.com/drive/folders/19qXbAMSQw7ewzYt3NsQqz9bze53D1h5L?usp=drive_link",
    category: "Programming"
  },
  {
    id: "others",
    name: "Others",
    description: "Miscellaneous programming and tech resources",
    driveLink: "https://drive.google.com/drive/folders/1drB1ZQNCMnPUeAlkKaLurS_gNS0ipyvo?usp=drive_link",
    category: "Resources"
  },
  {
    id: "reactjs",
    name: "React.js",
    description: "React library, hooks, and modern React patterns",
    driveLink: "https://drive.google.com/drive/folders/1TzEsVZNpkYLJSFjQUguCxvagoMfcOIfa?usp=drive_link",
    category: "Frontend"
  },
  {
    id: "roadmaps",
    name: "Roadmaps",
    description: "Learning roadmaps for different tech careers",
    driveLink: "https://drive.google.com/drive/folders/16hHXPdvGNgNjgCiap99BUMbGd0ra9Jzu?usp=drive_link",
    category: "Resources"
  },
  {
    id: "reduxjs",
    name: "Redux.js",
    description: "Redux state management and patterns",
    driveLink: "https://drive.google.com/drive/folders/1VDNV3j3UXPIe6RJuCfk5hC7NCJojw5Gp?usp=drive_link",
    category: "Frontend"
  },
  {
    id: "serverside",
    name: "Server Side",
    description: "Server-side programming and backend concepts",
    driveLink: "https://drive.google.com/drive/folders/1UyRNeK5-JUyCHf0yO1WR68rQ0uBTiTgx?usp=drive_link",
    category: "Backend"
  },
  {
    id: "sql",
    name: "SQL",
    description: "SQL database queries and database design",
    driveLink: "https://drive.google.com/drive/folders/1dHe6t427Ccn3WoZObBz9QPH6b5Jmpxrq?usp=drive_link",
    category: "Database"
  },
  {
    id: "system-design",
    name: "System Design",
    description: "System design interviews and scalable architectures",
    driveLink: "https://drive.google.com/drive/folders/1Uux3BplbChX1lSZJCpUzu27gAYr961uo?usp=drive_link",
    category: "System Design"
  },
  {
    id: "webdev",
    name: "Web Development",
    description: "Full-stack web development resources and tutorials",
    driveLink: "https://drive.google.com/drive/folders/1L2QDIiTxDqf7iC22q29Elq9Ia_EyrAVf?usp=drive_link",
    category: "Web"
  }
]

function formatMaterial(material: IMaterial): Material {
  return {
    id: material.id,
    name: material.name,
    description: material.description,
    driveLink: material.driveLink,
    category: material.category,
    accessCount: material.accessCount || 0,
    tags: [...(material.tags || [])],
    difficulty: material.difficulty || 'intermediate',
    lastUpdated: material.lastUpdated?.toISOString() || new Date().toISOString(),
    createdAt: material.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: material.updatedAt?.toISOString() || new Date().toISOString()
  }
}

export async function getMaterials(): Promise<Material[]> {
  try {
    await connectDB()
    const materialsFromDB = await Material.find({})
      .sort({ name: 1 })
      .lean()
    
    return materialsFromDB.map(formatMaterial)
  } catch (error) {
    console.error('Error fetching materials from database, using fallback data:', error)
    return materials
  }
}

export async function getMaterialById(id: string): Promise<Material | null> {
  try {
    await connectDB()
    const material = await Material.findOne({ id }).lean()
    
    if (!material) {
      // Fallback to static data
      const fallbackMaterial = materials.find(m => m.id === id)
      return fallbackMaterial || null
    }
    
    return formatMaterial(material)
  } catch (error) {
    console.error('Error fetching material by id:', error)
    // Fallback to static data
    const fallbackMaterial = materials.find(m => m.id === id)
    return fallbackMaterial || null
  }
}

export async function getMaterialsByCategory(category: string): Promise<Material[]> {
  try {
    await connectDB()
    const materialsFromDB = await Material.find({ category })
      .sort({ name: 1 })
      .lean()
    
    return materialsFromDB.map(formatMaterial)
  } catch (error) {
    console.error('Error fetching materials by category:', error)
    return materials.filter(material => material.category === category)
  }
}

export async function getCategories(): Promise<string[]> {
  try {
    await connectDB()
    const categories = await Material.distinct('category')
    return categories.sort()
  } catch (error) {
    console.error('Error fetching categories:', error)
    return [...new Set(materials.map(material => material.category))].sort()
  }
}

export async function createMaterial(materialData: Omit<Material, 'accessCount' | 'createdAt' | 'updatedAt'>): Promise<Material | null> {
  try {
    await connectDB()
    const material = new Material({
      ...materialData,
      accessCount: 0,
      lastUpdated: new Date()
    })
    const savedMaterial = await material.save()
    
    return formatMaterial(savedMaterial)
  } catch (error) {
    console.error('Error creating material:', error)
    return null
  }
}

export async function updateMaterial(id: string, updates: Partial<Material>): Promise<Material | null> {
  try {
    await connectDB()
    const material = await Material.findOneAndUpdate(
      { id },
      { ...updates, lastUpdated: new Date() },
      { new: true, runValidators: true }
    ).lean()
    
    if (!material) return null
    
    return formatMaterial(material)
  } catch (error) {
    console.error('Error updating material:', error)
    return null
  }
}

export async function deleteMaterial(id: string): Promise<boolean> {
  try {
    await connectDB()
    const result = await Material.deleteOne({ id })
    return result.deletedCount > 0
  } catch (error) {
    console.error('Error deleting material:', error)
    return false
  }
}

export async function incrementAccessCount(id: string): Promise<boolean> {
  try {
    await connectDB()
    const result = await Material.updateOne(
      { id },
      { $inc: { accessCount: 1 } }
    )
    return result.modifiedCount > 0
  } catch (error) {
    console.error('Error incrementing access count:', error)
    return false
  }
}

export async function searchMaterials(query: string): Promise<Material[]> {
  try {
    await connectDB()
    const materialsFromDB = await Material.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ]
    })
      .sort({ name: 1 })
      .lean()
    
    return materialsFromDB.map(formatMaterial)
  } catch (error) {
    console.error('Error searching materials:', error)
    const searchLower = query.toLowerCase()
    return materials.filter(m => 
      m.name.toLowerCase().includes(searchLower) ||
      m.description.toLowerCase().includes(searchLower) ||
      m.category.toLowerCase().includes(searchLower)
    )
  }
}