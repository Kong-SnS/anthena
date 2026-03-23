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
    title: `${product.name} | Anthena`,
    description: product.short_description,
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

  return (
    <ProductDetailContent
      product={product as Product}
      relatedProducts={(relatedProducts || []) as Product[]}
    />
  )
}
