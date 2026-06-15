import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { palettesQuery } from "@/api/queries";
import { PaletteCard } from "@/components/library/palette-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/palettes")({
  loader: ({ context }) => context.queryClient.ensureQueryData(palettesQuery),
  component: LibraryPage,
});

function LibraryPage() {
  const { data: palettes, isPending, isError, error } = useQuery(palettesQuery);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Library</h1>
        <p className="text-muted-foreground text-sm">Your saved palettes.</p>
      </header>

      {isPending ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <p className="text-destructive text-sm">
          Failed to load palettes: {error.message}
        </p>
      ) : palettes.length === 0 ? (
        <div className="border-border rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground text-sm">
            No palettes yet, Compose one to get started.
          </p>
          <Button asChild className="mt-4">
            <Link to="/">Compose a palette</Link>
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {palettes.map((palette) => (
            <li key={palette.id}>
              <PaletteCard palette={palette} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
