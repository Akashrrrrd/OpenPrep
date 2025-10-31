// Standard interview questions with keywords for evaluation
export const technicalQuestions = [
  {
    question: "Explain the difference between let, const, and var in JavaScript.",
    category: "JavaScript",
    difficulty: "medium",
    keywords: ["scope", "hoisting", "block scope", "function scope", "reassignment", "redeclaration", "temporal dead zone"],
    sampleAnswer: "var has function scope and is hoisted, let and const have block scope. const cannot be reassigned, let can be. var allows redeclaration, let and const don't.",
    companies: ["Google", "Microsoft", "Amazon", "Meta"]
  },
  {
    question: "What is the difference between == and === in JavaScript?",
    category: "JavaScript", 
    difficulty: "easy",
    keywords: ["type coercion", "strict equality", "loose equality", "type conversion", "comparison"],
    sampleAnswer: "== performs type coercion before comparison, === checks both value and type without coercion.",
    companies: ["Netflix", "Uber", "Airbnb"]
  },
  {
    question: "Explain closures in JavaScript with an example.",
    category: "JavaScript",
    difficulty: "hard",
    keywords: ["lexical scope", "inner function", "outer function", "variable access", "memory", "encapsulation"],
    sampleAnswer: "A closure is when an inner function has access to variables from its outer function's scope even after the outer function has returned.",
    companies: ["Google", "Meta", "Apple"]
  },
  {
    question: "What is the Virtual DOM in React and why is it useful?",
    category: "React",
    difficulty: "medium",
    keywords: ["virtual dom", "reconciliation", "diffing", "performance", "real dom", "batching", "efficient updates"],
    sampleAnswer: "Virtual DOM is a JavaScript representation of the real DOM. React uses it to efficiently update the UI by comparing changes and updating only what's necessary.",
    companies: ["Meta", "Netflix", "Airbnb"]
  },
  {
    question: "Explain the concept of state management in React.",
    category: "React",
    difficulty: "medium",
    keywords: ["state", "props", "useState", "component state", "lifting state up", "redux", "context"],
    sampleAnswer: "State management involves handling data that changes over time in React components using useState, useReducer, Context API, or external libraries like Redux.",
    companies: ["Meta", "Uber", "Spotify"]
  },
  {
    question: "What are React Hooks and why were they introduced?",
    category: "React",
    difficulty: "medium",
    keywords: ["hooks", "functional components", "useState", "useEffect", "class components", "lifecycle", "reusability"],
    sampleAnswer: "Hooks allow functional components to use state and lifecycle methods. They were introduced to simplify component logic and improve code reusability.",
    companies: ["Meta", "Google", "Microsoft"]
  },
  {
    question: "Explain the difference between SQL and NoSQL databases.",
    category: "Database",
    difficulty: "medium",
    keywords: ["relational", "non-relational", "schema", "ACID", "scalability", "consistency", "flexibility"],
    sampleAnswer: "SQL databases are relational with fixed schemas and ACID properties. NoSQL databases are non-relational, more flexible, and better for horizontal scaling.",
    companies: ["Amazon", "Google", "MongoDB"]
  },
  {
    question: "What is REST API and what are its principles?",
    category: "API",
    difficulty: "medium",
    keywords: ["REST", "stateless", "HTTP methods", "GET", "POST", "PUT", "DELETE", "resources", "uniform interface"],
    sampleAnswer: "REST is an architectural style for web services that uses HTTP methods, is stateless, and treats everything as resources with uniform interfaces.",
    companies: ["Amazon", "Microsoft", "Stripe"]
  },
  {
    question: "Explain the concept of Big O notation.",
    category: "Algorithms",
    difficulty: "hard",
    keywords: ["time complexity", "space complexity", "algorithm efficiency", "worst case", "average case", "scalability"],
    sampleAnswer: "Big O notation describes the upper bound of algorithm complexity, helping us understand how performance scales with input size.",
    companies: ["Google", "Amazon", "Meta"]
  },
  {
    question: "What is the difference between authentication and authorization?",
    category: "Security",
    difficulty: "easy",
    keywords: ["authentication", "authorization", "identity", "permissions", "access control", "JWT", "OAuth"],
    sampleAnswer: "Authentication verifies who you are (identity), authorization determines what you can access (permissions).",
    companies: ["Auth0", "Okta", "Microsoft"]
  },
  {
    question: "Explain the concept of microservices architecture.",
    category: "Architecture",
    difficulty: "hard",
    keywords: ["microservices", "monolith", "distributed", "scalability", "independence", "communication", "deployment"],
    sampleAnswer: "Microservices break applications into small, independent services that communicate over networks, enabling better scalability and maintainability.",
    companies: ["Netflix", "Amazon", "Uber"]
  },
  {
    question: "What is Docker and how does it work?",
    category: "DevOps",
    difficulty: "medium",
    keywords: ["containerization", "docker", "images", "containers", "isolation", "portability", "virtualization"],
    sampleAnswer: "Docker is a containerization platform that packages applications with their dependencies into lightweight, portable containers.",
    companies: ["Docker", "Google", "Amazon"]
  },
  {
    question: "Explain the concept of version control and Git.",
    category: "Tools",
    difficulty: "easy",
    keywords: ["version control", "git", "repository", "commit", "branch", "merge", "collaboration", "history"],
    sampleAnswer: "Version control tracks changes to code over time. Git is a distributed version control system that enables collaboration and maintains project history.",
    companies: ["GitHub", "GitLab", "Atlassian"]
  },
  {
    question: "What is the difference between synchronous and asynchronous programming?",
    category: "Programming Concepts",
    difficulty: "medium",
    keywords: ["synchronous", "asynchronous", "blocking", "non-blocking", "promises", "async/await", "callbacks"],
    sampleAnswer: "Synchronous code executes sequentially and blocks until completion. Asynchronous code allows other operations to continue while waiting for results.",
    companies: ["Node.js", "Google", "Microsoft"]
  },
  {
    question: "Explain the concept of Object-Oriented Programming.",
    category: "Programming Concepts",
    difficulty: "medium",
    keywords: ["OOP", "encapsulation", "inheritance", "polymorphism", "abstraction", "classes", "objects"],
    sampleAnswer: "OOP organizes code into objects with properties and methods, using principles like encapsulation, inheritance, polymorphism, and abstraction.",
    companies: ["Oracle", "Microsoft", "IBM"]
  }
]

