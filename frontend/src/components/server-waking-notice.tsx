import { Loader2 } from "lucide-react";

export function ServerWakingNotice() {
  return (
    <div className="border-border text-muted-foreground flex items-center gap-3 rounded-lg border border-dashed p-4 text-sm">
      <Loader2 className="size-4 shrink-0 animate-spin" />
      <p>
        Waking up the server… the backend sleeps when idle, so the first load
        can take up to a minute.
      </p>
    </div>
  );
}
