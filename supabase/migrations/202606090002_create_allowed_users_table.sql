create table if not exists public.allowed_users (
  email text primary key check (email = lower(email)),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

create index if not exists idx_allowed_users_created_at on public.allowed_users(created_at desc);

alter table public.allowed_users enable row level security;

drop policy if exists "allowed_users_read_self" on public.allowed_users;
create policy "allowed_users_read_self"
  on public.allowed_users
  for select
  to authenticated
  using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));
