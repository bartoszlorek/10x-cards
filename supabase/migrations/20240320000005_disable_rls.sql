/* Migration: Disable RLS on tables
 * Description: Disables row-level security on relevant tables to allow operations without RLS enforcement during development
 * Dependencies: Requires the disable_policies migration to be applied
 */

ALTER TABLE public.flashcards DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.generations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_error_logs DISABLE ROW LEVEL SECURITY; 