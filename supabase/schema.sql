-- Rode este script no SQL Editor do Supabase.

create table if not exists families (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (family_id, name)
);

create table if not exists shopping_items (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  name text not null,
  category text not null default 'Outros',
  done boolean not null default false,
  added_by uuid references members(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  title text not null,
  frequency text not null default 'eventual' check (frequency in ('diaria','semanal','eventual')),
  status text not null default 'pendente' check (status in ('pendente','andamento','concluida')),
  assignee_id uuid references members(id) on delete set null,
  created_by uuid references members(id) on delete set null,
  completed_by uuid references members(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists notices (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  text text not null,
  author_id uuid references members(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists members_family_idx on members(family_id);
create index if not exists shopping_family_idx on shopping_items(family_id);
create index if not exists tasks_family_idx on tasks(family_id);
create index if not exists notices_family_idx on notices(family_id);

-- Acesso por código (sem login): políticas abertas para a chave anon.
-- Quem souber o código da família consegue acessá-la; use códigos difíceis de adivinhar.
alter table families enable row level security;
alter table members enable row level security;
alter table shopping_items enable row level security;
alter table tasks enable row level security;
alter table notices enable row level security;

do $$
declare t text;
begin
  foreach t in array array['families','members','shopping_items','tasks','notices'] loop
    execute format('drop policy if exists "open_access" on %I', t);
    execute format('create policy "open_access" on %I for all to anon using (true) with check (true)', t);
  end loop;
end $$;

-- Tempo real
alter publication supabase_realtime add table members, shopping_items, tasks, notices;
-- Necessário para eventos DELETE chegarem com family_id (filtro realtime)
alter table members replica identity full;
alter table shopping_items replica identity full;
alter table tasks replica identity full;
alter table notices replica identity full;
