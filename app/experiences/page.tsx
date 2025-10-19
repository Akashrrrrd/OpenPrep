"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { InterviewExperienceCard } from "@/components/interview-experience-card"
import { Building2, Search, Filter, Plus, BookOpen } from "lucide-react"
import Link from "next/link"
import { InterviewExperience } from "@/lib/experiences"

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<InterviewExperience[]>([])
  const [filteredExperiences, setFilteredExperiences] = useState<InterviewExperience[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [selectedOutcome, setSelectedOutcome] = useState("all")
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([])

  // Fetch experiences and companies
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch experiences
        const experiencesResponse = await fetch('/api/experiences')
        if (experiencesResponse.ok) {
          const experiencesData = await experiencesResponse.json()
          setExperiences(experiencesData)
          setFilteredExperiences(experiencesData)
        }

        // Fetch companies
        const companiesResponse = await fetch('/api/companies')
        if (companiesResponse.ok) {
          const companiesData = await companiesResponse.json()
          setCompanies(companiesData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter experiences based on search and filters
  useEffect(() => {
    let filtered = experiences

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(exp => 
        exp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        companies.find(c => c.id === exp.companyId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Company filter
    if (selectedCompany !== "all") {
      filtered = filtered.filter(exp => exp.companyId === selectedCompany)
    }

    // Difficulty filter
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(exp => exp.overallDifficulty.toString() === selectedDifficulty)
    }

    // Outcome filter
    if (selectedOutcome !== "all") {
      filtered = filtered.filter(exp => exp.outcome === selectedOutcome)
    }

    setFilteredExperiences(filtered)
  }, [searchTerm, selectedCompany, selectedDifficulty, selectedOutcome, experiences, companies])

  const getCompanyName = (companyId: string) => {
    return companies.find(c => c.id === companyId)?.name || companyId
  }

  const getDifficultyText = (level: number) => {
    const labels = { 1: 'Very Easy', 2: 'Easy', 3: 'Medium', 4: 'Hard', 5: 'Very Hard' }
    return labels[level as keyof typeof labels]
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading interview experiences...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-primary" />
                Interview Experiences
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Learn from real interview experiences shared by students
              </p>
            </div>
            <Button asChild className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              <Link href="/experiences/share">
                <Plus className="mr-2 h-4 w-4" />
                Share Your Experience
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Experiences</p>
                  <p className="text-2xl font-bold">{experiences.length}</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Companies</p>
                  <p className="text-2xl font-bold">{companies.length}</p>
                </div>
                <Building2 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold">
                    {experiences.length > 0 
                      ? Math.round((experiences.filter(e => e.outcome === 'selected').length / experiences.length) * 100)
                      : 0}%
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Difficulty</p>
                  <p className="text-2xl font-bold">
                    {experiences.length > 0 
                      ? (experiences.reduce((sum, e) => sum + e.overallDifficulty, 0) / experiences.length).toFixed(1)
                      : 0}
                  </p>
                </div>
                <Filter className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Experiences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by company or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Company Filter */}
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger>
                  <SelectValue placeholder="All Companies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Difficulty Filter */}
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="All Difficulties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="1">Very Easy</SelectItem>
                  <SelectItem value="2">Easy</SelectItem>
                  <SelectItem value="3">Medium</SelectItem>
                  <SelectItem value="4">Hard</SelectItem>
                  <SelectItem value="5">Very Hard</SelectItem>
                </SelectContent>
              </Select>

              {/* Outcome Filter */}
              <Select value={selectedOutcome} onValueChange={setSelectedOutcome}>
                <SelectTrigger>
                  <SelectValue placeholder="All Outcomes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Outcomes</SelectItem>
                  <SelectItem value="selected">Selected</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="waiting">Waiting</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCompany("all")
                  setSelectedDifficulty("all")
                  setSelectedOutcome("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-600 dark:text-gray-300">
              Showing {filteredExperiences.length} of {experiences.length} experiences
            </p>
            {filteredExperiences.length > 0 && (
              <div className="flex gap-2">
                <Badge variant="outline">
                  {Math.round((filteredExperiences.filter(e => e.outcome === 'selected').length / filteredExperiences.length) * 100)}% Success Rate
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Experience Cards */}
        {filteredExperiences.length > 0 ? (
          <div className="grid gap-6">
            {filteredExperiences.map((experience) => (
              <div key={experience.id}>
                <InterviewExperienceCard 
                  experience={{
                    ...experience,
                    companyName: getCompanyName(experience.companyId)
                  }} 
                />
              </div>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No experiences found</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {searchTerm || selectedCompany !== "all" || selectedDifficulty !== "all" || selectedOutcome !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "Be the first to share your interview experience!"}
              </p>
              <Button asChild>
                <Link href="/experiences/share">
                  <Plus className="mr-2 h-4 w-4" />
                  Share Your Experience
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}