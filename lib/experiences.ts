import connectDB from './mongodb'
import InterviewExperience, { IInterviewExperience, IInterviewRound } from './models/InterviewExperience'
// Fallback data import
import experiencesData from '../src/data/interview-experiences.json'

export interface InterviewRound {
  type: 'aptitude' | 'technical' | 'coding' | 'hr' | 'group_discussion'
  duration: number
  questions: string[]
  difficulty: 1 | 2 | 3 | 4 | 5
  tips: string[]
}

export interface InterviewExperience {
  id: string
  companyId: string
  role: string
  date: string
  rounds: InterviewRound[]
  overallDifficulty: 1 | 2 | 3 | 4 | 5
  outcome: 'selected' | 'rejected' | 'waiting'
  tips: string[]
  anonymous: boolean
  verified: boolean
  upvotes: number
  downvotes: number
  helpful: number
}

function formatExperience(exp: IInterviewExperience): InterviewExperience {
  return {
    id: exp.id,
    companyId: exp.companyId,
    role: exp.role,
    date: exp.date.toISOString(),
    rounds: exp.rounds.map(round => ({
      type: round.type,
      duration: round.duration,
      questions: [...round.questions],
      difficulty: round.difficulty,
      tips: [...round.tips]
    })),
    overallDifficulty: exp.overallDifficulty,
    outcome: exp.outcome,
    tips: [...exp.tips],
    anonymous: exp.anonymous,
    verified: exp.verified,
    upvotes: exp.upvotes,
    downvotes: exp.downvotes,
    helpful: exp.helpful
  }
}

export async function getExperiencesByCompany(companyId: string): Promise<InterviewExperience[]> {
  try {
    await connectDB()
    const experiences = await InterviewExperience.find({ companyId })
      .sort({ date: -1 })
      .lean()
    
    return experiences.map(formatExperience)
  } catch (error) {
    console.error('Error fetching experiences by company from database, using fallback data:', error)
    // Return fallback data from JSON file
    return experiencesData
      .filter(exp => exp.companyId === companyId)
      .map(exp => ({
        ...exp,
        downvotes: exp.downvotes || 0
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }
}

export async function getAllExperiences(): Promise<InterviewExperience[]> {
  try {
    await connectDB()
    const experiences = await InterviewExperience.find({})
      .sort({ date: -1 })
      .lean()
    
    return experiences.map(formatExperience)
  } catch (error) {
    console.error('Error fetching all experiences from database, using fallback data:', error)
    // Return fallback data from JSON file
    return experiencesData
      .map(exp => ({
        ...exp,
        downvotes: exp.downvotes || 0
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }
}

export async function getRecentExperiences(limit: number = 10): Promise<InterviewExperience[]> {
  try {
    await connectDB()
    const experiences = await InterviewExperience.find({})
      .sort({ date: -1 })
      .limit(limit)
      .lean()
    
    return experiences.map(formatExperience)
  } catch (error) {
    console.error('Error fetching recent experiences from database, using fallback data:', error)
    // Return fallback data from JSON file
    return experiencesData
      .map(exp => ({
        ...exp,
        downvotes: exp.downvotes || 0
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit)
  }
}

export async function getExperienceById(id: string): Promise<InterviewExperience | null> {
  try {
    await connectDB()
    const experience = await InterviewExperience.findOne({ id }).lean()
    
    if (!experience) return null
    
    return formatExperience(experience)
  } catch (error) {
    console.error('Error fetching experience:', error)
    return null
  }
}

export async function createExperience(experienceData: Omit<InterviewExperience, 'upvotes' | 'downvotes' | 'helpful'>): Promise<InterviewExperience | null> {
  try {
    await connectDB()
    const experience = new InterviewExperience({
      ...experienceData,
      date: new Date(experienceData.date),
      upvotes: 0,
      downvotes: 0,
      helpful: 0
    })
    const savedExperience = await experience.save()
    
    return formatExperience(savedExperience)
  } catch (error) {
    console.error('Error creating experience:', error)
    return null
  }
}

export async function updateExperience(id: string, updates: Partial<InterviewExperience>): Promise<InterviewExperience | null> {
  try {
    await connectDB()
    const updateData = { ...updates }
    if (updateData.date) {
      updateData.date = new Date(updateData.date) as any
    }
    
    const experience = await InterviewExperience.findOneAndUpdate(
      { id },
      updateData,
      { new: true, runValidators: true }
    ).lean()
    
    if (!experience) return null
    
    return formatExperience(experience)
  } catch (error) {
    console.error('Error updating experience:', error)
    return null
  }
}

export async function upvoteExperience(id: string): Promise<boolean> {
  try {
    await connectDB()
    const result = await InterviewExperience.updateOne(
      { id },
      { $inc: { upvotes: 1 } }
    )
    return result.modifiedCount > 0
  } catch (error) {
    console.error('Error upvoting experience:', error)
    return false
  }
}

export async function markHelpful(id: string): Promise<boolean> {
  try {
    await connectDB()
    const result = await InterviewExperience.updateOne(
      { id },
      { $inc: { helpful: 1 } }
    )
    return result.modifiedCount > 0
  } catch (error) {
    console.error('Error marking experience as helpful:', error)
    return false
  }
}

export async function deleteExperience(id: string): Promise<boolean> {
  try {
    await connectDB()
    const result = await InterviewExperience.deleteOne({ id })
    return result.deletedCount > 0
  } catch (error) {
    console.error('Error deleting experience:', error)
    return false
  }
}