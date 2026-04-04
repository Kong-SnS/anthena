"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ImageReveal } from "@/components/ui/image-reveal"
import { TestimonialCarousel } from "@/components/ui/testimonial-carousel"
import { OrnamentDivider } from "@/components/ui/ornament-divider"
import { CountdownTimer } from "@/components/ui/countdown-timer"
import { useCart, useCartDrawer } from "@/hooks/use-cart"
import { TypingEffect } from "@/components/ui/typing-effect"
import { HorizontalScrollGallery } from "@/components/ui/horizontal-scroll-gallery"
import { PopIn } from "@/components/ui/pop-in"
import { InstagramFeed } from "@/components/ui/instagram-feed"
import { BundleCards } from "@/components/ui/bundle-cards"
import { Button } from "@/components/ui/button"
import { Counter } from "@/components/ui/counter"
import { TextReveal } from "@/components/ui/text-reveal"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { StaggerChildren, StaggerItem } from "@/components/ui/stagger-children"
import { PageTransition } from "@/components/ui/page-transition"
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
  Sun,
  Brain,
  Wind,
} from "lucide-react"
import type { Product } from "@/types"

const benefitIcons = [Heart, Brain, Sun, Droplets, Zap, Sparkles, Moon, Shield, Flower2, Wind, Wind]
const benefitKeys = ["menstrualRelief", "migraines", "coldHands", "vaginalDryness", "energyBoost", "hormonalBalance", "moodSwings", "uterineHealth", "stressSleep", "hormonalAcne", "bodyOdor"] as const
const ingredientKeys = ["ginfortGinger", "frenchAstaxanthin", "gojiBerry", "usaAshwagandha", "dongQuai", "usaChamomile", "chasteberry", "magnesiumOxide", "cinnamon", "vitaminBComplex", "spanishFerrousFumarate", "pomegranate"] as const

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

function useParallax(offset: number = -50) {
  const { scrollY } = useScroll()
  return useTransform(scrollY, [0, 1000], [0, offset])
}

// Countdown: 30 days from now (adjust as needed)
const promoEndDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)

