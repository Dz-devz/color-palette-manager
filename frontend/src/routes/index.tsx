import { useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ListPlus } from "lucide-react";
import { colorsQuery } from "@/api/queries";
import { homeSearchSchema } from "@/lib/schemas";
import { useIsMobile } from "@/hooks/use-media-query";
import { useComposer } from "@/components/composer/hooks/use-composer";
import { useServerWaking } from "@/hooks/use-server-waking";
import { ServerWakingNotice } from "@/components/server-waking-notice";
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
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(colorsQuery);
  },
  component: ComposePage,
});

function ComposePage() {
  const { edit: editId, q } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const isMobile = useIsMobile();

  const colorsResult = useQuery(colorsQuery);
  const colors = useMemo(() => colorsResult.data ?? [], [colorsResult.data]);
  const isServerWaking = useServerWaking(colorsResult.isPending);

  const composer = useComposer({ editId, colors });

  function setQuery(next: string) {
    navigate({
      search: (prev) => ({ ...prev, q: next || undefined }),
      replace: true,
    });
  }

  const composerPanel = (
    <Composer
      name={composer.name}
      onNameChange={composer.setName}
      selected={composer.selected}
      onRemove={composer.removeColor}
      onReorder={composer.reorderColors}
      onClear={composer.resetComposer}
      onSave={composer.savePalette}
      isSaving={composer.isSaving}
      isEditing={composer.isEditing}
      onCancelEdit={composer.cancelEdit}
      error={composer.error}
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
        <div className="space-y-4">
          {isServerWaking && <ServerWakingNotice />}
          <CatalogSkeleton />
        </div>
      ) : colorsResult.isError ? (
        <p className="text-destructive text-sm">
          Failed to load colors: {colorsResult.error.message}
        </p>
      ) : isMobile ? (
        <>
          <ColorGrid
            colors={colors}
            selectedHexes={composer.selectedHexes}
            onToggle={composer.toggleColor}
            query={q ?? ""}
            onQueryChange={setQuery}
          />
          <MobileComposerDock count={composer.selected.length}>
            {composerPanel}
          </MobileComposerDock>
        </>
      ) : (
        <div className="grid grid-cols-[1fr_20rem] gap-6">
          <ColorGrid
            colors={colors}
            selectedHexes={composer.selectedHexes}
            onToggle={composer.toggleColor}
            query={q ?? ""}
            onQueryChange={setQuery}
          />
          <aside>
            <div className="sticky top-20">{composerPanel}</div>
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
