import type { APIRoute } from "astro";
import { z } from "zod";
import { createFlashcards } from "src/lib/services/flashcard.service";
import type { SupabaseClient } from "src/db/supabase.client";
import { DEFAULT_USER_ID } from "src/db/supabase.client";

// Define validation schema for a single flashcard
const singleFlashcardSchema = z.object({
  front: z.string().max(200),
  back: z.string().max(500),
  source: z.enum(["ai-full", "ai-edited", "manual"]),
  generation_id: z.number().optional().nullable(),
});

// Define validation schema for bulk request
const bulkFlashcardSchema = z.object({
  flashcards: z.array(singleFlashcardSchema),
});

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Parse and validate JSON body
    const body = await request.json();
    let flashcards;

    if (body.flashcards) {
      // Validate bulk flashcards input
      const parsed = bulkFlashcardSchema.safeParse(body);
      if (!parsed.success) {
        return new Response(JSON.stringify({ error: "Invalid flashcards format", details: parsed.error.format() }), {
          status: 400,
        });
      }
      flashcards = parsed.data.flashcards;
    } else {
      // Validate single flashcard input and normalize it to an array
      const parsed = singleFlashcardSchema.safeParse(body);
      if (!parsed.success) {
        return new Response(JSON.stringify({ error: "Invalid flashcard format", details: parsed.error.format() }), {
          status: 400,
        });
      }
      flashcards = [parsed.data];
    }

    // Retrieve supabase from locals
    const { supabase } = locals as { supabase: SupabaseClient };
    const inserted = await createFlashcards(supabase, DEFAULT_USER_ID, flashcards);

    return new Response(JSON.stringify(inserted.length === 1 ? inserted[0] : { flashcards: inserted }), {
      status: 201,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Server error", message: err instanceof Error ? err.message : String(err) }),
      { status: 500 }
    );
  }
};
