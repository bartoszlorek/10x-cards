-- Migration: Create generation_error_logs table
-- Description: Creates the generation_error_logs table to store errors during flashcard generation
-- Dependencies: Requires auth.users table

-- Create the generation_error_logs table
create table public.generation_error_logs (
    id bigserial primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    model varchar not null,
    source_text_hash varchar not null,
    source_text_length integer not null check (source_text_length between 1000 and 10000),
    error_code varchar(100) not null,
    error_message text not null,
    created_at timestamptz not null default now()
);

-- Create index for faster lookups
create index generation_error_logs_user_id_idx on public.generation_error_logs(user_id);

-- Enable Row Level Security
alter table public.generation_error_logs enable row level security;

-- Create RLS policies for authenticated users
create policy "Users can view their own error logs"
    on public.generation_error_logs
    for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can insert their own error logs"
    on public.generation_error_logs
    for insert
    to authenticated
    with check (auth.uid() = user_id);

-- Note: Update and delete policies are not needed as error logs should be immutable

-- Grant access to authenticated users
grant select, insert on public.generation_error_logs to authenticated;
grant usage, select on sequence generation_error_logs_id_seq to authenticated; 