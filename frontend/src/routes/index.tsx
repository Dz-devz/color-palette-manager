import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ListPlus } from "lucide-react";
import { colorsQuery, paletteQuery, palettesQuery } from "@/api/queries";
import { createPalette, updatePalette } from "@/api/palettes";
import {
  homeSearchSchema,
  paletteInputSchema,
  type Color,
  type PaletteInput,
} from "@/lib/schemas";
import { useIsMobile } from "@/hooks/use-media-query";
import { ColorGrid } from "@/components/catalog/color-grid";
import { Composer } from "@/components/composer/composer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export const Route = createFileRoute("/")({
  validateSearch: homeSearchSchema,
  // Prefetch the colors compose data
  loader: ({ context }) => context.queryClient.ensureQueryData(colorsQuery),
  component: ComposePage,
});

function ComposePage() {
  const { edit: editId, q } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

  const colorsResult = useQuery(colorsQuery);
  const colors = useMemo(() => colorsResult.data ?? [], [colorsResult.data]);

  const editPalette = useQuery({
    ...paletteQuery(editId ?? 0),
    enabled: editId !== undefined,
  });

  const [name, setName] = useState("");
  const [selected, setSelected] = useState<Color[]>([]);
  const [error, setError] = useState<string | null>(null);

  const colorByHex = useMemo(() => {
    const map = new Map<string, Color>();
    for (const color of colors) map.set(color.hex.toLowerCase(), color);
    return map;
  }, [colors]);

  const seededId = useRef<number | null>(null);
  useEffect(() => {
    if (editId === undefined) {
      seededId.current = null;
      return;
    }
    if (editPalette.data && seededId.current !== editId) {
      setName(editPalette.data.name);
      setSelected(
        editPalette.data.colors.map(
          (hex) =>
            colorByHex.get(hex.toLowerCase()) ?? {
              id: -1,
              name: hex,
              code: "",
              hex,
            },
        ),
      );
      setError(null);
      seededId.current = editId;
    }
  }, [editId, editPalette.data, colorByHex]);

  const selectedHexes = useMemo(
    () => new Set(selected.map((c) => c.hex.toLowerCase())),
    [selected],
  );

  function toggleColor(color: Color) {
    setSelected((prev) =>
      prev.some((c) => c.hex.toLowerCase() === color.hex.toLowerCase())
        ? prev.filter((c) => c.hex.toLowerCase() !== color.hex.toLowerCase())
        : [...prev, color],
    );
  }

  function removeColor(hex: string) {
    setSelected((prev) =>
      prev.filter((c) => c.hex.toLowerCase() !== hex.toLowerCase()),
    );
  }

  function reorderColors(next: Color[]) {
    setSelected(next);
  }

  function resetComposer() {
    setName("");
    setSelected([]);
    setError(null);
  }

  function setQuery(next: string) {
    navigate({
      search: (prev) => ({ ...prev, q: next || undefined }),
      replace: true,
    });
  }

  function cancelEdit() {
    seededId.current = null;
    resetComposer();
    navigate({ search: (prev) => ({ ...prev, edit: undefined }) });
  }

  const createMutation = useMutation({
    mutationFn: createPalette,
    onSuccess: (palette) => {
      queryClient.invalidateQueries({ queryKey: palettesQuery.queryKey });
      toast.success(`Created “${palette.name}”`);
      resetComposer();
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: PaletteInput }) =>
      updatePalette(id, input),
    onSuccess: (palette) => {
      queryClient.invalidateQueries({ queryKey: palettesQuery.queryKey });
      queryClient.invalidateQueries({
        queryKey: paletteQuery(palette.id).queryKey,
      });
      toast.success(`Updated “${palette.name}”`);
      seededId.current = null;
      resetComposer();
      navigate({ to: "/palettes" });
    },
    onError: (err) => toast.error(err.message),
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  function handleSave() {
    const parsed = paletteInputSchema.safeParse({
      name,
      colors: selected.map((c) => c.hex),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid palette");
      return;
    }
    setError(null);
    if (editId !== undefined) {
      updateMutation.mutate({ id: editId, input: parsed.data });
    } else {
      createMutation.mutate(parsed.data);
    }
  }

  const composer = (
    <Composer
      name={name}
      onNameChange={setName}
      selected={selected}
      onRemove={removeColor}
      onReorder={reorderColors}
      onClear={resetComposer}
      onSave={handleSave}
      isSaving={isSaving}
      isEditing={editId !== undefined}
      onCancelEdit={cancelEdit}
      error={error}
    />
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Compose</h1>
        <p className="text-muted-foreground text-sm">
          Pick colors from the catalog to build a palette.
        </p>
      </header>

      {colorsResult.isPending ? (
        <CatalogSkeleton />
      ) : colorsResult.isError ? (
        <p className="text-destructive text-sm">
          Failed to load colors: {colorsResult.error.message}
        </p>
      ) : isMobile ? (
        <>
          <ColorGrid
            colors={colors}
            selectedHexes={selectedHexes}
            onToggle={toggleColor}
            query={q ?? ""}
            onQueryChange={setQuery}
          />
          <MobileComposerDock count={selected.length}>
            {composer}
          </MobileComposerDock>
        </>
      ) : (
        <div className="grid grid-cols-[1fr_20rem] gap-6">
          <ColorGrid
            colors={colors}
            selectedHexes={selectedHexes}
            onToggle={toggleColor}
            query={q ?? ""}
            onQueryChange={setQuery}
          />
          <aside>
            <div className="sticky top-20">{composer}</div>
          </aside>
        </div>
      )}
    </div>
  );
}

function MobileComposerDock({
  count,
  children,
}: {
  count: number;
  children: React.ReactNode;
}) {
  return (
    <Drawer>
      <div className="border-border bg-background/95 fixed inset-x-0 bottom-0 z-10 border-t p-3 backdrop-blur">
        <DrawerTrigger asChild>
          <Button className="w-full" size="lg">
            <ListPlus className="size-4" />
            Review &amp; save
            {count > 0 && (
              <span className="bg-primary-foreground/20 ml-1 rounded-full px-2 py-0.5 text-xs">
                {count}
              </span>
            )}
          </Button>
        </DrawerTrigger>
      </div>
      <DrawerContent>
        <DrawerHeader className="sr-only">
          <DrawerTitle>Palette composer</DrawerTitle>
          <DrawerDescription>
            Name your palette and review selected colors.
          </DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto p-4">{children}</div>
      </DrawerContent>
    </Drawer>
  );
}

function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-lg" />
      ))}
    </div>
  );
}
