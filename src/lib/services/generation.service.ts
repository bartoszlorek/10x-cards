import type { FlashcardProposalDTO, GenerationDTO, GenerationResponseDTO } from "../../types";
import type { SupabaseClient } from "../../db/supabase.client";
import { DEFAULT_USER_ID } from "../../db/supabase.client";
import { createHash } from "crypto";

/**
 * Service for handling flashcard generation operations
 */
export class GenerationService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Generates flashcard proposals from text using AI
   * @param text The input text to generate flashcards from
   * @returns An object containing generation record and flashcard proposals
   */
  async generateFlashcards(text: string): Promise<GenerationResponseDTO> {
    try {
      // 1. Create a generation record
      const { data: generation, error: generationError } = await this.supabase
        .from("generations")
        .insert({
          user_id: DEFAULT_USER_ID,
          model: "gpt-3.5-turbo-mock", // Mock model name for development
          generated_count: 0, // Initial count, will be updated later
          generation_duration: 0, // Will be filled in after generation
          accepted_edited_count: 0,
          accepted_unedited_count: 0,
          source_text_hash: this.generateMd5Hash(text),
          source_text_length: text.length,
        })
        .select()
        .single();

      if (generationError) {
        await this.logGenerationError("gpt-3.5-turbo-mock", "db_error", generationError.message, text);
        throw new Error(`Failed to create generation record: ${generationError.message}`);
      }

      // Record start time for duration calculation
      const startTime = Date.now();

      // 2. Generate proposals using AI service (mocked for now)
      // In a real implementation, call the external AI service here
      const proposals = await this.mockAiGeneration(text);

      // Calculate generation duration
      const generationDuration = Date.now() - startTime;

      // 3. Update generation record with completed status and generated count
      const { error: updateError } = await this.supabase
        .from("generations")
        .update({
          generated_count: proposals.length,
          generation_duration: Math.floor(generationDuration / 1000), // Convert to seconds
        })
        .eq("id", generation.id);

      if (updateError) {
        await this.logGenerationError("gpt-3.5-turbo-mock", "db_error", updateError.message, text);
        throw new Error(`Failed to update generation status: ${updateError.message}`);
      }

      // 4. Return generation data and proposals
      return {
        generation: generation as GenerationDTO,
        flashcards_proposals: proposals,
      };
    } catch (error) {
      // Log the error
      await this.logGenerationError(
        "gpt-3.5-turbo-mock",
        "internal_error",
        error instanceof Error ? error.message : String(error),
        text
      );
      throw error;
    }
  }

  /**
   * Logs generation errors to the database
   * @param model AI model used
   * @param errorCode Error code
   * @param errorMessage Error message
   * @param sourceText Text that was being processed
   */
  private async logGenerationError(
    model: string,
    errorCode: string,
    errorMessage: string,
    sourceText: string
  ): Promise<void> {
    try {
      await this.supabase.from("generation_error_logs").insert({
        user_id: DEFAULT_USER_ID,
        model,
        error_code: errorCode,
        error_message: errorMessage,
        source_text_hash: this.generateMd5Hash(sourceText),
        source_text_length: sourceText.length,
      });
    } catch (e) {
      // If we can't log the error, just console log it
      console.error("Failed to log generation error:", e);
    }
  }

  /**
   * Generate an MD5 hash for the source text
   * @param text Text to hash
   * @returns MD5 hash string
   */
  private generateMd5Hash(text: string): string {
    return createHash("md5").update(text).digest("hex");
  }

  /**
   * Temporary mock function for AI generation
   * This would be replaced with actual AI service integration
   */
  private async mockAiGeneration(text: string): Promise<FlashcardProposalDTO[]> {
    // Simulating async AI processing
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock data for development purposes
    return [
      {
        front: "What is the main purpose of flashcards?",
        back: "To aid memory retention through active recall",
        source: "ai-full",
      },
      {
        front: "How many characters are in the provided text?",
        back: `${text.length} characters`,
        source: "ai-full",
      },
      {
        front: "What is spaced repetition?",
        back: "A learning technique that incorporates increasing intervals of time between reviews of previously learned material",
        source: "ai-full",
      },
    ];
  }
}
