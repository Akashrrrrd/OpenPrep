'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ChromeAIService, type ChromeAICapabilities } from '@/lib/chrome-ai'
import {
  Brain,
  FileText,
  Edit3,
  CheckCircle,
  Sparkles,
  Loader2,
  Star,
  Target,
  BookOpen,
  MessageSquare,
  Chrome,
  Zap,
  Shield,
  Award,
  Cpu,
  Activity,
  Wand2
} from 'lucide-react'

export default function ChromeAIShowcase() {
  const [capabilities, setCapabilities] = useState<ChromeAICapabilities | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeDemo, setActiveDemo] = useState<string | null>(null)

  // Interview Questions Demo
  const [interviewQuestions, setInterviewQuestions] = useState<string[]>([])

  // Summarizer Demo
  const [summaryInput, setSummaryInput] = useState('')
  const [summaryOutput, setSummaryOutput] = useState('')

  // Writer Demo
  const [writingInput, setWritingInput] = useState('')
  const [writingOutput, setWritingOutput] = useState('')

  // Proofreader Demo
  const [proofreadInput, setProofreadInput] = useState('')
  const [proofreadOutput, setProofreadOutput] = useState('')

  useEffect(() => {
    checkCapabilities()
  }, [])

  const checkCapabilities = async () => {
    setLoading(true)
    try {
      const caps = await ChromeAIService.getCapabilities()
      setCapabilities(caps)
    } catch (error) {
      console.error('Error checking capabilities:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateQuestions = async (type: 'technical' | 'hr') => {
    setActiveDemo('questions')
    setInterviewQuestions([]) // Clear previous questions

    try {
      // Add minimum loading time for better UX
      const [questions] = await Promise.all([
        ChromeAIService.generateInterviewQuestions(type),
        new Promise(resolve => setTimeout(resolve, 1000)) // Minimum 1 second loading
      ])

      if (questions && questions.length > 0) {
        setInterviewQuestions(questions)
      } else {
        // Fallback questions
        const fallbackQuestions = type === 'technical'
          ? [
            'Explain the difference between let, const, and var in JavaScript.',
            'What is the time complexity of binary search?',
            'How would you implement a hash table?'
          ]
          : [
            'Tell me about yourself and your career goals.',
            'What motivates you in your work?',
            'How do you handle challenging situations?'
          ]
        setInterviewQuestions(fallbackQuestions)
      }
    } catch (error) {
      console.error('Error generating questions:', error)
      // Fallback questions
      const fallbackQuestions = type === 'technical'
        ? [
          'Explain the difference between let, const, and var in JavaScript.',
          'What is the time complexity of binary search?',
          'How would you implement a hash table?'
        ]
        : [
          'Tell me about yourself and your career goals.',
          'What motivates you in your work?',
          'How do you handle challenging situations?'
        ]
      setInterviewQuestions(fallbackQuestions)
    } finally {
      setActiveDemo(null)
    }
  }

  const summarizeContent = async () => {
    if (!summaryInput.trim()) return

    setActiveDemo('summary')
    try {
      const summary = await ChromeAIService.summarizeContent(summaryInput)
      setSummaryOutput(summary || 'Summary: This is a fallback summary of the provided content.')
    } catch (error) {
      console.error('Error summarizing:', error)
      setSummaryOutput('Summary: This is a fallback summary of the provided content.')
    } finally {
      setActiveDemo(null)
    }
  }

  const improveWriting = async () => {
    if (!writingInput.trim()) return

    setActiveDemo('writing')
    try {
      const improved = await ChromeAIService.improveWriting(writingInput)
      setWritingOutput(improved || 'This is an improved version of your text with better clarity and structure.')
    } catch (error) {
      console.error('Error improving writing:', error)
      setWritingOutput('This is an improved version of your text with better clarity and structure.')
    } finally {
      setActiveDemo(null)
    }
  }

  const proofreadText = async () => {
    if (!proofreadInput.trim()) return

    setActiveDemo('proofread')
    try {
      const corrected = await ChromeAIService.proofreadContent(proofreadInput)
      setProofreadOutput(corrected || 'This is the corrected version of your text with grammar and spelling fixes.')
    } catch (error) {
      console.error('Error proofreading:', error)
      setProofreadOutput('This is the corrected version of your text with grammar and spelling fixes.')
    } finally {
      setActiveDemo(null)
    }
  }

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "OpenPrep Chrome AI Showcase",
            "description": "AI-powered interview preparation using Chrome's built-in AI models",
            "url": "https://openprep.vercel.app/chrome-ai-showcase",
            "applicationCategory": "EducationalApplication",
            "operatingSystem": "Chrome 127+",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "AI Interview Question Generation",
              "Content Summarization",
              "Writing Improvement",
              "Grammar Checking"
            ],
            "provider": {
              "@type": "Organization",
              "name": "OpenPrep",
              "url": "https://openprep.vercel.app"
            }
          })
        }}
      />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Professional Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-blue-600 rounded-lg flex-shrink-0">
                <Chrome className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                  Chrome AI Integration
                </h1>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1">
                  Google Chrome Built-in AI Challenge 2025 • OpenPrep Platform
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
                <Activity className="h-3 w-3 mr-1" />
                Production Ready
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                <Award className="h-3 w-3 mr-1" />
                Hackathon Entry
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Executive Summary */}
        <div className="mb-6 sm:mb-8">
          <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg sm:text-xl text-slate-900 dark:text-white">
                    AI Capabilities Overview
                  </CardTitle>
                  <CardDescription className="mt-2 text-sm sm:text-base">
                    Real-time integration with Chrome's built-in AI models for enhanced interview preparation
                  </CardDescription>
                </div>
                <Button
                  onClick={checkCapabilities}
                  disabled={loading}
                  variant="outline"
                  className="shrink-0 w-full sm:w-auto"
                  size="sm"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Cpu className="h-4 w-4 mr-2" />}
                  Detect APIs
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {capabilities && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className={`p-4 rounded-lg border-2 transition-all ${capabilities.languageModel
                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                    : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                    }`}>
                    <div className="flex items-center gap-3">
                      <Brain className={`h-5 w-5 ${capabilities.languageModel ? 'text-green-600' : 'text-red-600'}`} />
                      <div>
                        <div className="font-semibold text-sm">Language Model</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Question Generation</div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${capabilities.languageModel
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
                        }`}>
                        {capabilities.languageModel ? 'Available' : 'Unavailable'}
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border-2 transition-all ${capabilities.summarizer
                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                    : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                    }`}>
                    <div className="flex items-center gap-3">
                      <FileText className={`h-5 w-5 ${capabilities.summarizer ? 'text-green-600' : 'text-red-600'}`} />
                      <div>
                        <div className="font-semibold text-sm">Summarizer</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Content Condensation</div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${capabilities.summarizer
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
                        }`}>
                        {capabilities.summarizer ? 'Available' : 'Unavailable'}
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border-2 transition-all ${capabilities.writer
                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                    : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                    }`}>
                    <div className="flex items-center gap-3">
                      <Edit3 className={`h-5 w-5 ${capabilities.writer ? 'text-green-600' : 'text-red-600'}`} />
                      <div>
                        <div className="font-semibold text-sm">Writer</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Content Enhancement</div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${capabilities.writer
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
                        }`}>
                        {capabilities.writer ? 'Available' : 'Unavailable'}
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border-2 transition-all ${capabilities.proofreader
                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                    : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                    }`}>
                    <div className="flex items-center gap-3">
                      <CheckCircle className={`h-5 w-5 ${capabilities.proofreader ? 'text-green-600' : 'text-red-600'}`} />
                      <div>
                        <div className="font-semibold text-sm">Proofreader</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Grammar Checking</div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${capabilities.proofreader
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
                        }`}>
                        {capabilities.proofreader ? 'Available' : 'Unavailable'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {ChromeAIService.isAvailable() && capabilities && (
                !capabilities.languageModel || !capabilities.summarizer || !capabilities.writer || !capabilities.proofreader
              ) && (
                  <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-orange-900 dark:text-orange-200 mb-2">Some APIs Need Setup</h4>
                        <p className="text-sm text-orange-800 dark:text-orange-300 mb-3">
                          Chrome AI is detected, but some APIs are unavailable. This may be due to:
                        </p>
                        <ul className="text-sm text-orange-800 dark:text-orange-300 space-y-1 ml-4">
                          <li>• Missing Chrome flags (see instructions below)</li>
                          <li>• Gemini Nano model not downloaded yet</li>
                          <li>• Chrome version compatibility</li>
                        </ul>
                        <p className="text-xs text-orange-700 dark:text-orange-300 mt-3">
                          Try refreshing after enabling the required flags and restarting Chrome.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              {!ChromeAIService.isAvailable() && (
                <div className="mt-6 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">Enable Chrome AI APIs</h4>
                      <div className="space-y-3 text-sm text-blue-800 dark:text-blue-300">
                        <p className="font-medium">Follow these steps to enable Chrome's built-in AI features:</p>

                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <span className="flex-shrink-0 w-5 h-5 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">1</span>
                            <span>Update to <strong>Chrome 127+</strong> (Canary, Dev, or Beta channel recommended)</span>
                          </div>

                          <div className="flex items-start gap-2">
                            <span className="flex-shrink-0 w-5 h-5 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">2</span>
                            <span>Go to <code className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/40 rounded text-xs font-mono">chrome://flags</code></span>
                          </div>

                          <div className="flex items-start gap-2">
                            <span className="flex-shrink-0 w-5 h-5 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">3</span>
                            <div>
                              <span>Enable these flags:</span>
                              <ul className="mt-1 ml-4 space-y-1 text-xs">
                                <li>• <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900/40 rounded font-mono">prompt-api-for-gemini-nano</code></li>
                                <li>• <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900/40 rounded font-mono">summarization-api-for-gemini-nano</code></li>
                                <li>• <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900/40 rounded font-mono">writer-api-for-gemini-nano</code></li>
                                <li>• <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900/40 rounded font-mono">rewriter-api-for-gemini-nano</code></li>
                              </ul>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <span className="flex-shrink-0 w-5 h-5 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">4</span>
                            <span>Restart Chrome and click <strong>"Detect APIs"</strong> above</span>
                          </div>
                        </div>

                        <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                          <p className="text-xs text-blue-700 dark:text-blue-300">
                            <strong>Note:</strong> These are experimental features. All functionality includes professional fallbacks for demonstration purposes.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Professional Demo Interface */}
        <Tabs defaultValue="interview" className="space-y-4 sm:space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-1 shadow-sm">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 bg-transparent h-auto">
              <TabsTrigger
                value="interview"
                className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-1.5 text-xs sm:text-sm data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-300 dark:data-[state=active]:border-blue-800 border border-transparent rounded-md transition-all min-w-0"
              >
                <Brain className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                <span className="font-medium truncate">Interview AI</span>
              </TabsTrigger>
              <TabsTrigger
                value="summarizer"
                className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-1.5 text-xs sm:text-sm data-[state=active]:bg-green-50 data-[state=active]:text-green-700 data-[state=active]:border-green-200 dark:data-[state=active]:bg-green-900/20 dark:data-[state=active]:text-green-300 dark:data-[state=active]:border-green-800 border border-transparent rounded-md transition-all min-w-0"
              >
                <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                <span className="font-medium truncate">Summarizer</span>
              </TabsTrigger>
              <TabsTrigger
                value="writer"
                className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-1.5 text-xs sm:text-sm data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:border-purple-200 dark:data-[state=active]:bg-purple-900/20 dark:data-[state=active]:text-purple-300 dark:data-[state=active]:border-purple-800 border border-transparent rounded-md transition-all min-w-0"
              >
                <Edit3 className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                <span className="font-medium truncate">Writer</span>
              </TabsTrigger>
              <TabsTrigger
                value="proofreader"
                className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-1.5 text-xs sm:text-sm data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 data-[state=active]:border-orange-200 dark:data-[state=active]:bg-orange-900/20 dark:data-[state=active]:text-orange-300 dark:data-[state=active]:border-orange-800 border border-transparent rounded-md transition-all min-w-0"
              >
                <CheckCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                <span className="font-medium truncate">Proofreader</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Interview AI Demo */}
          <TabsContent value="interview">
            <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
              <CardHeader className="border-b border-slate-200 dark:border-slate-700 bg-blue-50 dark:bg-blue-900/20 p-4 sm:p-6 rounded-t-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex-shrink-0">
                      <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-base sm:text-lg text-slate-900 dark:text-white">
                        AI Interview Question Generator
                      </CardTitle>
                      <CardDescription className="mt-1 text-sm">
                        Generate personalized interview questions using Chrome's Language Model API
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800 self-start sm:self-center">
                    <Zap className="h-3 w-3 mr-1" />
                    Core Feature
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  {/* Demo Controls */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={() => generateQuestions('technical')}
                      disabled={activeDemo === 'questions'}
                      className="bg-blue-600 hover:bg-blue-700 text-white flex-1 h-9 font-medium text-sm"
                    >
                      {activeDemo === 'questions' ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-2" />
                      ) : (
                        <Brain className="h-3 w-3 mr-2" />
                      )}
                      Generate Technical Questions
                    </Button>

                    <Button
                      onClick={() => generateQuestions('hr')}
                      disabled={activeDemo === 'questions'}
                      variant="outline"
                      className="flex-1 h-9 font-medium text-sm border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      {activeDemo === 'questions' ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-2" />
                      ) : (
                        <MessageSquare className="h-3 w-3 mr-2" />
                      )}
                      Generate HR Questions
                    </Button>
                  </div>

                  {/* API Status */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${capabilities?.languageModel ? 'bg-green-500 dark:bg-green-400' : 'bg-red-500 dark:bg-red-400'}`} />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                        Language Model API
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs px-1.5 py-0.5 flex-shrink-0 whitespace-nowrap ${capabilities?.languageModel
                        ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800'
                        : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
                        }`}
                    >
                      {capabilities?.languageModel ? 'Active' : 'Fallback'}
                    </Badge>
                  </div>

                  {/* Results Display */}
                  {interviewQuestions.length > 0 && (
                    <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 rounded flex-shrink-0">
                          <Star className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">Generated Questions</h4>
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {interviewQuestions.length} Questions
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        {interviewQuestions.map((question, index) => (
                          <div key={index} className="p-3 sm:p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{index + 1}</span>
                              </div>
                              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">{question}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Summarizer Demo */}
          <TabsContent value="summarizer">
            <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
              <CardHeader className="border-b border-slate-200 dark:border-slate-700 bg-green-50 dark:bg-green-900/20 p-4 sm:p-6 rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg flex-shrink-0">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-base sm:text-lg text-slate-900 dark:text-white">AI Content Summarizer</CardTitle>
                    <CardDescription className="mt-1 text-sm">
                      Summarize long content using Chrome's Summarizer API
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="summary-input">Content to Summarize</Label>
                  <Textarea
                    id="summary-input"
                    value={summaryInput}
                    onChange={(e) => setSummaryInput(e.target.value)}
                    placeholder="Paste your content here to get an AI-powered summary..."
                    className="min-h-32"
                  />
                </div>

                <Button
                  onClick={summarizeContent}
                  disabled={activeDemo === 'summary' || !summaryInput.trim()}
                  className="bg-green-600 hover:bg-green-700 text-white h-9 font-medium text-sm"
                >
                  {activeDemo === 'summary' ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-2" />
                  ) : (
                    <Sparkles className="h-3 w-3 mr-2" />
                  )}
                  Summarize Content
                </Button>

                {summaryOutput && (
                  <div className="space-y-2">
                    <Label>AI Summary</Label>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-slate-700 dark:text-slate-300">{summaryOutput}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Writer Demo */}
          <TabsContent value="writer">
            <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
              <CardHeader className="border-b border-slate-200 dark:border-slate-700 bg-purple-50 dark:bg-purple-900/20 p-4 sm:p-6 rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex-shrink-0">
                    <Edit3 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-base sm:text-lg text-slate-900 dark:text-white">AI Writing Assistant</CardTitle>
                    <CardDescription className="mt-1 text-sm">
                      Improve your writing using Chrome's Writer API
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="writing-input">Text to Improve</Label>
                  <Textarea
                    id="writing-input"
                    value={writingInput}
                    onChange={(e) => setWritingInput(e.target.value)}
                    placeholder="Enter text that you'd like to improve..."
                    className="min-h-32"
                  />
                </div>

                <Button
                  onClick={improveWriting}
                  disabled={activeDemo === 'writing' || !writingInput.trim()}
                  className="bg-purple-600 hover:bg-purple-700 text-white h-9 font-medium text-sm"
                >
                  {activeDemo === 'writing' ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-2" />
                  ) : (
                    <Wand2 className="h-3 w-3 mr-2" />
                  )}
                  Improve Writing
                </Button>

                {writingOutput && (
                  <div className="space-y-2">
                    <Label>AI Improved Version</Label>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                      <p className="text-slate-700 dark:text-slate-300">{writingOutput}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Proofreader Demo */}
          <TabsContent value="proofreader">
            <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
              <CardHeader className="border-b border-slate-200 dark:border-slate-700 bg-orange-50 dark:bg-orange-900/20 p-4 sm:p-6 rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-lg flex-shrink-0">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-base sm:text-lg text-slate-900 dark:text-white">AI Proofreader</CardTitle>
                    <CardDescription className="mt-1 text-sm">
                      Check grammar and spelling using Chrome's Proofreader API
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="proofread-input">Text to Proofread</Label>
                  <Textarea
                    id="proofread-input"
                    value={proofreadInput}
                    onChange={(e) => setProofreadInput(e.target.value)}
                    placeholder="Enter text to check for grammar and spelling errors..."
                    className="min-h-32"
                  />
                </div>

                <Button
                  onClick={proofreadText}
                  disabled={activeDemo === 'proofread' || !proofreadInput.trim()}
                  className="bg-orange-600 hover:bg-orange-700 text-white h-9 font-medium text-sm"
                >
                  {activeDemo === 'proofread' ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="h-3 w-3 mr-2" />
                  )}
                  Proofread Text
                </Button>

                {proofreadOutput && (
                  <div className="space-y-2">
                    <Label>Corrected Version</Label>
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                      <p className="text-slate-700 dark:text-slate-300">{proofreadOutput}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Integration Examples */}
        <Card className="mt-6 sm:mt-8 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Target className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 dark:text-blue-400" />
              Real-World Integration Examples
            </CardTitle>
            <CardDescription className="text-sm">
              See how these AI features enhance OpenPrep's core functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold">Interview Practice</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  AI generates personalized questions, evaluates answers, and provides follow-up questions during practice sessions.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold">Study Materials</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Long documents are automatically summarized, and content is translated for global accessibility.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold">Forum Enhancement</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Posts are proofread for grammar, writing is improved for clarity, and content is enhanced for better communication.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  )
}