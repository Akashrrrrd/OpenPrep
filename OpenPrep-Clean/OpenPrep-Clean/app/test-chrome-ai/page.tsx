'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChromeAIService, type ChromeAICapabilities } from '@/lib/chrome-ai'
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function TestChromeAI() {
  const [capabilities, setCapabilities] = useState<ChromeAICapabilities | null>(null)
  const [testResults, setTestResults] = useState<{ [key: string]: 'success' | 'error' | 'testing' }>({})
  const [testOutputs, setTestOutputs] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    checkCapabilities()
  }, [])

  const checkCapabilities = async () => {
    const caps = await ChromeAIService.getCapabilities()
    setCapabilities(caps)
  }

  const testAPI = async (apiName: string, testFn: () => Promise<any>) => {
    setTestResults(prev => ({ ...prev, [apiName]: 'testing' }))
    
    try {
      const result = await testFn()
      if (result) {
        setTestResults(prev => ({ ...prev, [apiName]: 'success' }))
        setTestOutputs(prev => ({ ...prev, [apiName]: typeof result === 'string' ? result : JSON.stringify(result) }))
      } else {
        setTestResults(prev => ({ ...prev, [apiName]: 'error' }))
        setTestOutputs(prev => ({ ...prev, [apiName]: 'No result returned (using fallback)' }))
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, [apiName]: 'error' }))
      setTestOutputs(prev => ({ ...prev, [apiName]: `Error: ${error}` }))
    }
  }

  const getStatusIcon = (status: 'success' | 'error' | 'testing' | undefined) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />
      case 'testing': return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      default: return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Chrome AI Test Suite</h1>
        
        {/* Chrome AI Detection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Chrome AI Detection</CardTitle>
            <CardDescription>Testing if Chrome AI APIs are available</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {ChromeAIService.isAvailable() ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span>Chrome AI Available: {ChromeAIService.isAvailable() ? 'Yes' : 'No'}</span>
              </div>
              
              {capabilities && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-semibold">API Capabilities:</h4>
                  {Object.entries(capabilities).map(([api, available]) => (
                    <div key={api} className="flex items-center gap-2">
                      {available ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span>{api}: {available ? 'Available' : 'Not Available'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* API Tests */}
        <div className="grid gap-6">
          {/* Language Model Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(testResults.languageModel)}
                Language Model API Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => testAPI('languageModel', () => 
                  ChromeAIService.generateInterviewQuestions('technical', 'React', 'mid')
                )}
                disabled={testResults.languageModel === 'testing'}
              >
                Test Interview Questions Generation
              </Button>
              {testOutputs.languageModel && (
                <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded">
                  <pre className="text-sm whitespace-pre-wrap">{testOutputs.languageModel}</pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summarizer Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(testResults.summarizer)}
                Summarizer API Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => testAPI('summarizer', () => 
                  ChromeAIService.summarizeContent('React is a JavaScript library for building user interfaces. It was developed by Facebook and is now maintained by Meta and the community. React allows developers to create reusable UI components and manage application state efficiently. It uses a virtual DOM for optimal performance and supports both functional and class-based components.')
                )}
                disabled={testResults.summarizer === 'testing'}
              >
                Test Content Summarization
              </Button>
              {testOutputs.summarizer && (
                <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded">
                  <pre className="text-sm whitespace-pre-wrap">{testOutputs.summarizer}</pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Writer Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(testResults.writer)}
                Writer API Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => testAPI('writer', () => 
                  ChromeAIService.improveWriting('i think react is good for making websites', 'answer')
                )}
                disabled={testResults.writer === 'testing'}
              >
                Test Writing Improvement
              </Button>
              {testOutputs.writer && (
                <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded">
                  <pre className="text-sm whitespace-pre-wrap">{testOutputs.writer}</pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Proofreader Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(testResults.proofreader)}
                Proofreader API Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => testAPI('proofreader', () => 
                  ChromeAIService.proofreadContent('this is a test sentance with some erors in it')
                )}
                disabled={testResults.proofreader === 'testing'}
              >
                Test Proofreading
              </Button>
              {testOutputs.proofreader && (
                <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded">
                  <pre className="text-sm whitespace-pre-wrap">{testOutputs.proofreader}</pre>
                </div>
              )}
            </CardContent>
          </Card>


        </div>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>To test Chrome AI features:</strong></p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Use Chrome browser version 127 or later</li>
                <li>Enable experimental AI features in chrome://flags</li>
                <li>Look for "Prompt API for Gemini Nano" and enable it</li>
                <li>Restart Chrome and return to this page</li>
                <li>Click the test buttons above to verify functionality</li>
              </ol>
              <p className="mt-4"><strong>Note:</strong> If Chrome AI is not available, the system will use fallback implementations to ensure the application still works.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}