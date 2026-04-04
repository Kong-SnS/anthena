import { createClient } from "@/lib/supabase/server"
import type { Product } from "@/types"
import { HomeContent } from "./home-content"

export default async function HomePage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(4)

  const { data: bundleProduct } = await supabase
    .from("products")
    .select("*")
    .eq("slug", "bloomie-2box")
    .single()

  return <HomeContent featuredProducts={(data || []) as Product[]} bundleProduct={bundleProduct as Product | null} />
}
