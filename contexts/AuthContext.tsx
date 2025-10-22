"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  subscriptionTier: 'free' | 'pro' | 'premium'
  subscriptionStatus: 'active' | 'cancelled' | 'expired'
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
    lastActiveDate: string
  }
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  updateUser: (updates: Partial<User>) => void
  refreshAuth: () => Promise<void>
}

interface RegisterData {
  name: string
  email: string
  password: string
  college?: string
  graduationYear?: number
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Check if user is authenticated on mount
  useEffect(() => {
    setMounted(true)
    // Check auth on mount
    checkAuth()
  }, [])

  const checkAuth = async () => {
    console.log('🔍 Checking authentication...')
    
    try {
      // Always try to call the API first - let the server handle cookie validation
      console.log('📡 Making request to /api/auth/me...')
      
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
        }
      })

      console.log('📡 Response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('✅ User authenticated:', data.user.name)
        setUser(data.user)
        
        // Store user in localStorage as backup (non-sensitive data only)
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('openprep_user_backup', JSON.stringify({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            subscriptionTier: data.user.subscriptionTier,
            timestamp: Date.now()
          }))
        }
      } else {
        console.log('❌ Authentication failed:', response.status)
        const errorData = await response.json().catch(() => ({}))
        console.log('Error details:', errorData)
        
        // Clear user state and localStorage
        setUser(null)
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('openprep_user_backup')
        }
      }
    } catch (error) {
      console.error('🚨 Auth check network error:', error)
      
      // If network error, try to use localStorage backup temporarily
      if (typeof localStorage !== 'undefined') {
        const backup = localStorage.getItem('openprep_user_backup')
        if (backup) {
          try {
            const backupData = JSON.parse(backup)
            // Only use backup if it's less than 24 hours old
            if (Date.now() - backupData.timestamp < 24 * 60 * 60 * 1000) {
              console.log('🔄 Using localStorage backup for user data')
              // Set a minimal user object from backup
              setUser({
                id: backupData.id,
                name: backupData.name,
                email: backupData.email,
                subscriptionTier: backupData.subscriptionTier,
                subscriptionStatus: 'active',
                profile: {
                  targetCompanies: [],
                  preparationLevel: 'beginner',
                  focusAreas: []
                },
                usage: {
                  studyPlansGenerated: 0,
                  companiesAccessed: [],
                  forumPostsCreated: 0,
                  lastActiveDate: new Date().toISOString()
                }
              })
              
              // Retry auth check in 10 seconds
              setTimeout(() => {
                console.log('🔄 Retrying auth check...')
                checkAuth()
              }, 10000)
              return
            } else {
              console.log('🗑️ Removing old localStorage backup')
              localStorage.removeItem('openprep_user_backup')
            }
          } catch (e) {
            console.error('Error parsing localStorage backup:', e)
            localStorage.removeItem('openprep_user_backup')
          }
        }
      }
      
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting login for:', email)
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      })

      const data = await response.json()
      console.log('📡 Login response status:', response.status)

      if (response.ok) {
        console.log('✅ Login successful for:', data.user.name)
        setUser(data.user)
        
        // Store user in localStorage immediately after login
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('openprep_user_backup', JSON.stringify({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            subscriptionTier: data.user.subscriptionTier,
            timestamp: Date.now()
          }))
        }
        
        return { success: true }
      } else {
        console.log('❌ Login failed:', data.error)
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('🚨 Login network error:', error)
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const register = async (registerData: RegisterData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
        credentials: 'include'
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      setUser(null)
      
      // Clear localStorage backup
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('openprep_user_backup')
      }
      
      console.log('✅ User logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
      // Still clear user state even if request fails
      setUser(null)
      
      // Clear localStorage backup
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('openprep_user_backup')
      }
    }
  }

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null)
  }

  const refreshAuth = async () => {
    await checkAuth()
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading: loading || !mounted,
      isAuthenticated: !!user && !loading && mounted,
      login,
      register,
      logout,
      updateUser,
      refreshAuth
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}