export const hrQuestions = [
  {
    question: "Tell me about yourself.",
    category: "Introduction",
    difficulty: "easy",
    keywords: ["background", "experience", "skills", "achievements", "career goals", "relevant", "concise"],
    sampleAnswer: "A brief professional summary highlighting relevant experience, key skills, and career objectives aligned with the role.",
    companies: ["All Companies"]
  },
  {
    question: "Why do you want to work for our company?",
    category: "Company Interest",
    difficulty: "medium",
    keywords: ["research", "company values", "mission", "culture", "growth", "opportunity", "alignment"],
    sampleAnswer: "Show research about the company, align personal values with company mission, and express genuine interest in contributing to their goals.",
    companies: ["All Companies"]
  },
  {
    question: "What are your greatest strengths?",
    category: "Self Assessment",
    difficulty: "easy",
    keywords: ["relevant strengths", "examples", "impact", "skills", "achievements", "specific", "measurable"],
    sampleAnswer: "Identify 2-3 relevant strengths with specific examples and quantifiable impact on previous roles or projects.",
    companies: ["All Companies"]
  },
  {
    question: "What is your biggest weakness?",
    category: "Self Assessment",
    difficulty: "medium",
    keywords: ["genuine weakness", "improvement", "learning", "growth", "self-awareness", "action plan"],
    sampleAnswer: "Share a real weakness you're actively working to improve, with specific steps you're taking for development.",
    companies: ["All Companies"]
  },
  {
    question: "Where do you see yourself in 5 years?",
    category: "Career Goals",
    difficulty: "medium",
    keywords: ["career progression", "growth", "learning", "leadership", "expertise", "realistic", "aligned"],
    sampleAnswer: "Outline realistic career progression that shows ambition while aligning with the company's growth opportunities.",
    companies: ["All Companies"]
  },
  {
    question: "Why are you leaving your current job?",
    category: "Career Transition",
    difficulty: "medium",
    keywords: ["positive reasons", "growth", "opportunity", "learning", "challenge", "career advancement"],
    sampleAnswer: "Focus on positive reasons like seeking growth, new challenges, or better alignment with career goals. Avoid negative comments.",
    companies: ["All Companies"]
  },
  {
    question: "Describe a challenging situation you faced at work and how you handled it.",
    category: "Problem Solving",
    difficulty: "hard",
    keywords: ["STAR method", "situation", "task", "action", "result", "problem solving", "leadership"],
    sampleAnswer: "Use STAR method to describe a specific challenging situation, your actions, and the positive outcome achieved.",
    companies: ["All Companies"]
  },
  {
    question: "How do you handle stress and pressure?",
    category: "Work Style",
    difficulty: "medium",
    keywords: ["stress management", "prioritization", "time management", "calm", "productive", "strategies"],
    sampleAnswer: "Describe specific stress management techniques, prioritization methods, and how you maintain productivity under pressure.",
    companies: ["All Companies"]
  },
  {
    question: "Describe your ideal work environment.",
    category: "Work Style",
    difficulty: "easy",
    keywords: ["collaboration", "communication", "learning", "growth", "team work", "flexibility", "culture"],
    sampleAnswer: "Describe an environment that matches the company culture while highlighting your adaptability and team collaboration skills.",
    companies: ["All Companies"]
  },
  {
    question: "How do you prioritize your work when you have multiple deadlines?",
    category: "Time Management",
    difficulty: "medium",
    keywords: ["prioritization", "time management", "deadlines", "organization", "efficiency", "communication"],
    sampleAnswer: "Explain your prioritization framework, time management tools, and communication strategies for managing multiple deadlines.",
    companies: ["All Companies"]
  },
  {
    question: "Tell me about a time you had to work with a difficult team member.",
    category: "Teamwork",
    difficulty: "hard",
    keywords: ["teamwork", "conflict resolution", "communication", "empathy", "collaboration", "positive outcome"],
    sampleAnswer: "Use STAR method to show how you handled interpersonal challenges professionally and achieved positive team outcomes.",
    companies: ["All Companies"]
  },
  {
    question: "What motivates you in your work?",
    category: "Motivation",
    difficulty: "easy",
    keywords: ["intrinsic motivation", "learning", "impact", "growth", "achievement", "purpose", "contribution"],
    sampleAnswer: "Share genuine motivators that align with the role, such as learning, making impact, solving problems, or helping others.",
    companies: ["All Companies"]
  },
  {
    question: "How do you stay updated with industry trends?",
    category: "Learning",
    difficulty: "medium",
    keywords: ["continuous learning", "industry knowledge", "resources", "networking", "courses", "reading"],
    sampleAnswer: "Describe specific resources, communities, courses, or practices you use to stay current with industry developments.",
    companies: ["All Companies"]
  },
  {
    question: "Describe a time when you had to learn something new quickly.",
    category: "Adaptability",
    difficulty: "medium",
    keywords: ["learning agility", "adaptability", "quick learning", "resourcefulness", "application", "results"],
    sampleAnswer: "Share a specific example showing your learning process, resources used, and successful application of new knowledge.",
    companies: ["All Companies"]
  },
  {
    question: "What questions do you have for us?",
    category: "Engagement",
    difficulty: "easy",
    keywords: ["thoughtful questions", "company culture", "role expectations", "growth opportunities", "team dynamics"],
    sampleAnswer: "Ask thoughtful questions about the role, team, company culture, growth opportunities, and success metrics.",
    companies: ["All Companies"]
  }
]

