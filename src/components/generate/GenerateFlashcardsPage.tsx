import { Card, CardContent } from "@/components/ui/card";
import { TextInputArea } from "./TextInputArea";
import { GenerateButton } from "./GenerateButton";
import { FlashcardsProposalList } from "./FlashcardsProposalList";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { useGenerateFlashcards } from "./hooks/useGenerateFlashcards";

export function GenerateFlashcardsPage() {
  const {
    text,
    setText,
    loading,
    error,
    proposals,
    isValidText,
    saving,
    handleGenerate,
    handleAccept,
    handleReject,
    handleEdit,
    handleSaveAll,
  } = useGenerateFlashcards();

  if (loading) {
    return <LoadingSkeleton />;
  }

  const acceptedCount = proposals.filter((p) => p.isAccepted).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <TextInputArea value={text} onChange={setText} disabled={loading || saving} invalid={!isValidText} />
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">{text.length} / 10000 characters</div>
            <GenerateButton onClick={handleGenerate} disabled={!isValidText || loading || saving} loading={loading} />
          </div>
          {error && <div className="mt-4 text-sm text-destructive">{error}</div>}
        </CardContent>
      </Card>

      <FlashcardsProposalList
        proposals={proposals}
        onAccept={handleAccept}
        onEdit={handleEdit}
        onReject={handleReject}
      />

      {acceptedCount > 0 && (
        <div className="flex justify-end">
          <GenerateButton onClick={handleSaveAll} disabled={saving} loading={saving}>
            Save {acceptedCount} Flashcard{acceptedCount === 1 ? "" : "s"}
          </GenerateButton>
        </div>
      )}
    </div>
  );
}
