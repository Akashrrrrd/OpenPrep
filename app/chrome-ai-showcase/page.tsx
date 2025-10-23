'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChromeAIService, type ChromeAICapabilities } from '@/lib/chrome-ai'
import { 
  Brain, 
  FileText, 
  Edit3, 
  CheckCircle, 
  Languages, 
  Sparkles, 
  Wand2, 
  Globe, 
  Loader2,
  Star,
  Target,
  BookOpen,
  MessageSquare
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

  // Translator Demo
  const [translateInput, setTranslateInput] = useState('')
  const [translateOutput, setTranslateOutput] = useState('')
  const [targetLanguage, setTargetLanguage] = useState('es')

  useEffect(() => {
    checkCapabilities()
  }, [])

  const checkCapabilities = async () => {
    setLoading(true)
    const caps = await ChromeAIService.getCapabilities()
    setCapabilities(caps)
    setLoading(false)
  }

  const generateQuestions = async (type: 'technical' | 'hr') => {
    setActiveDemo('questions')
    setInterviewQuestions([])
    
    const questions = await ChromeAIService.generateInterviewQuestions(type, 'JavaScript and React', 'mid')
    if (questions) {
      setInterviewQuestions(questions)
    }
    setActiveDemo(null)
  }

  const summarizeContent = async () => {
    if (!summaryInput.trim()) return
    setActiveDemo('summary')
    setSummaryOutput('')
    
    const summary = await ChromeAIService.summarizeContent(summaryInput)
    if (summary) {
      setSummaryOutput(summary)
    }
    setActiveDemo(null)
  }

  const improveWriting = async () => {
    if (!writingInput.trim()) return
    setActiveDemo('writing')
    setWritingOutput('')
    
    const improved = await ChromeAIService.improveWriting(writingInput, 'answer')
    if (improved) {
      setWritingOutput(improved)
    }
    setActiveDemo(null)
  }

  const proofreadContent = async () => {
    if (!proofreadInput.trim()) return
    setActiveDemo('proofread')
    setProofreadOutput('')
    
    const corrected = await ChromeAIService.proofreadContent(proofreadInput)
    if (corrected) {
      setProofreadOutput(corrected)
    }
    setActiveDemo(null)
  }

  const translateContent = async () => {
    if (!translateInput.trim()) return
    setActiveDemo('translate')
    setTranslateOutput('')
    
    const translated = await ChromeAIService.translateContent(translateInput, targetLanguage, 'en')
    if (translated) {
      setTranslateOutput(translated)
    }
    setActiveDemo(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Chrome AI Enhanced
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            AI-Powered Learning
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Experience the future of interview preparation with Chrome's built-in AI capabilities. 
            No external APIs, no data sent to servers - everything runs locally in your browser.
          </p>
          
          <div className="mt-8">
            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Chrome AI Capabilities</h3>
                  <Button onClick={checkCapabilities} disabled={loading} variant="outline" size="sm">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Check Again'}
                  </Button>
                </div>
                
                {capabilities && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className={`flex items-center gap-2 p-3 rounded-lg ${capabilities.languageModel ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                      <Brain className={`h-4 w-4 ${capabilities.languageModel ? 'text-green-600' : 'text-red-600'}`} />
                      <span className="text-sm font-medium">Language Model</span>
                    </div>
                    <div className={`flex items-center gap-2 p-3 rounded-lg ${capabilities.summarizer ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                      <FileText className={`h-4 w-4 ${capabilities.summarizer ? 'text-green-600' : 'text-red-600'}`} />
                      <span className="text-sm font-medium">Summarizer</span>
                    </div>
                    <div className={`flex items-center gap-2 p-3 rounded-lg ${capabilities.writer ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                      <Edit3 className={`h-4 w-4 ${capabilities.writer ? 'text-green-600' : 'text-red-600'}`} />
                      <span className="text-sm font-medium">Writer</span>
                    </div>
                    <div className={`flex items-center gap-2 p-3 rounded-lg ${capabilities.proofreader ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                      <CheckCircle className={`h-4 w-4 ${capabilities.proofreader ? 'text-green-600' : 'text-red-600'}`} />
                      <span className="text-sm font-medium">Proofreader</span>
                    </div>
                    <div className={`flex items-center gap-2 p-3 rounded-lg ${capabilities.translator ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                      <Languages className={`h-4 w-4 ${capabilities.translator ? 'text-green-600' : 'text-red-600'}`} />
                      <span className="text-sm font-medium">Translator</span>
                    </div>
                    <div className={`flex items-center gap-2 p-3 rounded-lg ${capabilities.rewriter ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                      <Wand2 className={`h-4 w-4 ${capabilities.rewriter ? 'text-green-600' : 'text-red-600'}`} />
                      <span className="text-sm font-medium">Rewriter</span>
                    </div>
                  </div>
                )}

                {!ChromeAIService.isAvailable() && (
                  <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <p className="text-orange-800 dark:text-orange-200 text-sm">
                      <strong>Chrome AI not detected.</strong> To experience these features, please use Chrome 127+ with AI features enabled.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Demos */}
        <Tabs defaultValue="interview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto p-1">
            <TabsTrigger value="interview" className="flex items-center gap-2 py-3">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Interview AI</span>
            </TabsTrigger>
            <TabsTrigger value="summarizer" className="flex items-center gap-2 py-3">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Summarizer</span>
            </TabsTrigger>
            <TabsTrigger value="writer" className="flex items-center gap-2 py-3">
              <Edit3 className="h-4 w-4" />
              <span className="hidden sm:inline">Writer</span>
            </TabsTrigger>
            <TabsTrigger value="proofreader" className="flex items-center gap-2 py-3">
              <CheckCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Proofreader</span>
            </TabsTrigger>
            <TabsTrigger value="translator" className="flex items-center gap-2 py-3">
              <Languages className="h-4 w-4" />
              <span className="hidden sm:inline">Translator</span>
            </TabsTrigger>
          </TabsList>    
      {/* Interview AI Demo */}
          <TabsContent value="interview">
            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-blue-500" />
                  AI Interview Question Generator
                </CardTitle>
                <CardDescription>
                  Generate personalized interview questions using Chrome's Language Model API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={() => generateQuestions('technical')}
                    disabled={activeDemo === 'questions' || !capabilities?.languageModel}
                    className="bg-blue-500 hover:bg-blue-600 text-white h-12"
                  >
                    {activeDemo === 'questions' ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Brain className="h-4 w-4 mr-2" />
                    )}
                    Generate Technical Questions
                  </Button>
                  
                  <Button 
                    onClick={() => generateQuestions('hr')}
                    disabled={activeDemo === 'questions' || !capabilities?.languageModel}
                    variant="outline"
                    className="h-12"
                  >
                    {activeDemo === 'questions' ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <MessageSquare className="h-4 w-4 mr-2" />
                    )}
                    Generate HR Questions
                  </Button>
                </div>
                
                {interviewQuestions.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      AI Generated Questions
                    </h4>
                    {interviewQuestions.map((question, index) => (
                      <div key={index} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Q{index + 1}:</p>
                        <p className="text-slate-700 dark:text-slate-300 mt-1">{question}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Summarizer Demo */}
          <TabsContent value="summarizer">
            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-green-500" />
                  AI Content Summarizer
                </CardTitle>
                <CardDescription>
                  Summarize long content using Chrome's Summarizer API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="summary-input">Content to Summarize</Label>
                  <Textarea
                    id="summary-input"
                    placeholder="Paste long content here (study materials, articles, documentation)..."
                    value={summaryInput}
                    onChange={(e) => setSummaryInput(e.target.value)}
                    className="min-h-32"
                  />
                </div>
                
                <Button 
                  onClick={summarizeContent}
                  disabled={activeDemo === 'summary' || !summaryInput.trim() || !capabilities?.summarizer}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  {activeDemo === 'summary' ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
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
            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="h-6 w-6 text-purple-500" />
                  AI Writing Assistant
                </CardTitle>
                <CardDescription>
                  Improve your writing using Chrome's Writer API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="writing-input">Text to Improve</Label>
                  <Textarea
                    id="writing-input"
                    placeholder="Enter your interview answer, forum post, or any text to improve..."
                    value={writingInput}
                    onChange={(e) => setWritingInput(e.target.value)}
                    className="min-h-32"
                  />
                </div>
                
                <Button 
                  onClick={improveWriting}
                  disabled={activeDemo === 'writing' || !writingInput.trim() || !capabilities?.writer}
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                >
                  {activeDemo === 'writing' ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Wand2 className="h-4 w-4 mr-2" />
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
            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-orange-500" />
                  AI Proofreader
                </CardTitle>
                <CardDescription>
                  Check grammar and spelling using Chrome's Proofreader API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="proofread-input">Text to Proofread</Label>
                  <Textarea
                    id="proofread-input"
                    placeholder="Enter text with potential grammar or spelling errors..."
                    value={proofreadInput}
                    onChange={(e) => setProofreadInput(e.target.value)}
                    className="min-h-32"
                  />
                </div>
                
                <Button 
                  onClick={proofreadContent}
                  disabled={activeDemo === 'proofread' || !proofreadInput.trim() || !capabilities?.proofreader}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {activeDemo === 'proofread' ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
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

          {/* Translator Demo */}
          <TabsContent value="translator">
            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-6 w-6 text-indigo-500" />
                  AI Translator
                </CardTitle>
                <CardDescription>
                  Translate content using Chrome's Translator API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="translate-input">English Text</Label>
                    <Textarea
                      id="translate-input"
                      placeholder="Enter English text to translate..."
                      value={translateInput}
                      onChange={(e) => setTranslateInput(e.target.value)}
                      className="min-h-32"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="target-language">Target Language</Label>
                    <select
                      id="target-language"
                      value={targetLanguage}
                      onChange={(e) => setTargetLanguage(e.target.value)}
                      className="w-full p-2 border rounded-md bg-background"
                    >
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="it">Italian</option>
                      <option value="pt">Portuguese</option>
                      <option value="ja">Japanese</option>
                      <option value="ko">Korean</option>
                      <option value="zh">Chinese</option>
                    </select>
                  </div>
                </div>
                
                <Button 
                  onClick={translateContent}
                  disabled={activeDemo === 'translate' || !translateInput.trim() || !capabilities?.translator}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white"
                >
                  {activeDemo === 'translate' ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Globe className="h-4 w-4 mr-2" />
                  )}
                  Translate Text
                </Button>
                
                {translateOutput && (
                  <div className="space-y-2">
                    <Label>Translation</Label>
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                      <p className="text-slate-700 dark:text-slate-300">{translateOutput}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Integration Examples */}
        <Card className="mt-8 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6 text-blue-500" />
              Real-World Integration Examples
            </CardTitle>
            <CardDescription>
              See how these AI features enhance OpenPrep's core functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
  )
}