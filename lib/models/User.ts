import mongoose from 'mongoose'

export interface IUser {
  _id?: string
  id: string
  email: string
  password: string
  name: string
  avatar?: string
  subscriptionTier: 'free' | 'pro' | 'premium'
  subscriptionStatus: 'active' | 'cancelled' | 'expired'
  subscriptionStartDate?: Date
  subscriptionEndDate?: Date
  stripeCustomerId?: string
  subscription?: {
    planId?: string
    paymentId?: string
    orderId?: string
    startDate?: Date
    endDate?: Date
  }
  profile: {
    college?: string
    graduationYear?: number
    targetCompanies: string[]
    preparationLevel: 'beginner' | 'intermediate' | 'advanced'
    focusAreas: ('aptitude' | 'coding' | 'technical' | 'hr')[]
  }
  usage: {
    studyPlansGenerated: number
    companiesAccessed: string[]
    forumPostsCreated: number
    materialsAccessed: string[]
    totalPageViews: number
    lastActiveDate: Date
    dailyActivity: {
      date: string
      actions: number
    }[]
  }
  preferences: {
    emailNotifications: boolean
    studyReminders: boolean
    weeklyProgress: boolean
  }
  createdAt?: Date
  updatedAt?: Date
}

const UserSchema = new mongoose.Schema<IUser>({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String,
    default: null
  },
  subscriptionTier: {
    type: String,
    enum: ['free', 'pro', 'premium'],
    default: 'free'
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'cancelled', 'expired'],
    default: 'active'
  },
  subscriptionStartDate: {
    type: Date,
    default: Date.now
  },
  subscriptionEndDate: {
    type: Date,
    default: null
  },
  stripeCustomerId: {
    type: String,
    default: null
  },
  subscription: {
    planId: {
      type: String,
      default: null
    },
    paymentId: {
      type: String,
      default: null
    },
    orderId: {
      type: String,
      default: null
    },
    startDate: {
      type: Date,
      default: null
    },
    endDate: {
      type: Date,
      default: null
    }
  },
  profile: {
    college: {
      type: String,
      trim: true
    },
    graduationYear: {
      type: Number,
      min: 2020,
      max: 2030
    },
    targetCompanies: [{
      type: String,
      trim: true
    }],
    preparationLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    focusAreas: [{
      type: String,
      enum: ['aptitude', 'coding', 'technical', 'hr']
    }]
  },
  usage: {
    studyPlansGenerated: {
      type: Number,
      default: 0
    },
    companiesAccessed: [{
      type: String
    }],
    forumPostsCreated: {
      type: Number,
      default: 0
    },
    materialsAccessed: [{
      type: String
    }],
    totalPageViews: {
      type: Number,
      default: 0
    },
    lastActiveDate: {
      type: Date,
      default: Date.now
    },
    dailyActivity: [{
      date: {
        type: String,
        required: true
      },
      actions: {
        type: Number,
        default: 0
      }
    }]
  },
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    studyReminders: {
      type: Boolean,
      default: true
    },
    weeklyProgress: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
})

// Indexes for performance
UserSchema.index({ email: 1 })
UserSchema.index({ subscriptionTier: 1, subscriptionStatus: 1 })
UserSchema.index({ 'usage.lastActiveDate': -1 })

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)