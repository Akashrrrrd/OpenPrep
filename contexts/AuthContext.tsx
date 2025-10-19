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
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else if (response.status === 401) {
        // Token is invalid, clear it
        setUser(null)
        // Optionally call logout to clear cookies
        await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include'
        })
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
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
      console.error('Login error:', error)
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
    } catch (error) {
      console.error('Logout error:', error)
      // Still clear user state even if request fails
      setUser(null)
    }
  }

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading: loading || !mounted,
      isAuthenticated: !!user && !loading,
      login,
      register,
      logout,
      updateUser
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