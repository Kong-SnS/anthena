import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function SGSuccessPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-gold flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-gold" />
        </div>
        <h1 className="text-[40px] font-display font-normal tracking-tight mb-3">
          Thank You!
        </h1>
        <p className="text-xs text-muted-foreground mb-2">
          Your payment was successful. We&apos;ll send a confirmation email shortly.
        </p>
        <p className="text-xs text-muted-foreground mb-8">
          Your Bloomie will be shipped to Singapore within 3-5 business days.
        </p>
        <Link
          href="/sg"
          className="inline-block btn-rose-gold px-8 h-11 text-xs font-medium tracking-[0.15em] uppercase leading-[44px]"
        >
          Back to Store
        </Link>
      </div>
    </div>
  )
}
