import connectDB from '../lib/mongodb'
import Material from '../lib/models/Material'
import { materials } from '../lib/materials'

async function seedMaterials() {
  try {
    console.log('🔄 Connecting to MongoDB...')
    await connectDB()
    
    console.log('🗑️ Clearing existing materials...')
    await Material.deleteMany({})
    
    console.log('📚 Seeding materials...')
    
    const materialsWithMetadata = materials.map(material => ({
      ...material,
      accessCount: 0,
      tags: generateTags(material.name, material.category),
      difficulty: getDifficulty(material.category),
      lastUpdated: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }))
    
    await Material.insertMany(materialsWithMetadata)
    
    console.log(`✅ Successfully seeded ${materialsWithMetadata.length} materials!`)
    
    // Display summary
    const categories = [...new Set(materialsWithMetadata.map(m => m.category))]
    console.log('\n📊 Summary:')
    for (const category of categories.sort()) {
      const count = materialsWithMetadata.filter(m => m.category === category).length
      console.log(`  ${category}: ${count} materials`)
    }
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding materials:', error)
    process.exit(1)
  }
}

function generateTags(name: string, category: string): string[] {
  const tags: string[] = []
  
  // Add category as a tag
  tags.push(category.toLowerCase())
  
  // Add name-based tags
  const nameLower = name.toLowerCase()
  
  // Technology-specific tags
  if (nameLower.includes('javascript') || nameLower.includes('js')) {
    tags.push('javascript', 'programming', 'web')
  }
  if (nameLower.includes('react')) {
    tags.push('react', 'frontend', 'library')
  }
  if (nameLower.includes('node')) {
    tags.push('nodejs', 'backend', 'server')
  }
  if (nameLower.includes('css')) {
    tags.push('css', 'styling', 'frontend')
  }
  if (nameLower.includes('html')) {
    tags.push('html', 'markup', 'frontend')
  }
  if (nameLower.includes('sql') || nameLower.includes('mongodb')) {
    tags.push('database', 'data')
  }
  if (nameLower.includes('aws')) {
    tags.push('cloud', 'amazon', 'infrastructure')
  }
  if (nameLower.includes('system') || nameLower.includes('architecture')) {
    tags.push('design', 'scalability', 'patterns')
  }
  if (nameLower.includes('interview') || nameLower.includes('faang')) {
    tags.push('interview', 'preparation', 'coding')
  }
  if (nameLower.includes('dsa') || nameLower.includes('algorithm')) {
    tags.push('algorithms', 'data-structures', 'coding')
  }
  if (nameLower.includes('devops')) {
    tags.push('deployment', 'ci-cd', 'automation')
  }
  if (nameLower.includes('api')) {
    tags.push('rest', 'api', 'backend')
  }
  if (nameLower.includes('bootstrap')) {
    tags.push('css', 'framework', 'responsive')
  }
  if (nameLower.includes('angular')) {
    tags.push('angular', 'typescript', 'spa')
  }
  if (nameLower.includes('redux')) {
    tags.push('state-management', 'react', 'flux')
  }
  if (nameLower.includes('git')) {
    tags.push('version-control', 'collaboration', 'git')
  }
  if (nameLower.includes('http')) {
    tags.push('protocol', 'web', 'networking')
  }
  if (nameLower.includes('oops') || nameLower.includes('oop')) {
    tags.push('object-oriented', 'programming', 'concepts')
  }
  if (nameLower.includes('agile')) {
    tags.push('methodology', 'scrum', 'project-management')
  }
  
  // Remove duplicates and return
  return [...new Set(tags)]
}

function getDifficulty(category: string): 'beginner' | 'intermediate' | 'advanced' {
  const beginnerCategories = ['Frontend', 'Resources', 'Tools']
  const advancedCategories = ['System Design', 'Architecture', 'DevOps', 'Interview']
  
  if (beginnerCategories.includes(category)) {
    return 'beginner'
  } else if (advancedCategories.includes(category)) {
    return 'advanced'
  } else {
    return 'intermediate'
  }
}

// Run the seeding function
seedMaterials()