"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/AuthContext"
import {
    ThumbsUp,
    ThumbsDown,
    MessageSquare,
    Eye,
    CheckCircle,
    Award,
    Calendar,
    User,
    Send,
    Heart,
    Share2,
    Bookmark,
    Lock
} from "lucide-react"

interface QuestionDetailProps {
    question: any
}

export default function QuestionDetail({ question }: QuestionDetailProps) {
    const { user, isAuthenticated } = useAuth()
    const [currentQuestion, setCurrentQuestion] = useState(question)
    const [newAnswer, setNewAnswer] = useState("")
    const [newComment, setNewComment] = useState("")
    const [showCommentForm, setShowCommentForm] = useState<string | null>(null)
    const [userVotes, setUserVotes] = useState<{ [key: string]: 'up' | 'down' | null }>({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isAuthenticated && user) {
            loadUserVotes()
        }
    }, [isAuthenticated, user, question.id])

    const loadUserVotes = async () => {
        if (!user) return
        
        try {
            // Check if user has already voted on this question and its answers
            const votes: { [key: string]: 'up' | 'down' | null } = {}
            
            // Check question votes
            const questionUpvoted = currentQuestion.upvotes?.some((vote: any) => vote.userId === user.id)
            const questionDownvoted = currentQuestion.downvotes?.some((vote: any) => vote.userId === user.id)
            
            if (questionUpvoted) votes['question'] = 'up'
            else if (questionDownvoted) votes['question'] = 'down'
            else votes['question'] = null
            
            // Check answer votes
            currentQuestion.answers?.forEach((answer: any) => {
                const answerUpvoted = answer.upvotes?.some((vote: any) => vote.userId === user.id)
                const answerDownvoted = answer.downvotes?.some((vote: any) => vote.userId === user.id)
                
                if (answerUpvoted) votes[`answer-${answer.id}`] = 'up'
                else if (answerDownvoted) votes[`answer-${answer.id}`] = 'down'
                else votes[`answer-${answer.id}`] = null
            })
            
            setUserVotes(votes)
        } catch (error) {
            console.error('Error loading user votes:', error)
        }
    }

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

    const handleVote = async (type: 'question' | 'answer', voteType: 'up' | 'down', targetId?: string) => {
        // Check if user is authenticated
        if (!isAuthenticated || !user) {
            alert('Please log in to vote on questions and answers.')
            return
        }

        const key = type === 'question' ? 'question' : `answer-${targetId}`
        const currentVote = userVotes[key]
        
        // If user already voted the same way, remove the vote
        if (currentVote === voteType) {
            // Remove vote - this would need a separate API endpoint
            console.log('Removing vote not implemented yet')
            return
        }

        setLoading(true)
        try {
            const endpoint = type === 'question'
                ? `/api/questions/${question.id}/${voteType}vote`
                : `/api/questions/${question.id}/answers/${targetId}/${voteType}vote`

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    username: user.name
                })
            })

            if (response.ok) {
                const updatedData = await response.json()
                setCurrentQuestion(updatedData)

                // Update local vote state
                setUserVotes(prev => ({
                    ...prev,
                    [key]: voteType
                }))
            } else {
                const errorData = await response.json()
                alert(errorData.error || 'Failed to vote')
            }
        } catch (error) {
            console.error('Error voting:', error)
            alert('Failed to vote. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmitComment = async (targetId: string, targetType: 'question' | 'answer') => {
        // Check if user is authenticated
        if (!isAuthenticated || !user) {
            alert('Please log in to comment on questions and answers.')
            return
        }

        if (!newComment.trim()) return

        setLoading(true)
        try {
            const endpoint = targetType === 'question'
                ? `/api/questions/${question.id}/comments`
                : `/api/questions/${question.id}/answers/${targetId}/comments`

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: newComment,
                    author: user.name,
                    authorReputation: 0 // This could be fetched from user profile
                })
            })

            if (response.ok) {
                const updatedQuestion = await response.json()
                setCurrentQuestion(updatedQuestion)
                setNewComment("")
                setShowCommentForm(null)
            } else {
                const errorData = await response.json()
                alert(errorData.error || 'Failed to post comment')
            }
        } catch (error) {
            console.error('Error submitting comment:', error)
            alert('Failed to post comment. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmitAnswer = async () => {
        // Check if user is authenticated
        if (!isAuthenticated || !user) {
            alert('Please log in to post answers.')
            return
        }

        if (!newAnswer.trim()) return

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
                    authorReputation: 0 // This could be fetched from user profile
                })
            })

            if (response.ok) {
                const updatedQuestion = await response.json()
                setCurrentQuestion(updatedQuestion)
                setNewAnswer("")
            } else {
                const errorData = await response.json()
                alert(errorData.error || 'Failed to post answer')
            }
        } catch (error) {
            console.error('Error submitting answer:', error)
            alert('Failed to post answer. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const netUpvotes = (currentQuestion.upvotes?.length || 0) - (currentQuestion.downvotes?.length || 0)

    return (
        <div className="space-y-6">
            {/* Question Header */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                            <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-4">
                                {currentQuestion.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>Asked {formatDate(currentQuestion.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    <span>{currentQuestion.views} views</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MessageSquare className="h-4 w-4" />
                                    <span>{currentQuestion.answers?.length || 0} answers</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                                <Bookmark className="h-4 w-4" />
                                Save
                            </Button>
                            <Button variant="outline" size="sm">
                                <Share2 className="h-4 w-4" />
                                Share
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Tags and Difficulty */}
                    <div className="flex flex-wrap gap-2">
                        {currentQuestion.tags?.map((tag: string) => (
                            <Badge key={tag} variant="secondary">
                                {tag}
                            </Badge>
                        ))}
                        <Badge className={getDifficultyColor(currentQuestion.difficulty)} variant="outline">
                            {currentQuestion.difficulty}
                        </Badge>
                    </div>

                    {/* Question Content */}
                    <div className="prose prose-sm sm:prose max-w-none dark:prose-invert">
                        <p className="whitespace-pre-wrap">{currentQuestion.content}</p>
                    </div>

                    {/* Question Actions */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleVote('question', 'up')}
                                disabled={!isAuthenticated || loading}
                                className={`flex items-center gap-1 ${userVotes['question'] === 'up' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'hover:bg-gray-100'}`}
                                title={!isAuthenticated ? "Please log in to vote" : ""}
                            >
                                {!isAuthenticated && <Lock className="h-3 w-3" />}
                                <ThumbsUp className={`h-4 w-4 ${userVotes['question'] === 'up' ? 'fill-white' : 'fill-none'}`} />
                                <span>{currentQuestion.upvotes?.length || 0}</span>
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowCommentForm(showCommentForm === 'question' ? null : 'question')}
                                disabled={!isAuthenticated || loading}
                                title={!isAuthenticated ? "Please log in to comment" : ""}
                            >
                                {!isAuthenticated && <Lock className="h-3 w-3 mr-1" />}
                                <MessageSquare className="h-4 w-4" />
                                Comment ({currentQuestion.comments?.length || 0})
                            </Button>
                        </div>

                        {/* Author Info */}
                        <div className="flex items-center gap-2">
                            <div className="text-right">
                                <div className="text-sm font-medium">{currentQuestion.author}</div>
                                <Badge className={getReputationBadge(currentQuestion.authorReputation).color} variant="outline">
                                    {getReputationBadge(currentQuestion.authorReputation).text}
                                </Badge>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-5 w-5" />
                            </div>
                        </div>
                    </div>

                    {/* Comment Form */}
                    {showCommentForm === 'question' && (
                        <div className="space-y-3 pt-4 border-t">
                            <Textarea
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="min-h-[80px]"
                            />
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setShowCommentForm(null)}>
                                    Cancel
                                </Button>
                                <Button onClick={() => handleSubmitComment('question', 'question')}>
                                    <Send className="h-4 w-4" />
                                    Comment
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Question Comments */}
                    {currentQuestion.comments && currentQuestion.comments.length > 0 && (
                        <div className="space-y-3 pt-4 border-t">
                            <h4 className="font-medium">Comments</h4>
                            {currentQuestion.comments.map((comment: any) => (
                                <div key={comment.id} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-sm">{comment.author}</span>
                                            <Badge className={getReputationBadge(comment.authorReputation).color} variant="outline" className="text-xs">
                                                {getReputationBadge(comment.authorReputation).text}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {formatDate(comment.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-sm">{comment.content}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                                <Heart className="h-3 w-3" />
                                                {comment.likes?.length || 0}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Answers Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>{currentQuestion.answers?.length || 0} Answers</span>
                        {currentQuestion.hasAcceptedAnswer && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Has Accepted Answer
                            </Badge>
                        )}
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    {currentQuestion.answers?.map((answer: any, index: number) => {
                        const answerNetUpvotes = (answer.upvotes?.length || 0) - (answer.downvotes?.length || 0)
                        const answerKey = `answer-${answer.id}`

                        return (
                            <div key={answer.id} className={`space-y-4 ${index > 0 ? 'pt-6 border-t' : ''}`}>
                                {/* Answer Header */}
                                {answer.isAccepted && (
                                    <div className="flex items-center gap-2 text-green-600">
                                        <CheckCircle className="h-5 w-5" />
                                        <span className="font-medium">Accepted Answer</span>
                                        {answer.expertVerified && (
                                            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                                                <Award className="h-3 w-3 mr-1" />
                                                Expert Verified
                                            </Badge>
                                        )}
                                    </div>
                                )}

                                {/* Answer Content */}
                                <div className="prose prose-sm sm:prose max-w-none dark:prose-invert">
                                    <p className="whitespace-pre-wrap">{answer.content}</p>
                                </div>

                                {/* Answer Actions */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleVote('answer', 'up', answer.id)}
                                            disabled={!isAuthenticated || loading}
                                            className={`flex items-center gap-1 ${userVotes[answerKey] === 'up' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'hover:bg-gray-100'}`}
                                            title={!isAuthenticated ? "Please log in to vote" : ""}
                                        >
                                            {!isAuthenticated && <Lock className="h-3 w-3" />}
                                            <ThumbsUp className={`h-4 w-4 ${userVotes[answerKey] === 'up' ? 'fill-white' : 'fill-none'}`} />
                                            <span>{answer.upvotes?.length || 0}</span>
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowCommentForm(showCommentForm === answer.id ? null : answer.id)}
                                            disabled={!isAuthenticated || loading}
                                            title={!isAuthenticated ? "Please log in to comment" : ""}
                                        >
                                            {!isAuthenticated && <Lock className="h-3 w-3 mr-1" />}
                                            <MessageSquare className="h-4 w-4" />
                                            Comment ({answer.comments?.length || 0})
                                        </Button>
                                    </div>

                                    {/* Answer Author Info */}
                                    <div className="flex items-center gap-2">
                                        <div className="text-right">
                                            <div className="text-sm font-medium">{answer.author}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {formatDate(answer.createdAt)}
                                            </div>
                                        </div>
                                        <Badge className={getReputationBadge(answer.authorReputation).color} variant="outline">
                                            {getReputationBadge(answer.authorReputation).text}
                                        </Badge>
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <User className="h-4 w-4" />
                                        </div>
                                    </div>
                                </div>

                                {/* Answer Comment Form */}
                                {showCommentForm === answer.id && (
                                    <div className="space-y-3 pt-4 border-t">
                                        <Textarea
                                            placeholder="Add a comment to this answer..."
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            className="min-h-[80px]"
                                        />
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" onClick={() => setShowCommentForm(null)}>
                                                Cancel
                                            </Button>
                                            <Button onClick={() => handleSubmitComment(answer.id, 'answer')}>
                                                <Send className="h-4 w-4" />
                                                Comment
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Answer Comments */}
                                {answer.comments && answer.comments.length > 0 && (
                                    <div className="space-y-3 pt-4 border-t">
                                        {answer.comments.map((comment: any) => (
                                            <div key={comment.id} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                    <User className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-medium text-sm">{comment.author}</span>
                                                        <Badge className={getReputationBadge(comment.authorReputation).color} variant="outline" className="text-xs">
                                                            {getReputationBadge(comment.authorReputation).text}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground">
                                                            {formatDate(comment.createdAt)}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm">{comment.content}</p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                                            <Heart className="h-3 w-3" />
                                                            {comment.likes?.length || 0}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    })}

                    {/* Add Answer Form */}
                    <Separator />
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Your Answer</h3>
                        {!isAuthenticated ? (
                            <div className="p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg text-center">
                                <Lock className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                                <h4 className="font-medium mb-2">Login Required</h4>
                                <p className="text-sm text-muted-foreground mb-4">
                                    You need to be logged in to post answers and help the community.
                                </p>
                                <div className="flex gap-2 justify-center">
                                    <Button asChild variant="default">
                                        <a href="/auth/login">Login</a>
                                    </Button>
                                    <Button asChild variant="outline">
                                        <a href="/auth/register">Sign Up</a>
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Textarea
                                    placeholder="Write your answer here... Be detailed and helpful!"
                                    value={newAnswer}
                                    onChange={(e) => setNewAnswer(e.target.value)}
                                    className="min-h-[120px]"
                                    disabled={loading}
                                />
                                <div className="flex justify-end">
                                    <Button 
                                        onClick={handleSubmitAnswer} 
                                        disabled={!newAnswer.trim() || loading}
                                    >
                                        <Send className="h-4 w-4" />
                                        {loading ? 'Posting...' : 'Post Answer'}
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}