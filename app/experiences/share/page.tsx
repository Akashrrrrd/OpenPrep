"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Building2, Calendar, User, Briefcase, Target, CheckCircle, X, Plus } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { LoadingOverlay } from "@/components/loading"

interface Company {
  id: string
  name: string
}

interface Round {
  type: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
}

const ROUND_TYPES = [
  'Online Assessment',
  'Aptitude Test',
  'Coding Round',
  'Technical Interview',
  'HR Interview',
  'Group Discussion',
  'Case Study',
  'Presentation',
  'Final Interview'
]

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'hard', label: 'Hard', color: 'bg-red-100 text-red-800' }
]

const OUTCOME_OPTIONS = [
  { value: 'selected', label: 'Selected', color: 'bg-green-100 text-green-800' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'withdrew', label: 'Withdrew', color: 'bg-gray-100 text-gray-800' }
]

export default function ShareExperiencePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [companies, setCompanies] = useState<Company[]>([])
  const [formData, setFormData] = useState({
    companyId: '',
    role: '',
    date: '',
    rounds: [] as Round[],
    overallDifficulty: '',
    outcome: '',
    tips: [] as string[],
    anonymous: false,
    verified: false
  })
  const [newTip, setNewTip] = useState('')
  const [newRound, setNewRound] = useState({
    type: '',
    description: '',
    difficulty: '' as 'easy' | 'medium' | 'hard'
  })

  // Fetch companies on component mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('/api/companies')
        if (response.ok) {
          const companiesData = await response.json()
          setCompanies(companiesData)
        }
      } catch (error) {
        console.error('Error fetching companies:', error)
      }
    }
    fetchCompanies()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.companyId || !formData.role || !formData.date || !formData.overallDifficulty || !formData.outcome) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    if (formData.rounds.length === 0) {
      toast({
        title: "Add Interview Rounds",
        description: "Please add at least one interview round.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)

    try {
      const experienceData = {
        id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        companyId: formData.companyId,
        role: formData.role,
        date: formData.date,
        rounds: formData.rounds,
        overallDifficulty: formData.overallDifficulty,
        outcome: formData.outcome,
        tips: formData.tips,
        anonymous: formData.anonymous,
        verified: formData.verified
      }

      const response = await fetch('/api/experiences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(experienceData),
      })

      if (!response.ok) {
        throw new Error('Failed to create experience')
      }

      toast({
        title: "Experience Shared!",
        description: "Your interview experience has been shared successfully.",
      })

      router.push('/forum')
    } catch (error) {
      console.error('Error creating experience:', error)
      toast({
        title: "Error",
        description: "Failed to share your experience. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const addRound = () => {
    if (newRound.type && newRound.description && newRound.difficulty) {
      setFormData(prev => ({
        ...prev,
        rounds: [...prev.rounds, { ...newRound }]
      }))
      setNewRound({ type: '', description: '', difficulty: '' as 'easy' | 'medium' | 'hard' })
    }
  }

  const removeRound = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rounds: prev.rounds.filter((_, i) => i !== index)
    }))
  }

  const addTip = () => {
    if (newTip.trim()) {
      setFormData(prev => ({
        ...prev,
        tips: [...prev.tips, newTip.trim()]
      }))
      setNewTip('')
    }
  }

  const removeTip = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tips: prev.tips.filter((_, i) => i !== index)
    }))
  }

  return (
    <>
      <LoadingOverlay message="Sharing your experience..." isVisible={loading} />
      <div className="mx-auto w-full max-w-4xl px-4 py-10">
        <Card className="shadow-lg">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <Building2 className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold">Share Your Interview Experience</CardTitle>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Help other students by sharing your interview experience and preparation tips
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Selection */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Building2 className="h-4 w-4" />
                Company *
              </Label>
              <Select value={formData.companyId} onValueChange={(value) => setFormData(prev => ({ ...prev, companyId: value }))}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select the company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Role and Date */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="role" className="flex items-center gap-2 text-sm font-medium">
                  <Briefcase className="h-4 w-4" />
                  Role/Position *
                </Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="e.g., Software Engineer, Analyst"
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="date" className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4" />
                  Interview Date *
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                  className="h-11"
                />
              </div>
            </div>

            {/* Interview Rounds */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Target className="h-4 w-4" />
                Interview Rounds *
              </Label>
              
              {/* Existing Rounds */}
              {formData.rounds.length > 0 && (
                <div className="space-y-3">
                  {formData.rounds.map((round, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{round.type}</Badge>
                            <Badge className={DIFFICULTY_OPTIONS.find(d => d.value === round.difficulty)?.color}>
                              {round.difficulty}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{round.description}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRound(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Add New Round */}
              <Card className="p-4 border-dashed">
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Select value={newRound.type} onValueChange={(value) => setNewRound(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Round type" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROUND_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={newRound.difficulty} onValueChange={(value: 'easy' | 'medium' | 'hard') => setNewRound(prev => ({ ...prev, difficulty: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        {DIFFICULTY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    value={newRound.description}
                    onChange={(e) => setNewRound(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe this round - what was asked, format, duration, etc."
                    rows={3}
                  />
                  <Button type="button" onClick={addRound} variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Round
                  </Button>
                </div>
              </Card>
            </div>

            {/* Overall Difficulty and Outcome */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  Overall Difficulty *
                </Label>
                <Select value={formData.overallDifficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, overallDifficulty: value }))}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select overall difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <div className={`px-2 py-1 rounded text-xs ${option.color}`}>
                            {option.label}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  Outcome *
                </Label>
                <Select value={formData.outcome} onValueChange={(value) => setFormData(prev => ({ ...prev, outcome: value }))}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select outcome" />
                  </SelectTrigger>
                  <SelectContent>
                    {OUTCOME_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <div className={`px-2 py-1 rounded text-xs ${option.color}`}>
                            {option.label}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tips */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <CheckCircle className="h-4 w-4" />
                Preparation Tips (Optional)
              </Label>
              
              {/* Existing Tips */}
              {formData.tips.length > 0 && (
                <div className="space-y-2">
                  {formData.tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="flex-1 text-sm">{tip}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTip(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Tip */}
              <div className="flex gap-2">
                <Textarea
                  value={newTip}
                  onChange={(e) => setNewTip(e.target.value)}
                  placeholder="Share a preparation tip that helped you..."
                  rows={2}
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={addTip}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anonymous"
                  checked={formData.anonymous}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, anonymous: !!checked }))}
                />
                <Label htmlFor="anonymous" className="text-sm">
                  Share anonymously (your name won't be displayed)
                </Label>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full h-12 text-base font-medium"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Sharing Experience...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Share Experience
                </div>
              )}
            </Button>
          </form>
        </CardContent>
        </Card>
      </div>
    </>
  )
}