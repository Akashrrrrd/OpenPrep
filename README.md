# 🚀 OpenPrep - AI-Enhanced Interview Preparation Platform

## 🏆 Google Chrome Built-in AI Challenge 2025 Submission

**OpenPrep** is a comprehensive interview preparation platform enhanced with Chrome's built-in AI models. It combines traditional interview prep resources with cutting-edge AI capabilities to provide personalized, intelligent coaching for job seekers.

## 🎯 **Hackathon Submission Overview**

### **Problem Solved**
Interview preparation is often generic, time-consuming, and lacks personalized feedback. OpenPrep leverages Chrome's built-in AI to provide:
- **Dynamic question generation** tailored to user's skill level
- **Real-time content improvement** for better communication
- **Intelligent summarization** of study materials
- **Professional writing assistance** for forum interactions

### **Chrome AI APIs Used**
1. **🧠 Prompt API** - Dynamic interview question generation and evaluation
2. **📄 Summarizer API** - Study material and performance summarization  
3. **🔤 Proofreader API** - Professional communication enhancement

### **Innovation Highlights**
- **First interview prep platform** with Chrome AI integration
- **Real-world application** solving actual user problems
- **Production-ready implementation** with comprehensive features
- **Scalable architecture** ready for global deployment

## ✨ **Key Features**

### **🤖 AI-Enhanced Interview Practice**
- Dynamic question generation using Chrome's Prompt API
- Real-time answer evaluation and feedback
- Personalized follow-up questions based on responses
- Voice-enabled interview experience

### **📚 Smart Study Materials**
- AI-powered content summarization
- Curated resources for 50+ programming topics
- Company-specific preparation materials
- Intelligent content processing

### **💬 Intelligent Forum**
- AI writing assistance for better questions
- Grammar and spelling correction
- Content improvement suggestions
- Community-driven Q&A platform

### **📊 Comprehensive Platform**
- **User Authentication** - Secure JWT-based system
- **Study Planner** - Personalized preparation schedules
- **Interview Experiences** - Real user-shared experiences
- **Company Resources** - FAANG and startup-specific materials
- **Progress Tracking** - Detailed analytics and insights

## 🛠 **Tech Stack**

### **Frontend**
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern component library

### **Backend**
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT Authentication** - Secure user sessions
- **Chrome AI APIs** - Built-in browser AI capabilities

### **AI Integration**
- **Chrome Prompt API** - Language model for content generation
- **Chrome Summarizer API** - Intelligent content summarization
- **Chrome Proofreader API** - Grammar and writing enhancement

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+
- MongoDB database
- Chrome browser with AI features enabled
- npm or yarn

### **Installation**

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/openprep.git
cd openprep
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
Create a `.env.local` file:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NEXTAUTH_SECRET=your_nextauth_secret
```

4. **Seed the database:**
```bash
npm run seed-all
```

5. **Run the development server:**
```bash
npm run dev
```

6. **Open [http://localhost:3000](http://localhost:3000)**

### **Testing Chrome AI Features**
1. Use Chrome browser (version 127+)
2. Enable experimental AI features in chrome://flags
3. Navigate to interview or forum pages
4. Look for AI-enhanced buttons with sparkle icons
5. Test question generation and writing assistance

## 📁 **Project Structure**

```
openprep/
├── app/                          # Next.js App Router
│   ├── api/                     # API endpoints
│   │   ├── auth/               # Authentication APIs
│   │   ├── interview/          # Interview APIs
│   │   ├── materials/          # Study materials APIs
│   │   └── questions/          # Forum APIs
│   ├── dashboard/              # User dashboard
│   ├── interview/              # AI interview practice
│   ├── forum/                  # Community forum
│   ├── materials/              # Study resources
│   └── experiences/            # Interview experiences
├── components/                  # Reusable components
│   ├── ai-enhanced-button.tsx  # Chrome AI integration
│   ├── ui/                     # shadcn/ui components
│   └── ...
├── lib/                        # Utilities and configurations
│   ├── models/                 # MongoDB models
│   ├── chrome-ai.ts           # Chrome AI service
│   ├── mongodb.ts             # Database connection
│   └── ...
├── scripts/                    # Database seeding
└── public/                     # Static assets
```

## 🎯 **Chrome AI Integration Details**

### **Service Architecture**
```typescript
// lib/chrome-ai.ts - Centralized AI service
export class ChromeAIService {
  static async generateInterviewQuestions(type, topic, difficulty)
  static async summarizeContent(content)
  static async proofreadContent(text)
  // ... more AI methods
}
```

### **Component Integration**
```typescript
// components/ai-enhanced-button.tsx - Reusable AI component
<AIEnhancedButton
  aiAction="improve"
  content={userContent}
  onAIResult={handleResult}
>
  Improve Content
</AIEnhancedButton>
```

### **Real-World Use Cases**
- **Interview Practice**: Generate unlimited personalized questions
- **Study Efficiency**: Summarize long technical documents
- **Communication**: Improve forum posts and answers
- **Professional Growth**: Enhance writing quality

## 📊 **Database Schema**

### **Core Models**
- **User** - Authentication and profile data
- **Interview** - AI interview sessions and results
- **Question** - Forum questions and answers
- **Material** - Study resources and metadata
- **Company** - Company-specific information
- **InterviewExperience** - User-shared experiences

### **Sample Data**
The platform includes comprehensive seed data:
- **50+ Study Materials** across programming topics
- **8 Major Companies** (Google, Microsoft, Amazon, etc.)
- **Sample Interview Experiences** with detailed rounds
- **Forum Questions** with answers and voting

## 🔧 **Available Scripts**

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database Management
npm run seed-all        # Seed all data (recommended)
npm run seed-materials  # Seed only study materials
npm run seed-forum      # Seed only forum data

# Testing
npm run lint           # Run ESLint
npm run type-check     # TypeScript type checking
```

## 🌟 **Hackathon Highlights**

### **Technical Excellence**
- **Production-ready code** with TypeScript and proper error handling
- **Scalable architecture** using Next.js and MongoDB
- **Modern UI/UX** with responsive design
- **Comprehensive testing** and validation

### **AI Innovation**
- **Multiple API integration** (3 Chrome AI APIs)
- **Real user value** in education and career development
- **Seamless fallbacks** when AI features aren't available
- **Future-proof implementation** ready for API expansion

### **Business Impact**
- **Addresses real problem** in interview preparation
- **Scalable to millions** of job seekers globally
- **Monetization ready** with subscription tiers
- **Community-driven** growth potential

## 🚀 **Deployment**

### **Production Deployment**
1. **Build the application:**
```bash
npm run build
```

2. **Deploy to Vercel:**
```bash
vercel --prod
```

3. **Set environment variables** in Vercel dashboard

4. **Seed production database:**
```bash
npm run seed-all
```

### **Environment Variables**
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
NEXTAUTH_SECRET=your-nextauth-secret
NODE_ENV=production
```

## 🎥 **Demo Video**

[Link to demo video showcasing Chrome AI features]

## 🔗 **Live Demo**

[Link to deployed application]

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 **Hackathon Submission**

**OpenPrep** demonstrates the future of AI-enhanced web applications by:
- Solving real-world problems with Chrome's built-in AI
- Providing genuine user value in career development
- Showcasing technical excellence and innovation
- Building a scalable, production-ready platform

**Ready to revolutionize interview preparation with Chrome AI!** 🚀

---

**Built with ❤️ for the Google Chrome Built-in AI Challenge 2025**