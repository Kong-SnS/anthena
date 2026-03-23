"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"

interface GalleryImage {
  src: string
  alt: string
}

export function HorizontalScrollGallery({ images }: { images: GalleryImage[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(images.length - 2) * 25}%`])

  return (
    <div ref={containerRef} className="overflow-hidden py-16 lg:py-24">
      <motion.div className="flex gap-6 px-6 lg:px-8" style={{ x }}>
        {images.map((img, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[70vw] md:w-[40vw] lg:w-[30vw] aspect-[3/4] relative rounded-sm overflow-hidden group"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 70vw, 30vw"
            />
          </div>
        ))}
      </motion.div>
    </div>
  )
}
