import mongoose from 'mongoose'

export interface INotification {
  _id?: string
  id: string
  userId: string
  type: 'info' | 'success' | 'warning' | 'error' | 'achievement' | 'reminder' | 'social'
  title: string
  message: string
  actionUrl?: string
  actionText?: string
  metadata?: {
    questionId?: string
    answerId?: string
    companyId?: string
    materialId?: string
    studyPlanId?: string
    fromUserId?: string
    fromUserName?: string
    [key: string]: any
  }
  read: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
  expiresAt?: Date
  createdAt?: Date
  updatedAt?: Date
}

const NotificationSchema = new mongoose.Schema<INotification>({
  id: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error', 'achievement', 'reminder', 'social'],
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  actionUrl: {
    type: String,
    default: null
  },
  actionText: {
    type: String,
    default: null
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  read: {
    type: Boolean,
    default: false,
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  expiresAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
})

// Indexes for performance
NotificationSchema.index({ userId: 1, read: 1 })
NotificationSchema.index({ userId: 1, createdAt: -1 })
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema)