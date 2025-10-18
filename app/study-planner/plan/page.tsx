"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LoadingOverlay } from "@/components/loading"

interface Task {
  id: string
  title: string
  type: 'aptitude' | 'coding' | 'technical' | 'hr' | 'mock_test' | 'revision'
  duration: number // in minutes
  priority: 'high' | 'medium' | 'low'
  description: string
  resources: string[]
  completed: boolean
}

interface DailyTask {
  date: string
  tasks: Task[]
  totalHours: number
}

interface StudyPlan {
  id: string
  targetCompanies: string[]
  availableHoursPerDay: number
  targetDate: string
  currentLevel: string
  focusAreas: string[]
  generatedPlan: DailyTask[]
  createdAt: string
}

// Client-side study plan generation function
function generateStudyPlan(
  targetCompanies: string[],
  availableHoursPerDay: number,
  targetDate: string,
  currentLevel: 'beginner' | 'intermediate' | 'advanced',
  focusAreas: ('aptitude' | 'coding' | 'technical' | 'hr')[]
): StudyPlan {
  const startDate = new Date()
  const endDate = new Date(targetDate)
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  
  const dailyTasks: DailyTask[] = []
  
  // Generate tasks for each day
  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i)
    
    const tasks = generateDailyTasks(
      i,
      totalDays,
      availableHoursPerDay,
      currentLevel,
      focusAreas,
      targetCompanies
    )
    
    dailyTasks.push({
      date: currentDate.toISOString().split('T')[0],
      tasks,
      totalHours: tasks.reduce((sum, task) => sum + task.duration / 60, 0)
    })
  }
  
  return {
    id: `plan-${Date.now()}`,
    targetCompanies,
    availableHoursPerDay,
    targetDate,
    currentLevel,
    focusAreas,
    generatedPlan: dailyTasks,
    createdAt: new Date().toISOString()
  }
}

function generateDailyTasks(
  dayIndex: number,
  totalDays: number,
  availableHours: number,
  level: string,
  focusAreas: string[],
  targetCompanies: string[]
): Task[] {
  const tasks: Task[] = []
  const availableMinutes = availableHours * 60
  
  // Phase-based approach
  const phase1Days = Math.floor(totalDays * 0.6) // 60% foundation
  const phase2Days = Math.floor(totalDays * 0.3) // 30% practice
  const phase3Days = totalDays - phase1Days - phase2Days // 10% final prep
  
  if (dayIndex < phase1Days) {
    // Foundation Phase
    tasks.push(...generateFoundationTasks(availableMinutes, level, focusAreas))
  } else if (dayIndex < phase1Days + phase2Days) {
    // Practice Phase
    tasks.push(...generatePracticeTasks(availableMinutes, level, focusAreas, targetCompanies))
  } else {
    // Final Preparation Phase
    tasks.push(...generateFinalPrepTasks(availableMinutes, targetCompanies))
  }
  
  return tasks
}

function generateFoundationTasks(
  availableMinutes: number,
  level: string,
  focusAreas: string[]
): Task[] {
  const tasks: Task[] = []
  const timePerArea = Math.floor(availableMinutes / focusAreas.length)
  
  focusAreas.forEach((area, index) => {
    switch (area) {
      case 'aptitude':
        tasks.push({
          id: `task-${Date.now()}-${index}`,
          title: 'Quantitative Aptitude Practice',
          type: 'aptitude',
          duration: Math.floor(timePerArea * 0.6),
          priority: 'high',
          description: level === 'beginner' 
            ? 'Basic arithmetic, percentages, and simple interest'
            : 'Advanced problems on time & work, profit & loss',
          resources: [
            'RS Aggarwal Quantitative Aptitude',
            'IndiaBix Aptitude Questions',
            'Previous year question papers'
          ],
          completed: false
        })
        
        tasks.push({
          id: `task-${Date.now()}-${index}-2`,
          title: 'Logical Reasoning',
          type: 'aptitude',
          duration: Math.floor(timePerArea * 0.4),
          priority: 'medium',
          description: 'Pattern recognition, blood relations, coding-decoding',
          resources: [
            'RS Aggarwal Logical Reasoning',
            'Logical reasoning practice tests'
          ],
          completed: false
        })
        break
        
      case 'coding':
        tasks.push({
          id: `task-${Date.now()}-${index}`,
          title: 'Data Structures & Algorithms',
          type: 'coding',
          duration: timePerArea,
          priority: 'high',
          description: level === 'beginner'
            ? 'Arrays, strings, basic sorting algorithms'
            : 'Trees, graphs, dynamic programming',
          resources: [
            'LeetCode Easy/Medium problems',
            'GeeksforGeeks DSA course',
            'Coding interview preparation books'
          ],
          completed: false
        })
        break
        
      case 'technical':
        tasks.push({
          id: `task-${Date.now()}-${index}`,
          title: 'Core CS Concepts',
          type: 'technical',
          duration: timePerArea,
          priority: 'high',
          description: 'OOP, DBMS, Operating Systems, Computer Networks',
          resources: [
            'GATE preparation books',
            'InterviewBit technical questions',
            'YouTube CS fundamentals videos'
          ],
          completed: false
        })
        break
        
      case 'hr':
        tasks.push({
          id: `task-${Date.now()}-${index}`,
          title: 'HR Preparation',
          type: 'hr',
          duration: timePerArea,
          priority: 'medium',
          description: 'Common HR questions, company research, mock interviews',
          resources: [
            'Glassdoor interview experiences',
            'Company websites and recent news',
            'STAR method practice'
          ],
          completed: false
        })
        break
    }
  })
  
  return tasks
}

function generatePracticeTasks(
  availableMinutes: number,
  level: string,
  focusAreas: string[],
  targetCompanies: string[]
): Task[] {
  const tasks: Task[] = []
  
  // Mock tests take priority in practice phase
  tasks.push({
    id: `mock-${Date.now()}`,
    title: 'Full Mock Test',
    type: 'mock_test',
    duration: 120, // 2 hours
    priority: 'high',
    description: `Complete mock test simulating ${targetCompanies[0] || 'target company'} pattern`,
    resources: [
      'Company-specific mock tests',
      'Previous year question papers',
      'Online test platforms'
    ],
    completed: false
  })
  
  const remainingTime = availableMinutes - 120
  
  // Focus on weak areas identified from mock tests
  tasks.push({
    id: `practice-${Date.now()}`,
    title: 'Targeted Practice',
    type: 'coding',
    duration: remainingTime,
    priority: 'high',
    description: 'Focus on areas where you scored low in mock tests',
    resources: [
      'Identified weak topics',
      'Additional practice problems',
      'Video explanations'
    ],
    completed: false
  })
  
  return tasks
}

function generateFinalPrepTasks(
  availableMinutes: number,
  targetCompanies: string[]
): Task[] {
  return [
    {
      id: `final-${Date.now()}`,
      title: 'Quick Revision',
      type: 'revision',
      duration: Math.floor(availableMinutes * 0.4),
      priority: 'high',
      description: 'Review formulas, important concepts, and notes',
      resources: [
        'Personal notes and cheat sheets',
        'Formula cards',
        'Quick revision videos'
      ],
      completed: false
    },
    {
      id: `final-mock-${Date.now()}`,
      title: 'Final Mock Test',
      type: 'mock_test',
      duration: Math.floor(availableMinutes * 0.6),
      priority: 'high',
      description: `Final practice test for ${targetCompanies.join(', ')}`,
      resources: [
        'Latest mock tests',
        'Time management practice',
        'Stress management techniques'
      ],
      completed: false
    }
  ]
}

