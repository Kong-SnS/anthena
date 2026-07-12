import type { MetadataRoute } from "next"
import { createAdminClient } from "@/lib/supabase/admin"

const SITE_URL = "https://www.boomingwellness.com.my"

// The sitemap is generated at build time. Never let a slow/unreachable DB hang
// the build (Vercel kills a route build after 60s) — bound the product fetch
// and fall back to the static routes if it times out or errors.
const FETCH_TIMEOUT_MS = 8000

async function fetchProductSlugs(): Promise<
  { slug: string; updated_at: string | null }[]
> {
  try {
    const supabase = createAdminClient()
    const result = await Promise.race([
      supabase.from("products").select("slug, updated_at"),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("sitemap-db-timeout")), FETCH_TIMEOUT_MS)
      ),
    ])
    return result.data ?? []
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const products = await fetchProductSlugs()
  const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
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
