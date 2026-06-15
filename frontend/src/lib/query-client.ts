import { QueryClient } from "@tanstack/react-query";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

// How long a cached entry is kept and how long a persisted copy stays valid.
// gcTime must be at least PERSIST_MAX_AGE, otherwise entries get garbage
// collected before they can be restored from storage on the next load.
export const PERSIST_MAX_AGE = 1000 * 60 * 60 * 24; // 24 hours

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      gcTime: PERSIST_MAX_AGE,
    },
  },
});

// Writes the cache to localStorage so a reload (or a brief backend outage)
// still shows the last known catalog and palettes instead of an error.
export const persister = createSyncStoragePersister({
  storage: window.localStorage,
});
