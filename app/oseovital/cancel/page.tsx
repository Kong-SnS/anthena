import Link from "next/link"
import { XCircle } from "lucide-react"

export default function OseoVitalCancelPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-gray-200 flex items-center justify-center">
          <XCircle className="h-8 w-8 text-gray-400" />
        </div>
        <h1 className="text-[40px] font-bold tracking-tight mb-3">
          Payment Cancelled
        </h1>
        <p className="text-xs text-gray-500 mb-8">
          Your payment was not processed. No charges were made.
        </p>
        <Link
          href="/oseovital"
          className="inline-block px-8 h-11 text-xs text-white font-bold tracking-[0.15em] uppercase leading-[44px]"
          style={{ background: "#00007b" }}
        >
          Try Again
        </Link>
      </div>
    </div>
  )
}
