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
  
  // Enhanced evaluation for voice-based answers with resume context
  static evaluateVoiceAnswer(
    answer: string, 
    keywords: string[], 
    category: string, 
    timeSpent: number = 0,
    resumeAnalysis?: any
  ): EvaluationResult {
    if (!answer || answer.trim().length < 10) {
      return {
        score: 0,
        feedback: "Answer is too short or empty. Please provide a more detailed response.",
        keywordsFound: [],
        keywordsMissed: keywords,
        strengths: [],
        improvements: ["Provide more detailed explanations", "Include specific examples", "Speak more confidently"]
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
    const keywordScore = (keywordsFound.length / Math.max(keywords.length, 1)) * 50

    // Voice-specific scoring factors
    let bonusScore = 0
    const wordCount = answer.trim().split(/\s+/).length

    // Length bonus for voice responses (optimal 30-150 words for spoken answers)
    if (wordCount >= 30 && wordCount <= 150) {
      bonusScore += 20
    } else if (wordCount >= 20 && wordCount < 30) {
      bonusScore += 15
    } else if (wordCount > 150 && wordCount <= 200) {
      bonusScore += 10
    }

    // Time-based scoring (good pacing)
    if (timeSpent > 0) {
      const wordsPerSecond = wordCount / timeSpent
      if (wordsPerSecond >= 1.5 && wordsPerSecond <= 3) { // Good speaking pace
        bonusScore += 10
      } else if (wordsPerSecond >= 1 && wordsPerSecond < 1.5) {
        bonusScore += 5 // Slower but thoughtful
      }
    }

    // Resume relevance bonus
    if (resumeAnalysis) {
      const resumeSkills = resumeAnalysis.skills || []
      const resumeTech = resumeAnalysis.technologies || []
      
      resumeSkills.forEach((skill: string) => {
        if (answerLower.includes(skill.toLowerCase())) {
          bonusScore += 5
        }
      })
      
      resumeTech.forEach((tech: string) => {
        if (answerLower.includes(tech.toLowerCase())) {
          bonusScore += 5
        }
      })
    }

    // Voice communication patterns
    if (answerLower.includes('example') || answerLower.includes('for instance') || answerLower.includes('such as')) {
      bonusScore += 10
    }

    // Confidence indicators in speech
    if (answerLower.includes('i believe') || answerLower.includes('in my experience') || answerLower.includes('i think')) {
      bonusScore += 5
    }

    // Technical depth for voice responses
    if (category === 'JavaScript' || category === 'React' || category === 'Database') {
      if (answerLower.includes('because') || answerLower.includes('reason') || answerLower.includes('why')) {
        bonusScore += 8
      }
    }

    const finalScore = Math.min(100, Math.max(0, keywordScore + bonusScore))

    // Generate voice-specific feedback
    const feedback = this.generateVoiceFeedback(finalScore, keywordsFound, keywordsMissed, wordCount, timeSpent, category)
    const strengths = this.identifyVoiceStrengths(answerLower, keywordsFound, timeSpent, wordCount, category)
    const improvements = this.identifyVoiceImprovements(keywordsMissed, wordCount, timeSpent, category)

    return {
      score: Math.round(finalScore),
      feedback,
      keywordsFound,
      keywordsMissed,
      strengths,
      improvements
    }
  }

  // Generate voice-specific feedback
  private static generateVoiceFeedback(
    score: number, 
    keywordsFound: string[], 
    keywordsMissed: string[], 
    wordCount: number, 
    timeSpent: number, 
    category: string
  ): string {
    let feedback = ""

    if (score >= 80) {
      feedback = "Excellent voice response! You spoke clearly and covered key concepts well."
    } else if (score >= 60) {
      feedback = "Good spoken answer with clear communication. Some technical areas could be expanded."
    } else if (score >= 40) {
      feedback = "Decent response but missing some important concepts. Practice explaining technical topics aloud."
    } else {
      feedback = "Voice response needs improvement. Focus on speaking more confidently and covering key concepts."
    }

    if (keywordsFound.length > 0) {
      feedback += ` You clearly mentioned: ${keywordsFound.join(', ')}.`
    }

    if (keywordsMissed.length > 0 && keywordsMissed.length <= 3) {
      feedback += ` Consider discussing: ${keywordsMissed.slice(0, 3).join(', ')}.`
    }

    // Voice-specific feedback
    if (timeSpent > 0) {
      const wordsPerSecond = wordCount / timeSpent
      if (wordsPerSecond < 1) {
        feedback += " Try to speak a bit faster and more confidently."
      } else if (wordsPerSecond > 3.5) {
        feedback += " Good enthusiasm! Try to slow down slightly for better clarity."
      } else {
        feedback += " Good speaking pace and clarity."
      }
    }

    if (wordCount < 20) {
      feedback += " Try to elaborate more when speaking - provide examples and explanations."
    } else if (wordCount > 200) {
      feedback += " Good detail, but practice being more concise in verbal responses."
    }

    return feedback
  }

  // Identify voice-specific strengths
  private static identifyVoiceStrengths(
    answerLower: string, 
    keywordsFound: string[], 
    timeSpent: number, 
    wordCount: number, 
    category: string
  ): string[] {
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

    if (wordCount >= 50 && wordCount <= 150) {
      strengths.push("Good response length for voice")
    }

    if (timeSpent > 0) {
      const wordsPerSecond = wordCount / timeSpent
      if (wordsPerSecond >= 1.5 && wordsPerSecond <= 3) {
        strengths.push("Good speaking pace")
      }
    }

    if (answerLower.includes('i believe') || answerLower.includes('in my experience')) {
      strengths.push("Confident communication")
    }

    return strengths
  }

  // Identify voice-specific improvements
  private static identifyVoiceImprovements(
    keywordsMissed: string[], 
    wordCount: number, 
    timeSpent: number, 
    category: string
  ): string[] {
    const improvements: string[] = []

    if (keywordsMissed.length > 3) {
      improvements.push("Cover more key technical concepts")
    }

    if (wordCount < 30) {
      improvements.push("Provide more detailed explanations")
      improvements.push("Include specific examples")
      improvements.push("Speak more confidently and elaborately")
    }

    if (timeSpent > 0) {
      const wordsPerSecond = wordCount / timeSpent
      if (wordsPerSecond < 1) {
        improvements.push("Speak more fluently and confidently")
      } else if (wordsPerSecond > 3.5) {
        improvements.push("Slow down for better clarity")
      }
    }

    if (category === 'JavaScript' || category === 'React') {
      improvements.push("Explain the 'why' behind concepts")
      improvements.push("Mention practical use cases")
    }

    return improvements
  }

  // Legacy method for backward compatibility
  static evaluateAnswer(answer: string, keywords: string[], category: string): EvaluationResult {
    return this.evaluateVoiceAnswer(answer, keywords, category, 0)
  }

  // Generate overall assessment for the entire interview
  static generateOverallAssessment(questions: any[], type: string): OverallAssessment {
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
      technical: type === 'technical' || type === 'resume-based' ? this.generateTechnicalFeedback(averageScore) : "N/A - HR Interview",
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
    
    return 'General'
  }

  private static getCategorySuggestions(category: string, type: string): string[] {
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
      ]
    }

    return suggestions[category] || [
      'Practice more questions in this area',
      'Study relevant concepts and best practices',
      'Gain hands-on experience through projects',
      'Seek feedback from experienced professionals'
    ]
  }

  private static generateOverallFeedback(score: number, type: string): string {
    const interviewType = type === 'technical' || type === 'resume-based' ? 'technical' : 'HR'
    
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