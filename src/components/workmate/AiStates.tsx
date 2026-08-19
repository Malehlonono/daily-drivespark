import { Loader2, Sparkles, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AI_REVIEW_LABEL } from "@/lib/ai/prompts";

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="grid place-items-center rounded-xl border border-dashed border-border bg-card/60 p-10 text-center">
      <Sparkles className="mb-3 size-6 text-muted-foreground" aria-hidden="true" />
      <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="grid place-items-center rounded-xl border border-border bg-card p-10 text-center">
      <Loader2 className="mb-3 size-6 animate-spin text-primary" aria-hidden="true" />
      <p className="text-sm font-medium text-foreground">AI is processing your request...</p>
      <p className="mt-1 text-xs text-muted-foreground">This usually takes a few seconds.</p>
    </div>
  );
}

export function ErrorState({ onRetry, detail }: { onRetry: () => void; detail?: string }) {
  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
      <TriangleAlert className="mx-auto mb-3 size-6 text-destructive" aria-hidden="true" />
      <p className="text-sm font-medium text-foreground">
        We couldn&apos;t generate a response right now. Please try again.
      </p>
      {detail ? <p className="mt-1 text-xs text-muted-foreground">{detail}</p> : null}
      <Button className="mt-4" variant="outline" onClick={onRetry}>
        Try Again
      </Button>
    </div>
  );
}

export function AiDisclaimer() {
  return (
    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Sparkles className="size-3.5" aria-hidden="true" />
      {AI_REVIEW_LABEL}
    </p>
  );
}
