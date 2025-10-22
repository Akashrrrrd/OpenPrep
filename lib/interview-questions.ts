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