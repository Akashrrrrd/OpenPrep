"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

export type Company = {
  id: string
  name: string
  logo: string
  driveLink: string
}

export function CompanyCard({ company }: { company: Company }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-primary/20 bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="flex-row items-center gap-4 pb-4">
          <div className="relative">
            <img
              src={company.logo || "/logos/placeholder.jpg"}
              alt={`${company.name} logo`}
              width={52}
              height={52}
              className="h-13 w-13 rounded-lg object-cover bg-secondary/50 p-2 border border-border/20"
            />
          </div>
          <CardTitle className="text-lg font-semibold leading-tight">{company.name}</CardTitle>
        </CardHeader>
        <CardContent className="mt-auto pt-4">
          <Link href={`/company/${company.id}`} className="w-full" aria-label={`View resources for ${company.name}`}>
            <Button variant="default" className="w-full group transition-all duration-200 hover:shadow-md">
              View Resources
              <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  )
}
