import { Copy } from "lucide-react";
import { colorFormats, normalizeHex } from "@/lib/color";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CopyableSwatchProps {
  hex: string;
  name?: string;
  className?: string;
}

export function CopyableSwatch({ hex, name, className }: CopyableSwatchProps) {
  const copy = useCopyToClipboard();
  const formats = colorFormats(hex);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Copy ${name ?? hex}`}
          className={cn(
            "border-border/50 focus-visible:ring-ring size-8 rounded border transition hover:scale-105 focus-visible:ring-2 focus-visible:outline-none",
            className,
          )}
          style={{ background: hex }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel className="flex items-center gap-2">
          <span
            className="border-border/50 size-4 shrink-0 rounded-sm border"
            style={{ background: hex }}
          />
          <span className="truncate font-mono text-xs">
            {name ?? normalizeHex(hex)}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {formats.map((format) => (
          <DropdownMenuItem
            key={format.label}
            onClick={() => copy(format.value, format.value)}
          >
            <Copy className="size-3.5 shrink-0" />
            <span className="font-medium">{format.label}</span>
            <span className="text-muted-foreground ml-auto truncate font-mono text-xs whitespace-nowrap">
              {format.value}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
