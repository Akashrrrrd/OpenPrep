import questions from "../src/data/questions.json"

export interface Answer {
  id: string
  content: string
  author: string
  authorReputation: number
  upvotes: number
  downvotes: number
  isAccepted: boolean
  expertVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface Question {
  id: string
  title: string
  content: string
  author: string
  authorReputation: number
  tags: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  upvotes: number
  downvotes: number
  views: number
  answers: Answer[]
  hasAcceptedAnswer: boolean
  createdAt: string
  updatedAt: string
}

export async function getAllQuestions(): Promise<Question[]> {
  return questions as Question[]
}

export async function getQuestionsByTag(tag: string): Promise<Question[]> {
  return questions.filter(q => q.tags.includes(tag)) as Question[]
}

export async function getQuestionById(id: string): Promise<Question | null> {
  const question = questions.find(q => q.id === id) as Question | undefined
  return question || null
}

export async function getPopularQuestions(limit: number = 10): Promise<Question[]> {
  return questions
    .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
    .slice(0, limit) as Question[]
}

export async function getRecentQuestions(limit: number = 10): Promise<Question[]> {
  return questions
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit) as Question[]
}

export async function searchQuestions(query: string): Promise<Question[]> {
  const searchTerm = query.toLowerCase()
  return questions.filter(q => 
    q.title.toLowerCase().includes(searchTerm) ||
    q.content.toLowerCase().includes(searchTerm) ||
    q.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  ) as Question[]
}

export function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
}

export function getTagColor(tag: string) {
  const colors = [
    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
    'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300'
  ]
  
  // Simple hash function to consistently assign colors
  let hash = 0
  for (let i = 0; i < tag.length; i++) {
    hash = ((hash << 5) - hash + tag.charCodeAt(i)) & 0xffffffff
  }
  
  return colors[Math.abs(hash) % colors.length]
}