import { Suspense } from "react"
import { CompanyGrid } from "@/components/company-grid"
import { getCompanies } from "@/lib/companies"
import { GraduationCap, Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function HomePage() {
  const companies = await getCompanies()

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <section className="text-center space-y-4 sm:space-y-6 py-8 sm:py-12 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl">
        <div className="flex justify-center mb-2 sm:mb-4">
          <GraduationCap className="h-12 w-12 sm:h-16 sm:w-16 text-primary" />
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-balance leading-tight sm:leading-normal bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent px-2 sm:px-0">
          OpenPrep — Free & Open-Source Platform for Company Preparation Resources.
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-base sm:text-lg px-4 sm:px-0">
          Browse curated, student-contributed resources for top companies. Simple, free, and always growing.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 sm:pt-4 px-4 sm:px-0">
          <Button asChild className="w-full sm:w-auto">
            <a href="#companies">
              <Search className="h-4 w-4" />
              Browse companies
              <span className="sr-only">{"Jump to companies"}</span>
            </a>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <a href="/contribute">
              <Plus className="h-4 w-4" />
              Contribute resources
              <span className="sr-only">{"Go to contribute page"}</span>
            </a>
          </Button>
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
