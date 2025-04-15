-- Migration: Disable all RLS policies
-- Description: Disables all previously defined RLS policies from flashcards, generations and generation_error_logs tables
-- Dependencies: Requires previous migrations to be applied

-- Drop policies from flashcards table
drop policy if exists "Users can view their own flashcards" on public.flashcards;
drop policy if exists "Users can insert their own flashcards" on public.flashcards;
drop policy if exists "Users can update their own flashcards" on public.flashcards;
drop policy if exists "Users can delete their own flashcards" on public.flashcards;

-- Drop policies from generations table
drop policy if exists "Users can view their own generations" on public.generations;
drop policy if exists "Users can insert their own generations" on public.generations;
drop policy if exists "Users can update their own generations" on public.generations;
drop policy if exists "Users can delete their own generations" on public.generations;

-- Drop policies from generation_error_logs table
drop policy if exists "Users can view their own error logs" on public.generation_error_logs;
drop policy if exists "Users can insert their own error logs" on public.generation_error_logs; 