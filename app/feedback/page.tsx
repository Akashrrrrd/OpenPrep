"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { User, MessageCircle, FileText, Send } from "lucide-react"

export default function FeedbackPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    // Simulate submission
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 700)
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 shadow-lg">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <MessageCircle className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Provide Feedback</CardTitle>
          <p className="text-muted-foreground mt-2">Help us improve OpenPrep by sharing your suggestions</p>
        </CardHeader>
        <CardContent className="space-y-8">
          {submitted ? (
            <div className="text-center space-y-4 py-8">
              <div className="flex justify-center">
                <Send className="h-16 w-16 text-green-500" />
              </div>
              <p className="text-xl font-medium text-green-600 dark:text-green-400">Thank you for your feedback!</p>
              <p className="text-muted-foreground">
                We appreciate your input. It will help us make the platform better for everyone.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                  <User className="h-4 w-4" />
                  Name
                </Label>
                <Input id="name" name="name" placeholder="Your full name" required className="h-11" />
              </div>
              <div className="space-y-3">
                <Label htmlFor="feature" className="flex items-center gap-2 text-sm font-medium">
                  <MessageCircle className="h-4 w-4" />
                  Feature Suggestion
                </Label>
                <Input id="feature" name="feature" placeholder="e.g., Dark mode toggle, Search improvements" required className="h-11" />
              </div>
              <div className="space-y-3">
                <Label htmlFor="desc" className="flex items-center gap-2 text-sm font-medium">
                  <FileText className="h-4 w-4" />
                  Description
                </Label>
                <Textarea id="desc" name="desc" placeholder="Describe your suggestion in detail..." rows={5} className="resize-none" />
              </div>
              <Button type="submit" disabled={loading} className="w-full h-12 text-lg font-medium transition-all hover:shadow-lg">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Submitting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Submit Feedback
                  </div>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
