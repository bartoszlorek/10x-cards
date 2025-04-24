import { useState } from "react";
import type { FlashcardProposalDTO, GenerationResponseDTO } from "@/types";

interface UseGenerateFlashcardsResult {
  text: string;
  setText: (value: string) => void;
  loading: boolean;
  error: string | null;
  proposals: FlashcardProposalDTO[];
  generationId: number | null;
  isValidText: boolean;
  saving: boolean;
  handleGenerate: () => Promise<void>;
  handleAccept: (index: number) => void;
  handleReject: (index: number) => void;
  handleEdit: (proposal: FlashcardProposalDTO, index: number) => void;
  handleSaveAll: () => Promise<void>;
}

export function useGenerateFlashcards(): UseGenerateFlashcardsResult {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [proposals, setProposals] = useState<FlashcardProposalDTO[]>([]);
  const [generationId, setGenerationId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const handleTextChange = (value: string) => {
    setText(value);
    setError(null);
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data: GenerationResponseDTO = await response.json();
      setProposals(data.flashcards_proposals.map((proposal) => ({ ...proposal, isAccepted: false })));
      setGenerationId(data.generation.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = (index: number) => {
    setProposals((prevProposals: FlashcardProposalDTO[]) =>
      prevProposals.map((proposal: FlashcardProposalDTO, i: number) =>
        i === index ? { ...proposal, isAccepted: true } : proposal
      )
    );
  };

  const handleReject = (index: number) => {
    setProposals((prevProposals: FlashcardProposalDTO[]) =>
      prevProposals.map((proposal: FlashcardProposalDTO, i: number) =>
        i === index ? { ...proposal, isAccepted: false } : proposal
      )
    );
  };

  const handleEdit = (proposal: FlashcardProposalDTO, index: number) => {
    setProposals((prevProposals: FlashcardProposalDTO[]) =>
      prevProposals.map((p: FlashcardProposalDTO, i: number) => (i === index ? { ...proposal } : p))
    );
  };

  const handleSaveAll = async () => {
    const acceptedFlashcards = proposals.filter((p) => p.isAccepted);
    if (acceptedFlashcards.length === 0) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const response = await fetch("/api/flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          flashcards: acceptedFlashcards.map(({ isAccepted, ...flashcard }) => ({
            ...flashcard,
            generation_id: generationId,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      // Reset all necessary states after successful save
      setProposals([]);
      setText("");
      setGenerationId(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while saving flashcards");
    } finally {
      setSaving(false);
    }
  };

  const isValidText = text.length >= 1000 && text.length <= 10000;

  return {
    text,
    setText: handleTextChange,
    loading,
    error,
    proposals,
    generationId,
    isValidText,
    saving,
    handleGenerate,
    handleAccept,
    handleReject,
    handleEdit,
    handleSaveAll,
  };
}
