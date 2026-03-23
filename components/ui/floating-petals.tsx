"use client"

import { useState, useEffect } from "react"

export function FloatingPetals() {
  const [petals, setPetals] = useState<{ id: number; left: string; size: number; duration: string; delay: string; opacity: number }[]>([])

  useEffect(() => {
    // Generate petals only on client to avoid hydration mismatch
    setPetals(
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        left: `${10 + Math.random() * 80}%`,
        size: 8 + Math.random() * 16,
        duration: `${12 + Math.random() * 18}s`,
        delay: `${Math.random() * 10}s`,
        opacity: 0.15 + Math.random() * 0.25,
      }))
    )
  }, [])

  if (petals.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute animate-float"
          style={{
            left: petal.left,
            bottom: "-20px",
            width: petal.size,
            height: petal.size,
            opacity: petal.opacity,
            "--duration": petal.duration,
            "--delay": petal.delay,
          } as React.CSSProperties}
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <path
              d="M12 2C8 6 4 10 4 14c0 4.4 3.6 8 8 8s8-3.6 8-8c0-4-4-8-8-12z"
              fill="#d4a89a"
              opacity="0.6"
            />
          </svg>
        </div>
      ))}
    </div>
  )
}
