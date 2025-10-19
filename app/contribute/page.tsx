"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { User, Mail, Link as LinkIcon, FileText, Send } from "lucide-react"

export default function ContributePage() {
  const router = useRouter()
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    if (!isAuthenticated) {
      alert('Please log in to contribute resources')
      router.push('/auth/login?redirect=/contribute')
      return
    }
    
    setLoading(true)
    // Simulate submission
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 700)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 shadow-lg">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold">Contribute Resources</CardTitle>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base px-4 sm:px-0">Help students by sharing placement preparation materials</p>
          {!isAuthenticated && !authLoading && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
                🔒 Please log in to contribute resources and help other students
              </p>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-8">
          {submitted ? (
            <div className="text-center space-y-4 py-8">
              <div className="flex justify-center">
                <Send className="h-12 w-12 sm:h-16 sm:w-16 text-green-500" />
              </div>
              <p className="text-lg sm:text-xl font-medium text-green-600 dark:text-green-400">Thank you for your contribution!</p>
              <p className="text-muted-foreground text-sm sm:text-base px-4 sm:px-0">
                We appreciate your effort in helping students. Your submission will be reviewed and added soon.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                    <User className="h-4 w-4" />
                    Name
                  </Label>
                  <Input id="name" name="name" placeholder="Your full name" required className="h-11" />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input id="email" name="email" type="email" placeholder="you@example.com" required className="h-11" />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="drive" className="flex items-center gap-2 text-sm font-medium">
                  <LinkIcon className="h-4 w-4" />
                  Drive Folder Link
                </Label>
                <Input id="drive" name="drive" type="url" placeholder="https://drive.google.com/..." required className="h-11" />
              </div>
              <div className="space-y-3">
                <Label htmlFor="desc" className="flex items-center gap-2 text-sm font-medium">
                  <FileText className="h-4 w-4" />
                  Description
                </Label>
                <Textarea id="desc" name="desc" placeholder="Briefly describe the resources (e.g., aptitude tests, coding questions, interview tips)..." rows={5} className="resize-none" />
              </div>
              <Button type="submit" disabled={loading} className="w-full h-10 text-base font-medium transition-all">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Submitting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Submit Contribution
                  </div>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
