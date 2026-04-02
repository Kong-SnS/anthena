import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function OseoVitalSuccessPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 flex items-center justify-center" style={{ borderColor: "#00007b" }}>
          <CheckCircle className="h-8 w-8" style={{ color: "#00007b" }} />
        </div>
        <h1 className="text-[40px] font-bold tracking-tight mb-3" style={{ color: "#00007b" }}>
          Thank You!
        </h1>
        <p className="text-xs text-gray-500 mb-2">
          Your payment was successful. We&apos;ll send a confirmation email shortly.
        </p>
        <p className="text-xs text-gray-500 mb-8">
          Your OseoVital will be shipped to Singapore within 3-5 business days.
        </p>
        <Link
          href="/oseovital"
          className="inline-block px-8 h-11 text-xs text-white font-bold tracking-[0.15em] uppercase leading-[44px]"
          style={{ background: "#00007b" }}
        >
          Back to Store
        </Link>
      </div>
    </div>
  )
}
