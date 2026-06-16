import { useEffect, useState } from "react";

// The backend spins down when idle (free tier), so the first request after a cold starts.
const WAKEUP_DELAY_MS = 4000;

export function useServerWaking(isPending: boolean): boolean {
  const [isWaking, setIsWaking] = useState(false);

  // Reset during render when a loading
  const [wasPending, setWasPending] = useState(isPending);
  if (isPending !== wasPending) {
    setWasPending(isPending);
    if (!isPending) setIsWaking(false);
  }

  useEffect(() => {
    if (!isPending) return;

    const timer = setTimeout(() => setIsWaking(true), WAKEUP_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isPending]);

  return isWaking;
}
