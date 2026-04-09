import type { MetadataRoute } from "next"

const SITE_URL = "https://www.boomingwellness.com.my"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

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
      url: `${SITE_URL}/shop/bloomie`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/oseovital`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ]
}
