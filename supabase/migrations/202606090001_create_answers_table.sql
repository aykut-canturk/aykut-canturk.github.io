create table if not exists public.answers (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  group_name text,
  is_correct boolean not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_answers_user_id on public.answers(user_id);
create index if not exists idx_answers_created_at on public.answers(created_at desc);

alter table public.answers enable row level security;

drop policy if exists "kendi cevaplarini gor" on public.answers;
create policy "kendi cevaplarini gor"
  on public.answers
  for select
  using (auth.uid() = user_id);

drop policy if exists "kendi cevaplarini ekle" on public.answers;
create policy "kendi cevaplarini ekle"
  on public.answers
  for insert
  with check (auth.uid() = user_id);
