import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { paletteQuery, palettesQuery } from "@/api/queries";
import { createPalette, updatePalette } from "@/api/palettes";
import {
  paletteInputSchema,
  type Color,
  type PaletteInput,
} from "@/lib/schemas";

interface UseComposerOptions {
  editId: number | undefined;
  colors: Color[];
}

export interface ComposerController {
  name: string;
  setName: (name: string) => void;
  selected: Color[];
  selectedHexes: Set<string>;
  error: string | null;
  isEditing: boolean;
  isSaving: boolean;
  toggleColor: (color: Color) => void;
  removeColor: (hex: string) => void;
  reorderColors: (next: Color[]) => void;
  resetComposer: () => void;
  cancelEdit: () => void;
  savePalette: () => void;
}

export function useComposer({
  editId,
  colors,
}: UseComposerOptions): ComposerController {
  const navigate = useNavigate({ from: "/" });
  const queryClient = useQueryClient();

  // Load the palette being edited so we can seed the form from it.
  const editPalette = useQuery({
    ...paletteQuery(editId ?? 0),
    enabled: editId !== undefined,
  });

  const [name, setName] = useState("");
  const [selected, setSelected] = useState<Color[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Mapping the colors by hex
  const colorByHex = useMemo(() => {
    const map = new Map<string, Color>();
    for (const color of colors) map.set(color.hex.toLowerCase(), color);
    return map;
  }, [colors]);

  // Seed the composer from the palette being edited (once per edit id).
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

  function savePalette() {
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

  return {
    name,
    setName,
    selected,
    selectedHexes,
    error,
    isEditing: editId !== undefined,
    isSaving: createMutation.isPending || updateMutation.isPending,
    toggleColor,
    removeColor,
    reorderColors,
    resetComposer,
    cancelEdit,
    savePalette,
  };
}
