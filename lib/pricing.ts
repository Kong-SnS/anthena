// Bloomie pricing tiers
// 1 box = RM138
// 2 boxes = RM209
// Buy 2 Free 1: 3 boxes = RM209
// 4+ boxes: every 3 = RM209, remainder at tier price

const PRICE_1 = 138
const PRICE_2 = 209 // also covers 3 boxes (buy 2 free 1)

export function calculatePrice(quantity: number): {
  total: number
  unitPrice: number
  savings: number
  freeBoxes: number
  breakdown: string
} {
  if (quantity <= 0) return { total: 0, unitPrice: 0, savings: 0, freeBoxes: 0, breakdown: "" }

  if (quantity === 1) {
    return {
      total: PRICE_1,
      unitPrice: PRICE_1,
      savings: 0,
      freeBoxes: 0,
      breakdown: "1 box × RM138",
    }
  }

  if (quantity === 2) {
    return {
      total: PRICE_2,
      unitPrice: PRICE_2 / 2,
      savings: PRICE_1 * 2 - PRICE_2,
      freeBoxes: 0,
      breakdown: "2 boxes × RM209",
    }
  }

  // For 3+: apply buy 2 free 1 bundles
  const bundles = Math.floor(quantity / 3)
  const remainder = quantity % 3

  let total = bundles * PRICE_2

  if (remainder === 1) {
    total += PRICE_1
  } else if (remainder === 2) {
    total += PRICE_2
  }

  const fullPrice = quantity * PRICE_1
  const freeBoxes = bundles

  return {
    total,
    unitPrice: total / quantity,
    savings: fullPrice - total,
    freeBoxes,
    breakdown:
      bundles > 0
        ? `${bundles} bundle${bundles > 1 ? "s" : ""} (Buy 2 Free 1)${remainder > 0 ? ` + ${remainder} box${remainder > 1 ? "es" : ""}` : ""}`
        : `${quantity} box${quantity > 1 ? "es" : ""}`,
  }
}
