import type { Database } from "./db/database.types";

/**
 * Pagination DTO used in list responses.
 */
export interface PaginationDTO {
  page: number;
  limit: number;
  total: number;
}

/**
 * FlashcardDTO represents the flashcard data returned in responses.
 * It omits the `user_id` for security reasons.
 */
export type FlashcardDTO = Omit<Database["public"]["Tables"]["flashcards"]["Row"], "user_id">;

/**
 * Command model for creating a flashcard.
 * Derived from the database Insert type, omitting auto-generated fields.
 */
export type FlashcardCreateCommand = Omit<
  Database["public"]["Tables"]["flashcards"]["Insert"],
  "id" | "created_at" | "updated_at" | "user_id"
>;

/**
 * Command model for updating a flashcard.
 * It follows the same shape as the creation command as per API specification.
 */
export type FlashcardUpdateCommand = FlashcardCreateCommand;

/**
 * Command model for bulk creation of flashcards.
 */
export interface BulkFlashcardCreateCommand {
  flashcards: FlashcardCreateCommand[];
}

/**
 * Response DTO for listing flashcards.
 */
export interface ListFlashcardsResponseDTO {
  flashcards: FlashcardDTO[];
  pagination: PaginationDTO;
}

/**
 * GenerationDTO represents the generation record returned in responses.
 * It omits the `user_id` for security reasons.
 */
export type GenerationDTO = Omit<Database["public"]["Tables"]["generations"]["Row"], "user_id">;

/**
 * Command model for initiating AI flashcard generation.
 */
export interface GenerateFlashcardsCommand {
  text: string;
}

/**
 * FlashcardProposalDTO is used for proposals returned by the generation endpoint.
 * It includes only the essential fields for a flashcard proposal.
 */
export type FlashcardProposalDTO = Pick<FlashcardCreateCommand, "front" | "back" | "source">;

/**
 * GenerationResponseDTO is the response payload for the generation endpoint,
 * containing the generation record and an array of flashcard proposals.
 */
export interface GenerationResponseDTO {
  generation: GenerationDTO;
  flashcards_proposals: FlashcardProposalDTO[];
}

/**
 * Response DTO for listing generations.
 */
export interface ListGenerationsResponseDTO {
  generations: GenerationDTO[];
  pagination: PaginationDTO;
}

/**
 * GenerationDetailsResponseDTO is the response payload for detailed generation view,
 * including the generation record and associated flashcards.
 */
export interface GenerationDetailsResponseDTO {
  generation: GenerationDTO;
  flashcards: FlashcardDTO[];
}

/**
 * GenerationErrorLogDTO represents an error log related to flashcard generation.
 */
export type GenerationErrorLogDTO = Pick<
  Database["public"]["Tables"]["generation_error_logs"]["Row"],
  "id" | "model" | "error_code" | "error_message" | "created_at"
>;

/**
 * Response DTO for listing generation error logs.
 */
export interface GenerationErrorLogsResponseDTO {
  error_logs: GenerationErrorLogDTO[];
}
