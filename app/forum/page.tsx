import { getAllQuestions } from '@/lib/forum'
import ForumClient from '@/components/forum-client'

export default async function ForumPage() {
  // Fetch questions from database
  const questions = await getAllQuestions()
  
  // Get all unique tags
  const allTags = Array.from(
    new Set(questions.flatMap(q => q.tags))
  ).sort()

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Q&A Forum</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-4 sm:px-0">
          Get help from the community. Ask questions, share knowledge, and learn from experienced students and professionals.
        </p>
      </div>

      {/* Client Component with Interactive Features */}
      <ForumClient questions={questions} allTags={allTags} />
    </div>
  )
}