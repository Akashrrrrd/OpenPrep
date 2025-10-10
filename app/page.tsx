import { Suspense } from "react"
import { CompanyGrid } from "@/components/company-grid"
import { getCompanies } from "@/lib/companies"
import { GraduationCap } from "lucide-react"

export default async function HomePage() {
  const companies = await getCompanies()

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <section className="text-center space-y-6 py-12 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl">
        <div className="flex justify-center mb-4">
          <GraduationCap className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-balance bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          OpenPrep — Free & Open-Source Platform for Company Preparation Resources.
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-lg">
          Browse curated, student-contributed resources for top companies. Simple, free, and always growing.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <a href="#companies" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            Browse companies
            <span className="sr-only">{"Jump to companies"}</span>
          </a>
          <a href="/contribute" className="inline-flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors">
            Contribute resources
            <span className="sr-only">{"Go to contribute page"}</span>
          </a>
        </div>
      </section>

      <section id="companies" className="mt-8">
        <Suspense fallback={<div className="text-center text-muted-foreground">Loading companies...</div>}>
          <CompanyGrid initialCompanies={companies} />
        </Suspense>
      </section>
    </div>
  )
}
