import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ClipboardList,
  Bot,
  Settings2,
  Users,
  PhoneOutgoing,
  History,
  MessageSquare,
  Home,
  CircleHelp,
  LogOut,
  Loader2,
  X,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

type NavItem = {
  label: string;
  to: string;
  icon: ComponentType<LucideProps>;
  queryParam?: string;
};

type NavSection = {
  label: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    label: "MAIN",
    items: [
      { label: "Overview", to: "/dashboard", icon: Home },
      { label: "Calendar", to: "/dashboard", icon: CalendarDays, queryParam: "view=calendar" },
      { label: "Bookings", to: "/dashboard", icon: ClipboardList, queryParam: "view=bookings" },
      { label: "Customers", to: "/dashboard", icon: Users, queryParam: "view=customers" },
    ],
  },
  {
    label: "MY AGENT",
    items: [
      { label: "Agent Settings", to: "/dashboard", icon: Bot, queryParam: "view=agent-settings" },
      { label: "Services & Pricing", to: "/dashboard", icon: Settings2, queryParam: "view=services-pricing" },
      { label: "Call History", to: "/calls", icon: History },
      { label: "Outbound Calls", to: "/dashboard", icon: PhoneOutgoing, queryParam: "view=outbound-calls" },
      { label: "Reminders", to: "/dashboard", icon: MessageSquare, queryParam: "view=reminders" },
    ],
  },
  {
    label: "SUPPORT",
    items: [
      { label: "Help & Info", to: "/dashboard", icon: CircleHelp, queryParam: "view=info" },
      { label: "Settings", to: "/dashboard", icon: Settings2, queryParam: "view=settings" },
    ],
  },
];

function isActive(
  pathname: string,
  search: string,
  to: string,
  queryParam?: string
): boolean {
  if (queryParam) {
    return pathname === to && search.includes(queryParam);
  }
  if (to === "/dashboard") {
    return pathname === "/dashboard" && !search.includes("view=");
  }
  return pathname === to || pathname.startsWith(`${to}/`);
}

function SidebarLogo() {
  return (
    <Link
      to="/dashboard"
      className="flex items-center gap-2 px-2"
      aria-label="CallBay dashboard home"
    >
      <span className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_12px_rgba(194,61,72,0.55)]" />
      <span className="text-base font-semibold tracking-tight">
        <span className="text-foreground">Call</span>
        <span className="text-primary">Bay</span>
      </span>
    </Link>
  );
}

type SidebarContentProps = {
  onNavigate?: () => void;
};

function SidebarContent({ onNavigate }: SidebarContentProps) {
  const { pathname, search } = useLocation();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      navigate("/login", { replace: true });
      onNavigate?.();
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#0b0b0b]">
      <div className="flex h-14 shrink-0 items-center border-b border-white/5 px-4">
        <SidebarLogo />
      </div>
      <nav
        className="flex-1 overflow-y-auto px-2.5 py-4"
        aria-label="Dashboard navigation"
      >
        <div className="space-y-5">
          {navSections.map((section) => (
            <section key={section.label} aria-labelledby={`sidebar-${section.label}`}>
              <p
                id={`sidebar-${section.label}`}
                className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500"
              >
                {section.label}
              </p>
              <ul className="flex flex-col gap-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(pathname, search, item.to, item.queryParam);
                  const href = item.queryParam
                    ? `${item.to}?${item.queryParam}`
                    : item.to;
                  return (
                    <li key={`${section.label}-${item.label}`}>
                      <Link
                        to={href}
                        onClick={onNavigate}
                        className={cn(
                          "group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium transition-colors",
                          active
                            ? "bg-primary/15 text-white shadow-[inset_3px_0_0_rgba(194,61,72,0.95)]"
                            : "text-neutral-400 hover:bg-white/5 hover:text-primary",
                        )}
                        aria-current={active ? "page" : undefined}
                      >
                        <Icon
                          className={cn(
                            "h-3.5 w-3.5 shrink-0 transition-colors",
                            active
                              ? "text-primary"
                              : "text-neutral-500 group-hover:text-primary",
                          )}
                          aria-hidden
                        />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </nav>
      <div className="border-t border-white/5 p-2.5">
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="group flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium text-neutral-400 transition-colors hover:bg-white/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {signingOut ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin group-hover:text-primary" aria-hidden />
          ) : (
            <LogOut className="h-3.5 w-3.5 group-hover:text-primary" aria-hidden />
          )}
          <span>{signingOut ? "Signing out..." : "Sign Out"}</span>
        </button>
      </div>
    </div>
  );
}

type DashboardSidebarProps = {
  mobileOpen: boolean;
  onMobileClose: () => void;
};

export function DashboardSidebar({
  mobileOpen,
  onMobileClose,
}: DashboardSidebarProps) {
  return (
    <>
      <aside className="hidden w-56 shrink-0 border-r border-white/10 bg-[#0b0b0b] md:block">
        <div className="sticky top-0 h-dvh">
          <SidebarContent />
        </div>
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-50 md:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={onMobileClose}
          className={cn(
            "absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-200",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={cn(
            "absolute left-0 top-0 h-full w-72 max-w-[85vw] border-r border-white/10 bg-[#0b0b0b] shadow-[0_24px_60px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Dashboard menu"
        >
          <button
            type="button"
            onClick={onMobileClose}
            aria-label="Close menu"
            className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-300 transition-colors hover:bg-white/10 hover:text-primary"
          >
            <X className="h-4 w-4" />
          </button>
          <SidebarContent onNavigate={onMobileClose} />
        </div>
      </div>
    </>
  );
}
