-- Migration: Create generations table
-- Description: Creates the generations table to store information about flashcard generation attempts
-- Dependencies: Requires auth.users table (provided by Supabase)

-- Create the generations table
create table public.generations (
    id bigserial primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    model varchar not null,
    generated_count integer not null,
    accepted_unedited_count integer,
    accepted_edited_count integer,
    source_text_hash varchar not null,
    source_text_length integer not null check (source_text_length between 1000 and 10000),
    generation_duration integer not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Create index on user_id for faster lookups
create index generations_user_id_idx on public.generations(user_id);

-- Enable Row Level Security
alter table public.generations enable row level security;

-- Create RLS policies for authenticated users
create policy "Users can view their own generations"
    on public.generations
    for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can insert their own generations"
    on public.generations
    for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Users can update their own generations"
    on public.generations
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete their own generations"
    on public.generations
    for delete
    to authenticated
    using (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_generations_updated_at
    before update on public.generations
    for each row
    execute function update_updated_at_column();

-- Grant access to authenticated users
grant all on public.generations to authenticated;
grant usage, select on sequence generations_id_seq to authenticated; 