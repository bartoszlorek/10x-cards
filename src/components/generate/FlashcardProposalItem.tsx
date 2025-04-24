import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { FlashcardProposalDTO } from "@/types";
import type { ChangeEvent } from "react";

interface FlashcardProposalItemProps {
  proposal: FlashcardProposalDTO;
  isAccepted?: boolean;
  onAccept: () => void;
  onEdit: (edited: FlashcardProposalDTO) => void;
  onReject: () => void;
}

export function FlashcardProposalItem({
  proposal,
  isAccepted = false,
  onAccept,
  onEdit,
  onReject,
}: FlashcardProposalItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedFront, setEditedFront] = useState(proposal.front);
  const [editedBack, setEditedBack] = useState(proposal.back);

  const handleSaveEdit = () => {
    onEdit({
      ...proposal,
      front: editedFront,
      back: editedBack,
      source: "ai-edited",
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedFront(proposal.front);
    setEditedBack(proposal.back);
    setIsEditing(false);
  };

  const handleFrontChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setEditedFront(e.target.value);
  };

  const handleBackChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setEditedBack(e.target.value);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="front" className="text-sm font-medium block">
                Front
              </label>
              <Textarea id="front" value={editedFront} onChange={handleFrontChange} className="mt-1" />
            </div>
            <div>
              <label htmlFor="back" className="text-sm font-medium block">
                Back
              </label>
              <Textarea id="back" value={editedBack} onChange={handleBackChange} className="mt-1" />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium">Front</div>
              <div className="mt-1 whitespace-pre-wrap">{proposal.front}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Back</div>
              <div className="mt-1 whitespace-pre-wrap">{proposal.back}</div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-end space-x-2">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save</Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={onReject}>
              Reject
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
            {isAccepted ? (
              <Button className="bg-green-600 hover:bg-green-600/90" disabled>
                Accepted
              </Button>
            ) : (
              <Button onClick={onAccept}>Accept</Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
}
