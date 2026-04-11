import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import type { Product } from "@/types"
import { ProductDetailContent } from "./product-detail-content"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: product } = await supabase
    .from("products")
    .select("name, short_description, images, price")
    .eq("slug", slug)
    .single()

  if (!product) return { title: "Product Not Found" }

  const image = product.images?.[0] || null

  return {
    title: `${product.name} | Athena`,
    description: product.short_description,
    alternates: {
      canonical: `https://www.boomingwellness.com.my/shop/${slug}`,
    },
    openGraph: {
      title: product.name,
      description: product.short_description,
      ...(image ? { images: [{ url: image }] } : {}),
    },
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (!product) return notFound()

  const { data: relatedProducts } = await supabase
    .from("products")
    .select("*")
    .eq("category", product.category)
    .eq("is_active", true)
    .neq("id", product.id)
    .limit(4)

  // Fetch the 2-box bundle product (hidden from shop listing)
  const { data: bundleProduct } = await supabase
    .from("products")
    .select("*")
    .eq("slug", "bloomie-2box")
    .single()

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.boomingwellness.com.my",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop",
        item: "https://www.boomingwellness.com.my/shop",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `https://www.boomingwellness.com.my/shop/${slug}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductDetailContent
        product={product as Product}
        relatedProducts={(relatedProducts || []) as Product[]}
        bundleProduct={bundleProduct as Product | null}
      />
    </>
  )
}
