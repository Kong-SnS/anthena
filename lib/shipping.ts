// Shipping rates

// East Malaysian states
const EAST_STATES = ["Sabah", "Sarawak", "Labuan"]

export type Region = "peninsular" | "east" | "singapore"

export function getRegion(state: string): Region {
  if (state === "Singapore") return "singapore"
  if (EAST_STATES.includes(state)) return "east"
  return "peninsular"
}

// Min purchase = 2 boxes (quantity >= 2) for free shipping
export function calculateShipping(region: Region, quantity: number): {
  cost: number
  isFree: boolean
  carriers: string[]
} {
  const minPurchase = quantity >= 2

  if (region === "singapore") {
    return { cost: 30, isFree: false, carriers: ["International Shipping"] }
  }

  if (region === "east") {
    return {
      cost: minPurchase ? 0 : 12,
      isFree: minPurchase,
      carriers: ["Citylink", "Poslaju"],
    }
  }

  // peninsular
  return {
    cost: minPurchase ? 0 : 6.5,
    isFree: minPurchase,
    carriers: ["DHL", "Citylink", "Poslaju"],
  }
}

// Allowed carriers per region (for admin EasyParcel selection)
// Names must partially match EasyParcel courier_name (case-insensitive)
export const ALLOWED_CARRIERS: Record<Region, string[]> = {
  peninsular: ["DHL", "City-Link", "Poslaju"],
  east: ["City-Link", "Poslaju"],
  singapore: [],
}

// SGD shipping for Singapore Stripe checkout
export const SG_SHIPPING_SGD = 10 // ~RM30 equivalent in SGD
