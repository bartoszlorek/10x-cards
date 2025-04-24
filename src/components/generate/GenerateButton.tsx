import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

interface GenerateButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  children?: ReactNode;
}

export function GenerateButton({ onClick, disabled, loading, children }: GenerateButtonProps) {
  return (
    <Button onClick={onClick} disabled={disabled} className="min-w-[120px]">
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {children || "Generating..."}
        </>
      ) : (
        children || "Generate"
      )}
    </Button>
  );
}
