"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { LoadingOverlay } from "@/components/loading"

interface Company {
  id: string
  name: string
  logo?: string
}

interface StudyPlannerFormProps {
  companies: Company[]
  isAuthenticated: boolean
}

export function StudyPlannerForm({ companies, isAuthenticated }: StudyPlannerFormProps) {
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    targetCompanies: [] as string[],
    availableHoursPerDay: 4,
    targetDate: '',
    currentLevel: 'intermediate' as 'beginner' | 'intermediate' | 'advanced',
    focusAreas: [] as ('aptitude' | 'coding' | 'technical' | 'hr')[]
  })

  // Filter companies based on search term
  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleGeneratePlan = async () => {
    if (!isAuthenticated) {
      alert('Please log in to generate your personalized study plan')
      window.location.href = '/auth/login?redirect=/study-planner'
      return
    }

    if (formData.targetCompanies.length === 0 || !formData.targetDate) {
      alert('Please select at least one company and target date')
      return
    }

    setLoading(true)
    
    // Redirect to results page with form data
    const params = new URLSearchParams({
      companies: formData.targetCompanies.join(','),
      hours: formData.availableHoursPerDay.toString(),
      date: formData.targetDate,
      level: formData.currentLevel,
      areas: formData.focusAreas.join(',')
    })
    
    window.location.href = `/study-planner/plan?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <LoadingOverlay message="Generating your personalized study plan..." isVisible={loading} />
      <div className="mx-auto w-full max-w-2xl px-4 py-10">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Create Your Study Plan</CardTitle>
            <p className="text-muted-foreground">
              Get a personalized study schedule based on your target companies and available time
            </p>
            {!isAuthenticated && (
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
                  🔒 Please log in to generate your personalized study plan
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Target Companies */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <Label className="text-base font-medium">Target Companies</Label>
                <div className="text-sm text-muted-foreground">
                  {formData.targetCompanies.length} selected
                </div>
              </div>
              
              {/* Search Companies */}
              <div className="relative">
                <Input
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Companies Grid */}
              <div className="max-h-64 overflow-y-auto border rounded-lg p-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredCompanies.length > 0 ? (
                    filteredCompanies.map((company) => (
                      <div key={company.id} className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-md">
                        <Checkbox
                          id={company.id}
                          checked={formData.targetCompanies.includes(company.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData(prev => ({
                                ...prev,
                                targetCompanies: [...prev.targetCompanies, company.id]
                              }))
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                targetCompanies: prev.targetCompanies.filter(id => id !== company.id)
                              }))
                            }
                          }}
                        />
                        {company.logo && (
                          <img 
                            src={company.logo} 
                            alt={`${company.name} logo`}
                            className="h-6 w-6 object-contain"
                          />
                        )}
                        <Label htmlFor={company.id} className="text-sm font-normal cursor-pointer flex-1">
                          {company.name}
                        </Label>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-4 text-muted-foreground">
                      {searchTerm ? 'No companies found matching your search' : 'No companies available'}
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Companies Summary */}
              {formData.targetCompanies.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm font-medium">Selected:</span>
                  {formData.targetCompanies.map(companyId => {
                    const company = companies.find(c => c.id === companyId)
                    return company ? (
                      <Badge key={companyId} variant="secondary" className="text-xs">
                        {company.name}
                      </Badge>
                    ) : null
                  })}
                </div>
              )}
            </div>

            {/* Available Hours */}
            <div className="space-y-3">
              <Label htmlFor="hours" className="text-base font-medium">
                Available Hours Per Day
              </Label>
              <select
                id="hours"
                value={formData.availableHoursPerDay}
                onChange={(e) => setFormData(prev => ({ ...prev, availableHoursPerDay: parseInt(e.target.value) }))}
                className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value={2}>2 hours</option>
                <option value={3}>3 hours</option>
                <option value={4}>4 hours</option>
                <option value={5}>5 hours</option>
                <option value={6}>6 hours</option>
                <option value={8}>8 hours</option>
              </select>
            </div>

            {/* Target Date */}
            <div className="space-y-3">
              <Label htmlFor="targetDate" className="text-base font-medium">
                Target Date (Placement Drive)
              </Label>
              <Input
                id="targetDate"
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData(prev => ({ ...prev, targetDate: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Current Level */}
            <div className="space-y-3">
              <Label htmlFor="currentLevel" className="text-base font-medium">Current Preparation Level</Label>
              <select
                id="currentLevel"
                value={formData.currentLevel}
                onChange={(e) => setFormData(prev => ({ ...prev, currentLevel: e.target.value as 'beginner' | 'intermediate' | 'advanced' }))}
                className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="beginner">Beginner - Just starting preparation</option>
                <option value="intermediate">Intermediate - Some preparation done</option>
                <option value="advanced">Advanced - Well prepared, need fine-tuning</option>
              </select>
            </div>

            {/* Focus Areas */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Focus Areas</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'aptitude', label: 'Aptitude & Reasoning' },
                  { id: 'coding', label: 'Coding & DSA' },
                  { id: 'technical', label: 'Technical Concepts' },
                  { id: 'hr', label: 'HR & Communication' }
                ].map((area) => (
                  <div key={area.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={area.id}
                      checked={formData.focusAreas.includes(area.id as any)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData(prev => ({
                            ...prev,
                            focusAreas: [...prev.focusAreas, area.id as any]
                          }))
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            focusAreas: prev.focusAreas.filter(id => id !== area.id)
                          }))
                        }
                      }}
                    />
                    <Label htmlFor={area.id} className="text-sm font-normal">
                      {area.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Button onClick={handleGeneratePlan} className="w-full" size="lg">
                Generate My Study Plan
              </Button>
              {isAuthenticated && (
                <Button asChild variant="outline" className="w-full" size="lg">
                  <a href="/study-planner/my-plans">
                    View My Existing Plans
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}