import mongoose from 'mongoose'

export interface IAnswer {
  _id?: string
  id: string
  content: string
  author: string
  authorReputation: number
  upvotes: number
  downvotes: number
  isAccepted: boolean
  expertVerified: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface IQuestion {
  _id?: string
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
  answers: IAnswer[]
  hasAcceptedAnswer: boolean
  createdAt?: Date
  updatedAt?: Date
}

const AnswerSchema = new mongoose.Schema<IAnswer>({
  id: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  authorReputation: {
    type: Number,
    default: 0,
    min: 0
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
  isAccepted: {
    type: Boolean,
    default: false
  },
  expertVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

const QuestionSchema = new mongoose.Schema<IQuestion>({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    index: 'text'
  },
  content: {
    type: String,
    required: true,
    trim: true,
    index: 'text'
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  authorReputation: {
    type: Number,
    default: 0,
    min: 0
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    index: true
  }],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
    index: true
  },
  upvotes: {
    type: Number,
    default: 0,
    min: 0,
    index: true
  },
  downvotes: {
    type: Number,
    default: 0,
    min: 0
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  answers: [AnswerSchema],
  hasAcceptedAnswer: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true
})

// Create compound indexes for better performance
QuestionSchema.index({ tags: 1, createdAt: -1 })
QuestionSchema.index({ upvotes: -1, createdAt: -1 })
QuestionSchema.index({ hasAcceptedAnswer: 1, createdAt: -1 })
QuestionSchema.index({ '$**': 'text' }) // Full text search

export default mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema)