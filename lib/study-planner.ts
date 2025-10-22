import connectDB from './mongodb'
import StudyPlan, { IStudyPlan, ITask, IDailyTask } from './models/StudyPlan'

export interface StudyPlan {
  id: string
  userId?: string
  targetCompanies: string[]
  availableHoursPerDay: number
  targetDate: string
  currentLevel: 'beginner' | 'intermediate' | 'advanced'
  focusAreas: ('aptitude' | 'coding' | 'technical' | 'hr')[]
  generatedPlan: DailyTask[]
  createdAt: string
}

export interface DailyTask {
  date: string
  tasks: Task[]
  totalHours: number
}

export interface Task {
  id: string
  title: string
  type: 'aptitude' | 'coding' | 'technical' | 'hr' | 'mock_test' | 'revision'
  duration: number // in minutes
  priority: 'high' | 'medium' | 'low'
  description: string
  resources: string[]
  completed: boolean
}

export function generateStudyPlan(
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

function formatStudyPlan(plan: IStudyPlan): StudyPlan {
  return {
    id: plan.id,
    userId: plan.userId,
    targetCompanies: [...plan.targetCompanies],
    availableHoursPerDay: plan.availableHoursPerDay,
    targetDate: plan.targetDate.toISOString(),
    currentLevel: plan.currentLevel,
    focusAreas: [...plan.focusAreas],
    generatedPlan: plan.generatedPlan.map(day => ({
      date: day.date.toISOString().split('T')[0],
      tasks: day.tasks.map(task => ({
        id: task.id,
        title: task.title,
        type: task.type,
        duration: task.duration,
        priority: task.priority,
        description: task.description,
        resources: [...task.resources],
        completed: task.completed
      })),
      totalHours: day.totalHours
    })),
    createdAt: plan.createdAt?.toISOString() || new Date().toISOString()
  }
}

export async function saveStudyPlan(planData: StudyPlan): Promise<StudyPlan | null> {
  try {
    await connectDB()
    const plan = new StudyPlan({
      ...planData,
      targetDate: new Date(planData.targetDate),
      generatedPlan: planData.generatedPlan.map(day => ({
        ...day,
        date: new Date(day.date)
      }))
    })
    const savedPlan = await plan.save()
    
    return formatStudyPlan(savedPlan)
  } catch (error) {
    console.error('Error saving study plan:', error)
    return null
  }
}

export async function getStudyPlan(id: string): Promise<StudyPlan | null> {
  try {
    await connectDB()
    const plan = await StudyPlan.findOne({ id }).lean()
    
    if (!plan) return null
    
    return formatStudyPlan(plan)
  } catch (error) {
    console.error('Error fetching study plan:', error)
    return null
  }
}

export async function updateStudyPlan(id: string, updates: Partial<StudyPlan>): Promise<StudyPlan | null> {
  try {
    await connectDB()
    const updateData = { ...updates }
    if (updateData.targetDate) {
      updateData.targetDate = new Date(updateData.targetDate) as any
    }
    if (updateData.generatedPlan) {
      updateData.generatedPlan = updateData.generatedPlan.map(day => ({
        ...day,
        date: new Date(day.date)
      })) as any
    }
    
    const plan = await StudyPlan.findOneAndUpdate(
      { id },
      updateData,
      { new: true, runValidators: true }
    ).lean()
    
    if (!plan) return null
    
    return formatStudyPlan(plan)
  } catch (error) {
    console.error('Error updating study plan:', error)
    return null
  }
}

export async function deleteStudyPlan(id: string): Promise<boolean> {
  try {
    await connectDB()
    const result = await StudyPlan.deleteOne({ id })
    return result.deletedCount > 0
  } catch (error) {
    console.error('Error deleting study plan:', error)
    return false
  }
}

export async function getUserStudyPlans(userId?: string): Promise<StudyPlan[]> {
  try {
    await connectDB()
    const query = userId ? { userId } : {}
    const plans = await StudyPlan.find(query)
      .sort({ createdAt: -1 })
      .lean()
    
    return plans.map(formatStudyPlan)
  } catch (error) {
    console.error('Error fetching user study plans:', error)
    return []
  }
}

export function getStudyPlanProgress(plan: StudyPlan): {
  completedTasks: number
  totalTasks: number
  completedHours: number
  totalHours: number
  progressPercentage: number
} {
  const allTasks = plan.generatedPlan.flatMap(day => day.tasks)
  const completedTasks = allTasks.filter(task => task.completed)
  
  const totalHours = allTasks.reduce((sum, task) => sum + task.duration / 60, 0)
  const completedHours = completedTasks.reduce((sum, task) => sum + task.duration / 60, 0)
  
  return {
    completedTasks: completedTasks.length,
    totalTasks: allTasks.length,
    completedHours,
    totalHours,
    progressPercentage: Math.round((completedTasks.length / allTasks.length) * 100)
  }
}