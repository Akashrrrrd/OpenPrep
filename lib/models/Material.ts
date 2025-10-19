import mongoose from 'mongoose'

export interface IMaterial {
  _id?: string
  id: string
  name: string
  description: string
  driveLink: string
  category: string
  accessCount: number
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  lastUpdated: Date
  createdAt?: Date
  updatedAt?: Date
}

const MaterialSchema = new mongoose.Schema<IMaterial>({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    index: 'text'
  },
  description: {
    type: String,
    required: true,
    trim: true,
    index: 'text'
  },
  driveLink: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  accessCount: {
    type: Number,
    default: 0,
    min: 0
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Create indexes for better performance
MaterialSchema.index({ category: 1, name: 1 })
MaterialSchema.index({ tags: 1 })
MaterialSchema.index({ accessCount: -1 })
MaterialSchema.index({ '$**': 'text' }) // Full text search

export default mongoose.models.Material || mongoose.model<IMaterial>('Material', MaterialSchema)