import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // After successful code exchange, redirect to reset password page
      return NextResponse.redirect(new URL("/auth/reset-password", origin))
    }
  }

  // If no code or exchange fails, redirect to login
  return NextResponse.redirect(new URL("/auth/login", origin))
}
