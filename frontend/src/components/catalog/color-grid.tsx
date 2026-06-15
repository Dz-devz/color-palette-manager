import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Color } from "@/lib/schemas";

interface ColorGridProps {
  colors: Color[];
  selectedHexes: Set<string>;
  onToggle: (color: Color) => void;
  query: string;
  onQueryChange: (query: string) => void;
}

export function ColorGrid({
  colors,
  selectedHexes,
  onToggle,
  query,
  onQueryChange,
}: ColorGridProps) {
  const needle = query.trim().toLowerCase();
  const filtered = needle
    ? colors.filter(
        (c) =>
          c.name.toLowerCase().includes(needle) ||
          c.hex.toLowerCase().includes(needle),
      )
    : colors;

  return (
    <div className="space-y-4">
      <Input
        type="search"
        placeholder="Search colors by name or hex…"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No colors match “{query}”.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {filtered.map((color) => (
            <ColorSwatch
              key={color.id}
              color={color}
              selected={selectedHexes.has(color.hex.toLowerCase())}
              onToggle={() => onToggle(color)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ColorSwatchProps {
  color: Color;
  selected: boolean;
  onToggle: () => void;
}

function ColorSwatch({ color, selected, onToggle }: ColorSwatchProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      aria-label={`${selected ? "Remove" : "Add"} ${color.name}`}
      className={cn(
        "group border-border focus-visible:ring-ring relative overflow-hidden rounded-lg border text-left transition focus-visible:ring-2 focus-visible:outline-none",
        selected && "ring-primary ring-2",
      )}
    >
      <div className="relative h-14 w-full" style={{ background: color.hex }}>
        {selected && (
          <span className="bg-primary text-primary-foreground absolute top-1 right-1 flex size-5 items-center justify-center rounded-full">
            <Check className="size-3" />
          </span>
        )}
      </div>
      <div className="p-2">
        <p className="truncate text-xs font-medium">{color.name}</p>
        <p className="text-muted-foreground text-[11px] tracking-wide uppercase">
          {color.hex}
        </p>
      </div>
    </button>
  );
}
