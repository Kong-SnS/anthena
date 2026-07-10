import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { resolveUserRole, type AuthClaims } from "@/lib/auth-claims"

export async function verifyAdmin(): Promise<{ authorized: boolean; response?: NextResponse }> {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {},
      },
    }
  )

  // Verify the JWT locally (asymmetric signing keys) instead of a round trip to
  // the auth server. Falls back to getUser() automatically on legacy HS256.
  const { data, error } = await supabase.auth.getClaims()
  const claims = data?.claims as AuthClaims | undefined

  if (error || !claims) {
    return {
      authorized: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    }
  }

  const role = await resolveUserRole(supabase, claims)

  if (role !== "admin") {
    return {
      authorized: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    }
  }

  return { authorized: true }
}
