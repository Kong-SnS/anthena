// Bloomie pricing tiers
// 1 box = RM138 (you get 1 box)
// 2 boxes = RM209 + 1 FREE box (you get 3 boxes, pay for 2)
// 4 boxes = RM209 x2 + 2 FREE boxes (you get 6, pay for 4)

const PRICE_1 = 138
const PRICE_2 = 209 // buy 2 get 1 free

export function calculatePrice(quantity: number): {
  total: number
  unitPrice: number
  savings: number
  freeBoxes: number
  totalBoxes: number
  breakdown: string
} {
  if (quantity <= 0) return { total: 0, unitPrice: 0, savings: 0, freeBoxes: 0, totalBoxes: 0, breakdown: "" }

  if (quantity === 1) {
    return {
      total: PRICE_1,
      unitPrice: PRICE_1,
      savings: 0,
      freeBoxes: 0,
      totalBoxes: 1,
      breakdown: "1 box × RM138",
    }
  }

  // Every 2 boxes = RM209 + 1 free box
  const pairs = Math.floor(quantity / 2)
  const remainder = quantity % 2

  let total = pairs * PRICE_2
  if (remainder === 1) {
    total += PRICE_1
  }

  const freeBoxes = pairs // 1 free box per pair
  const totalBoxes = quantity + freeBoxes
  const fullPrice = quantity * PRICE_1

  return {
    total,
    unitPrice: total / totalBoxes,
    savings: fullPrice - total,
    freeBoxes,
    totalBoxes,
    breakdown:
      freeBoxes > 0
        ? `Pay for ${quantity}, get ${totalBoxes} boxes (${freeBoxes} FREE)`
        : `${quantity} box × RM${PRICE_1}`,
  }
}
