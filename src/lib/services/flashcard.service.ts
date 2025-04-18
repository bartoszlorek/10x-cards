import type { SupabaseClient } from "src/db/supabase.client";

export interface FlashcardCreateCommand {
  front: string;
  back: string;
  source: "ai-full" | "ai-edited" | "manual";
  generation_id?: number | null;
}

export const createFlashcards = async (
  supabase: SupabaseClient,
  userId: string,
  flashcards: FlashcardCreateCommand[]
) => {
  // Validate generation_id ownership for flashcards that have a generation_id
  const uniqueGenIds = Array.from(
    new Set(
      flashcards
        .filter((flashcard) => typeof flashcard.generation_id === "number")
        .map((flashcard) => flashcard.generation_id as number)
    )
  );

  // Only validate if there are generation IDs to check
  if (uniqueGenIds.length > 0) {
    const { data: generations, error: genError } = await supabase
      .from("generations")
      .select("id")
      .in("id", uniqueGenIds)
      .eq("user_id", userId);

    // Handle any query errors
    if (genError) {
      throw new Error(`Failed to validate generation ids: ${genError.message}`);
    }

    // Verify all generation IDs belong to the user
    if (generations.length !== uniqueGenIds.length) {
      throw new Error("One or more generation_id are invalid or do not belong to the user");
    }
  }

  const records = flashcards.map((flashcard) => ({
    ...flashcard,
    user_id: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  const { data, error } = await supabase.from("flashcards").insert(records).select();
  if (error) {
    throw new Error(`Failed to create flashcards: ${error.message}`);
  }
  return data;
};
