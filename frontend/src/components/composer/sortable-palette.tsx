import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import type { Color } from "@/lib/schemas";
import { cn } from "@/lib/utils";

interface SortablePaletteProps {
  selected: Color[];
  onRemove: (hex: string) => void;
  onReorder: (next: Color[]) => void;
}

/**
 * The working palette as a drag-to-reorder list of color chips. Each chip's
 * hex is its sortable id (selection guarantees uniqueness). Dragging is done
 * via a grip handle so the remove button stays independently clickable.
 */
export function SortablePalette({
  selected,
  onRemove,
  onReorder,
}: SortablePaletteProps) {
  const sensors = useSensors(
    // A small drag threshold keeps taps/clicks from starting a drag.
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const from = selected.findIndex((c) => c.hex === active.id);
    const to = selected.findIndex((c) => c.hex === over.id);
    if (from === -1 || to === -1) return;

    onReorder(arrayMove(selected, from, to));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={selected.map((c) => c.hex)}
        strategy={horizontalListSortingStrategy}
      >
        <ul className="flex flex-wrap gap-2">
          {selected.map((color) => (
            <SortableChip key={color.hex} color={color} onRemove={onRemove} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

interface SortableChipProps {
  color: Color;
  onRemove: (hex: string) => void;
}

function SortableChip({ color, onRemove }: SortableChipProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: color.hex });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "border-border bg-card flex items-center gap-1 rounded-full border py-1 pr-1 pl-1 text-xs",
        isDragging && "z-10 opacity-60 shadow-sm",
      )}
    >
      <button
        type="button"
        className="text-muted-foreground hover:text-foreground cursor-grab touch-none active:cursor-grabbing"
        aria-label={`Drag ${color.name}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-3.5" />
      </button>
      <span className="size-4 rounded-full" style={{ background: color.hex }} />
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
  );
}
