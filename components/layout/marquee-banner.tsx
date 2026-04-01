"use client"

const items = [
  "Free Shipping Min. Purchase 2 Boxes",
  "Results Seen in 1 Week",
  "Premium French\u00A0\ud83c\uddeb\ud83c\uddf7 Patented Formula",
]

export function MarqueeBanner() {
  return (
    <div className="bg-gradient-to-r from-[#ffdde1] to-[#ee9ca7] text-white py-2.5 overflow-hidden">
      <div className="animate-marquee flex whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="mx-8 text-xs font-medium tracking-[0.15em] uppercase flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-white/50" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
