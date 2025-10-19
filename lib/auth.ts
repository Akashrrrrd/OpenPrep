import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import connectDB from './mongodb'
import User, { IUser } from './models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'

export interface AuthUser {
  id: string
  email: string
  name: string
  subscriptionTier: 'free' | 'pro' | 'premium'
  subscriptionStatus: 'active' | 'cancelled' | 'expired'
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  college?: string
  graduationYear?: number
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12)
  return bcrypt.hash(password, salt)
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Generate JWT token
export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      subscriptionTier: user.subscriptionTier
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// Verify JWT token
export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    await connectDB()
    // Find user by custom id field (not MongoDB _id)
    const user = await User.findOne({ id: decoded.id })
    
    if (!user) {
      // Try to find by email as fallback
      const userByEmail = await User.findOne({ email: decoded.email })
      if (userByEmail) {
        return {
          id: userByEmail.id,
          email: userByEmail.email,
          name: userByEmail.name,
          subscriptionTier: userByEmail.subscriptionTier,
          subscriptionStatus: userByEmail.subscriptionStatus
        }
      }
      return null
    }
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      subscriptionTier: user.subscriptionTier,
      subscriptionStatus: user.subscriptionStatus
    }
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

// Register new user
export async function registerUser(userData: RegisterData): Promise<{ user: AuthUser; token: string } | null> {
  try {
    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email.toLowerCase() })
    if (existingUser) {
      console.log('Registration attempt with existing email:', userData.email)
      throw new Error('User already exists with this email')
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password)

    // Create user with comprehensive data
    const user = new User({
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      email: userData.email.toLowerCase().trim(),
      password: hashedPassword,
      name: userData.name.trim(),
      profile: {
        college: userData.college?.trim() || null,
        graduationYear: userData.graduationYear || null,
        targetCompanies: [],
        preparationLevel: 'beginner',
        focusAreas: []
      },
      subscriptionTier: 'free',
      subscriptionStatus: 'active',
      subscriptionStartDate: new Date(),
      subscriptionEndDate: null,
      stripeCustomerId: null,
      usage: {
        studyPlansGenerated: 0,
        companiesAccessed: [],
        forumPostsCreated: 0,
        lastActiveDate: new Date()
      },
      preferences: {
        emailNotifications: true,
        studyReminders: true,
        weeklyProgress: true
      }
    })

    console.log('Creating new user:', { email: userData.email, name: userData.name })
    const savedUser = await user.save()
    console.log('User successfully saved to MongoDB:', savedUser.id)

    const authUser: AuthUser = {
      id: savedUser.id,
      email: savedUser.email,
      name: savedUser.name,
      subscriptionTier: savedUser.subscriptionTier,
      subscriptionStatus: savedUser.subscriptionStatus
    }

    const token = generateToken(authUser)

    return { user: authUser, token }
  } catch (error) {
    console.error('Error registering user:', error)
    return null
  }
}

// Login user
export async function loginUser(credentials: LoginCredentials): Promise<{ user: AuthUser; token: string } | null> {
  try {
    await connectDB()

    console.log('Login attempt for email:', credentials.email)

    // Find user by email
    const user = await User.findOne({ email: credentials.email.toLowerCase().trim() })
    if (!user) {
      console.log('User not found for email:', credentials.email)
      throw new Error('Invalid email or password')
    }

    // Verify password
    const isValidPassword = await verifyPassword(credentials.password, user.password)
    if (!isValidPassword) {
      console.log('Invalid password for user:', credentials.email)
      throw new Error('Invalid email or password')
    }

    // Update last active date and login tracking
    user.usage.lastActiveDate = new Date()
    await user.save()

    console.log('User successfully logged in:', user.id)

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      subscriptionTier: user.subscriptionTier,
      subscriptionStatus: user.subscriptionStatus
    }

    const token = generateToken(authUser)

    return { user: authUser, token }
  } catch (error) {
    console.error('Error logging in user:', error)
    return null
  }
}

// Get user by ID
export async function getUserById(userId: string): Promise<IUser | null> {
  try {
    await connectDB()
    const user = await User.findOne({ id: userId }).lean()
    return user
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

// Update user profile
export async function updateUserProfile(userId: string, updates: Partial<IUser>): Promise<IUser | null> {
  try {
    await connectDB()
    const user = await User.findOneAndUpdate(
      { id: userId },
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean()
    
    return user
  } catch (error) {
    console.error('Error updating user profile:', error)
    return null
  }
}

// Check subscription limits
export function checkSubscriptionLimits(user: AuthUser, action: string): boolean {
  switch (user.subscriptionTier) {
    case 'free':
      // Free tier limitations will be checked in specific functions
      return true
    case 'pro':
      return true
    case 'premium':
      return true
    default:
      return false
  }
}

// Track user usage
export async function trackUserUsage(userId: string, action: 'study_plan' | 'company_access' | 'forum_post', data?: any): Promise<void> {
  try {
    await connectDB()
    
    const updateQuery: any = {
      'usage.lastActiveDate': new Date()
    }

    switch (action) {
      case 'study_plan':
        updateQuery['$inc'] = { 'usage.studyPlansGenerated': 1 }
        break
      case 'company_access':
        if (data?.companyId) {
          updateQuery['$addToSet'] = { 'usage.companiesAccessed': data.companyId }
        }
        break
      case 'forum_post':
        updateQuery['$inc'] = { 'usage.forumPostsCreated': 1 }
        break
    }

    await User.updateOne({ id: userId }, updateQuery)
  } catch (error) {
    console.error('Error tracking user usage:', error)
  }
}

// Admin utility functions for debugging
export async function getAllUsers(): Promise<IUser[]> {
  try {
    await connectDB()
    const users = await User.find({}).select('-password').lean()
    return users
  } catch (error) {
    console.error('Error fetching all users:', error)
    return []
  }
}

export async function getUserStats(): Promise<{
  totalUsers: number
  freeUsers: number
  proUsers: number
  premiumUsers: number
  recentUsers: number
}> {
  try {
    await connectDB()
    
    const totalUsers = await User.countDocuments({})
    const freeUsers = await User.countDocuments({ subscriptionTier: 'free' })
    const proUsers = await User.countDocuments({ subscriptionTier: 'pro' })
    const premiumUsers = await User.countDocuments({ subscriptionTier: 'premium' })
    
    // Users created in last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recentUsers = await User.countDocuments({ 
      createdAt: { $gte: sevenDaysAgo } 
    })

    return {
      totalUsers,
      freeUsers,
      proUsers,
      premiumUsers,
      recentUsers
    }
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return {
      totalUsers: 0,
      freeUsers: 0,
      proUsers: 0,
      premiumUsers: 0,
      recentUsers: 0
    }
  }
}