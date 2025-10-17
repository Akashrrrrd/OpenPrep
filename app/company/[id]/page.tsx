import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCompanies } from "@/lib/companies"
import { getExperiencesByCompany } from "@/lib/experiences"
import { InterviewExperienceCard } from "@/components/interview-experience-card"

type Params = { params: { id: string } }

export default async function CompanyPage({ params }: Params) {
  const companies = await getCompanies()
  const company = companies.find((c) => c.id === params.id)
  if (!company) return notFound()

  const experiences = await getExperiencesByCompany(params.id)

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 space-y-8">
      {/* Company Info Card */}
      <Card className="border">
        <CardHeader className="flex items-center gap-4">
          <img
            src={company.logo || "/logos/placeholder.jpg"}
            alt={`${company.name} logo`}
            width={64}
            height={64}
            className="h-16 w-16 rounded-md object-contain bg-secondary p-2"
          />
          <CardTitle className="text-2xl">{company.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">Access all Aptitude, Technical, and HR resources for this company.</p>

          <div className="flex flex-wrap items-center gap-3">
            <a href={company.driveLink} target="_blank" rel="noopener noreferrer">
              <Button className="min-w-56">Open Google Drive Resources</Button>
            </a>
            <Link href="/" className="text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground">
              {"← Back to companies"}
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Interview Experiences Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Recent Interview Experiences</h2>
            <p className="text-muted-foreground text-sm sm:text-base">Real experiences from students who interviewed at {company.name}</p>
          </div>
          <Link href={`/contribute?company=${params.id}`} className="w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              Share Your Experience
            </Button>
          </Link>
        </div>

        {experiences.length > 0 ? (
          <div className="space-y-4">
            {experiences.map((experience) => (
              <InterviewExperienceCard key={experience.id} experience={experience} />
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">No experiences shared yet</h3>
              <p className="text-muted-foreground mb-4 max-w-sm">
                Be the first to share your interview experience with {company.name} and help fellow students prepare better.
              </p>
              <Link href={`/contribute?company=${params.id}`}>
                <Button>Share Your Experience</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
