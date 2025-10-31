"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Material } from "@/lib/materials"

interface MaterialCardProps {
  material: Material
}

export function MaterialCard({ material }: MaterialCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="space-y-2">
          <CardTitle className="text-lg group-hover:text-primary transition-colors">
            {material.name}
          </CardTitle>
          <p className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-full inline-block">
            {material.category}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {material.description}
        </p>
        <div className="flex flex-col gap-2">
          <Link href={`/materials/${material.id}`} className="w-full">
            <Button className="w-full" size="sm">
              View Resources
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}