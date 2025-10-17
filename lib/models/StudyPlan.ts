import mongoose from 'mongoose'

export interface ITask {
  id: string
  title: string
  type: 'aptitude' | 'coding' | 'technical' | 'hr' | 'mock_test' | 'revision'
  duration: number // in minutes
  priority: 'high' | 'medium' | 'low'
  description: string
  resources: string[]
  completed: boolean
}

export interface IDailyTask {
  date: Date
  tasks: ITask[]
  totalHours: number
}

export interface IStudyPlan {
  _id?: string
  id: string
  userId?: string // For future user authentication
  targetCompanies: string[]
  availableHoursPerDay: number
  targetDate: Date
  currentLevel: 'beginner' | 'intermediate' | 'advanced'
  focusAreas: ('aptitude' | 'coding' | 'technical' | 'hr')[]
  generatedPlan: IDailyTask[]
  createdAt?: Date
  updatedAt?: Date
}

const TaskSchema = new mongoose.Schema<ITask>({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['aptitude', 'coding', 'technical', 'hr', 'mock_test', 'revision'],
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  resources: [{
    type: String,
    trim: true
  }],
  completed: {
    type: Boolean,
    default: false
  }
})

const DailyTaskSchema = new mongoose.Schema<IDailyTask>({
  date: {
    type: Date,
    required: true
  },
  tasks: [TaskSchema],
  totalHours: {
    type: Number,
    required: true,
    min: 0
  }
})

const StudyPlanSchema = new mongoose.Schema<IStudyPlan>({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: String,
    index: true // For future user authentication
  },
  targetCompanies: [{
    type: String,
    required: true,
    trim: true
  }],
  availableHoursPerDay: {
    type: Number,
    required: true,
    min: 1,
    max: 24
  },
  targetDate: {
    type: Date,
    required: true,
    index: true
  },
  currentLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  focusAreas: [{
    type: String,
    enum: ['aptitude', 'coding', 'technical', 'hr'],
    required: true
  }],
  generatedPlan: [DailyTaskSchema]
}, {
  timestamps: true
})

// Create indexes for better performance
StudyPlanSchema.index({ userId: 1, createdAt: -1 })
StudyPlanSchema.index({ targetDate: 1 })

export default mongoose.models.StudyPlan || mongoose.model<IStudyPlan>('StudyPlan', StudyPlanSchema)