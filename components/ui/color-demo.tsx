"use client"

import { useState } from "react"

const options = [
  { label: "Current", gradient: "linear-gradient(135deg, #B76E78, #c9a96e)" },
  { label: "Rosy Easter Glow", gradient: "linear-gradient(90deg, #ffcad4, #f4acb7)" },
  { label: "Frost Pink", gradient: "linear-gradient(90deg, #ffdde1, #ee9ca7)" },
]

export function ColorDemo() {
  const [active, setActive] = useState(0)

  const applyTheme = (index: number) => {
    setActive(index)
    const g = options[index].gradient

    const reset = index === 0

    // Update all .btn-rose-gold elements (needs !important override)
    document.querySelectorAll<HTMLElement>(".btn-rose-gold").forEach((el) => {
      if (reset) el.style.removeProperty("background")
      else el.style.setProperty("background", g, "important")
    })

    // Update announcement bar
    document.querySelectorAll<HTMLElement>("[class*='from-[#']").forEach((el) => {
      if (reset) el.style.removeProperty("background")
      else el.style.setProperty("background", g, "important")
    })

    // Update footer
    const footer = document.querySelector<HTMLElement>("footer")
    if (footer) {
      if (reset) footer.style.removeProperty("background")
      else footer.style.setProperty("background", g, "important")
    }

    // Update marquee banner
    document.querySelectorAll<HTMLElement>("[class*='bg-gradient']").forEach((el) => {
      if (el.closest("footer") || el.tagName === "FOOTER") return
      if (reset) el.style.removeProperty("background")
      else el.style.setProperty("background", g, "important")
    })

    // Update sticky product bar
    document.querySelectorAll<HTMLElement>(".line-rose-gold, .text-rose-gold-gradient").forEach((el) => {
      if (reset) el.style.removeProperty("background")
      else el.style.setProperty("background", g, "important")
    })
  }

  return (
    <div className="fixed bottom-20 left-4 z-[200] flex flex-col gap-2 bg-white shadow-xl rounded-lg p-3 border border-gold/20">
      <p className="text-[10px] font-medium tracking-wider uppercase text-center mb-1">
        Rose Gold Demo
      </p>
      {options.map((opt, i) => (
        <button
          key={i}
          onClick={() => applyTheme(i)}
          className={`flex items-center gap-2 px-3 py-2 rounded text-xs transition-all ${
            active === i ? "ring-2 ring-gold bg-gold/5" : "hover:bg-gold/5"
          }`}
        >
          <span
            className="w-6 h-6 rounded-full flex-shrink-0 border border-white shadow-sm"
            style={{ background: opt.gradient }}
          />
          <span className="font-medium">{opt.label}</span>
        </button>
      ))}
    </div>
  )
}