export const getRandomQuestions = (type: 'technical' | 'hr', count: number = 15) => {
  const questions = type === 'technical' ? technicalQuestions : hrQuestions
  const shuffled = [...questions].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.min(count, questions.length))
}

// Resume analysis interface
export interface ResumeAnalysis {
  skills: string[]
  technologies: string[]
  experience: string[]
  keywords: string[]
  rawText: string
}

// Generate questions based on resume analysis
export const generateResumeBasedQuestions = (resumeAnalysis: ResumeAnalysis, count: number = 8) => {
  const { skills, technologies, experience, keywords } = resumeAnalysis
  const questions = []

  // Generate custom questions based on specific skills found in resume
  const customQuestions = generateCustomQuestions(skills, technologies, experience)
  
  // Prioritize custom questions (60% of total)
  const customCount = Math.ceil(count * 0.6)
  questions.push(...customQuestions.slice(0, customCount))

  // Find relevant predefined questions based on resume skills
  const relevantQuestions = technicalQuestions.filter(q => 
    skills.some(skill => 
      q.category.toLowerCase().includes(skill.toLowerCase()) ||
      q.keywords.some(keyword => keyword.toLowerCase().includes(skill.toLowerCase())) ||
      q.question.toLowerCase().includes(skill.toLowerCase())
    ) ||
    technologies.some(tech =>
      q.category.toLowerCase().includes(tech.toLowerCase()) ||
      q.keywords.some(keyword => keyword.toLowerCase().includes(tech.toLowerCase())) ||
      q.question.toLowerCase().includes(tech.toLowerCase())
    )
  )

  // Add relevant predefined questions (40% of total)
  const remainingCount = count - questions.length
  if (remainingCount > 0 && relevantQuestions.length > 0) {
    questions.push(...relevantQuestions.slice(0, remainingCount))
  }

  // If still not enough questions, generate more custom ones
  if (questions.length < count) {
    const additionalCustom = generateExperienceBasedQuestions(experience, skills)
    questions.push(...additionalCustom.slice(0, count - questions.length))
  }

  // Ensure we have enough questions
  if (questions.length < count) {
    const fallbackQuestions = technicalQuestions.filter(q => !questions.includes(q))
    questions.push(...fallbackQuestions.slice(0, count - questions.length))
  }

  // Shuffle and return
  return questions.sort(() => 0.5 - Math.random()).slice(0, count)
}

