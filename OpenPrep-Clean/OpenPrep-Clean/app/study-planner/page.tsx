"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { StudyPlannerForm } from "@/components/study-planner-form"

interface Company {
  id: string
  name: string
  logo?: string
}

export default function StudyPlannerPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch companies for all users
  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies')
      if (response.ok) {
        const companiesData = await response.json()
        setCompanies(companiesData)
      }
    } catch (error) {
      console.error('Error fetching companies:', error)
    } finally {
      setLoading(false)
    }
  }

  // Show loading while checking authentication or loading companies
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4" />
          <p>{authLoading ? "Checking authentication..." : "Loading companies..."}</p>
        </div>
      </div>
    )
  }

  return <StudyPlannerForm companies={companies} isAuthenticated={isAuthenticated} />
}