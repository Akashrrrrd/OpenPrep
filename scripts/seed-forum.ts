import connectDB from '../lib/mongodb'
import Question from '../lib/models/Question'

const sampleQuestions = [
  {
    id: 'q1',
    title: 'How to prepare for TCS CodeVita?',
    content: 'I have TCS CodeVita coming up next month. What are the best resources and practice problems to solve? Any specific algorithms I should focus on?',
    author: 'StudentDev',
    authorReputation: 150,
    tags: ['tcs', 'codevita', 'coding', 'algorithms'],
    difficulty: 'medium' as const,
    upvotes: [
      { userId: 'user1', username: 'CodeMaster', timestamp: new Date() },
      { userId: 'user2', username: 'AlgoExpert', timestamp: new Date() }
    ],
    downvotes: [],
    views: 45,
    viewedBy: [
      { userId: 'user1', username: 'CodeMaster', timestamp: new Date() },
      { userId: 'user2', username: 'AlgoExpert', timestamp: new Date() },
      { userId: 'user3', username: 'StudentDev', timestamp: new Date() }
    ],
    comments: [
      {
        id: 'c1',
        content: 'Great question! I\'m also preparing for CodeVita.',
        author: 'FutureEngineer',
        authorReputation: 75,
        likes: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    answers: [
      {
        id: 'a1',
        content: 'For TCS CodeVita, focus on:\n\n1. Dynamic Programming - Very important\n2. Graph algorithms (BFS, DFS, Dijkstra)\n3. String algorithms\n4. Mathematical problems\n\nPractice on HackerRank and CodeChef. Previous year CodeVita problems are gold!',
        author: 'TCSEmployee',
        authorReputation: 850,
        upvotes: [
          { userId: 'user4', username: 'StudentDev', timestamp: new Date() },
          { userId: 'user5', username: 'CodeLover', timestamp: new Date() }
        ],
        downvotes: [],
        comments: [
          {
            id: 'ac1',
            content: 'Thanks! This is really helpful. Do you have links to previous year problems?',
            author: 'StudentDev',
            authorReputation: 150,
            likes: [
              { userId: 'user6', username: 'TCSEmployee', timestamp: new Date() }
            ],
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        isAccepted: true,
        expertVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    hasAcceptedAnswer: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'q2',
    title: 'Infosys Aptitude Test Pattern 2024',
    content: 'Can someone share the latest Infosys aptitude test pattern? What topics should I focus on for quantitative aptitude?',
    author: 'AptitudeMaster',
    authorReputation: 200,
    tags: ['infosys', 'aptitude', 'quantitative', 'placement'],
    difficulty: 'easy' as const,
    upvotes: [
      { userId: 'user7', username: 'MathGeek', timestamp: new Date() }
    ],
    downvotes: [],
    views: 32,
    viewedBy: [
      { userId: 'user7', username: 'MathGeek', timestamp: new Date() },
      { userId: 'user8', username: 'PlacementPrep', timestamp: new Date() }
    ],
    comments: [],
    answers: [
      {
        id: 'a2',
        content: 'Infosys aptitude test includes:\n\n• Quantitative Aptitude (30 questions)\n• Logical Reasoning (30 questions)\n• Verbal Ability (40 questions)\n\nFocus on: Percentages, Profit & Loss, Time & Work, Data Interpretation',
        author: 'InfosysHR',
        authorReputation: 650,
        upvotes: [],
        downvotes: [],
        comments: [],
        isAccepted: false,
        expertVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    hasAcceptedAnswer: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'q3',
    title: 'System Design Interview Tips for Freshers',
    content: 'I have a system design round coming up for a software engineer position. As a fresher, what should I prepare? Any good resources?',
    author: 'SystemDesignNewbie',
    authorReputation: 50,
    tags: ['system-design', 'interview', 'software-engineer', 'freshers'],
    difficulty: 'hard' as const,
    upvotes: [
      { userId: 'user9', username: 'ArchitectPro', timestamp: new Date() },
      { userId: 'user10', username: 'TechLead', timestamp: new Date() },
      { userId: 'user11', username: 'SeniorDev', timestamp: new Date() }
    ],
    downvotes: [],
    views: 78,
    viewedBy: [
      { userId: 'user9', username: 'ArchitectPro', timestamp: new Date() },
      { userId: 'user10', username: 'TechLead', timestamp: new Date() },
      { userId: 'user11', username: 'SeniorDev', timestamp: new Date() }
    ],
    comments: [
      {
        id: 'c3',
        content: 'System design for freshers is usually basic. Don\'t worry too much!',
        author: 'MentorDev',
        authorReputation: 400,
        likes: [
          { userId: 'user12', username: 'SystemDesignNewbie', timestamp: new Date() }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    answers: [],
    hasAcceptedAnswer: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedForum() {
  try {
    await connectDB()
    
    // Clear existing questions
    await Question.deleteMany({})
    console.log('Cleared existing questions')
    
    // Insert sample questions
    await Question.insertMany(sampleQuestions)
    console.log('✅ Forum seeded with sample questions!')
    
    console.log('\nSample questions created:')
    sampleQuestions.forEach((q, i) => {
      console.log(`${i + 1}. ${q.title} (${q.answers.length} answers, ${q.upvotes.length} upvotes)`)
    })
    
  } catch (error) {
    console.error('Error seeding forum:', error)
  }
}

// Run the seed function
seedForum()