-- Per-user Services & Pricing document (categories, films, packages, info cards as JSON)
create table public.user_services_pricing (
  user_id uuid not null primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

comment on table public.user_services_pricing is 'Dashboard Services & Pricing JSON payload per auth user';

alter table public.user_services_pricing enable row level security;

create policy "user_services_pricing_select_own"
  on public.user_services_pricing
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "user_services_pricing_insert_own"
  on public.user_services_pricing
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "user_services_pricing_update_own"
  on public.user_services_pricing
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
