import Link from "next/link"
import { XCircle } from "lucide-react"

export default function SGCancelPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-gold/30 flex items-center justify-center">
          <XCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-[40px] font-display font-normal tracking-tight mb-3">
          Payment Cancelled
        </h1>
        <p className="text-xs text-muted-foreground mb-8">
          Your payment was not processed. No charges were made.
        </p>
        <Link
          href="/sg"
          className="inline-block btn-rose-gold px-8 h-11 text-xs font-medium tracking-[0.15em] uppercase leading-[44px]"
        >
          Try Again
        </Link>
      </div>
    </div>
  )
}
