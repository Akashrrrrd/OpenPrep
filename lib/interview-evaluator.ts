// AI Interview Evaluation System
export interface EvaluationResult {
  score: number
  feedback: string
  keywordsFound: string[]
  keywordsMissed: string[]
  strengths: string[]
  improvements: string[]
}

export interface OverallAssessment {
  overallScore: number
  strengths: Array<{
    category: string
    score: number
    feedback: string
  }>
  improvements: Array<{
    category: string
    score: number
    feedback: string
    suggestions: string[]
  }>
  feedback: {
    overall: string
    technical: string
    communication: string
    confidence: string
  }
}

export class InterviewEvaluator {
  
  // Evaluate a single answer
  static evaluateAnswer(answer: string, keywords: string[], category: string): EvaluationResult {
    if (!answer || answer.trim().length < 10) {
      return {
        score: 0,
        feedback: "Answer is too short or empty. Please provide a more detailed response.",
        keywordsFound: [],
        keywordsMissed: keywords,
        strengths: [],
        improvements: ["Provide more detailed explanations", "Include specific examples"]
      }
    }

    const answerLower = answer.toLowerCase()
    const keywordsFound: string[] = []
    const keywordsMissed: string[] = []

    // Check for keywords
    keywords.forEach(keyword => {
      if (answerLower.includes(keyword.toLowerCase())) {
        keywordsFound.push(keyword)
      } else {
        keywordsMissed.push(keyword)
      }
    })

    // Calculate base score from keyword coverage
    const keywordScore = (keywordsFound.length / keywords.length) * 60

    // Additional scoring factors
    let bonusScore = 0
    const wordCount = answer.trim().split(/\s+/).length

    // Length bonus (optimal 50-200 words)
    if (wordCount >= 50 && wordCount <= 200) {
      bonusScore += 15
    } else if (wordCount >= 30 && wordCount < 50) {
      bonusScore += 10
    } else if (wordCount > 200 && wordCount <= 300) {
      bonusScore += 10
    }

    // Structure bonus (contains examples, explanations)
    if (answerLower.includes('example') || answerLower.includes('for instance') || answerLower.includes('such as')) {
      bonusScore += 10
    }

    // Technical depth bonus
    if (category === 'JavaScript' || category === 'React' || category === 'Database') {
      if (answerLower.includes('because') || answerLower.includes('reason') || answerLower.includes('why')) {
        bonusScore += 5
      }
    }

    // Communication bonus for HR questions
    if (category === 'Introduction' || category === 'Teamwork' || category === 'Problem Solving') {
      if (answerLower.includes('team') || answerLower.includes('collaborate') || answerLower.includes('communicate')) {
        bonusScore += 5
      }
    }

    const finalScore = Math.min(100, Math.max(0, keywordScore + bonusScore))

    // Generate feedback
    const feedback = this.generateFeedback(finalScore, keywordsFound, keywordsMissed, wordCount, category)
    const strengths = this.identifyStrengths(answerLower, keywordsFound, category)
    const improvements = this.identifyImprovements(keywordsMissed, wordCount, category)

    return {
      score: Math.round(finalScore),
      feedback,
      keywordsFound,
      keywordsMissed,
      strengths,
      improvements
    }
  }

  // Generate detailed feedback for an answer
  private static generateFeedback(score: number, keywordsFound: string[], keywordsMissed: string[], wordCount: number, category: string): string {
    let feedback = ""

    if (score >= 80) {
      feedback = "Excellent answer! You demonstrated strong understanding and covered most key concepts."
    } else if (score >= 60) {
      feedback = "Good answer with solid understanding. Some areas could be expanded."
    } else if (score >= 40) {
      feedback = "Decent answer but missing some important concepts. Consider adding more detail."
    } else {
      feedback = "Answer needs improvement. Focus on covering key concepts and providing more explanation."
    }

    if (keywordsFound.length > 0) {
      feedback += ` You correctly mentioned: ${keywordsFound.join(', ')}.`
    }

    if (keywordsMissed.length > 0 && keywordsMissed.length <= 3) {
      feedback += ` Consider discussing: ${keywordsMissed.slice(0, 3).join(', ')}.`
    }

    if (wordCount < 30) {
      feedback += " Try to provide more detailed explanations with examples."
    } else if (wordCount > 300) {
      feedback += " Good detail, but try to be more concise in your explanations."
    }

    return feedback
  }

