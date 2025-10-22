"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/AuthContext"
import {
    CheckCircle,
    Award,
    Calendar,
    User
} from "lucide-react"

interface QuestionDetailProps {
    question: any
}

export default function QuestionDetail({ question }: QuestionDetailProps) {
    const { user, isAuthenticated } = useAuth()
    const [currentQuestion, setCurrentQuestion] = useState(question)
    const [newAnswer, setNewAnswer] = useState("")
    const [loading, setLoading] = useState(false)

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
            case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
        }
    }

    const getReputationBadge = (reputation: number) => {
        if (reputation >= 1000) return { text: 'Expert', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' }
        if (reputation >= 500) return { text: 'Advanced', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' }
        if (reputation >= 100) return { text: 'Intermediate', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' }
        return { text: 'Beginner', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' }
    }

    const handleSubmitAnswer = async () => {
        if (!isAuthenticated || !user) {
            alert('Please log in to answer questions.')
            return
        }

        if (!newAnswer.trim() || loading) return

        setLoading(true)
        try {
            const response = await fetch(`/api/questions/${question.id}/answers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: newAnswer,
                    author: user.name,
                    authorReputation: 0
                })
            })

            if (response.ok) {
                const updatedQuestion = await response.json()
                setCurrentQuestion(updatedQuestion)
                setNewAnswer("")
            } else {
                const errorData = await response.json()
                alert(errorData.error || 'Failed to submit answer')
            }
        } catch (error) {
            console.error('Error submitting answer:', error)
            alert('Failed to submit answer. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const questionRepBadge = getReputationBadge(currentQuestion.authorReputation)

    return (
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            {/* Question Card */}
            <Card>
                <CardHeader className="pb-4 sm:pb-6">
                    <div className="space-y-3 sm:space-y-4">
                        <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight">
                            {currentQuestion.title}
                        </CardTitle>
                        
                        {/* Question Meta */}
                        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                <span className="truncate">Asked {formatDate(currentQuestion.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <div className="flex items-center gap-1">
                                    <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                    <span>by {currentQuestion.author}</span>
                                </div>
                                <Badge className={`${questionRepBadge.color} text-xs`} variant="outline">
                                    {questionRepBadge.text}
                                </Badge>
                            </div>
                        </div>

                        {/* Tags and Difficulty */}
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                            {currentQuestion.tags?.map((tag: string) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                            <Badge className={`${getDifficultyColor(currentQuestion.difficulty)} text-xs`} variant="outline">
                                {currentQuestion.difficulty}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-0">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                        <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">{currentQuestion.content}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Answers Section */}
            <Card>
                <CardHeader className="pb-4 sm:pb-6">
                    <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-lg sm:text-xl">
                        <span>{currentQuestion.answers?.length || 0} Answers</span>
                        {currentQuestion.hasAcceptedAnswer && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs w-fit">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Solved
                            </Badge>
                        )}
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 sm:space-y-6">
                    {/* Existing Answers */}
                    {currentQuestion.answers?.map((answer: any, index: number) => {
                        const answerRepBadge = getReputationBadge(answer.authorReputation)
                        
                        return (
                            <div key={answer.id} className="space-y-3 sm:space-y-4">
                                {index > 0 && <Separator />}
                                
                                <div className="space-y-3 sm:space-y-4">
                                    {/* Answer Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                            <div className="flex items-center gap-2">
                                                <Badge className={`${answerRepBadge.color} text-xs`} variant="outline">
                                                    {answerRepBadge.text}
                                                </Badge>
                                                <span className="text-sm text-muted-foreground font-medium">
                                                    {answer.author}
                                                </span>
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {formatDate(answer.createdAt)}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                                            {answer.isAccepted && (
                                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs">
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Accepted
                                                </Badge>
                                            )}
                                            {answer.expertVerified && (
                                                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 text-xs">
                                                    <Award className="h-3 w-3 mr-1" />
                                                    Expert Verified
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    {/* Answer Content */}
                                    <div className="prose prose-sm max-w-none dark:prose-invert">
                                        <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">{answer.content}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    {/* No Answers State */}
                    {(!currentQuestion.answers || currentQuestion.answers.length === 0) && (
                        <div className="text-center py-6 sm:py-8 text-muted-foreground">
                            <p className="text-sm sm:text-base">No answers yet. Be the first to help!</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Answer Form */}
            <Card>
                <CardHeader className="pb-4 sm:pb-6">
                    <CardTitle className="text-lg sm:text-xl">Your Answer</CardTitle>
                </CardHeader>
                <CardContent>
                    {isAuthenticated ? (
                        <div className="space-y-4">
                            <Textarea
                                placeholder="Write your answer here..."
                                value={newAnswer}
                                onChange={(e) => setNewAnswer(e.target.value)}
                                className="min-h-[100px] sm:min-h-[120px] text-sm sm:text-base"
                                disabled={loading}
                            />
                            <div className="flex justify-end">
                                <Button 
                                    onClick={handleSubmitAnswer}
                                    disabled={!newAnswer.trim() || loading}
                                    className="w-full sm:w-auto"
                                >
                                    {loading ? 'Submitting...' : 'Submit Answer'}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-6 sm:py-8 space-y-4">
                            <p className="text-muted-foreground text-sm sm:text-base">
                                Please log in to answer this question.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                <Button asChild variant="default" className="w-full sm:w-auto">
                                    <a href="/auth/login">Login</a>
                                </Button>
                                <Button asChild variant="outline" className="w-full sm:w-auto">
                                    <a href="/auth/register">Sign Up</a>
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}