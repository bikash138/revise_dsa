import { BrainCircuit } from "lucide-react";

import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  compact?: boolean;
  inverted?: boolean;
};

export function BrandMark({
  className,
  compact = false,
  inverted = false,
}: BrandMarkProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span
        className={cn(
          "grid size-10 place-items-center rounded-xl",
          inverted
            ? "bg-white text-[#10221b]"
            : "bg-[#163c2d] text-white",
        )}
      >
        <BrainCircuit className="size-5" strokeWidth={2.2} />
      </span>
      {compact ? null : (
        <div className="leading-none">
          <p
            className={cn(
              "text-base font-semibold tracking-tight",
              inverted ? "text-white" : "text-[#10221b]",
            )}
          >
            Revise DSA
          </p>
          <p
            className={cn(
              "mt-1 text-[10px] font-medium uppercase tracking-[0.2em]",
              inverted ? "text-white/50" : "text-neutral-500",
            )}
          >
            Practice with intent
          </p>
        </div>
      )}
    </div>
  );
}
