import { z } from "zod";

/**
 * Validation schema for the generate flashcards command.
 * Requires a text field between 1000 and 10000 characters.
 */
export const generateFlashcardsSchema = z.object({
  text: z
    .string({
      required_error: "Text content is required",
    })
    .min(1000, "Text must be at least 1000 characters long")
    .max(10000, "Text cannot exceed 10000 characters"),
});

export type GenerateFlashcardsInput = z.infer<typeof generateFlashcardsSchema>;
