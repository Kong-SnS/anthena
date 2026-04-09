import type { MetadataRoute } from "next"

const SITE_URL = "https://www.boomingwellness.com.my"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/account/", "/auth/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
