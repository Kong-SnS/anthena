import { createClient } from "@/lib/supabase/server"
import type { Product } from "@/types"
import { HomeContent } from "./home-content"

const SITE_URL = "https://www.boomingwellness.com.my"

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

  const product = data?.[0]

  // Organization schema
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Athena Healthcare",
    url: SITE_URL,
    logo: `${SITE_URL}/images/athena-logo.png`,
    description: "Premium women's wellness supplements with patented French formula",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+60-12-643-1737",
      contactType: "Customer Service",
      areaServed: "MY",
      availableLanguage: ["en", "ms", "zh"],
    },
    sameAs: ["https://www.instagram.com/bloomie_int/"],
  }

  // Product schema
  const productSchema = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: "Bloomie by Athena",
        image: [`${SITE_URL}/images/products/bloomie-product-new.png`],
        description:
          "Premium women's wellness supplement with 12 patented ingredients from France, USA, Spain & Asia. Relieves menstrual cramps, PCOS, hormonal acne, mood swings & more.",
        brand: { "@type": "Brand", name: "Athena" },
        sku: product.id,
        offers: {
          "@type": "Offer",
          url: `${SITE_URL}/shop/bloomie`,
          priceCurrency: "MYR",
          price: "138.00",
          availability:
            product.stock_count > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          seller: { "@type": "Organization", name: "Athena Healthcare" },
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "127",
        },
      }
    : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      <HomeContent
        featuredProducts={(data || []) as Product[]}
        bundleProduct={bundleProduct as Product | null}
      />
    </>
  )
}