  // Identify strengths in the answer
  private static identifyStrengths(answerLower: string, keywordsFound: string[], category: string): string[] {
    const strengths: string[] = []

    if (keywordsFound.length >= 3) {
      strengths.push("Strong technical knowledge")
    }

    if (answerLower.includes('example') || answerLower.includes('for instance')) {
      strengths.push("Good use of examples")
    }

    if (answerLower.includes('experience') || answerLower.includes('project')) {
      strengths.push("Practical experience mentioned")
    }

    if (answerLower.length > 200) {
      strengths.push("Detailed explanation")
    }

    if (category.includes('HR') || category === 'Teamwork') {
      if (answerLower.includes('team') || answerLower.includes('collaborate')) {
        strengths.push("Team-oriented mindset")
      }
    }

    return strengths
  }

  // Identify areas for improvement
  private static identifyImprovements(keywordsMissed: string[], wordCount: number, category: string): string[] {
    const improvements: string[] = []

    if (keywordsMissed.length > 3) {
      improvements.push("Cover more key technical concepts")
    }

    if (wordCount < 50) {
      improvements.push("Provide more detailed explanations")
      improvements.push("Include specific examples")
    }

    if (category === 'JavaScript' || category === 'React') {
      improvements.push("Explain the 'why' behind concepts")
      improvements.push("Mention practical use cases")
    }

    if (category.includes('HR')) {
      improvements.push("Use the STAR method (Situation, Task, Action, Result)")
      improvements.push("Include quantifiable achievements")
    }

    return improvements
  }

  // Generate overall assessment for the entire interview
  static generateOverallAssessment(questions: any[], type: 'technical' | 'hr'): OverallAssessment {
    const totalScore = questions.reduce((sum, q) => sum + (q.score || 0), 0)
    const averageScore = questions.length > 0 ? totalScore / questions.length : 0

    // Categorize questions and calculate category scores
    const categoryScores: { [key: string]: { total: number, count: number, scores: number[] } } = {}
    
    questions.forEach(q => {
      const category = this.getCategoryFromQuestion(q.question)
      if (!categoryScores[category]) {
        categoryScores[category] = { total: 0, count: 0, scores: [] }
      }
      categoryScores[category].total += q.score || 0
      categoryScores[category].count += 1
      categoryScores[category].scores.push(q.score || 0)
    })

    const strengths: Array<{ category: string, score: number, feedback: string }> = []
    const improvements: Array<{ category: string, score: number, feedback: string, suggestions: string[] }> = []

    Object.entries(categoryScores).forEach(([category, data]) => {
      const avgScore = data.total / data.count
      
      if (avgScore >= 70) {
        strengths.push({
          category,
          score: Math.round(avgScore),
          feedback: `Strong performance in ${category}. You demonstrated good understanding and communication skills.`
        })
      } else {
        improvements.push({
          category,
          score: Math.round(avgScore),
          feedback: `Room for improvement in ${category}. Focus on strengthening your knowledge in this area.`,
          suggestions: this.getCategorySuggestions(category, type)
        })
      }
    })

    // Generate detailed feedback
    const feedback = {
      overall: this.generateOverallFeedback(averageScore, type),
      technical: type === 'technical' ? this.generateTechnicalFeedback(averageScore) : "N/A - HR Interview",
      communication: this.generateCommunicationFeedback(questions),
      confidence: this.generateConfidenceFeedback(questions)
    }

    return {
      overallScore: Math.round(averageScore),
      strengths,
      improvements,
      feedback
    }
  }

  private static getCategoryFromQuestion(question: string): string {
    const questionLower = question.toLowerCase()
    
    // Technical categories
    if (questionLower.includes('javascript') || questionLower.includes('js') || questionLower.includes('var') || questionLower.includes('let') || questionLower.includes('const')) {
      return 'JavaScript'
    }
    if (questionLower.includes('react') || questionLower.includes('component') || questionLower.includes('hook')) {
      return 'React'
    }
    if (questionLower.includes('database') || questionLower.includes('sql') || questionLower.includes('nosql')) {
      return 'Database'
    }
    if (questionLower.includes('api') || questionLower.includes('rest')) {
      return 'API'
    }
    if (questionLower.includes('algorithm') || questionLower.includes('big o')) {
      return 'Algorithms'
    }
    
    // HR categories
    if (questionLower.includes('yourself') || questionLower.includes('tell me about')) {
      return 'Introduction'
    }
    if (questionLower.includes('team') || questionLower.includes('difficult')) {
      return 'Teamwork'
    }
    if (questionLower.includes('strength') || questionLower.includes('weakness')) {
      return 'Self Assessment'
    }
    if (questionLower.includes('challenging') || questionLower.includes('problem')) {
      return 'Problem Solving'
    }
    
    return 'General'
  }

