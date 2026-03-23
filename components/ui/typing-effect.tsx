"use client"

import { useState, useEffect, useRef } from "react"
import { useInView } from "framer-motion"

interface TypingEffectProps {
  text: string
  className?: string
  speed?: number
  delay?: number
}

export function TypingEffect({ text, className = "", speed = 30, delay = 0 }: TypingEffectProps) {
  const [displayed, setDisplayed] = useState("")
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const timer = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(timer)
  }, [inView, delay])

  useEffect(() => {
    if (!started) return

    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(interval)
    }, speed)

    return () => clearInterval(interval)
  }, [started, text, speed])

  return (
    <span ref={ref} className={className}>
      {displayed}
      {started && displayed.length < text.length && (
        <span className="inline-block w-[2px] h-[1em] bg-current ml-0.5 animate-pulse" />
      )}
    </span>
  )
}
