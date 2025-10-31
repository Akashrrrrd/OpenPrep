import mongoose from 'mongoose'

const InterviewQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['technical', 'hr'],
    required: true
  },
  category: {
    type: String,
    required: true // e.g., 'JavaScript', 'React', 'Leadership', 'Communication'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  keywords: [{
    type: String
  }], // Expected keywords in good answers
  sampleAnswer: {
    type: String
  },
  companies: [{
    type: String
  }] // Companies that frequently ask this question
}, {
  timestamps: true
})

const InterviewSessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['technical', 'hr', 'resume-based'],
    required: true
  },
  resumeAnalysis: {
    skills: [String],
    technologies: [String],
    experience: [String],
    keywords: [String],
    rawText: String
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress'
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  totalDuration: {
    type: Number // in seconds
  },
  questions: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InterviewQuestion'
    },
    question: String,
    answer: String,
    timeSpent: Number, // seconds spent on this question
    score: Number, // 0-10 score based on keywords and quality
    feedback: String,
    category: String,
    difficulty: String,
    keywords: [String]
  }],
  overallScore: {
    type: Number,
    min: 0,
    max: 100
  },
  strengths: [{
    category: String,
    score: Number,
    feedback: String
  }],
  improvements: [{
    category: String,
    score: Number,
    feedback: String,
    suggestions: [String]
  }],
  feedback: {
    overall: String,
    technical: String,
    communication: String,
    confidence: String
  }
}, {
  timestamps: true
})

export const InterviewQuestion = mongoose.models.InterviewQuestion || mongoose.model('InterviewQuestion', InterviewQuestionSchema)
export const InterviewSession = mongoose.models.InterviewSession || mongoose.model('InterviewSession', InterviewSessionSchema)