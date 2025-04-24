import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { ChangeEvent } from "react";

interface TextInputAreaProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
}

export function TextInputArea({ value, onChange, disabled, invalid }: TextInputAreaProps) {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      <Textarea
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder="Enter your text here (1000-10000 characters)..."
        className={cn("min-h-[200px] resize-y", invalid && "border-destructive focus-visible:ring-destructive")}
      />
      {invalid && <p className="text-sm text-destructive">Text must be between 1000 and 10000 characters</p>}
    </div>
  );
}
