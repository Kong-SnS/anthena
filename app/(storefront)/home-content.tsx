"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Counter } from "@/components/ui/counter"
import { MarqueeBanner } from "@/components/layout/marquee-banner"
import { useTranslation } from "@/lib/i18n"
import {
  ArrowRight,
  ChevronDown,
  Star,
  Flower2,
  Heart,
  Sparkles,
  Moon,
  Shield,
  Zap,
  Droplets,
} from "lucide-react"
import type { Product } from "@/types"

const benefits = [
  { icon: Heart, title: "Menstrual Relief", desc: "Relieves cramps & regulates cycle" },
  { icon: Sparkles, title: "Hormonal Balance", desc: "Improves PCOS & irregular periods" },
  { icon: Moon, title: "Better Sleep", desc: "Stabilizes mood & reduces stress" },
  { icon: Zap, title: "Energy Boost", desc: "Reduces fatigue during menstruation" },
  { icon: Shield, title: "Uterine Health", desc: "Supports anti-aging & recovery" },
  { icon: Droplets, title: "Skin Clarity", desc: "Reduces hormonal acne & glow" },
]

const ingredients = [
  "Ginfort Ginger",
  "French Astaxanthin",
  "Goji Berry",
  "USA Ashwagandha",
  "Dong Quai",
  "USA Chamomile",
  "Chasteberry",
  "Magnesium Oxide",
  "Cinnamon",
  "Vitamin B Complex",
  "Spanish Ferrous Fumarate",
  "Pomegranate",
]

const testimonials = [
  {
    name: "Sarah L.",
    title: "Verified Buyer",
    text: "After 2 months of Bloomie, my cramps have significantly reduced. I used to dread my period but now it's so much more manageable!",
    rating: 5,
  },
  {
    name: "Aisyah M.",
    title: "Verified Buyer",
    text: "The pomegranate flavor is delicious! I drink it every morning. My skin has cleared up and my cycle is finally regular after years of irregularity.",
    rating: 5,
  },
  {
    name: "Michelle T.",
    title: "Verified Buyer",
    text: "I bought this for my mood swings and it's been a game-changer. I feel calmer, more energized, and my hormonal acne is almost gone.",
    rating: 5,
  },
]

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(el)
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, inView }
}

function AnimatedSection({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  const { ref, inView } = useInView()
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  )
}

