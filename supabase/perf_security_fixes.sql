-- Performance + security fixes derived from Supabase advisors (2026-07-11).
-- Already applied to the production DB via MCP; kept here for version control
-- and reproducibility. Safe to re-run (idempotent where it matters).

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Missing FK indexes (advisor: 0001_unindexed_foreign_keys)
-- ─────────────────────────────────────────────────────────────────────────────
create index if not exists idx_email_logs_customer_id on public.email_logs(customer_id);
create index if not exists idx_invoices_order_id       on public.invoices(order_id);
create index if not exists idx_order_items_product_id  on public.order_items(product_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Lock down SECURITY DEFINER functions exposed via PostgREST RPC
--    (advisor: 0028/0029). By default PUBLIC has EXECUTE; revoke it and grant
--    only the roles that legitimately call each function.
-- ─────────────────────────────────────────────────────────────────────────────
-- decrement_stock: webhooks call it with the service role; the admin "cancel"
-- flow now goes through /api/admin/orders/cancel (service role) too. anon and
-- authenticated must NOT be able to tamper with stock via /rest/v1/rpc.
revoke execute on function public.decrement_stock(uuid, integer) from public;
grant  execute on function public.decrement_stock(uuid, integer) to service_role;
-- `authenticated` was revoked AFTER the deploy that moved the admin cancel call
-- server-side (the currently-deployed browser page needed it until then).
revoke execute on function public.decrement_stock(uuid, integer) from authenticated;

-- handle_new_user is a trigger function; the trigger fires regardless of the
-- caller's EXECUTE grant, so nobody needs RPC access to it.
revoke execute on function public.handle_new_user() from public;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Pin search_path on our functions (advisor: 0011_function_search_path_mutable)
--    (custom_access_token_hook is also set in access_token_hook.sql)
-- ─────────────────────────────────────────────────────────────────────────────
alter function public.custom_access_token_hook(jsonb) set search_path = '';
alter function public.decrement_stock(uuid, integer)   set search_path = '';
alter function public.handle_new_user()                set search_path = '';

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. RLS init-plan fix (advisor: 0003_auth_rls_initplan)
--    Wrap auth.uid()/auth.jwt() in a scalar subquery so they evaluate ONCE per
--    query instead of once per row. Admin policies additionally read the
--    `user_role` JWT claim first (no profiles lookup) and fall back to the
--    profiles check for pre-key-rotation tokens that lack the claim.
-- ─────────────────────────────────────────────────────────────────────────────

-- Owner / view policies
alter policy "Customers can view own record" on public.customers
  using (user_id = (select auth.uid()));

alter policy "Profiles are viewable by authenticated users" on public.profiles
  using ((select auth.uid()) is not null);

alter policy "Users can update own profile" on public.profiles
  using ((select auth.uid()) = id);

alter policy "Customers can view own orders" on public.orders
  using (customer_id in (
    select customers.id from public.customers
    where customers.user_id = (select auth.uid())
  ));

alter policy "Customers can view own order items" on public.order_items
  using (order_id in (
    select orders.id from public.orders
    where orders.customer_id in (
      select customers.id from public.customers
      where customers.user_id = (select auth.uid())
    )
  ));

-- Admin "manage" policies — JWT-claim fast path + profiles fallback.
-- (applied to: customers, orders, order_items, products, invoices, email_logs)
alter policy "Admins can manage customers" on public.customers
  using (
    ((select auth.jwt()) ->> 'user_role' = 'admin')
    or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
  );

alter policy "Admins can manage orders" on public.orders
  using (
    ((select auth.jwt()) ->> 'user_role' = 'admin')
    or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
  );

alter policy "Admins can manage order items" on public.order_items
  using (
    ((select auth.jwt()) ->> 'user_role' = 'admin')
    or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
  );

alter policy "Admins can manage products" on public.products
  using (
    ((select auth.jwt()) ->> 'user_role' = 'admin')
    or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
  );

alter policy "Admins can manage invoices" on public.invoices
  using (
    ((select auth.jwt()) ->> 'user_role' = 'admin')
    or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
  );

alter policy "Admins can manage email logs" on public.email_logs
  using (
    ((select auth.jwt()) ->> 'user_role' = 'admin')
    or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')
  );
