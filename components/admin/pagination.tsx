"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  page: number
  totalItems: number
  perPage: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalItems, perPage, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / perPage)

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-sm text-muted-foreground">
        Showing {Math.min((page - 1) * perPage + 1, totalItems)}-{Math.min(page * perPage, totalItems)} of {totalItems}
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium px-2">{page} / {totalPages}</span>
        <Button variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function paginate<T>(items: T[], page: number, perPage: number = 20): T[] {
  return items.slice((page - 1) * perPage, page * perPage)
}