// Generate custom questions based on specific skills and technologies
const generateCustomQuestions = (skills: string[], technologies: string[], experience: string[]) => {
  const customQuestions = []

  // JavaScript/TypeScript specific questions
  if (skills.some(s => s.toLowerCase().includes('javascript') || s.toLowerCase().includes('typescript'))) {
    customQuestions.push(
      {
        question: "Based on your JavaScript experience, explain how closures work and provide a practical example.",
        category: "JavaScript",
        difficulty: "medium",
        keywords: ["closures", "scope", "lexical scope", "inner function", "practical example"],
        sampleAnswer: "Closures allow inner functions to access outer function variables even after the outer function returns.",
        companies: ["Google", "Meta", "Microsoft"]
      },
      {
        question: "How do you handle asynchronous operations in JavaScript? Compare callbacks, promises, and async/await.",
        category: "JavaScript",
        difficulty: "medium",
        keywords: ["asynchronous", "callbacks", "promises", "async/await", "event loop"],
        sampleAnswer: "Callbacks can lead to callback hell, promises provide better chaining, async/await offers cleaner syntax.",
        companies: ["Netflix", "Uber", "Airbnb"]
      }
    )
  }

  // React specific questions
  if (skills.some(s => s.toLowerCase().includes('react'))) {
    customQuestions.push(
      {
        question: "In your React projects, how do you manage state? Compare useState, useReducer, and Context API.",
        category: "React",
        difficulty: "medium",
        keywords: ["state management", "useState", "useReducer", "Context API", "props drilling"],
        sampleAnswer: "useState for simple state, useReducer for complex state logic, Context API to avoid props drilling.",
        companies: ["Meta", "Netflix", "Spotify"]
      },
      {
        question: "How do you optimize React component performance? Discuss memoization and re-rendering.",
        category: "React",
        difficulty: "hard",
        keywords: ["performance", "memoization", "React.memo", "useMemo", "useCallback", "re-rendering"],
        sampleAnswer: "Use React.memo, useMemo, useCallback to prevent unnecessary re-renders and expensive calculations.",
        companies: ["Meta", "Google", "Microsoft"]
      }
    )
  }

  // Node.js specific questions
  if (skills.some(s => s.toLowerCase().includes('node'))) {
    customQuestions.push(
      {
        question: "Describe your experience with Node.js. How do you handle errors in asynchronous operations?",
        category: "Node.js",
        difficulty: "medium",
        keywords: ["error handling", "try-catch", "promises", "async/await", "error-first callbacks"],
        sampleAnswer: "Use try-catch with async/await, .catch() with promises, and error-first callbacks for traditional Node.js patterns.",
        companies: ["Netflix", "Uber", "LinkedIn"]
      }
    )
  }

  // Python specific questions
  if (skills.some(s => s.toLowerCase().includes('python'))) {
    customQuestions.push(
      {
        question: "What Python frameworks have you worked with? Compare their use cases and advantages.",
        category: "Python",
        difficulty: "medium",
        keywords: ["frameworks", "Django", "Flask", "FastAPI", "use cases", "advantages"],
        sampleAnswer: "Django for full-featured web apps, Flask for lightweight APIs, FastAPI for modern async APIs with automatic documentation.",
        companies: ["Google", "Instagram", "Dropbox"]
      }
    )
  }

  // Database questions based on technologies
  if (technologies.some(t => ['mongodb', 'mysql', 'postgresql', 'redis'].some(db => t.toLowerCase().includes(db)))) {
    const dbTechs = technologies.filter(t => ['mongodb', 'mysql', 'postgresql', 'redis'].some(db => t.toLowerCase().includes(db)))
    customQuestions.push(
      {
        question: `You've worked with ${dbTechs.join(', ')}. How do you choose between SQL and NoSQL databases for a project?`,
        category: "Database",
        difficulty: "medium",
        keywords: ["SQL", "NoSQL", "database selection", "use cases", "scalability", "consistency"],
        sampleAnswer: "Choose SQL for complex relationships and ACID compliance, NoSQL for scalability and flexible schemas.",
        companies: ["Amazon", "Google", "MongoDB"]
      }
    )
  }

  // AWS/Cloud questions
  if (technologies.some(t => ['aws', 'azure', 'gcp', 'docker', 'kubernetes'].some(cloud => t.toLowerCase().includes(cloud)))) {
    const cloudTechs = technologies.filter(t => ['aws', 'azure', 'gcp', 'docker', 'kubernetes'].some(cloud => t.toLowerCase().includes(cloud)))
    customQuestions.push(
      {
        question: `Describe your experience with ${cloudTechs.join(', ')}. How do you ensure application scalability in the cloud?`,
        category: "Cloud & DevOps",
        difficulty: "hard",
        keywords: ["cloud", "scalability", "load balancing", "auto scaling", "containerization"],
        sampleAnswer: "Use load balancers, auto scaling groups, containerization, and microservices for horizontal scalability.",
        companies: ["Amazon", "Microsoft", "Google"]
      }
    )
  }

  return customQuestions
}

