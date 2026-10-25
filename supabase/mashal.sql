-- Mashal Olympics Sports Wear — admin, products, banners, inquiries, image storage.
-- Run once in Supabase → SQL Editor. Safe to run again.

-- 1) Admins
create table if not exists public.mo_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.mo_admins enable row level security;

create or replace function public.is_mo_admin()
returns boolean language sql security definer set search_path = public stable as $$
  select exists (select 1 from public.mo_admins where user_id = auth.uid());
$$;
revoke all on function public.is_mo_admin() from public, anon;
grant execute on function public.is_mo_admin() to authenticated;

drop policy if exists "mo admins read self" on public.mo_admins;
create policy "mo admins read self" on public.mo_admins for select to authenticated using (user_id = auth.uid());

-- 2) Tables
create table if not exists public.mo_products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category_slug text not null,
  description text,
  price numeric,
  image_url text,
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.mo_banners (
  id uuid primary key default gen_random_uuid(),
  placement text not null check (placement in ('hero','athletes','promo')),
  title text not null,
  subtitle text,
  image_url text not null,
  link text,
  sort int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.mo_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  product text,
  quantity text,
  deadline text,
  details text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.mo_products enable row level security;
alter table public.mo_banners enable row level security;
alter table public.mo_inquiries enable row level security;

-- 3) Policies: public reads active items, admins do everything, anyone can send an inquiry
drop policy if exists "mo products public read" on public.mo_products;
create policy "mo products public read" on public.mo_products for select to anon, authenticated using (active = true);
drop policy if exists "mo products admin all" on public.mo_products;
create policy "mo products admin all" on public.mo_products for all to authenticated using (public.is_mo_admin()) with check (public.is_mo_admin());

drop policy if exists "mo banners public read" on public.mo_banners;
create policy "mo banners public read" on public.mo_banners for select to anon, authenticated using (active = true);
drop policy if exists "mo banners admin all" on public.mo_banners;
create policy "mo banners admin all" on public.mo_banners for all to authenticated using (public.is_mo_admin()) with check (public.is_mo_admin());

drop policy if exists "mo inquiries public insert" on public.mo_inquiries;
create policy "mo inquiries public insert" on public.mo_inquiries for insert to anon, authenticated
  with check (char_length(name) between 1 and 120 and char_length(phone) between 3 and 40);
drop policy if exists "mo inquiries admin all" on public.mo_inquiries;
create policy "mo inquiries admin all" on public.mo_inquiries for all to authenticated using (public.is_mo_admin()) with check (public.is_mo_admin());

-- 4) Image storage (public bucket, only admins can upload / delete)
insert into storage.buckets (id, name, public) values ('mo-media', 'mo-media', true)
on conflict (id) do update set public = true;

drop policy if exists "mo media public read" on storage.objects;
create policy "mo media public read" on storage.objects for select using (bucket_id = 'mo-media');
drop policy if exists "mo media admin insert" on storage.objects;
create policy "mo media admin insert" on storage.objects for insert to authenticated with check (bucket_id = 'mo-media' and public.is_mo_admin());
drop policy if exists "mo media admin update" on storage.objects;
create policy "mo media admin update" on storage.objects for update to authenticated using (bucket_id = 'mo-media' and public.is_mo_admin());
drop policy if exists "mo media admin delete" on storage.objects;
create policy "mo media admin delete" on storage.objects for delete to authenticated using (bucket_id = 'mo-media' and public.is_mo_admin());

-- 5) Starter products (only inserted when the table is empty; images fall back to the category photo)
insert into public.mo_products (name, category_slug, description, price, featured)
select * from (values
  ('Pro Match Football Kit', 'football-kits', 'Full sublimated kit with your club colours, names and numbers.', 3500, true),
  ('Competition Dobok', 'taekwondo', 'WT-style cut, ribbed collar, all belt sizes.', 4200, true),
  ('Performance Training Shorts', 'custom-shorts', 'Lightweight, breathable, fully custom.', 1500, false),
  ('Gym Tank Top', 'shirts-tank-tops', 'Moisture-wicking fabric with custom print.', 1200, false),
  ('Warm-up Tracksuit', 'tracksuits-sona-suits', 'Zip jacket and trousers, team branding included.', 5500, false),
  ('Satin Wushu Set', 'wushu', 'Competition satin uniform with embroidery.', 4800, false)
) as v(name, category_slug, description, price, featured)
where not exists (select 1 from public.mo_products);

-- 6) MAKE YOURSELF ADMIN: first create your user in Authentication → Users → Add user
--    (tick "Auto confirm user"), then put the same email below and run this line:
-- insert into public.mo_admins (user_id) select id from auth.users where email = 'YOUR-EMAIL@example.com' on conflict do nothing;
