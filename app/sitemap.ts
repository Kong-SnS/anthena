import type { MetadataRoute } from "next"
import { createAdminClient } from "@/lib/supabase/admin"

const SITE_URL = "https://www.boomingwellness.com.my"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Fetch all active products from database
  const supabase = createAdminClient()
  const { data: products } = await supabase
    .from("products")
    .select("slug, updated_at")

  const productUrls: MetadataRoute.Sitemap = (products || []).map((p) => ({
    url: `${SITE_URL}/shop/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : now,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/shop`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/oseovital`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...productUrls,
  ]
}
