-- Anthena Ecommerce Database Schema
-- Run this in Supabase SQL Editor to set up all tables

-- Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  name text,
  phone text,
  role text not null default 'customer' check (role in ('admin', 'customer')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by authenticated users" on public.profiles
  for select using (auth.role() = 'authenticated');

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Products table
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  description text not null default '',
  short_description text not null default '',
  price numeric(10,2) not null,
  compare_price numeric(10,2),
  images text[] not null default '{}',
  category text not null default 'Uncategorized',
  stock_count integer not null default 0,
  weight_kg numeric(5,2) not null default 0.5,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "Products are viewable by everyone" on public.products
  for select using (true);

create policy "Admins can manage products" on public.products
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Customers table (CRM)
create table if not exists public.customers (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete set null,
  email text not null,
  name text not null,
  phone text not null default '',
  address_line1 text not null default '',
  address_line2 text,
  city text not null default '',
  state text not null default '',
  postcode text not null default '',
  country text not null default 'MY',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.customers enable row level security;

create policy "Admins can manage customers" on public.customers
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Customers can view own record" on public.customers
  for select using (user_id = auth.uid());

-- Orders table
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  order_number text not null unique,
  customer_id uuid references public.customers on delete set null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal numeric(10,2) not null,
  shipping_cost numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  shipping_method text,
  tracking_number text,
  easyparcel_order_id text,
  billplz_bill_id text,
  billplz_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "Admins can manage orders" on public.orders
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Customers can view own orders" on public.orders
  for select using (
    customer_id in (select id from public.customers where user_id = auth.uid())
  );

-- Order items table
create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders on delete cascade not null,
  product_id uuid references public.products on delete set null,
  product_name text not null,
  quantity integer not null,
  unit_price numeric(10,2) not null
);

alter table public.order_items enable row level security;

create policy "Admins can manage order items" on public.order_items
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Customers can view own order items" on public.order_items
  for select using (
    order_id in (
      select id from public.orders where customer_id in (
        select id from public.customers where user_id = auth.uid()
      )
    )
  );

-- Invoices table
create table if not exists public.invoices (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders on delete cascade not null,
  invoice_number text not null unique,
  issued_at timestamptz not null default now(),
  pdf_url text,
  sent_at timestamptz
);

alter table public.invoices enable row level security;

create policy "Admins can manage invoices" on public.invoices
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Email logs table
create table if not exists public.email_logs (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders on delete set null,
  customer_id uuid references public.customers on delete set null,
  to_email text not null,
  subject text not null,
  template text not null,
  mailgun_message_id text,
  status text not null default 'sent' check (status in ('sent', 'delivered', 'bounced', 'failed')),
  sent_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.email_logs enable row level security;

create policy "Admins can manage email logs" on public.email_logs
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Function to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'name', coalesce(new.raw_user_meta_data->>'role', 'customer'));
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for auto-creating profile
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Indexes for performance
create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_orders_customer_id on public.orders(customer_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_customers_email on public.customers(email);
create index if not exists idx_customers_user_id on public.customers(user_id);
create index if not exists idx_email_logs_order_id on public.email_logs(order_id);

-- RPC function to decrement stock
create or replace function public.decrement_stock(p_product_id uuid, p_quantity integer)
returns void as $$
begin
  update public.products
  set stock_count = stock_count - p_quantity,
      updated_at = now()
  where id = p_product_id and stock_count >= p_quantity;
end;
$$ language plpgsql security definer;
