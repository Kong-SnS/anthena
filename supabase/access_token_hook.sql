-- Custom Access Token Hook — injects the app role into the JWT as `user_role`.
--
-- WHY: without this, every admin check has to hit the auth server (getUser) or
-- query `public.profiles` per request. With it, `role` travels inside the signed
-- JWT and is read locally via supabase.auth.getClaims() — zero network, zero DB
-- on the hot path. Our code (lib/auth-claims.ts) already falls back to the
-- profiles query until this hook is enabled, so deploy order does not matter.
--
-- HOW TO ENABLE (once, after running this file in the SQL Editor):
--   Dashboard → Authentication → Hooks → "Custom Access Token"
--     → enable, select public.custom_access_token_hook
--
-- Also migrate JWT signing keys to asymmetric so getClaims() verifies locally:
--   Dashboard → Authentication → JWT Keys → rotate to a new (RS256/ECC) key.
--   On legacy HS256 keys getClaims() silently falls back to a getUser() network
--   call, so the perf win only lands once keys are asymmetric.
--
-- Claims only refresh when a token is (re)issued. Existing sessions pick up
-- `user_role` on their next refresh; the profiles fallback covers them meanwhile.

create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  claims jsonb;
  v_role text;
begin
  select role into v_role
  from public.profiles
  where id = (event->>'user_id')::uuid;

  claims := event->'claims';
  claims := jsonb_set(claims, '{user_role}', to_jsonb(coalesce(v_role, 'customer')));

  event := jsonb_set(event, '{claims}', claims);
  return event;
end;
$$;

-- The hook runs as the `supabase_auth_admin` role during token minting. Grant it
-- exactly what it needs and nothing to anyone else.
grant usage on schema public to supabase_auth_admin;
grant execute on function public.custom_access_token_hook(jsonb) to supabase_auth_admin;
revoke execute on function public.custom_access_token_hook(jsonb) from authenticated, anon, public;

grant select on public.profiles to supabase_auth_admin;

-- RLS is enabled on profiles; let the auth admin read it while minting tokens.
drop policy if exists "Allow auth admin to read profiles" on public.profiles;
create policy "Allow auth admin to read profiles" on public.profiles
  as permissive for select to supabase_auth_admin using (true);
