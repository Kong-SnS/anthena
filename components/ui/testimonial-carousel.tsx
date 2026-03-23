"use client"

import { useEffect, useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { Star } from "lucide-react"

interface Testimonial {
  text: string
  name: string
  title: string
  avatar?: string
}

export function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  )

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {testimonials.map((review, i) => (
          <div key={i} className="flex-[0_0_100%] md:flex-[0_0_33.333%] min-w-0 px-3">
            <div className="border border-black/5 p-8 lg:p-10 group hover:border-gold/30 transition-all duration-500 h-full">
              <div className="flex gap-0.5 mb-6">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-foreground/70 text-[15px] font-light leading-relaxed mb-8 italic">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="border-t border-black/5 pt-6 flex items-center gap-3">
                {review.avatar && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c4a07c] to-[#d4a89a] flex items-center justify-center text-white text-sm font-medium">
                    {review.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-medium text-sm tracking-wide">{review.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{review.title}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
