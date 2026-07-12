import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a "city, state" location, collapsing duplicates so single-city
 * territories like Singapore render as "Singapore" instead of
 * "Singapore, Singapore". Blank parts are dropped.
 */
export function formatLocation(
  city?: string | null,
  state?: string | null
): string {
  return Array.from(
    new Set([city, state].map((p) => p?.trim()).filter(Boolean))
  ).join(", ")
}
