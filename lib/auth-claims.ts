import type { SupabaseClient } from "@supabase/supabase-js"

/**
 * Claims read from a verified Supabase access token.
 *
 * `sub` (user id) and `email` are standard. `user_role` is a CUSTOM claim
 * injected by our Custom Access Token Hook (see `supabase/access_token_hook.sql`)
 * so admin checks need no auth-server round trip and no `profiles` query. It is
 * optional so this code degrades gracefully until the hook is enabled.
 */
export type AuthClaims = {
  sub: string
  email?: string
  user_role?: string
  user_metadata?: { name?: string; [k: string]: unknown }
  app_metadata?: { user_role?: string; [k: string]: unknown }
  [k: string]: unknown
}

/**
 * Resolve the authenticated user's application role.
 *
 * Fast path: read `user_role` straight from the verified JWT claims — zero
 * network, zero DB. Fallback (only until the access-token hook is configured):
 * a single indexed lookup on `profiles`.
 */
export async function resolveUserRole(
  supabase: SupabaseClient,
  claims: AuthClaims
): Promise<string | null> {
  const fromClaim = claims.user_role ?? claims.app_metadata?.user_role
  if (typeof fromClaim === "string") return fromClaim

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", claims.sub)
    .single()
  return (data?.role as string | undefined) ?? null
}