// Generate experience-based questions
const generateExperienceBasedQuestions = (experience: string[], skills: string[]) => {
  const questions = []

  // Frontend experience questions
  if (experience.some(exp => exp.toLowerCase().includes('frontend'))) {
    questions.push({
      question: "Tell me about a challenging frontend project you've worked on. What technologies did you use and what problems did you solve?",
      category: "Frontend Experience",
      difficulty: "medium",
      keywords: ["project experience", "challenges", "problem solving", "technologies"],
      sampleAnswer: "Describe a specific project, technologies used, challenges faced, and solutions implemented.",
      companies: ["All Companies"]
    })
  }

  // Backend experience questions
  if (experience.some(exp => exp.toLowerCase().includes('backend'))) {
    questions.push({
      question: "Describe a backend system you've designed. How did you handle scalability and performance?",
      category: "Backend Experience",
      difficulty: "hard",
      keywords: ["system design", "scalability", "performance", "architecture"],
      sampleAnswer: "Explain system architecture, scalability strategies, performance optimizations, and trade-offs made.",
      companies: ["All Companies"]
    })
  }

  // Years of experience questions
  const experienceYears = experience.find(exp => exp.includes('years'))
  if (experienceYears) {
    questions.push({
      question: `With your ${experienceYears} in software development, what's the most important lesson you've learned?`,
      category: "Professional Growth",
      difficulty: "easy",
      keywords: ["experience", "lessons learned", "professional growth", "best practices"],
      sampleAnswer: "Share a meaningful lesson about code quality, teamwork, problem-solving, or technical decision-making.",
      companies: ["All Companies"]
    })
  }

  return questions
}