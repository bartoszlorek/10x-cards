import type { APIRoute } from "astro";
import { generateFlashcardsSchema } from "../../lib/schemas/generation.schema";
import { GenerationService } from "../../lib/services/generation.service";

export const prerender = false;

/**
 * POST handler for generating flashcards from text
 * Creates a new generation record and returns flashcard proposals
 */
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // 1. Get Supabase client from locals
    const supabase = locals.supabase;

    // 2. Validate request body
    const body = await request.json().catch(() => ({}));
    const parseResult = generateFlashcardsSchema.safeParse(body);

    if (!parseResult.success) {
      return new Response(
        JSON.stringify({
          error: "Bad Request",
          message: "Invalid request data",
          details: parseResult.error.format(),
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Extract validated data
    const { text } = parseResult.data;

    // 4. Initialize generation service and process request
    const generationService = new GenerationService(supabase);
    const result = await generationService.generateFlashcards(text);

    // 5. Return successful response
    return new Response(JSON.stringify(result), { status: 201, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Generation endpoint error:", error);

    // Return appropriate error response
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: "An error occurred while processing your request",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
