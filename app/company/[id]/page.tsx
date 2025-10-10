import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCompanies } from "@/lib/companies"

type Params = { params: { id: string } }

export default async function CompanyPage({ params }: Params) {
  const companies = await getCompanies()
  const company = companies.find((c) => c.id === params.id)
  if (!company) return notFound()

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
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
    </div>
  )
}
