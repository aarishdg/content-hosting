# ContentHub — Supabase Setup & Runbook

React + TypeScript app for hosting **articles & podcasts** on **Supabase** (Auth + Postgres + Storage).

- **Contributors** can create, edit, publish/unpublish, and soft-delete **their own** content.
- **Public users** (including logged-in non-contributors) can browse **published** content and open detail pages.
- **Podcasts** are uploaded to a **private** Storage bucket and streamed via **signed URLs**.

---

## 0) Prerequisites

- Supabase project (Postgres 15+)
- Node 18+
- Frontend env vars:

```bash
# .env
REACT_APP_SUPABASE_URL=your-project-url
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

Your Supabase client lives at: `src/utils/supabaseClient.ts`.

---

## 1) Database Schema (run once in Supabase SQL)

> Paste this whole block into the SQL editor and run it. It’s idempotent where possible.

```sql
-- UUID generation / crypto
create extension if not exists pgcrypto;

-- 1) profiles — linked to auth.users
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text,
  role       text default 'contributor',
  created_at timestamptz not null default now()
);

-- 2) content — articles & podcasts
create table if not exists public.content (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  description       text,
  content_type      text not null check (content_type in ('article','podcast')),
  status            text not null check (status in ('draft','published')),
  tags              text[] not null default '{}',
  rich_text_content text,
  audio_file_url    text,
  audio_duration    int4,
  author_id         uuid not null references auth.users (id) on delete cascade,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  published_at      timestamptz,
  deleted_at        timestamptz
);

-- 3) updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end$$;

drop trigger if exists trg_content_updated_at on public.content;
create trigger trg_content_updated_at
before update on public.content
for each row execute procedure public.set_updated_at();

-- 4) podcast integrity
-- Published podcasts must have an audio file; drafts may omit it.
alter table public.content
  drop constraint if exists content_audio_required;

alter table public.content
  add constraint content_audio_required
  check (
    content_type <> 'podcast'
    or audio_file_url is not null
    or status = 'draft'
  );

-- 5) index (public listing performance)
create index if not exists idx_content_public
  on public.content (status, content_type, published_at desc)
  where deleted_at is null;

-- 6) Row Level Security
alter table public.content  enable row level security;
alter table public.profiles enable row level security;

-- 7) RLS policies

-- Owner (contributor) access — used by the dashboard
drop policy if exists content_owner_read   on public.content;
drop policy if exists content_insert_self  on public.content;
drop policy if exists content_update_owner on public.content;

create policy content_owner_read
on public.content for select to authenticated
using (author_id = auth.uid() and deleted_at is null);

create policy content_insert_self
on public.content for insert to authenticated
with check (author_id = auth.uid());

create policy content_update_owner
on public.content for update to authenticated
using (author_id = auth.uid())
with check (author_id = auth.uid());

-- Public/reader access — show ONLY published + not-deleted
drop policy if exists content_public_read_anon on public.content;
drop policy if exists content_public_read_auth on public.content;

create policy content_public_read_anon
on public.content for select to anon
using (deleted_at is null and status = 'published');

create policy content_public_read_auth
on public.content for select to authenticated
using (deleted_at is null and status = 'published');
```

---

## 2) Storage (podcasts)

Create a bucket named **`podcasts`**. Keep it **Private** (recommended).  
The app generates **signed URLs** on podcast detail pages.

### Storage policies (read only, for playback)

```sql
-- Allow anonymous visitors to read (for generating signed URLs)
drop policy if exists anon_select_podcasts on storage.objects;
create policy anon_select_podcasts
on storage.objects
for select to anon
using (bucket_id = 'podcasts');

-- Allow authenticated users to read as well
drop policy if exists auth_select_podcasts on storage.objects;
create policy auth_select_podcasts
on storage.objects
for select to authenticated
using (bucket_id = 'podcasts');
```

> Do **not** grant insert/update/delete to `anon`. Contributors upload via the app with their authenticated session.

If you instead make the bucket **Public**, you can skip these two policies and use public URLs (the app currently uses signed URLs).

---

## 3) App Contracts (how the UI talks to Supabase)

### Articles
- Insert row:
  - `content_type = 'article'`
  - `status in ('draft','published')`
  - `rich_text_content` contains HTML
  - `author_id = auth.uid()` (enforced by RLS)

### Podcasts — **upload-first** flow (required by the check constraint)
1. Generate a UUID for the content row **client-side**.
2. Upload audio **first** to the `podcasts` bucket at:
   ```
   user/<auth.uid>/<contentId>/<timestamp>_<filename>
   ```
3. Insert the `content` row **with** `audio_file_url` set to that path.
4. Publishing sets `status='published'` and `published_at=now()`.

### Soft delete
- Set `deleted_at = now()` (RLS allows the owner to update their own row).

### Public detail pages
- Route `/content/:id` loads both articles & podcasts.
- RLS ensures only `status='published' AND deleted_at IS NULL` are visible.
- Podcasts resolve **signed URLs** from the `podcasts` bucket for playback.

---

## 4) Routes

**Public**
- `/articles` (supports `?type=podcast` if using a unified list)
- `/podcasts` (optional separate list page)
- `/content/:id` (detail page for both types)

**Contributor**
- `/dashboard` (owner list, filters, publish/unpublish, soft delete)
- `/dashboard/create?type=article|podcast`
- `/dashboard/edit/:id`

> Hide dashboard links for non-contributors and guard these routes in the router.

---

## 5) Running Locally

```bash
npm install
# ensure .env is set (see section 0)
npm start
```

**Demo users:** create them under **Auth → Users** in Supabase, then map to profiles:

```sql
insert into public.profiles (id, email, role)
select id, email, 'contributor'
from auth.users
where email in ('contributor@example.com')
on conflict (id) do update set email = excluded.email;

insert into public.profiles (id, email, role)
select id, email, 'public'
from auth.users
where email in ('user@example.com')
on conflict (id) do update set email = excluded.email;
```

---

## 6) Verification Queries

Latest published (what public sees):

```sql
select id, title, content_type, published_at
from public.content
where deleted_at is null and status = 'published'
order by published_at desc
limit 20;
```

My content (replace with your auth UID):

```sql
select id, title, status, content_type, updated_at
from public.content
where author_id = '<YOUR_AUTH_UID>' and deleted_at is null
order by updated_at desc;
```

Storage objects (latest uploads):

```sql
select name, bucket_id, created_at, updated_at
from storage.objects
where bucket_id = 'podcasts'
order by updated_at desc
limit 20;
```

---

## 7) Troubleshooting

- **Detail page says “Content not found” while logged in**  
  Ensure the authenticated public-read policy exists (see §1) and the row is `published` with `deleted_at IS NULL`.

- **`invalid input syntax for type uuid: "1"`**  
  Don’t use mock numeric IDs for `author_id`. Inserts must set `author_id = auth.uid()` (the RLS `with check` enforces it).

- **`violates check constraint content_audio_required`**  
  You inserted a podcast without `audio_file_url`. Use the **upload-first** flow or keep the row as `draft` until the upload completes.

- **403 when playing audio**  
  Confirm the Storage `select` policies above and that the bucket is named **`podcasts`**.

---

## 8) What’s changed from the old setup

- Replaced mock services with **Supabase Auth + Postgres + Storage**.
- Added **RLS** for owner actions and public read.
- Podcast **upload-first** workflow + **signed URL** playback.
- Unified detail page at **`/content/:id`**.
- Documented constraints, trigger, and performance index.