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

/**
 * Format a full address on one line — line1, line2, city/state, postcode —
 * dropping blank parts and collapsing a duplicate city/state (so Singapore
 * shows "Singapore 238888", not "Singapore, Singapore 238888").
 */
export function formatAddress(a: {
  address_line1?: string | null
  address_line2?: string | null
  city?: string | null
  state?: string | null
  postcode?: string | null
}): string {
  const cityStatePostcode = [formatLocation(a.city, a.state), a.postcode?.trim()]
    .filter(Boolean)
    .join(" ")
  return [
    a.address_line1?.trim(),
    a.address_line2?.trim(),
    cityStatePostcode,
  ]
    .filter(Boolean)
    .join(", ")
}