export function HomeContent({ featuredProducts }: { featuredProducts: Product[] }) {
  const product = featuredProducts[0]
  const { t } = useTranslation()

  return (
    <div className="bg-background">
      {/* ============================================ */}
      {/* HERO - Fullscreen Video Background           */}
      {/* ============================================ */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
            poster="/images/hero-poster.jpg"
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70 z-[1]" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <span className="animate-fade-in-up text-[11px] font-medium tracking-[0.35em] uppercase text-white/75 mb-6">
            {t.hero.label}
          </span>
          <h1 className="animate-fade-in-up animation-delay-200 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-normal tracking-tight text-white leading-[1.1] max-w-4xl">
            {t.hero.title1}
            <br />
            <span className="font-display italic shimmer-gold">{t.hero.title2}</span>
          </h1>
          <p className="animate-fade-in-up animation-delay-400 mt-6 text-base md:text-lg text-white/70 font-light max-w-lg leading-relaxed drop-shadow-sm">
            {t.hero.subtitle}
          </p>
          <div className="animate-fade-in-up animation-delay-600 flex gap-4 mt-10">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-white/90 rounded-none px-8 h-12 text-[13px] font-medium tracking-[0.1em] uppercase"
              render={<Link href="/shop/bloomie" />}
            >
              {t.hero.shopBtn}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 rounded-none px-8 h-12 text-[13px] font-medium tracking-[0.1em] uppercase bg-transparent"
              render={<Link href="#benefits" />}
            >
              {t.hero.learnBtn}
            </Button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown className="h-5 w-5 text-white/40" />
        </div>
      </section>

      {/* MARQUEE TRUST BANNER */}
      <MarqueeBanner />

      {/* ============================================ */}
      {/* PRODUCT SHOWCASE - Split Hero                */}
      {/* ============================================ */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Product Image */}
              <div className="relative group">
                <div className="aspect-square bg-gradient-to-br from-[#f5ece4] to-[#f0e4da] rounded-sm overflow-hidden relative glow-gold transition-all duration-700">
                  <Image
                    src="/images/products/bloomie-main.png"
                    alt="Bloomie Botanical Beverage"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>

              {/* Product Info */}
              <div>
                <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-gold">
                  {t.product.introducing}
                </span>
                <h2 className="text-3xl md:text-5xl font-display font-normal tracking-tight mt-3 mb-4 leading-snug">
                  <span className="text-rose-gold-gradient">Bloomie</span>
                </h2>
                <p className="text-lg text-muted-foreground font-light mb-2">
                  {t.product.subtitle}
                </p>
                <p className="text-muted-foreground font-light leading-relaxed mb-6 text-[15px]">
                  {t.product.description}
                </p>

                {/* Promo Banner */}
                <div className="btn-rose-gold px-5 py-3 mb-6 inline-block">
                  <span className="text-[11px] font-medium tracking-[0.2em] uppercase">
                    {t.product.promo}
                  </span>
                </div>

                {/* Pricing Tiers */}
                <div className="flex gap-4 mb-8">
                  <div className="border border-black/10 px-5 py-3 text-center">
                    <p className="text-xs text-muted-foreground font-light">1 Box</p>
                    <p className="text-xl font-light mt-1">RM 138</p>
                    <p className="text-[10px] text-muted-foreground">15 sachets</p>
                  </div>
                  <div className="border-2 border-gold px-5 py-3 text-center relative">
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gold text-white text-[9px] font-medium tracking-wider px-2 py-0.5 uppercase">Best Value</span>
                    <p className="text-xs text-muted-foreground font-light">2 Boxes</p>
                    <p className="text-xl font-light mt-1">RM 209</p>
                    <p className="text-[10px] text-muted-foreground">+ 1 Box FREE</p>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="btn-rose-gold rounded-none px-10 h-12 text-[12px] font-medium tracking-[0.15em] uppercase"
                  render={<Link href="/shop/bloomie" />}
                >
                  {t.product.orderNow}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================ */}
      {/* BENEFITS                                     */}
      {/* ============================================ */}
      <section id="benefits" className="py-24 lg:py-32 bg-[#faf8f5]">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-gold">
                {t.benefits.label}
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-normal tracking-tight mt-3">
                {t.benefits.title}
              </h2>
              <div className="w-16 h-px line-rose-gold mx-auto mt-6" />
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="bg-white p-6 lg:p-8 text-center group hover:shadow-lg hover:-translate-y-1 hover:border-gold/30 border border-transparent transition-all duration-500"
                >
                  <div className="mx-auto w-12 h-12 rounded-full bg-blush-light flex items-center justify-center mb-4 transition-all duration-500 group-hover:bg-gold-light group-hover:scale-110">
                    <b.icon className="h-5 w-5 text-gold" />
                  </div>
                  <h3 className="font-medium text-sm tracking-wide mb-1.5">
                    {b.title}
                  </h3>
                  <p className="text-xs text-muted-foreground font-light">
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================ */}
      {/* STATS COUNTER                                */}
      {/* ============================================ */}
      <section className="py-16 lg:py-20 border-y border-gold/10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { end: 10000, suffix: "+", label: "Happy Customers" },
              { end: 12, suffix: "", label: "Premium Botanicals" },
              { end: 100, suffix: "%", label: "Natural Ingredients" },
              { end: 15, suffix: "", label: "Sachets Per Box" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl lg:text-4xl font-display text-gold">
                  <Counter end={stat.end} suffix={stat.suffix} />
                </p>
                <p className="text-xs text-muted-foreground tracking-[0.1em] uppercase mt-2 font-light">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* LIFESTYLE IMAGE - Full Width                 */}
      {/* ============================================ */}
      <section className="py-24 lg:py-32 bg-warm-dark">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Text - Left */}
              <div>
                <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-gold/70">
                  Your Daily Ritual
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-normal tracking-tight mt-3 mb-4 leading-snug text-white">
                  One Sachet.
                  <br />
                  <span className="italic font-light">Endless Benefits.</span>
                </h2>
                <p className="text-white/50 font-light leading-relaxed mb-8 text-[15px]">
                  Simply mix with water for a delicious pomegranate wellness drink.
                  Best taken daily in the morning for optimal results. Within weeks,
                  you&apos;ll feel the difference in your energy, mood, and cycle comfort.
                </p>
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-white/90 rounded-none px-8 h-12 text-[13px] font-medium tracking-[0.1em] uppercase"
                  render={<Link href="/shop/bloomie" />}
                >
                  Try Bloomie
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {/* Image - Right */}
              <div className="aspect-[4/3] relative overflow-hidden rounded-sm">
                <Image
                  src="/images/products/bloomie-lifestyle-drink.webp"
                  alt="Bloomie pomegranate drink on marble table"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================ */}
      {/* INGREDIENTS                                  */}
      {/* ============================================ */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Ingredients List - Left */}
              <div className="order-2 lg:order-1">
                <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-gold">
                  12 Premium Botanicals
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-normal tracking-tight mt-3 mb-4">
                  Nature&apos;s Finest Ingredients
                </h2>
                <p className="text-muted-foreground font-light leading-relaxed mb-8 text-[15px]">
                  Sourced from France, USA, Spain, and Asia. Each ingredient is
                  carefully selected for its proven benefits in women&apos;s health.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {ingredients.map((ing) => (
                    <div
                      key={ing}
                      className="flex items-center gap-2.5 py-2"
                    >
                      <Flower2 className="h-3.5 w-3.5 text-gold shrink-0" />
                      <span className="text-sm font-light">{ing}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ingredients Image - Right */}
              <div className="aspect-[4/3] bg-[#faf8f5] relative overflow-hidden rounded-sm order-1 lg:order-2">
                <Image
                  src="/images/products/bloomie-flatlay.webp"
                  alt="Bloomie natural ingredients"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================ */}
      {/* HOW IT WORKS                                 */}
      {/* ============================================ */}
      <section className="py-24 lg:py-32 bg-warm-dark text-white">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-white/30">
                Simple & Delicious
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-normal tracking-tight mt-3">
                How to Enjoy Bloomie
              </h2>
              <div className="w-16 h-px line-rose-gold mx-auto mt-6" />
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-16 max-w-4xl mx-auto">
              {[
                { step: "01", title: "Open", desc: "Tear open one sachet of Bloomie" },
                { step: "02", title: "Mix", desc: "Pour into 150ml of warm or cold water" },
                { step: "03", title: "Enjoy", desc: "Stir well and enjoy your daily wellness drink" },
              ].map((s) => (
                <div key={s.step} className="text-center">
                  <span className="text-4xl font-display font-normal text-gold/60">
                    {s.step}
                  </span>
                  <h3 className="font-medium text-lg tracking-wide mt-3 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-white/40 font-light text-sm">{s.desc}</p>
                </div>
              ))}
            </div>

            {/* Drink Pour Image */}
            <div className="mt-16 max-w-3xl mx-auto aspect-[16/7] relative rounded-sm overflow-hidden">
              <Image
                src="/images/products/bloomie-drink-pour.webp"
                alt="Pouring Bloomie pomegranate drink"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 768px"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================ */}
      {/* TESTIMONIALS                                 */}
      {/* ============================================ */}
      <section id="testimonials" className="py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-muted-foreground">
                Real Stories
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-normal tracking-tight mt-3">
                Loved by Women
              </h2>
              <div className="w-16 h-px line-rose-gold mx-auto mt-6" />
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="grid md:grid-cols-3 gap-6 lg:gap-10">
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="border border-black/5 p-8 lg:p-10 group hover:border-gold/30 transition-all duration-500"
                >
                  <div className="flex gap-0.5 mb-6">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 fill-gold text-gold"
                      />
                    ))}
                  </div>
                  <p className="text-foreground/70 text-[15px] font-light leading-relaxed mb-8 italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="border-t border-black/5 pt-6">
                    <p className="font-medium text-sm tracking-wide">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================ */}
      {/* CTA                                          */}
      {/* ============================================ */}
      <section className="relative py-28 lg:py-36 bg-gradient-to-br from-[#f5ece4] to-[#f0e4da] overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#d4a89a]/15 rounded-full blur-3xl" />
        <div className="relative z-10 container mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-gold">
              {t.cta.label}
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-normal tracking-tight mt-4 mb-6 leading-snug">
              {t.cta.title1}
              <br />
              <span className="italic font-light">{t.cta.title2}</span>
            </h2>
            <p className="text-muted-foreground font-light max-w-md mx-auto mb-10 leading-relaxed">
              Join thousands of women who&apos;ve transformed their wellness with Bloomie.
              Your body deserves the best.
            </p>
            <Button
              size="lg"
              className="btn-rose-gold rounded-none px-10 h-12 text-[13px] font-medium tracking-[0.1em] uppercase"
              render={<Link href="/shop/bloomie" />}
            >
              {t.cta.btn}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-xs text-muted-foreground mt-4 font-light">
              {t.cta.price}
            </p>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
