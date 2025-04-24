import type { FlashcardProposalDTO } from "@/types";
import { FlashcardProposalItem } from "./FlashcardProposalItem";

interface FlashcardsProposalListProps {
  proposals: FlashcardProposalDTO[];
  onAccept: (index: number) => void;
  onEdit: (proposal: FlashcardProposalDTO, index: number) => void;
  onReject: (index: number) => void;
}

export function FlashcardsProposalList({ proposals, onAccept, onEdit, onReject }: FlashcardsProposalListProps) {
  if (proposals.length === 0) {
    return null;
  }

  const handleEdit = (edited: FlashcardProposalDTO, index: number) => {
    onEdit(edited, index);
  };

  return (
    <div className="mt-8 space-y-4">
      <h2 className="text-xl font-semibold">Generated Flashcards</h2>
      <div className="space-y-4">
        {proposals.map((proposal, index) => (
          <FlashcardProposalItem
            key={index}
            proposal={proposal}
            isAccepted={proposal.isAccepted ?? false}
            onAccept={() => onAccept(index)}
            onEdit={(edited) => handleEdit(edited, index)}
            onReject={() => onReject(index)}
          />
        ))}
      </div>
    </div>
  );
}
