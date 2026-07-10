import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { resolveUserRole, type AuthClaims } from "@/lib/auth-claims"

// Never let a slow Supabase auth server hang the whole request until Vercel's
// hard middleware limit (which surfaces as 504 MIDDLEWARE_INVOCATION_TIMEOUT).
// Bound every auth call and fail fast instead.
const AUTH_TIMEOUT_MS = 3000

function withTimeout<T>(promise: PromiseLike<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout>
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("supabase-timeout")), ms)
  })
  return Promise.race([Promise.resolve(promise), timeout]).finally(() =>
    clearTimeout(timer)
  )
}

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const isAdmin = pathname.startsWith("/admin")
  const isAccount = pathname.startsWith("/account")
  const code = searchParams.get("code")
  const isAuthCallback = Boolean(code) && pathname === "/"

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Auth code exchange (password reset, email confirm) — only when ?code= lands
  // on "/". On failure, fall through and let the page render.
  if (isAuthCallback) {
    try {
      const { error } = await withTimeout(
        supabase.auth.exchangeCodeForSession(code!),
        AUTH_TIMEOUT_MS
      )
      if (!error) {
        const { data: { session } } = await withTimeout(
          supabase.auth.getSession(),
          AUTH_TIMEOUT_MS
        )
        if (session?.user?.recovery_sent_at) {
          const url = new URL("/auth/reset-password", request.url)
          const response = NextResponse.redirect(url)
          supabaseResponse.cookies.getAll().forEach((cookie) => {
            response.cookies.set(cookie.name, cookie.value)
          })
          return response
        }
      }
    } catch {
      // Auth server slow/unreachable — don't block the homepage over it.
    }
    return supabaseResponse
  }

  // Protected routes: verify the JWT locally (asymmetric signing keys) instead
  // of a round trip to the auth server. getClaims() still refreshes an expired
  // session via getSession() first, so cookies stay fresh. Fail CLOSED (send to
  // login) if the auth server is slow. Never hang the request.
  let claims: AuthClaims | null = null
  try {
    const { data } = await withTimeout(supabase.auth.getClaims(), AUTH_TIMEOUT_MS)
    claims = (data?.claims as AuthClaims) ?? null
  } catch {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  if (!claims) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  if (isAdmin) {
    try {
      // Reads `user_role` straight from the verified claims once the access
      // token hook is enabled — no DB query on the hot path.
      const role = await withTimeout(
        resolveUserRole(supabase, claims),
        AUTH_TIMEOUT_MS
      )
      if (role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url))
      }
    } catch {
      // Can't verify admin role — deny by sending home.
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    // Only run on the homepage when an auth ?code= is present — plain visits
    // skip the proxy entirely and never touch Supabase.
    { source: "/", has: [{ type: "query", key: "code" }] },
    "/admin/:path*",
    "/account/:path*",
  ],
}
