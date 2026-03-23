"use client"

import { useEffect } from "react"

// Update these post IDs with your latest Instagram posts
const INSTAGRAM_POSTS = [
  "DGvAJzQzSHl",
  "DGqx3LATkrM",
  "DGjXoqpTUhZ",
  "DGeFIR8z7ak",
]

export function InstagramFeed() {
  useEffect(() => {
    // Load Instagram embed script
    const script = document.createElement("script")
    script.src = "https://www.instagram.com/embed.js"
    script.async = true
    document.body.appendChild(script)

    // Re-process embeds when script loads
    script.onload = () => {
      (window as any).instgrm?.Embeds?.process()
    }

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <section className="py-24 lg:py-32 bg-[#faf8f5]">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-gold">
            @bloomie_int
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-normal tracking-tight mt-3">
            Follow Us on Instagram
          </h2>
          <a
            href="https://www.instagram.com/bloomie_int/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 btn-rose-gold px-6 py-2 text-[11px] font-medium tracking-[0.15em] uppercase"
          >
            Follow @bloomie_int
          </a>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {INSTAGRAM_POSTS.map((postId) => (
            <div key={postId} className="overflow-hidden rounded-sm">
              <blockquote
                className="instagram-media"
                data-instgrm-captioned={false}
                data-instgrm-permalink={`https://www.instagram.com/p/${postId}/`}
                data-instgrm-version="14"
                style={{
                  background: "#FFF",
                  border: 0,
                  margin: 0,
                  padding: 0,
                  width: "100%",
                  maxWidth: "100%",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
