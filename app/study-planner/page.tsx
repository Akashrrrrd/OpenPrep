"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { generateStudyPlan, StudyPlan, getStudyPlanProgress } from "@/lib/study-planner"
import { getCompanies } from "@/lib/companies"
import { Calendar, Clock, Target, BookOpen, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function StudyPlannerPage() {
  const [step, setStep] = useState<'form' | 'plan'>('form')
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null)
  const [formData, setFormData] = useState({
    targetCompanies: [] as string[],
    availableHoursPerDay: 4,
    targetDate: '',
    currentLevel: 'intermediate' as 'beginner' | 'intermediate' | 'advanced',
    focusAreas: ['aptitude', 'coding', 'technical'] as ('aptitude' | 'coding' | 'technical' | 'hr')[]
  })

  const companies = [
    { id: 'tcs', name: 'TCS' },
    { id: 'infosys', name: 'Infosys' },
    { id: 'wipro', name: 'Wipro' },
    { id: 'accenture', name: 'Accenture' },
    { id: 'cognizant', name: 'Cognizant' },
    { id: 'capgemini', name: 'Capgemini' }
  ]

  const handleGeneratePlan = () => {
    if (formData.targetCompanies.length === 0 || !formData.targetDate) {
      alert('Please select at least one company and target date')
      return
    }

    const plan = generateStudyPlan(
      formData.targetCompanies,
      formData.availableHoursPerDay,
      formData.targetDate,
      formData.currentLevel,
      formData.focusAreas
    )
    
    setStudyPlan(plan)
    setStep('plan')
  }

  const toggleTaskCompletion = (dayIndex: number, taskIndex: number) => {
    if (!studyPlan) return
    
    const updatedPlan = { ...studyPlan }
    updatedPlan.generatedPlan[dayIndex].tasks[taskIndex].completed = 
      !updatedPlan.generatedPlan[dayIndex].tasks[taskIndex].completed
    
    setStudyPlan(updatedPlan)
  }

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case 'aptitude': return '🧮'
      case 'coding': return '💻'
      case 'technical': return '⚙️'
      case 'hr': return '👥'
      case 'mock_test': return '📝'
      case 'revision': return '📚'
      default: return '📖'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  if (step === 'plan' && studyPlan) {
    const progress = getStudyPlanProgress(studyPlan)
    const today = new Date().toISOString().split('T')[0]
    const todayTasks = studyPlan.generatedPlan.find(day => day.date === today)

    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Your Personalized Study Plan</h1>
          <p className="text-muted-foreground text-sm sm:text-base px-4 sm:px-0">
            Targeting: {studyPlan.targetCompanies.join(', ')} • {studyPlan.availableHoursPerDay}h/day
          </p>
        </div>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{progress.completedTasks}</div>
                <div className="text-sm text-muted-foreground">Tasks Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{progress.totalTasks}</div>
                <div className="text-sm text-muted-foreground">Total Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{Math.round(progress.completedHours)}</div>
                <div className="text-sm text-muted-foreground">Hours Studied</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{Math.round(progress.totalHours)}</div>
                <div className="text-sm text-muted-foreground">Total Hours</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{progress.progressPercentage}%</span>
              </div>
              <Progress value={progress.progressPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Today's Tasks */}
        {todayTasks && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today's Tasks ({todayTasks.date})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {todayTasks.tasks.map((task, taskIndex) => {
                const dayIndex = studyPlan.generatedPlan.findIndex(day => day.date === today)
                return (
                  <div
                    key={task.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border ${
                      task.completed ? 'bg-green-50 dark:bg-green-900/20' : 'bg-card'
                    }`}
                  >
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTaskCompletion(dayIndex, taskIndex)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getTaskTypeIcon(task.type)}</span>
                          <h4 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {task.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(task.priority)} variant="outline">
                            {task.priority}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {task.duration}min
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                      {task.resources.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          <strong>Resources:</strong> {task.resources.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        )}

        {/* Full Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Complete Study Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {studyPlan.generatedPlan.slice(0, 14).map((day, dayIndex) => (
              <div key={day.date} className="border rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <h3 className="font-semibold text-sm sm:text-base">
                    Day {dayIndex + 1} - {new Date(day.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    {day.totalHours.toFixed(1)} hours
                  </div>
                </div>
                <div className="grid gap-2">
                  {day.tasks.map((task, taskIndex) => (
                    <div
                      key={task.id}
                      className={`flex items-center gap-3 p-2 rounded ${
                        task.completed ? 'bg-green-50 dark:bg-green-900/20' : ''
                      }`}
                    >
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTaskCompletion(dayIndex, taskIndex)}
                      />
                      <span className="text-sm">{getTaskTypeIcon(task.type)}</span>
                      <span className={`text-sm flex-1 ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </span>
                      <Badge className={getPriorityColor(task.priority)} variant="outline" size="sm">
                        {task.priority}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{task.duration}min</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {studyPlan.generatedPlan.length > 14 && (
              <div className="text-center text-muted-foreground">
                ... and {studyPlan.generatedPlan.length - 14} more days
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button variant="outline" onClick={() => setStep('form')}>
            Create New Plan
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create Your Study Plan</CardTitle>
          <p className="text-muted-foreground">
            Get a personalized study schedule based on your target companies and available time
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Target Companies */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Target Companies</Label>
            <div className="grid grid-cols-2 gap-3">
              {companies.map((company) => (
                <div key={company.id} className="flex items-center space-x-2">
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
                  <Label htmlFor={company.id} className="text-sm font-normal">
                    {company.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Available Hours */}
          <div className="space-y-3">
            <Label htmlFor="hours" className="text-base font-medium">
              Available Hours Per Day
            </Label>
            <Select
              value={formData.availableHoursPerDay.toString()}
              onValueChange={(value) => setFormData(prev => ({ ...prev, availableHoursPerDay: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 hours</SelectItem>
                <SelectItem value="3">3 hours</SelectItem>
                <SelectItem value="4">4 hours</SelectItem>
                <SelectItem value="5">5 hours</SelectItem>
                <SelectItem value="6">6 hours</SelectItem>
                <SelectItem value="8">8 hours</SelectItem>
              </SelectContent>
            </Select>
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
            <Label className="text-base font-medium">Current Preparation Level</Label>
            <Select
              value={formData.currentLevel}
              onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => 
                setFormData(prev => ({ ...prev, currentLevel: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner - Just starting preparation</SelectItem>
                <SelectItem value="intermediate">Intermediate - Some preparation done</SelectItem>
                <SelectItem value="advanced">Advanced - Well prepared, need fine-tuning</SelectItem>
              </SelectContent>
            </Select>
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

          <Button onClick={handleGeneratePlan} className="w-full" size="lg">
            Generate My Study Plan
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}