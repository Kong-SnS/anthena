"use client"

import { useState } from "react"
import { ProductCard } from "@/components/shop/product-card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import type { Product } from "@/types"

export function ShopContent({
  products,
  categories,
}: {
  products: Product[]
  categories: string[]
}) {
  const [activeCategory, setActiveCategory] = useState("All")
  const [search, setSearch] = useState("")

  const filtered = products.filter((p) => {
    const matchCategory =
      activeCategory === "All" || p.category === activeCategory
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.short_description.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  return (
    <div className="pt-20">
      <div className="bg-gradient-to-b from-[#f5ece4] to-[#efe3d8] py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(196,160,124,0.08)_0%,transparent_70%)]" />
        <div className="container mx-auto px-6 lg:px-8 text-center relative">
          <span className="text-[11px] font-medium tracking-[0.35em] uppercase text-gold">
            Our Collection
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-normal tracking-tight mt-3">
            Shop
          </h1>
          <div className="w-16 h-px line-rose-gold mx-auto mt-6" />
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col sm:flex-row gap-6 mb-12 items-start sm:items-center justify-between">
          <div className="flex gap-6 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[12px] font-medium tracking-[0.1em] uppercase pb-1 transition-all duration-300 ${
                  activeCategory === cat
                    ? "text-foreground border-b border-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-none border-gold/15 bg-transparent text-sm h-10"
            />
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-10">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-muted-foreground font-light text-lg">
              No products found
            </p>
            <p className="text-sm text-muted-foreground mt-2 font-light">
              Try adjusting your search or filter
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