export default function StudyPlanPage() {
  const searchParams = useSearchParams()
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const generatePlan = async () => {
      try {
        const companies = searchParams.get('companies')?.split(',') || []
        const hours = parseInt(searchParams.get('hours') || '4')
        const date = searchParams.get('date') || ''
        const level = searchParams.get('level') || 'intermediate'
        const areas = searchParams.get('areas')?.split(',') || []

        if (!companies.length || !date) {
          setError('Missing required parameters')
          setLoading(false)
          return
        }

        const plan = generateStudyPlan(
          companies,
          hours,
          date,
          level as 'beginner' | 'intermediate' | 'advanced',
          areas as ('aptitude' | 'coding' | 'technical' | 'hr')[]
        )

        setStudyPlan(plan)
      } catch (err) {
        console.error('Error generating study plan:', err)
        setError('Failed to generate study plan')
      } finally {
        setLoading(false)
      }
    }

    generatePlan()
  }, [searchParams])

  if (loading) {
    return <LoadingOverlay message="Generating your personalized study plan..." isVisible={true} />
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-10">
        <Card>
          <CardContent className="text-center py-10">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!studyPlan) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-10">
        <Card>
          <CardContent className="text-center py-10">
            <h2 className="text-xl font-semibold mb-2">No Study Plan Generated</h2>
            <p className="text-muted-foreground mb-4">Unable to generate your study plan. Please try again.</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:py-10">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Your Personalized Study Plan</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {studyPlan.generatedPlan.length} days of focused preparation for your target companies
        </p>
      </div>

      {/* Plan Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Plan Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Target Companies</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {studyPlan.targetCompanies.map((company, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {company}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Daily Hours</h4>
              <p className="text-lg font-semibold">{studyPlan.availableHoursPerDay} hours</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Target Date</h4>
              <p className="text-lg font-semibold">{new Date(studyPlan.targetDate).toLocaleDateString()}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Preparation Level</h4>
              <Badge variant="outline" className="capitalize">{studyPlan.currentLevel}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Schedule */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Daily Schedule</h2>
        {studyPlan.generatedPlan.map((day, dayIndex) => (
          <Card key={day.date} className="overflow-hidden">
            <CardHeader className="pb-3 px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <CardTitle className="text-base sm:text-lg leading-tight">
                  Day {dayIndex + 1} - {new Date(day.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </CardTitle>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">{Math.round(day.totalHours)}h</Badge>
                  <Badge variant="secondary" className="text-xs">{day.tasks.length} task{day.tasks.length !== 1 ? 's' : ''}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="space-y-3 sm:space-y-4">
                {day.tasks.map((task) => (
                  <div key={task.id} className="border-l-4 border-l-blue-500 pl-3 sm:pl-4 py-2 bg-muted/20 rounded-r-lg">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                      <h4 className="font-medium text-sm sm:text-base leading-tight">{task.title}</h4>
                      <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs whitespace-nowrap">
                          {Math.round(task.duration / 60)}h {task.duration % 60}m
                        </Badge>
                        <Badge 
                          variant={task.priority === 'high' ? 'default' : task.priority === 'medium' ? 'secondary' : 'outline'}
                          className={`text-xs capitalize ${
                            task.priority === 'high' 
                              ? 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200' 
                              : task.priority === 'medium'
                              ? 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200'
                              : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                          }`}
                        >
                          {task.priority}
                        </Badge>
                        <Badge variant="secondary" className="text-xs capitalize">
                          {task.type.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 leading-relaxed">{task.description}</p>
                    {task.resources.length > 0 && (
                      <div className="mt-3">
                        <h5 className="text-xs font-medium text-muted-foreground mb-2">Resources:</h5>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {task.resources.map((resource, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></span>
                              <span className="leading-relaxed">{resource}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
        <Button onClick={() => window.print()} variant="outline" className="w-full sm:w-auto">
          Print Plan
        </Button>
        <Button onClick={() => window.history.back()} variant="outline" className="w-full sm:w-auto">
          Create New Plan
        </Button>
      </div>
    </div>
  )
}