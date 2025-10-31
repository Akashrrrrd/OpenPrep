"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InterviewExperience } from "@/lib/experiences"
import { Calendar, Clock, User, CheckCircle } from "lucide-react"
import { useState } from "react"

interface InterviewExperienceCardProps {
  experience: InterviewExperience & { companyName?: string }
}

const difficultyColors = {
  1: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  2: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300", 
  3: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  4: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  5: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
}

const outcomeColors = {
  selected: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  waiting: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
}

export function InterviewExperienceCard({ experience }: InterviewExperienceCardProps) {
  const [expanded, setExpanded] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getDifficultyText = (level: number) => {
    const labels = { 1: 'Very Easy', 2: 'Easy', 3: 'Medium', 4: 'Hard', 5: 'Very Hard' }
    return labels[level as keyof typeof labels]
  }



  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2 flex-1">
            <CardTitle className="text-lg font-semibold">
              {experience.role}
              {experience.companyName && (
                <span className="text-base font-normal text-muted-foreground ml-2">
                  at {experience.companyName}
                </span>
              )}
            </CardTitle>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(experience.date)}
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span className="truncate">{experience.anonymous ? 'Anonymous' : 'Verified Student'}</span>
              </div>
              {experience.verified && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Verified</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-row sm:flex-col items-start sm:items-end gap-2">
            <Badge className={outcomeColors[experience.outcome]}>
              {experience.outcome.charAt(0).toUpperCase() + experience.outcome.slice(1)}
            </Badge>
            <Badge className={difficultyColors[experience.overallDifficulty]}>
              {getDifficultyText(experience.overallDifficulty)}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Rounds Summary */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Interview Rounds ({experience.rounds.length})</h4>
          <div className="flex flex-wrap gap-2">
            {experience.rounds.map((round, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {round.type.replace('_', ' ')} ({round.duration}min)
              </Badge>
            ))}
          </div>
        </div>

        {/* Key Tips Preview */}
        {experience.tips.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Key Tips</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {experience.tips.slice(0, expanded ? undefined : 2).map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Detailed Rounds (Expandable) */}
        {expanded && (
          <div className="space-y-3 border-t pt-4">
            <h4 className="font-medium text-sm">Detailed Round Breakdown</h4>
            {experience.rounds.map((round, index) => (
              <div key={index} className="bg-muted/50 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium capitalize">
                    Round {index + 1}: {round.type.replace('_', ' ')}
                  </h5>
                  <div className="flex items-center gap-2">
                    <Badge className={difficultyColors[round.difficulty]} variant="outline">
                      {getDifficultyText(round.difficulty)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{round.duration} min</span>
                  </div>
                </div>
                
                {round.questions.length > 0 && (
                  <div>
                    <h6 className="text-xs font-medium text-muted-foreground mb-1">Questions Asked:</h6>
                    <ul className="text-sm space-y-1">
                      {round.questions.map((question, qIndex) => (
                        <li key={qIndex} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{question}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {round.tips.length > 0 && (
                  <div>
                    <h6 className="text-xs font-medium text-muted-foreground mb-1">Round Tips:</h6>
                    <ul className="text-sm space-y-1">
                      {round.tips.map((tip, tIndex) => (
                        <li key={tIndex} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">✓</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-center pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="text-sm"
          >
            {expanded ? 'Show Less' : 'Show Details'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}