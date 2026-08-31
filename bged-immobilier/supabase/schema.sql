-- ============================================================
-- BGED IMMOBILIER — Schéma Supabase
-- À exécuter dans Supabase : Project > SQL Editor > New query
-- ============================================================

-- Extension nécessaire pour gen_random_uuid()
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- 1. TABLE PROFILES
-- Un profil par utilisateur (lié à auth.users), avec son rôle
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('chercheur', 'societe')),
  full_name text not null,
  phone text,
  city text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Les profils sont visibles publiquement"
  on public.profiles for select
  using (true);

create policy "Un utilisateur crée son propre profil"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Un utilisateur modifie son propre profil"
  on public.profiles for update
  using (auth.uid() = id);

-- ------------------------------------------------------------
-- 2. TABLE PROPERTIES (biens en location)
-- ------------------------------------------------------------
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  type text not null,
  price numeric not null,
  city text not null,
  commune text,
  quartier text,
  rooms integer not null default 1,
  surface numeric,
  status text not null default 'disponible'
    check (status in ('disponible', 'en_attente', 'loue')),
  created_at timestamptz not null default now()
);

alter table public.properties enable row level security;

create policy "Les annonces sont visibles publiquement"
  on public.properties for select
  using (true);

create policy "Une société publie ses propres annonces"
  on public.properties for insert
  with check (
    auth.uid() = owner_id
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'societe')
  );

create policy "Une société modifie ses propres annonces"
  on public.properties for update
  using (auth.uid() = owner_id);

create policy "Une société supprime ses propres annonces"
  on public.properties for delete
  using (auth.uid() = owner_id);

-- ------------------------------------------------------------
-- 3. TABLE PROPERTY_IMAGES
-- ------------------------------------------------------------
create table if not exists public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  image_url text not null,
  created_at timestamptz not null default now()
);

alter table public.property_images enable row level security;

create policy "Les photos sont visibles publiquement"
  on public.property_images for select
  using (true);

create policy "Le propriétaire du bien ajoute des photos"
  on public.property_images for insert
  with check (
    exists (
      select 1 from public.properties p
      where p.id = property_id and p.owner_id = auth.uid()
    )
  );

create policy "Le propriétaire du bien supprime des photos"
  on public.property_images for delete
  using (
    exists (
      select 1 from public.properties p
      where p.id = property_id and p.owner_id = auth.uid()
    )
  );

-- ------------------------------------------------------------
-- 4. TABLE FAVORITES
-- ------------------------------------------------------------
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, property_id)
);

alter table public.favorites enable row level security;

create policy "Un utilisateur voit ses propres favoris"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "Un utilisateur ajoute ses propres favoris"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "Un utilisateur retire ses propres favoris"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 5. TABLE REQUESTS (demandes de contact / visite)
-- ------------------------------------------------------------
create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  message text not null,
  status text not null default 'en_attente'
    check (status in ('en_attente', 'repondu', 'cloture')),
  created_at timestamptz not null default now()
);

alter table public.requests enable row level security;

create policy "Le chercheur et la société voient la demande"
  on public.requests for select
  using (auth.uid() = user_id or auth.uid() = owner_id);

create policy "Un chercheur envoie une demande"
  on public.requests for insert
  with check (
    auth.uid() = user_id
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'chercheur')
  );

create policy "La société met à jour le statut de la demande"
  on public.requests for update
  using (auth.uid() = owner_id);

-- ============================================================
-- 6. STOCKAGE (Supabase Storage)
-- Deux buckets publics : "avatars" et "properties"
-- ============================================================
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('properties', 'properties', true)
on conflict (id) do nothing;

-- Lecture publique des photos
create policy "Lecture publique des avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Lecture publique des photos de biens"
  on storage.objects for select
  using (bucket_id = 'properties');

-- Upload : chaque utilisateur écrit uniquement dans son propre dossier
-- (convention utilisée côté React : `${user.id}/...`)
create policy "Upload avatar dans son propre dossier"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Upload photo de bien dans son propre dossier"
  on storage.objects for insert
  with check (
    bucket_id = 'properties'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Suppression de ses propres photos (properties)"
  on storage.objects for delete
  using (
    bucket_id = 'properties'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Suppression de son propre avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================
-- Fin du script. Vérifiez dans Table Editor que les 5 tables
-- et les 2 buckets Storage ont bien été créés.
-- ============================================================
