import mongoose from 'mongoose'

export interface ILike {
  userId: string
  username: string
  timestamp: Date
}

export interface IComment {
  _id?: string
  id: string
  content: string
  author: string
  authorReputation: number
  likes: ILike[]
  createdAt?: Date
  updatedAt?: Date
}

export interface IAnswer {
  _id?: string
  id: string
  content: string
  author: string
  authorReputation: number
  upvotes: ILike[]
  downvotes: ILike[]
  comments: IComment[]
  isAccepted: boolean
  expertVerified: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface IViewRecord {
  userId: string
  username: string
  timestamp: Date
  ipAddress?: string
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
  upvotes: ILike[]
  downvotes: ILike[]
  views: number
  viewedBy: IViewRecord[]
  comments: IComment[]
  answers: IAnswer[]
  hasAcceptedAnswer: boolean
  createdAt?: Date
  updatedAt?: Date
}

const LikeSchema = new mongoose.Schema<ILike>({
  userId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: false })

const CommentSchema = new mongoose.Schema<IComment>({
  id: {
    type: String,
    required: true
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
  likes: [LikeSchema]
}, {
  timestamps: true
})

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
  upvotes: [LikeSchema],
  downvotes: [LikeSchema],
  comments: [CommentSchema],
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

const ViewRecordSchema = new mongoose.Schema<IViewRecord>({
  userId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    required: false
  }
}, { _id: false })

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
  upvotes: [LikeSchema],
  downvotes: [LikeSchema],
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  viewedBy: [ViewRecordSchema],
  comments: [CommentSchema],
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