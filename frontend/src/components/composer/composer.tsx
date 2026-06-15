import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Color } from "@/lib/schemas";

interface ComposerProps {
  name: string;
  onNameChange: (name: string) => void;
  selected: Color[];
  onRemove: (hex: string) => void;
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
        <ul className="flex flex-wrap gap-2">
          {selected.map((color) => (
            <li
              key={color.hex}
              className="border-border flex items-center gap-1.5 rounded-full border py-1 pr-1 pl-1.5 text-xs"
            >
              <span
                className="size-4 rounded-full"
                style={{ background: color.hex }}
              />
              <span className="font-medium">{color.name}</span>
              <button
                type="button"
                onClick={() => onRemove(color.hex)}
                aria-label={`Remove ${color.name}`}
                className="hover:bg-muted rounded-full p-0.5"
              >
                <X className="size-3" />
              </button>
            </li>
          ))}
        </ul>
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
