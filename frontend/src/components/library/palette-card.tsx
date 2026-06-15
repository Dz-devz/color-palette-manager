import { Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Copy, Pencil, Trash2 } from "lucide-react";
import { deletePalette } from "@/api/palettes";
import { palettesQuery } from "@/api/queries";
import type { Palette } from "@/lib/schemas";
import { COLOR_FORMATS, formatColor, normalizeHex } from "@/lib/color";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { CopyableSwatch } from "@/components/color/copyable-swatch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PaletteCardProps {
  palette: Palette;
}

export function PaletteCard({ palette }: PaletteCardProps) {
  const queryClient = useQueryClient();
  const copy = useCopyToClipboard();
  const count = palette.colors.length;

  function copyAll(label: (typeof COLOR_FORMATS)[number]) {
    const values = palette.colors.map((hex) => formatColor(hex, label));
    copy(
      values.join(", "),
      `${count} color${count === 1 ? "" : "s"} as ${label}`,
    );
  }

  const deleteMutation = useMutation({
    mutationFn: () => deletePalette(palette.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: palettesQuery.queryKey });
      toast.success(`Deleted “${palette.name}”`);
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <div className="border-border flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 space-y-2">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium">{palette.name}</p>
          <Badge variant="secondary">{palette.colors.length}</Badge>
        </div>
        <ul className="flex flex-wrap gap-2">
          {palette.colors.map((hex, index) => (
            <li
              key={`${hex}-${index}`}
              className="flex flex-col items-center gap-1"
            >
              <CopyableSwatch hex={hex} />
              <span className="text-muted-foreground font-mono text-[11px] tracking-wide uppercase">
                {normalizeHex(hex)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex shrink-0 gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Copy className="size-4" />
              Copy all
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Copy all as…</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {COLOR_FORMATS.map((label) => (
              <DropdownMenuItem key={label} onClick={() => copyAll(label)}>
                <Copy className="size-3.5 shrink-0" />
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button asChild variant="outline" size="sm">
          <Link to="/" search={{ edit: palette.id }}>
            <Pencil className="size-4" />
            Edit
          </Link>
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="size-4" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete “{palette.name}”?</AlertDialogTitle>
              <AlertDialogDescription>
                This permanently removes the palette. This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteMutation.isPending}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(event) => {
                  event.preventDefault();
                  deleteMutation.mutate();
                }}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting…" : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
