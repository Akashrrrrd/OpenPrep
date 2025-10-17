import mongoose from 'mongoose'

export interface IInterviewRound {
  type: 'aptitude' | 'technical' | 'coding' | 'hr' | 'group_discussion'
  duration: number
  questions: string[]
  difficulty: 1 | 2 | 3 | 4 | 5
  tips: string[]
}

export interface IInterviewExperience {
  _id?: string
  id: string
  companyId: string
  role: string
  date: Date
  rounds: IInterviewRound[]
  overallDifficulty: 1 | 2 | 3 | 4 | 5
  outcome: 'selected' | 'rejected' | 'waiting'
  tips: string[]
  anonymous: boolean
  verified: boolean
  upvotes: number
  downvotes: number
  helpful: number
  createdAt?: Date
  updatedAt?: Date
}

const InterviewRoundSchema = new mongoose.Schema<IInterviewRound>({
  type: {
    type: String,
    enum: ['aptitude', 'technical', 'coding', 'hr', 'group_discussion'],
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  questions: [{
    type: String,
    trim: true
  }],
  difficulty: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    required: true
  },
  tips: [{
    type: String,
    trim: true
  }]
})

const InterviewExperienceSchema = new mongoose.Schema<IInterviewExperience>({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  companyId: {
    type: String,
    required: true,
    index: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  rounds: [InterviewRoundSchema],
  overallDifficulty: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    required: true
  },
  outcome: {
    type: String,
    enum: ['selected', 'rejected', 'waiting'],
    required: true
  },
  tips: [{
    type: String,
    trim: true
  }],
  anonymous: {
    type: Boolean,
    default: false
  },
  verified: {
    type: Boolean,
    default: false
  },
  upvotes: {
    type: Number,
    default: 0,
    min: 0
  },
  downvotes: {
    type: Number,
    default: 0,
    min: 0
  },
  helpful: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
})

// Create indexes for better performance
InterviewExperienceSchema.index({ companyId: 1, date: -1 })
InterviewExperienceSchema.index({ date: -1 })
InterviewExperienceSchema.index({ upvotes: -1 })
InterviewExperienceSchema.index({ verified: 1 })

export default mongoose.models.InterviewExperience || mongoose.model<IInterviewExperience>('InterviewExperience', InterviewExperienceSchema)