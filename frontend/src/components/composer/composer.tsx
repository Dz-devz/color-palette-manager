import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SortablePalette } from "@/components/composer/sortable-palette";
import type { Color } from "@/lib/schemas";

interface ComposerProps {
  name: string;
  onNameChange: (name: string) => void;
  selected: Color[];
  onRemove: (hex: string) => void;
  onReorder: (next: Color[]) => void;
  onClear: () => void;
  onSave: () => void;
  isSaving: boolean;
  isEditing: boolean;
  onCancelEdit: () => void;
  error: string | null;
}

export function Composer({
  name,
  onNameChange,
  selected,
  onRemove,
  onReorder,
  onClear,
  onSave,
  isSaving,
  isEditing,
  onCancelEdit,
  error,
}: ComposerProps) {
  const canSave = name.trim().length > 0 && selected.length > 0 && !isSaving;

  return (
    <div className="border-border bg-card space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">
          {isEditing ? "Edit palette" : "New palette"}
        </h2>
        <span className="text-muted-foreground text-xs">
          {selected.length} color{selected.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="palette-name">Name</Label>
        <Input
          id="palette-name"
          placeholder="e.g. Sunset"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
        />
      </div>

      {selected.length === 0 ? (
        <p className="text-muted-foreground rounded-md border border-dashed p-3 text-center text-sm">
          Tap colors in the catalog to add them here.
        </p>
      ) : (
        <SortablePalette
          selected={selected}
          onRemove={onRemove}
          onReorder={onReorder}
        />
      )}

      {error && <p className="text-destructive text-sm">{error}</p>}

      <div className="flex items-center gap-2">
        <Button onClick={onSave} disabled={!canSave} className="flex-1">
          {isSaving ? "Saving…" : isEditing ? "Save changes" : "Create palette"}
        </Button>
        {isEditing ? (
          <Button variant="outline" onClick={onCancelEdit} disabled={isSaving}>
            Cancel
          </Button>
        ) : (
          selected.length > 0 && (
            <Button variant="ghost" onClick={onClear} disabled={isSaving}>
              Clear
            </Button>
          )
        )}
      </div>
    </div>
  );
}
