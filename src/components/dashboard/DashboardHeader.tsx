import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ChevronDown, LogOut, Menu, Search, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cn } from "@/lib/utils";

type DashboardHeaderProps = {
  onMenuClick: () => void;
};

function getDisplayName(
  email: string | null | undefined,
  metadata?: Record<string, unknown> | null,
): string {
  const meta = (metadata ?? {}) as { full_name?: unknown; name?: unknown };
  if (typeof meta.full_name === "string" && meta.full_name.trim()) {
    return meta.full_name.trim();
  }
  if (typeof meta.name === "string" && meta.name.trim()) {
    return meta.name.trim();
  }
  if (email) {
    const local = email.split("@")[0];
    if (local) return local;
  }
  return "Account";
}

function getInitial(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  return trimmed.charAt(0).toUpperCase();
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const displayName = getDisplayName(
    user?.email,
    (user?.user_metadata ?? null) as Record<string, unknown> | null,
  );
  const email = user?.email ?? "";
  const initial = getInitial(displayName);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      navigate("/login", { replace: true });
    } finally {
      setSigningOut(false);
      setMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-neutral-300 transition-colors hover:bg-white/10 hover:text-foreground md:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="hidden min-w-0 flex-1 lg:flex">
          <div className="relative w-full max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
              aria-hidden
            />
            <input
              type="search"
              placeholder="Search calls, leads, bookings..."
              aria-label="Search"
              className="h-9 w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-foreground placeholder:text-neutral-500 transition-colors focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3 lg:flex-none">
          <StatusBadge variant="success" dot className="hidden sm:inline-flex">
            Pro · Active
          </StatusBadge>

          <button
            type="button"
            aria-label="Notifications"
            className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-neutral-300 transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <Bell className="h-4 w-4" />
            <span
              className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary"
              aria-hidden
            />
          </button>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-2 transition-colors hover:bg-white/10",
                menuOpen && "bg-white/10",
              )}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 text-xs font-semibold text-primary">
                {initial}
              </span>
              <span className="hidden max-w-[10rem] truncate text-sm text-neutral-200 sm:inline">
                {displayName}
              </span>
              <ChevronDown
                className={cn(
                  "hidden h-3.5 w-3.5 text-neutral-400 transition-transform sm:inline-block",
                  menuOpen && "rotate-180",
                )}
                aria-hidden
              />
            </button>

            {menuOpen ? (
              <div
                role="menu"
                className="absolute right-0 top-[calc(100%+8px)] w-64 overflow-hidden rounded-xl border border-white/10 bg-card shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
              >
                <div className="border-b border-white/5 px-3 py-3">
                  <p className="truncate text-sm font-medium text-foreground">
                    {displayName}
                  </p>
                  {email ? (
                    <p className="truncate text-xs text-neutral-400">{email}</p>
                  ) : null}
                </div>
                <div className="p-1">
                  <button
                    type="button"
                    role="menuitem"
                    disabled
                    className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-neutral-500"
                  >
                    <span className="flex items-center gap-2">
                      <Settings className="h-4 w-4" aria-hidden />
                      Settings
                    </span>
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-neutral-400">
                      Soon
                    </span>
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-200 transition-colors hover:bg-white/5 disabled:opacity-60"
                  >
                    <LogOut className="h-4 w-4" aria-hidden />
                    {signingOut ? "Signing out..." : "Sign out"}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
