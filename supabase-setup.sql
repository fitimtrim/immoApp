-- ═══════════════════════════════════════════════════════════
-- ViaHome24 – Supabase Database Setup
-- Führe dieses Skript im Supabase SQL Editor aus:
-- Dashboard → SQL Editor → New Query → Inhalt einfügen → Run
-- ═══════════════════════════════════════════════════════════

-- 1. PROFILES TABLE (zusätzliche Benutzerdaten)
-- ─────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  first_name text,
  last_name text,
  phone text,
  email text,
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Automatisch Profil erstellen wenn neuer User registriert
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, first_name, last_name, phone, email)
  values (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'phone',
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. LISTINGS TABLE (Immobilien-Inserate)
-- ─────────────────────────────────────────────
create table if not exists public.listings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  type text not null,
  offer_type text,
  loc text not null,
  city text,
  zip text,
  region text,
  street text,
  price numeric,
  price_label text,
  rooms text,
  area text,
  floor text,
  year text,
  description text,
  features text[],
  photos text[],
  badge text default 'new',
  agent_name text,
  created_at timestamp with time zone default now()
);

alter table public.listings enable row level security;

create policy "Listings are viewable by everyone"
  on public.listings for select
  using (true);

create policy "Users can insert their own listings"
  on public.listings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own listings"
  on public.listings for update
  using (auth.uid() = user_id);

create policy "Users can delete their own listings"
  on public.listings for delete
  using (auth.uid() = user_id);


-- 3. STORAGE BUCKET für Fotos
-- ─────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('listing-photos', 'listing-photos', true)
on conflict (id) do nothing;

create policy "Photos are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'listing-photos');

create policy "Authenticated users can upload photos"
  on storage.objects for insert
  with check (bucket_id = 'listing-photos' and auth.role() = 'authenticated');

create policy "Users can delete their own photos"
  on storage.objects for delete
  using (bucket_id = 'listing-photos' and auth.uid()::text = (storage.foldername(name))[1]);

-- ═══════════════════════════════════════════════════════════
-- FERTIG! Nach dem Ausführen:
-- 1. Authentication → Providers → Email aktivieren (meist schon an)
-- 2. Für Tests: Authentication → Settings → "Confirm email" OFF
--    (sonst muss jeder neue User seine Email bestätigen)
-- ═══════════════════════════════════════════════════════════
