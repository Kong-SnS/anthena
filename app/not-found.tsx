import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center">
        <p className="text-8xl font-extralight text-muted-foreground/20 mb-4">404</p>
        <h1 className="text-2xl font-extralight tracking-tight mb-2">
          Page Not Found
        </h1>
        <p className="text-muted-foreground font-light text-sm mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block btn-rose-gold rounded-none px-8 h-11 text-[12px] font-medium tracking-[0.15em] uppercase leading-[44px]"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
