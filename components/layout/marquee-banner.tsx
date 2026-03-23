"use client"

const items = [
  "French Patented Formula",
  "Clinically Proven",
  "12 Premium Botanicals",
  "Science-Backed Ingredients",
  "Free Shipping RM150+",
  "Buy 2 Free 1",
  "Women's Hormonal Health",
  "Made with Love",
]

export function MarqueeBanner() {
  return (
    <div className="bg-gradient-to-r from-[#c4a07c] to-[#d4a89a] text-white py-2.5 overflow-hidden">
      <div className="animate-marquee flex whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="mx-8 text-[11px] font-medium tracking-[0.15em] uppercase flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-white/50" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