  private static getCategorySuggestions(category: string, type: 'technical' | 'hr'): string[] {
    const suggestions: { [key: string]: string[] } = {
      'JavaScript': [
        'Practice ES6+ features and modern JavaScript concepts',
        'Study closures, hoisting, and scope in depth',
        'Build projects using vanilla JavaScript',
        'Learn about asynchronous programming and promises'
      ],
      'React': [
        'Build more React projects to gain hands-on experience',
        'Study React hooks and their use cases',
        'Learn about state management patterns',
        'Practice component lifecycle and optimization'
      ],
      'Database': [
        'Study SQL queries and database design principles',
        'Learn about different database types and their use cases',
        'Practice with both relational and NoSQL databases',
        'Understand indexing and query optimization'
      ],
      'Introduction': [
        'Practice your elevator pitch',
        'Prepare specific examples of your achievements',
        'Research the company and role thoroughly',
        'Focus on relevant skills and experiences'
      ],
      'Teamwork': [
        'Prepare STAR method examples',
        'Think of specific collaboration experiences',
        'Practice conflict resolution scenarios',
        'Highlight leadership and communication skills'
      ],
      'Problem Solving': [
        'Use the STAR method for behavioral questions',
        'Prepare multiple examples of challenges overcome',
        'Focus on your thought process and approach',
        'Quantify the impact of your solutions'
      ]
    }

    return suggestions[category] || [
      'Practice more questions in this area',
      'Study relevant concepts and best practices',
      'Gain hands-on experience through projects',
      'Seek feedback from experienced professionals'
    ]
  }

  private static generateOverallFeedback(score: number, type: 'technical' | 'hr'): string {
    const interviewType = type === 'technical' ? 'technical' : 'HR'
    
    if (score >= 85) {
      return `Outstanding performance in this ${interviewType} interview! You demonstrated excellent knowledge and communication skills. You're well-prepared for similar interviews.`
    } else if (score >= 70) {
      return `Good performance in this ${interviewType} interview. You showed solid understanding with room for minor improvements. Keep practicing to reach excellence.`
    } else if (score >= 55) {
      return `Decent performance with several areas for improvement. Focus on strengthening your knowledge and practice explaining concepts more clearly.`
    } else {
      return `This interview shows significant room for improvement. Dedicate time to studying core concepts and practicing your communication skills.`
    }
  }

  private static generateTechnicalFeedback(score: number): string {
    if (score >= 80) {
      return "Strong technical knowledge demonstrated. You understand core concepts well and can explain them clearly."
    } else if (score >= 60) {
      return "Good technical foundation with some gaps. Focus on deepening your understanding of key concepts."
    } else {
      return "Technical knowledge needs significant improvement. Study fundamental concepts and practice coding regularly."
    }
  }

  private static generateCommunicationFeedback(questions: any[]): string {
    const avgLength = questions.reduce((sum, q) => sum + (q.answer?.length || 0), 0) / questions.length
    
    if (avgLength > 200) {
      return "Good communication with detailed explanations. Consider being more concise while maintaining clarity."
    } else if (avgLength > 100) {
      return "Clear communication with appropriate detail level. Good balance of explanation and conciseness."
    } else {
      return "Communication could be improved. Provide more detailed explanations and examples to support your answers."
    }
  }

  private static generateConfidenceFeedback(questions: any[]): string {
    const shortAnswers = questions.filter(q => (q.answer?.length || 0) < 50).length
    const confidenceScore = ((questions.length - shortAnswers) / questions.length) * 100
    
    if (confidenceScore >= 80) {
      return "You appear confident in your responses with consistent detail across answers."
    } else if (confidenceScore >= 60) {
      return "Generally confident with some hesitation on certain topics. Practice more to build consistency."
    } else {
      return "Work on building confidence. Practice explaining concepts out loud and prepare more thoroughly."
    }
  }
}