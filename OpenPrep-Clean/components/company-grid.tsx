"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { type Company, CompanyCard } from "./company-card"

export function CompanyGrid({ initialCompanies }: { initialCompanies: Company[] }) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return initialCompanies
    return initialCompanies.filter((c) => c.name.toLowerCase().includes(q))
  }, [initialCompanies, query])

  return (
    <div className="space-y-6">
      <div className="max-w-xl mx-auto">
        <div className="relative">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search companies..."
            aria-label="Search companies"
            className="h-11 pl-10"
          />
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
            />
          </svg>
        </div>
        <p className="mt-2 text-xs text-muted-foreground text-center">
          Showing {filtered.length} {filtered.length === 1 ? "company" : "companies"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.length > 0 ? (
          filtered.map((c) => <CompanyCard key={c.id} company={c} />)
        ) : (
          <p className="text-center text-muted-foreground col-span-full">
            No companies found. Try a different keyword.
          </p>
        )}
      </div>
    </div>
  )
}
