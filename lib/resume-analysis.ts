import { ResumeAnalysis } from '@/components/resume-upload'

// Enhanced resume analysis with better keyword extraction and categorization
export class ResumeAnalyzer {
  private static readonly SKILL_KEYWORDS = {
    languages: [
      'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust',
      'swift', 'kotlin', 'scala', 'r', 'matlab', 'perl', 'bash', 'powershell'
    ],
    frameworks: [
      'react', 'vue', 'angular', 'svelte', 'next.js', 'nuxt', 'express', 'django', 'flask',
      'spring', 'laravel', 'rails', 'asp.net', 'fastapi', 'graphql', 'apollo'
    ],
    databases: [
      'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'cassandra', 'dynamodb',
      'sqlite', 'oracle', 'sql server', 'firebase', 'supabase'
    ],
    cloud: [
      'aws', 'azure', 'gcp', 'google cloud', 'heroku', 'vercel', 'netlify', 'digitalocean',
      'lambda', 'ec2', 's3', 'cloudformation', 'terraform'
    ],
    tools: [
      'docker', 'kubernetes', 'jenkins', 'github actions', 'gitlab ci', 'circleci',
      'git', 'webpack', 'babel', 'eslint', 'prettier', 'jest', 'cypress', 'selenium'
    ],
    methodologies: [
      'agile', 'scrum', 'kanban', 'tdd', 'bdd', 'ci/cd', 'devops', 'microservices'
    ]
  }

  private static readonly EXPERIENCE_KEYWORDS = [
    'years', 'year', 'months', 'month', 'experience', 'senior', 'junior', 'lead', 'principal',
    'architect', 'engineer', 'developer', 'fullstack', 'frontend', 'backend', 'full stack'
  ]

  static async analyzeResume(file: File): Promise<ResumeAnalysis> {
    try {
      // Extract text from file
      const text = await this.extractTextFromFile(file)

      // Analyze with Chrome AI if available
      const aiAnalysis = await this.analyzeWithChromeAI(text)

      // Fallback to manual analysis
      const manualAnalysis = this.analyzeManually(text)

      // Combine results
      return {
        skills: [...new Set([...(aiAnalysis.skills || []), ...manualAnalysis.skills])],
        technologies: [...new Set([...(aiAnalysis.technologies || []), ...manualAnalysis.technologies])],
        experience: [...new Set([...(aiAnalysis.experience || []), ...manualAnalysis.experience])],
        keywords: [...new Set([...(aiAnalysis.keywords || []), ...manualAnalysis.keywords])],
        rawText: text
      }
    } catch (error) {
      console.error('Resume analysis failed:', error)
      // Return basic analysis even on failure
      const text = await this.extractTextFromFile(file).catch(() => '')
      return this.analyzeManually(text)
    }
  }

  private static async extractTextFromFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer

