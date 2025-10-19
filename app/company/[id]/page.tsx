import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { cookies } from "next/headers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getCompanies } from "@/lib/companies"
import { getExperiencesByCompany } from "@/lib/experiences"
import { InterviewExperienceCard } from "@/components/interview-experience-card"
import { verifyToken } from "@/lib/auth"
import { UsageTracker } from "@/lib/usage-tracker"
import { Crown, Lock } from "lucide-react"

type Params = { params: { id: string } }

export default async function CompanyPage({ params }: Params) {
  const companies = await getCompanies()
  const company = companies.find((c) => c.id === params.id)
  if (!company) return notFound()

  // Check authentication and usage limits
  const cookieStore = cookies()
  const token = cookieStore.get('auth-token')?.value
  let user = null
  let usageCheck = null
  let hasAccess = true

  if (token) {
    try {
      user = await verifyToken(token)
      if (user) {
        usageCheck = await UsageTracker.checkCompanyAccess(user.id, params.id)
        hasAccess = usageCheck.allowed
        
        // Track company access if allowed
        if (hasAccess) {
          await UsageTracker.trackCompanyAccess(user.id, params.id)
        }
      }
    } catch (error) {
      console.error('Error checking company access:', error)
    }
  }

  const experiences = await getExperiencesByCompany(params.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto w-full max-w-4xl px-4 py-10 space-y-8">
        
        {/* Access Control Alert */}
        {user && !hasAccess && usageCheck && (
          <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
            <Lock className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Company Access Limit Reached</p>
                <p className="text-sm">
                  You've accessed {usageCheck.current} of {usageCheck.limit} companies this month. 
                  {usageCheck.requiresUpgrade && (
                    <span> Upgrade to Pro for unlimited company access.</span>
                  )}
                </p>
                {usageCheck.requiresUpgrade && (
                  <Link href="/pricing">
                    <Button size="sm" className="mt-2">
                      <Crown className="h-3 w-3 mr-1" />
                      Upgrade Now
                    </Button>
                  </Link>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Login Prompt for Unauthenticated Users */}
        {!user && (
          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
            <Lock className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Sign in to Access Company Resources</p>
                <p className="text-sm">
                  Create a free account to access company preparation materials and track your progress.
                </p>
                <div className="flex gap-2 mt-2">
                  <Link href="/auth/login">
                    <Button size="sm" variant="outline">Sign In</Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button size="sm">Sign Up Free</Button>
                  </Link>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

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
            {user && hasAccess ? (
              <a href={company.driveLink} target="_blank" rel="noopener noreferrer">
                <Button className="min-w-56">Open Google Drive Resources</Button>
              </a>
            ) : user && !hasAccess ? (
              <Button className="min-w-56" disabled>
                <Lock className="h-4 w-4 mr-2" />
                Access Limit Reached
              </Button>
            ) : (
              <Link href="/auth/login">
                <Button className="min-w-56">
                  <Lock className="h-4 w-4 mr-2" />
                  Sign In to Access Resources
                </Button>
              </Link>
            )}
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
          <Link href={`/experiences/share?company=${params.id}`} className="w-full sm:w-auto">
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
              <Link href={`/experiences/share?company=${params.id}`}>
                <Button>Share Your Experience</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
      </div>
    </div>
  )
}
