"use client"

import Image from "next/image"
import { Instagram } from "lucide-react"

const INSTAGRAM_POSTS = [
  { url: "https://www.instagram.com/bloomie_int/p/DWgkL8DEtBa/", image: "/images/instagram/ig-1.png" },
  { url: "https://www.instagram.com/bloomie_int/p/DWTlajNklTX/", image: "/images/instagram/ig-2.png" },
  { url: "https://www.instagram.com/bloomie_int/p/DWCyojrkmFS/", image: "/images/instagram/ig-3.png" },
]

export function InstagramFeed() {
  return (
    <section className="py-24 lg:py-32 bg-[#faf8f5]">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-gold">
            @bloomie_int
          </span>
          <h2 className="text-[40px] font-display font-normal tracking-tight mt-3">
            Follow Us on Instagram
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {INSTAGRAM_POSTS.map((post) => (
            <a
              key={post.url}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden"
            >
              <Image
                src={post.image}
                alt="Instagram post"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 33vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center">
                <Instagram className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="https://www.instagram.com/bloomie_int/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block btn-rose-gold px-6 py-2 text-xs font-medium tracking-[0.15em] uppercase"
          >
            Follow @bloomie_int
          </a>
        </div>
      </div>
    </section>
  )
}
