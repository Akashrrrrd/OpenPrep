import connectDB from '../lib/mongodb'
import Material from '../lib/models/Material'
import Company from '../lib/models/Company'
import InterviewExperience from '../lib/models/InterviewExperience'
import Question from '../lib/models/Question'
import { materials } from '../lib/materials'

// Sample companies data
const companiesData = [
  {
    id: "google",
    name: "Google",
    logo: "/logos/google.png",
    driveLink: "https://drive.google.com/drive/folders/sample-google"
  },
  {
    id: "microsoft",
    name: "Microsoft",
    logo: "/logos/microsoft.png",
    driveLink: "https://drive.google.com/drive/folders/sample-microsoft"
  },
  {
    id: "amazon",
    name: "Amazon",
    logo: "/logos/amazon.png",
    driveLink: "https://drive.google.com/drive/folders/sample-amazon"
  },
  {
    id: "meta",
    name: "Meta",
    logo: "/logos/meta.png",
    driveLink: "https://drive.google.com/drive/folders/sample-meta"
  },
  {
    id: "apple",
    name: "Apple",
    logo: "/logos/apple.png",
    driveLink: "https://drive.google.com/drive/folders/sample-apple"
  },
  {
    id: "netflix",
    name: "Netflix",
    logo: "/logos/netflix.png",
    driveLink: "https://drive.google.com/drive/folders/sample-netflix"
  },
  {
    id: "uber",
    name: "Uber",
    logo: "/logos/uber.png",
    driveLink: "https://drive.google.com/drive/folders/sample-uber"
  },
  {
    id: "airbnb",
    name: "Airbnb",
    logo: "/logos/airbnb.png",
    driveLink: "https://drive.google.com/drive/folders/sample-airbnb"
  }
]

// Sample interview experiences
const experiencesData = [
  {
    id: "exp-1",
    companyId: "google",
    role: "Software Engineer",
    date: new Date('2024-01-15'),
    rounds: [
      {
        type: "coding" as const,
        duration: 45,
        questions: ["Two Sum", "Valid Parentheses", "Merge Two Sorted Lists"],
        difficulty: 3,
        tips: ["Practice LeetCode medium problems", "Explain your approach clearly"]
      },
      {
        type: "technical" as const,
        duration: 60,
        questions: ["System design: Design a URL shortener", "Database normalization"],
        difficulty: 4,
        tips: ["Think about scalability", "Consider trade-offs"]
      }
    ],
    overallDifficulty: 4,
    outcome: "selected" as const,
    tips: ["Be confident", "Ask clarifying questions"],
    anonymous: false,
    verified: true,
    upvotes: 25,
    downvotes: 2,
    helpful: 30
  },
  {
    id: "exp-2",
    companyId: "microsoft",
    role: "Frontend Developer",
    date: new Date('2024-02-10'),
    rounds: [
      {
        type: "coding" as const,
        duration: 60,
        questions: ["Implement a React component", "CSS Grid layout"],
        difficulty: 2,
        tips: ["Know React hooks well", "Practice CSS fundamentals"]
      },
      {
        type: "hr" as const,
        duration: 30,
        questions: ["Why Microsoft?", "Tell me about a challenging project"],
        difficulty: 2,
        tips: ["Research company culture", "Prepare STAR format answers"]
      }
    ],
    overallDifficulty: 3,
    outcome: "selected" as const,
    tips: ["Show passion for frontend development"],
    anonymous: false,
    verified: true,
    upvotes: 18,
    downvotes: 1,
    helpful: 22
  }
]

// Sample forum questions
const questionsData = [
  {
    id: "q-1",
    title: "How to prepare for Google coding interviews?",
    content: "I have a Google interview coming up in 2 weeks. What should I focus on for the coding rounds?",
    author: "TechAspirant",
    authorReputation: 150,
    tags: ["google", "coding", "interview", "preparation"],
    difficulty: "medium" as const,
    upvotes: [],
    downvotes: [],
    views: 245,
    viewedBy: [],
    comments: [],
    answers: [
      {
        id: "a-1",
        content: "Focus on LeetCode medium problems, especially arrays, strings, and trees. Practice explaining your approach out loud.",
        author: "GoogleEngineer",
        authorReputation: 500,
        upvotes: [],
        downvotes: [],
        comments: [],
        isAccepted: true,
        expertVerified: true,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20')
      }
    ],
    hasAcceptedAnswer: true,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: "q-2",
    title: "Best resources for system design interviews?",
    content: "Looking for comprehensive resources to prepare for system design rounds at FAANG companies.",
    author: "SystemDesigner",
    authorReputation: 200,
    tags: ["system-design", "faang", "resources", "scalability"],
    difficulty: "hard" as const,
    upvotes: [],
    downvotes: [],
    views: 189,
    viewedBy: [],
    comments: [],
    answers: [],
    hasAcceptedAnswer: false,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  }
]