          if (file.type === 'application/pdf') {
            const text = await this.extractFromPDF(arrayBuffer)
            resolve(text)
          } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const text = await this.extractFromDOCX(arrayBuffer)
            resolve(text)
          } else {
            reject(new Error('Unsupported file type'))
          }
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsArrayBuffer(file)
    })
  }

  private static async extractFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
    // In a real implementation, use pdf-parse or pdf2pic
    // For now, return mock data
    return `
John Doe
Senior Full Stack Developer

Experience:
- 5 years of experience in web development
- React, Node.js, TypeScript, Python
- AWS, Docker, MongoDB, PostgreSQL
- Led team of 3 developers on e-commerce platform
- Implemented CI/CD pipelines with Jenkins

Skills:
- JavaScript, TypeScript, Python
- React, Express, Django
- MongoDB, PostgreSQL, Redis
- AWS (EC2, S3, Lambda), Docker, Kubernetes
- Git, Jenkins, Agile/Scrum
    `.trim()
  }

  private static async extractFromDOCX(arrayBuffer: ArrayBuffer): Promise<string> {
    // In a real implementation, use mammoth.js
    // For now, return mock data
    return `
Jane Smith
Software Engineer

Professional Experience:
- 3+ years in software development
- Java, Spring Boot, React
- Microservices architecture
- REST APIs, GraphQL
- Unit testing, integration testing

Technical Skills:
- Programming: Java, JavaScript, Python
- Frameworks: Spring Boot, React, Express
- Databases: MySQL, MongoDB
- Tools: Docker, Git, Maven, Gradle
- Cloud: AWS, Azure
    `.trim()
  }

  private static async analyzeWithChromeAI(text: string): Promise<Partial<ResumeAnalysis>> {
    try {
      if (typeof window === 'undefined' || !('ai' in window)) {
        throw new Error('Chrome AI not available')
      }

      const ai = (window as any).ai

      if (!ai.languageModel) {
        throw new Error('Language model not available')
      }

      const model = await ai.languageModel.create()

      const prompt = `Analyze this resume and extract technical information. Return ONLY a JSON object with these exact keys:
      {
        "skills": ["list", "of", "technical", "skills"],
        "technologies": ["list", "of", "technologies", "frameworks", "tools"],
        "experience": ["list", "of", "experience", "areas", "or", "years"],
        "keywords": ["important", "keywords", "for", "interview", "questions"]
      }

      Resume text:
      ${text}

      Return only the JSON, no other text.`

      const response = await model.prompt(prompt)

      // Clean the response to ensure it's valid JSON
      const cleanedResponse = response.trim().replace(/```json\s*|\s*```/g, '')
      const analysis = JSON.parse(cleanedResponse)

      return analysis

    } catch (error) {
      console.error('Chrome AI analysis failed:', error)
      throw error
    }
  }

  private static analyzeManually(text: string): ResumeAnalysis {
    const lowerText = text.toLowerCase()

    // Extract skills by category
    const skills: string[] = []
    const technologies: string[] = []

    // Languages
    this.SKILL_KEYWORDS.languages.forEach(lang => {
      if (lowerText.includes(lang)) {
        skills.push(lang.charAt(0).toUpperCase() + lang.slice(1))
      }
    })

    // Frameworks
    this.SKILL_KEYWORDS.frameworks.forEach(framework => {
      if (lowerText.includes(framework.toLowerCase())) {
        technologies.push(framework)
      }
    })

    // Databases
    this.SKILL_KEYWORDS.databases.forEach(db => {
      if (lowerText.includes(db.toLowerCase())) {
        technologies.push(db)
      }
    })

    // Cloud
    this.SKILL_KEYWORDS.cloud.forEach(cloud => {
      if (lowerText.includes(cloud.toLowerCase())) {
        technologies.push(cloud)
      }
    })

    // Tools
    this.SKILL_KEYWORDS.tools.forEach(tool => {
      if (lowerText.includes(tool.toLowerCase())) {
        technologies.push(tool)
      }
    })

    // Extract experience information
    const experience: string[] = []
    this.EXPERIENCE_KEYWORDS.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        // Extract surrounding context for experience
        const index = lowerText.indexOf(keyword)
        const start = Math.max(0, index - 20)
        const end = Math.min(text.length, index + keyword.length + 20)
        const context = text.slice(start, end).trim()
        if (context && !experience.includes(context)) {
          experience.push(context)
        }
      }
    })

    // Generate keywords for interview questions
    const keywords = [...skills, ...technologies, ...experience]

    return {
      skills: [...new Set(skills)],
      technologies: [...new Set(technologies)],
      experience: [...new Set(experience)],
      keywords: [...new Set(keywords)],
      rawText: text
    }
  }

  // Get question categories based on resume analysis
  static getRelevantCategories(analysis: ResumeAnalysis): string[] {
    const categories: string[] = []

    // Map skills to question categories
    if (analysis.skills.some(skill => ['JavaScript', 'TypeScript'].includes(skill))) {
      categories.push('JavaScript')
    }

    if (analysis.technologies.some(tech => tech.toLowerCase().includes('react'))) {
      categories.push('React')
    }

    if (analysis.technologies.some(tech => tech.toLowerCase().includes('node'))) {
      categories.push('API')
    }

    if (analysis.technologies.some(tech => ['MongoDB', 'PostgreSQL', 'MySQL'].includes(tech))) {
      categories.push('Database')
    }

    if (analysis.technologies.some(tech => ['AWS', 'Azure', 'GCP'].includes(tech))) {
      categories.push('DevOps')
    }

    // Always include general categories
    categories.push('Algorithms', 'Programming Concepts')

    return [...new Set(categories)]
  }
}
