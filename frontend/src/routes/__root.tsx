import {
  Link,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { Palette } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

export interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});

const navLinkClass =
  "text-muted-foreground hover:text-foreground text-sm font-medium transition-colors";
const activeClass = "text-foreground";

function RootLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-border bg-background/80 sticky top-0 z-10 border-b backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Palette className="size-5" />
            <span>Palette Manager</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className={navLinkClass}
              activeProps={{ className: cn(navLinkClass, activeClass) }}
              activeOptions={{ exact: true }}
            >
              Compose
            </Link>
            <Link
              to="/palettes"
              className={navLinkClass}
              activeProps={{ className: cn(navLinkClass, activeClass) }}
            >
              Library
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <Outlet />
      </main>

      <Toaster richColors />
    </div>
  );
}
