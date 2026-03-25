import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"
import type { Product } from "@/types"
import { ShopContent } from "./shop-content"

export const metadata: Metadata = {
  title: "Shop | Athena",
  description: "Browse our collection of premium botanical health supplements. Natural ingredients, science-backed formulations.",
  openGraph: {
    title: "Shop Athena Supplements",
    description: "Premium botanical health supplements for women's wellness.",
  },
}

export default async function ShopPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  const products: Product[] = data || []
  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category))),
  ]

  return <ShopContent products={products} categories={categories} />
}
