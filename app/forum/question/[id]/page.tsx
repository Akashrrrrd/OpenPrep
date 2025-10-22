import { notFound } from "next/navigation"
import { getQuestionByIdDetailed } from "@/lib/forum"
import QuestionDetail from "@/components/question-detail"

interface QuestionPageProps {
  params: { id: string }
}

export default async function QuestionPage({ params }: QuestionPageProps) {
  const question = await getQuestionByIdDetailed(params.id)

  if (!question) {
    notFound()
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-3 sm:px-4 py-4 sm:py-6 lg:py-10">
      <QuestionDetail question={question} />
    </div>
  )
}

export async function generateMetadata({ params }: QuestionPageProps) {
  const question = await getQuestionByIdDetailed(params.id)

  if (!question) {
    return {
      title: 'Question Not Found - OpenPrep Forum'
    }
  }

  return {
    title: `${question.title} - OpenPrep Forum`,
    description: question.content.substring(0, 160) + '...',
  }
}