-- Migration: Create flashcards table
-- Description: Creates the flashcards table to store user's flashcards
-- Dependencies: Requires auth.users table and generations table

-- Create enum type for source
create type flashcard_source as enum ('ai-full', 'ai-edited', 'manual');

-- Create the flashcards table
create table public.flashcards (
    id bigserial primary key,
    front varchar(200) not null,
    back varchar(500) not null,
    source flashcard_source not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    generation_id bigint references public.generations(id) on delete set null,
    user_id uuid not null references auth.users(id) on delete cascade
);

-- Create indexes for faster lookups
create index flashcards_user_id_idx on public.flashcards(user_id);
create index flashcards_generation_id_idx on public.flashcards(generation_id);

-- Enable Row Level Security
alter table public.flashcards enable row level security;

-- Create RLS policies for authenticated users
create policy "Users can view their own flashcards"
    on public.flashcards
    for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can insert their own flashcards"
    on public.flashcards
    for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Users can update their own flashcards"
    on public.flashcards
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete their own flashcards"
    on public.flashcards
    for delete
    to authenticated
    using (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
create trigger update_flashcards_updated_at
    before update on public.flashcards
    for each row
    execute function update_updated_at_column();

-- Grant access to authenticated users
grant all on public.flashcards to authenticated;
grant usage, select on sequence flashcards_id_seq to authenticated; 