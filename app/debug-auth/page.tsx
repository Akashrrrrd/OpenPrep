"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DebugAuthPage() {
  const { user, loading, login, logout } = useAuth()
  const [cookies, setCookies] = useState('')
  const [localStorage, setLocalStorage] = useState('')
  const [testResults, setTestResults] = useState<string[]>([])

  useEffect(() => {
    // Check cookies
    if (typeof document !== 'undefined') {
      setCookies(document.cookie)
    }
    
    // Check localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const backup = window.localStorage.getItem('openprep_user_backup')
      setLocalStorage(backup || 'No backup found')
    }
  }, [user])

  const testLogin = async () => {
    const results = []
    results.push('🔐 Testing login...')
    
    const loginResult = await login('test@example.com', 'password123')
    results.push(`Login result: ${JSON.stringify(loginResult)}`)
    
    // Check cookies after login
    if (typeof document !== 'undefined') {
      results.push(`Cookies after login: ${document.cookie}`)
    }
    
    setTestResults(results)
  }

  const testAuthAPI = async () => {
    const results = []
    results.push('📡 Testing /api/auth/me...')
    
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })
      
      results.push(`Response status: ${response.status}`)
      
      const data = await response.json()
      results.push(`Response data: ${JSON.stringify(data, null, 2)}`)
      
    } catch (error) {
      results.push(`Error: ${error}`)
    }
    
    setTestResults(results)
  }

  const clearAll = () => {
    // Clear cookies
    if (typeof document !== 'undefined') {
      document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    }
    
    // Clear localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem('openprep_user_backup')
    }
    
    logout()
    setTestResults(['🗑️ Cleared all auth data'])
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Authentication Debug</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Auth State</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>User:</strong> {user ? user.name : 'Not logged in'}
            </div>
            <div>
              <strong>User ID:</strong> {user?.id || 'N/A'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Browser Storage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <strong>Cookies:</strong>
              <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                {cookies || 'No cookies'}
              </pre>
            </div>
            <div>
              <strong>LocalStorage Backup:</strong>
              <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                {localStorage}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testLogin} className="w-full">
              Test Login
            </Button>
            <Button onClick={testAuthAPI} className="w-full" variant="outline">
              Test Auth API
            </Button>
            <Button onClick={clearAll} className="w-full" variant="destructive">
              Clear All Auth Data
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-100 p-4 rounded overflow-x-auto whitespace-pre-wrap">
              {testResults.join('\n') || 'No tests run yet'}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}