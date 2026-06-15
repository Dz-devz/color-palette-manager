import { useCallback } from "react";
import { toast } from "sonner";

export function useCopyToClipboard() {
  return useCallback(async (text: string, label?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`Copied ${label ?? text}`);
    } catch {
      toast.error("Couldn't copy to clipboard");
    }
  }, []);
}
