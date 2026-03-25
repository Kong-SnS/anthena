"use client"

import { useState, useEffect } from "react"

interface CountdownTimerProps {
  endDate: Date
  label?: string
}

export function CountdownTimer({ endDate, label = "Offer ends in" }: CountdownTimerProps) {
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 })

  useEffect(() => {
    const tick = () => {
      const diff = endDate.getTime() - Date.now()
      if (diff <= 0) return setTime({ days: 0, hours: 0, mins: 0, secs: 0 })

      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      })
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [endDate])

  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] tracking-[0.15em] uppercase text-gold/70 font-medium">{label}</span>
      <div className="flex gap-1.5">
        {[
          { val: time.days, unit: "D" },
          { val: time.hours, unit: "H" },
          { val: time.mins, unit: "M" },
          { val: time.secs, unit: "S" },
        ].map((t) => (
          <div key={t.unit} className="btn-rose-gold text-center rounded px-2 py-1 min-w-[36px]">
            <span className="text-sm font-medium tabular-nums">{String(t.val).padStart(2, "0")}</span>
            <span className="text-[8px] text-white/60 ml-0.5">{t.unit}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