async function seedAll() {
  try {
    console.log('🔄 Connecting to MongoDB...')
    await connectDB()
    
    console.log('🗑️ Clearing existing data...')
    await Promise.all([
      Material.deleteMany({}),
      Company.deleteMany({}),
      InterviewExperience.deleteMany({}),
      Question.deleteMany({})
    ])
    
    console.log('📚 Seeding materials...')
    const materialsWithMetadata = materials.map(material => ({
      ...material,
      accessCount: Math.floor(Math.random() * 100),
      tags: generateTags(material.name, material.category),
      difficulty: getDifficulty(material.category),
      lastUpdated: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }))
    await Material.insertMany(materialsWithMetadata)
    
    console.log('🏢 Seeding companies...')
    await Company.insertMany(companiesData.map(company => ({
      ...company,
      createdAt: new Date(),
      updatedAt: new Date()
    })))
    
    console.log('💼 Seeding interview experiences...')
    await InterviewExperience.insertMany(experiencesData.map(exp => ({
      ...exp,
      createdAt: new Date(),
      updatedAt: new Date()
    })))
    
    console.log('❓ Seeding forum questions...')
    await Question.insertMany(questionsData)
    
    console.log('✅ Database seeding completed successfully!')
    
    // Display summary
    const [materialCount, companyCount, experienceCount, questionCount] = await Promise.all([
      Material.countDocuments(),
      Company.countDocuments(),
      InterviewExperience.countDocuments(),
      Question.countDocuments()
    ])
    
    console.log('\n📊 Summary:')
    console.log(`  📚 Materials: ${materialCount}`)
    console.log(`  🏢 Companies: ${companyCount}`)
    console.log(`  💼 Experiences: ${experienceCount}`)
    console.log(`  ❓ Questions: ${questionCount}`)
    
    // Display material categories
    const categories = [...new Set(materialsWithMetadata.map(m => m.category))]
    console.log('\n📂 Material Categories:')
    for (const category of categories.sort()) {
      const count = materialsWithMetadata.filter(m => m.category === category).length
      console.log(`  ${category}: ${count} materials`)
    }
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

function generateTags(name: string, category: string): string[] {
  const tags: string[] = []
  
  // Add category as a tag
  tags.push(category.toLowerCase().replace(/\s+/g, '-'))
  
  // Add name-based tags
  const nameLower = name.toLowerCase()
  
  // Technology-specific tags
  const tagMappings = {
    'javascript': ['javascript', 'programming', 'web'],
    'react': ['react', 'frontend', 'library'],
    'node': ['nodejs', 'backend', 'server'],
    'css': ['css', 'styling', 'frontend'],
    'html': ['html', 'markup', 'frontend'],
    'sql': ['database', 'data', 'query'],
    'mongodb': ['database', 'nosql', 'data'],
    'aws': ['cloud', 'amazon', 'infrastructure'],
    'system': ['design', 'scalability', 'patterns'],
    'architecture': ['design', 'scalability', 'patterns'],
    'interview': ['interview', 'preparation', 'coding'],
    'faang': ['interview', 'preparation', 'coding'],
    'dsa': ['algorithms', 'data-structures', 'coding'],
    'algorithm': ['algorithms', 'data-structures', 'coding'],
    'devops': ['deployment', 'ci-cd', 'automation'],
    'api': ['rest', 'api', 'backend'],
    'bootstrap': ['css', 'framework', 'responsive'],
    'angular': ['angular', 'typescript', 'spa'],
    'redux': ['state-management', 'react', 'flux'],
    'git': ['version-control', 'collaboration', 'git'],
    'http': ['protocol', 'web', 'networking'],
    'oops': ['object-oriented', 'programming', 'concepts'],
    'oop': ['object-oriented', 'programming', 'concepts'],
    'agile': ['methodology', 'scrum', 'project-management']
  }
  
  for (const [keyword, keywordTags] of Object.entries(tagMappings)) {
    if (nameLower.includes(keyword)) {
      tags.push(...keywordTags)
    }
  }
  
  // Remove duplicates and return
  return [...new Set(tags)]
}

function getDifficulty(category: string): 'beginner' | 'intermediate' | 'advanced' {
  const beginnerCategories = ['Frontend', 'Resources', 'Tools', 'Web']
  const advancedCategories = ['System Design', 'Architecture', 'DevOps', 'Interview', 'Cloud']
  
  if (beginnerCategories.includes(category)) {
    return 'beginner'
  } else if (advancedCategories.includes(category)) {
    return 'advanced'
  } else {
    return 'intermediate'
  }
}

// Run the seeding function
seedAll()