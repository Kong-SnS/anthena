import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { rateLimit, getIP } from "@/lib/rate-limit"

// 5 attempts per 15 minutes per IP
const LIMIT = 5
const WINDOW_MS = 15 * 60 * 1000

export async function POST(request: NextRequest) {
  const ip = getIP(request)
  const { allowed, remaining, retryAfterMs } = rateLimit(`login:${ip}`, LIMIT, WINDOW_MS)

  if (!allowed) {
    const retryAfterSec = Math.ceil(retryAfterMs / 1000)
    return NextResponse.json(
      { error: `Too many login attempts. Please try again in ${Math.ceil(retryAfterSec / 60)} minutes.` },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfterSec) },
      }
    )
  }

  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
  }

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }

  // Fetch role for redirect
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single()

  return NextResponse.json(
    { role: profile?.role ?? "customer", remaining },
    { status: 200 }
  )
}