export function HomeContent({ featuredProducts, bundleProduct = null }: { featuredProducts: Product[]; bundleProduct?: Product | null }) {
  const product = featuredProducts[0]
  const { t } = useTranslation()
  const addItem = useCart((s) => s.addItem)
  const openCartDrawer = useCartDrawer((s) => s.show)

  return (
    <div className="bg-background">
      {/* ============================================ */}
      {/* HERO - Fullscreen Video Background           */}
      {/* ============================================ */}
      <section className="relative h-screen w-full overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ y: useParallax(-50) }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-[120%] w-full object-cover"
            poster="/images/products/bloomie-product-new.png"
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70 z-[1]" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <span className="animate-fade-in-up text-xs font-medium tracking-[0.35em] uppercase text-white/75 mb-6">
            {t.hero.label}
          </span>
          <h1 className="animate-fade-in-up animation-delay-200 text-[40px] font-display font-normal tracking-tight leading-[1.1] max-w-4xl">
            <span className="shimmer-gold">{t.hero.title1}</span>
            <br />
            <span className="font-display italic shimmer-gold">{t.hero.title2}</span>
          </h1>
          <p className="animate-fade-in-up animation-delay-400 mt-6 text-base md:text-[25px] text-white/70 font-light max-w-lg leading-relaxed drop-shadow-sm">
            <TypingEffect text={t.hero.subtitle} delay={1500} speed={25} />
          </p>
          <div className="animate-fade-in-up animation-delay-600 flex gap-4 mt-10">
            <MagneticButton>
              <Button
                size="lg"
                className="bg-white text-foreground hover:bg-white/90 rounded-none px-8 h-12 text-xs font-medium tracking-[0.1em] uppercase"
                render={<Link href="/shop/bloomie" />}
              >
                {t.hero.shopBtn}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </MagneticButton>
            <MagneticButton>
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 rounded-none px-8 h-12 text-xs font-medium tracking-[0.1em] uppercase bg-transparent"
                render={<Link href="#benefits" />}
              >
                {t.hero.learnBtn}
              </Button>
            </MagneticButton>
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
              <ImageReveal direction="left">
                <div className="aspect-square bg-gradient-to-br from-[#faf8f5] to-[#faf8f5] rounded-sm overflow-hidden relative glow-gold group">
                  <Image
                    src="/images/products/bloomie-product-new.png"
                    alt="Bloomie Botanical Beverage"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </ImageReveal>

              {/* Product Info */}
              <div>
                <span className="text-xs font-medium tracking-[0.3em] uppercase text-gold">
                  {t.product.introducing}
                </span>
                <h2 className="text-[40px] font-display font-normal tracking-tight mt-3 mb-4 leading-snug">
                  <span className="text-rose-gold-gradient">Bloomie</span>
                </h2>
                <p className="text-[25px] text-muted-foreground font-light mb-2">
                  {t.product.subtitle}
                </p>
                <p className="text-muted-foreground font-light leading-relaxed mb-6 text-base">
                  {t.product.description}
                </p>

                {/* Promo Banner */}
                <div className="btn-rose-gold px-5 py-3 mb-4 inline-block">
                  <span className="text-xs font-medium tracking-[0.2em] uppercase">
                    {t.product.promo}
                  </span>
                </div>
                <div className="mb-6">
                  <CountdownTimer endDate={promoEndDate} />
                </div>

                {/* Pricing Tiers */}
                <div className="flex gap-4 mb-8">
                  <button
                    className="border border-gold/15 px-5 py-3 text-center hover:border-gold/30 transition-all"
                    onClick={() => {
                      if (product) { addItem(product, 1); openCartDrawer() }
                    }}
                  >
                    <p className="text-xs text-muted-foreground font-light">1 Box</p>
                    <p className="text-[25px] font-light mt-1">RM 138</p>
                  </button>
                  <button
                    className="border-2 border-gold px-5 py-3 text-center relative hover:bg-gold/5 transition-all"
                    onClick={() => {
                      if (bundleProduct) { addItem(bundleProduct, 1); openCartDrawer() }
                    }}
                  >
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 btn-rose-gold text-xs font-medium tracking-wider px-3 py-0.5 whitespace-nowrap">SAVED RM 47</span>
                    <p className="text-xs text-muted-foreground font-light mt-1">2 Boxes</p>
                    <p className="text-[25px] font-light mt-1">RM 229</p>
                    <p className="text-xs text-muted-foreground">30 Sachets</p>
                  </button>
                </div>
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
              <span className="text-xs font-medium tracking-[0.3em] uppercase text-gold">
                {t.benefits.label}
              </span>
              <h2 className="text-[40px] font-display font-normal tracking-tight mt-3">
                {t.benefits.title}
              </h2>
              <OrnamentDivider className="mt-6" />
            </div>
          </AnimatedSection>

          <StaggerChildren className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6" staggerDelay={0.08}>
              {benefitKeys.map((key, i) => {
                const Icon = benefitIcons[i]
                return (
                  <StaggerItem key={key}>
                    <div className="bg-white p-6 lg:p-8 text-center group hover:shadow-lg hover:-translate-y-1 hover:border-gold/30 border border-transparent transition-all duration-500 h-full">
                      <div className="mx-auto w-12 h-12 rounded-full bg-rose-gold-light flex items-center justify-center mb-4 transition-all duration-500 group-hover:bg-gold-light group-hover:scale-110">
                        <Icon className="h-5 w-5 text-gold" />
                      </div>
                      <h3 className="font-medium text-xs tracking-wide mb-1.5">
                        {t.benefits[key]}
                      </h3>
                      <p className="text-base text-muted-foreground font-light leading-relaxed">
                        {t.benefits[`${key}Desc` as keyof typeof t.benefits]}
                      </p>
                    </div>
                  </StaggerItem>
                )
              })}
          </StaggerChildren>
        </div>
      </section>

      {/* ============================================ */}
      {/* STATS COUNTER                                */}
      {/* ============================================ */}
      <section className="py-16 lg:py-20 border-y border-gold/10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { end: 10000, suffix: "+", label: t.stats.happyCustomers },
              { end: 12, suffix: "", label: t.stats.premiumBotanicals },
              { end: 100, suffix: "%", label: t.stats.naturalIngredients },
              { end: 15, suffix: "", label: t.stats.sachetsPerBox },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-[40px] font-display text-gold">
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
      <section className="py-24 lg:py-32 bg-gradient-to-br from-[#faf8f5] to-[#faf8f5]">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Text - Left */}
              <div>
                <span className="text-xs font-medium tracking-[0.3em] uppercase text-gold/70">
                  {t.lifestyle.label}
                </span>
                <h2 className="text-[40px] font-display font-normal tracking-tight mt-3 mb-4 leading-snug text-foreground">
                  {t.lifestyle.title1}
                  <br />
                  <span className="italic font-light text-gold">{t.lifestyle.title2}</span>
                </h2>
                <p className="text-muted-foreground font-light leading-relaxed mb-8 text-base">
                  {t.lifestyle.description}
                </p>
                <Button
                  size="lg"
                  className="btn-rose-gold rounded-none px-8 h-12 text-xs font-medium tracking-[0.1em] uppercase"
                  render={<Link href="/shop/bloomie" />}
                >
                  {t.lifestyle.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {/* Image - Right */}
              <div className="aspect-[4/3] relative overflow-hidden rounded-sm">
                <Image
                  src="/images/products/bloomie-product-new.png"
                  alt="Bloomie product"
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
      {/* HORIZONTAL SCROLL GALLERY                    */}
      {/* ============================================ */}
      <section className="bg-[#faf8f5]">
        <HorizontalScrollGallery
          images={[
            { src: "/images/products/bloomie-product-new.png", alt: "Bloomie product" },
            { src: "/images/products/bloomie-functions.png", alt: "Bloomie functions" },
            { src: "/images/products/bloomie-ingredients.png", alt: "Bloomie ingredients" },
          ]}
        />
      </section>

      {/* ============================================ */}
      {/* TESTIMONIALS                                 */}
      {/* ============================================ */}
      <section id="testimonials" className="py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground">
                {t.testimonials.label}
              </span>
              <h2 className="text-[40px] font-display font-normal tracking-tight mt-3">
                {t.testimonials.title}
              </h2>
              <OrnamentDivider className="mt-6" />
            </div>
          </AnimatedSection>

          <TestimonialCarousel
            testimonials={[
              { text: t.testimonials.t1, name: t.testimonials.t1Name, title: t.testimonials.t1Title, avatar: "S" },
              { text: t.testimonials.t2, name: t.testimonials.t2Name, title: t.testimonials.t2Title, avatar: "A" },
              { text: t.testimonials.t3, name: t.testimonials.t3Name, title: t.testimonials.t3Title, avatar: "M" },
            ]}
          />
        </div>
      </section>

      {/* ============================================ */}
      {/* INSTAGRAM FEED                               */}
      {/* ============================================ */}
      <InstagramFeed />

      {/* ============================================ */}
      {/* CTA                                          */}
      {/* ============================================ */}
      <section className="relative py-28 lg:py-36 bg-gradient-to-br from-[#faf8f5] to-[#faf8f5] overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#ee9ca7]/15 rounded-full blur-3xl" />
        <div className="relative z-10 container mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <span className="text-xs font-medium tracking-[0.3em] uppercase text-gold">
              {t.cta.label}
            </span>
            <h2 className="text-[40px] font-display font-normal tracking-tight mt-4 mb-6 leading-snug">
              {t.cta.title1}
              <br />
              <span className="italic font-light">{t.cta.title2}</span>
            </h2>
            <p className="text-muted-foreground font-light max-w-md mx-auto mb-10 leading-relaxed">
              {t.cta.description}
            </p>
            <Button
              size="lg"
              className="btn-rose-gold rounded-none px-10 h-12 text-xs font-medium tracking-[0.1em] uppercase"
              render={<Link href="/shop/bloomie" />}
            >
              {t.cta.btn}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-base text-muted-foreground mt-4 font-light">
              {t.cta.price}
            </p>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
