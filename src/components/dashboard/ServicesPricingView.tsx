import { useState } from "react";
import {
  DollarSign,
  Plus,
  GripVertical,
  Clock,
  Pencil,
  Trash2,
  Check,
  ChevronDown,
  ChevronUp,
  Expand,
  Info,
  Scale,
  Building2,
  Shield,
  FileText,
  Sparkles,
} from "lucide-react";
import { toast } from "@/components/shared/Toaster";
import { cn } from "@/lib/utils";

type ServicePackage = {
  id: string;
  name: string;
  price: string;
  duration: string;
};

type ServiceCategory = {
  id: string;
  name: string;
  icon: string;
  packages: ServicePackage[];
  notes: string;
};

type InfoCard = {
  id: string;
  title: string;
  icon: typeof Scale;
  content: string;
  saved: boolean;
};

const INITIAL_CATEGORIES: ServiceCategory[] = [
  {
    id: "tinting",
    name: "Tinting",
    icon: "🎨",
    notes: "",
    packages: [
      { id: "1", name: "standard film coupe 2 windows", price: "$100", duration: "1hr" },
      { id: "2", name: "standard film coupe full car", price: "$150", duration: "1hr 30min" },
      { id: "3", name: "standard film sedan 2 windows", price: "$100", duration: "1hr" },
      { id: "4", name: "standard film sedan full car", price: "$200", duration: "2hr" },
      { id: "5", name: "standard film suv 2 windows", price: "150-250", duration: "1hr" },
      { id: "6", name: "standard film suv full car", price: "250-350", duration: "2hr" },
      { id: "7", name: "standard film truck 2 windows", price: "150-200", duration: "1hr" },
      { id: "8", name: "standard film truck full vehicle", price: "$300", duration: "2hr" },
    ],
  },
  { id: "ppf", name: "PPF", icon: "🔵", notes: "", packages: [] },
  { id: "ceramic", name: "Ceramic", icon: "✨", notes: "", packages: [] },
  { id: "detailing", name: "Detailing", icon: "🟡", notes: "", packages: [] },
  { id: "wrap", name: "Wrap", icon: "🔴", notes: "", packages: [] },
  { id: "other", name: "Other", icon: "📦", notes: "", packages: [] },
];

const INITIAL_INFO_CARDS: InfoCard[] = [
  {
    id: "tint-laws",
    title: "Tint Laws",
    icon: Scale,
    content: "Delaware tint laws: front windows no tint, back windows any darkness, no tint on windshield",
    saved: true,
  },
  {
    id: "company-info",
    title: "Company Info",
    icon: Building2,
    content: "",
    saved: false,
  },
  {
    id: "warranties",
    title: "Warranties",
    icon: Shield,
    content: "",
    saved: false,
  },
  {
    id: "policies",
    title: "Policies",
    icon: FileText,
    content: "",
    saved: false,
  },
];

export function ServicesPricingView() {
  const [activeCategory, setActiveCategory] = useState("tinting");
  const [categories, setCategories] = useState<ServiceCategory[]>(INITIAL_CATEGORIES);
  const [expandedNotes, setExpandedNotes] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [activeFilm, setActiveFilm] = useState("standard");
  const [infoCards] = useState<InfoCard[]>(INITIAL_INFO_CARDS);

  const currentCategory = categories.find((c) => c.id === activeCategory);

  const handleDeletePackage = (packageId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === activeCategory
          ? { ...cat, packages: cat.packages.filter((p) => p.id !== packageId) }
          : cat
      )
    );
    toast("Package removed", {
      description: "The service package has been deleted.",
    });
  };

  const handleAddPackage = () => {
    const newPackage: ServicePackage = {
      id: String(Date.now()),
      name: "New package",
      price: "$0",
      duration: "1hr",
    };
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === activeCategory
          ? { ...cat, packages: [...cat.packages, newPackage] }
          : cat
      )
    );
    toast("Package added successfully!", {
      description: "Edit the package details to customize it.",
    });
  };

  const handleEditPackage = (_packageId: string) => {
    toast("Edit mode", {
      description: "Package editing will be available in a future update.",
    });
  };

  const handleNotesChange = (notes: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === activeCategory ? { ...cat, notes } : cat
      )
    );
  };

  const handleInfoCardClick = (_cardId: string) => {
    toast("Info card editing", {
      description: "Card editing will be available in a future update.",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" aria-hidden />
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Services & Pricing
          </h1>
        </div>
        <p className="mt-1 text-sm text-neutral-400">
          Organize your services by category and film type. Add packages with
          pricing and duration.
        </p>
      </header>

      <section className="rounded-2xl border border-white/10 bg-card shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
        <div className="flex flex-wrap items-center gap-2 border-b border-white/5 px-4 py-3 sm:px-5">
          {categories.map((cat) => {
            const isActive = cat.id === activeCategory;
            const count = cat.packages.length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white/10 text-foreground"
                    : "text-neutral-400 hover:bg-white/5 hover:text-foreground"
                )}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                {count > 0 && (
                  <span
                    className={cn(
                      "ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold",
                      isActive
                        ? "bg-primary text-white"
                        : "bg-white/10 text-neutral-300"
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
              {currentCategory?.name.toUpperCase()} NOTES & INSTRUCTIONS
            </p>
            <button
              type="button"
              onClick={() => setExpandedNotes(!expandedNotes)}
              className="flex items-center gap-1 text-xs text-primary hover:text-primary-hover"
            >
              <Expand className="h-3 w-3" />
              {expandedNotes ? "Collapse" : "Expand"}
            </button>
          </div>
          <textarea
            value={currentCategory?.notes || ""}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder={`Add any special instructions or notes for ${currentCategory?.name}...`}
            rows={expandedNotes ? 6 : 3}
            className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-foreground placeholder:text-neutral-500 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
          />
          <p className="mt-1.5 text-xs text-neutral-500">
            Example: Ask about existing tint...
          </p>
        </div>

        <div className="border-t border-white/5">
          <button
            type="button"
            onClick={() => setAdvancedOpen(!advancedOpen)}
            className="flex w-full items-center justify-between px-4 py-3 text-sm text-neutral-400 transition-colors hover:bg-white/[0.02] sm:px-5"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Advanced Settings
            </span>
            {advancedOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {advancedOpen && (
            <div className="border-t border-white/5 px-4 py-4 sm:px-5">
              <p className="text-sm text-neutral-500">
                Advanced settings for {currentCategory?.name} will be available
                here. Configure custom pricing rules, appointment buffers, and
                more.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-card shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
        <div className="border-b border-white/5 px-4 py-3 sm:px-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
            FILMS / PRODUCTS
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveFilm("standard")}
              className={cn(
                "rounded-md px-4 py-2 text-sm font-medium transition-colors",
                activeFilm === "standard"
                  ? "bg-primary text-white"
                  : "bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-foreground"
              )}
            >
              Standard
            </button>
            <button
              type="button"
              onClick={() =>
                toast("Add Film", {
                  description: "Film type management coming soon.",
                })
              }
              className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-neutral-400 transition-colors hover:bg-white/5 hover:text-foreground"
            >
              <Plus className="h-4 w-4" />
              Add Film
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <p className="text-xs font-medium text-neutral-400">Standard Packages</p>

          <div className="mt-3 space-y-2">
            {currentCategory?.packages.map((pkg) => (
              <div
                key={pkg.id}
                className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-3 transition-colors hover:bg-white/[0.04]"
              >
                <GripVertical
                  className="h-4 w-4 shrink-0 cursor-grab text-neutral-600"
                  aria-hidden
                />
                <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                  {pkg.name}
                </span>
                <span className="shrink-0 text-sm font-medium text-foreground">
                  {pkg.price}
                </span>
                <span className="flex shrink-0 items-center gap-1 text-xs text-neutral-400">
                  <Clock className="h-3 w-3" />
                  {pkg.duration}
                </span>
                <button
                  type="button"
                  onClick={() => handleEditPackage(pkg.id)}
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-white/10 hover:text-foreground"
                  aria-label={`Edit ${pkg.name}`}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeletePackage(pkg.id)}
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                  aria-label={`Delete ${pkg.name}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}

            {currentCategory?.packages.length === 0 && (
              <div className="rounded-lg border border-dashed border-white/10 px-4 py-8 text-center">
                <p className="text-sm text-neutral-500">
                  No packages yet. Add your first package below.
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddPackage}
            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/10 py-2.5 text-sm font-medium text-neutral-400 transition-colors hover:border-white/20 hover:bg-white/[0.02] hover:text-foreground"
          >
            <Plus className="h-4 w-4" />
            Add Package to Standard
          </button>
        </div>

        <div className="border-t border-white/5 bg-emerald-500/5 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">
              Synced to Agent
            </span>
          </div>
          <p className="mt-0.5 text-xs text-neutral-500">
            Agent knowledge is up to date
          </p>
        </div>

        <div className="border-t border-white/5 px-4 py-3 sm:px-5">
          <p className="text-xs text-neutral-500">
            <span className="font-medium text-neutral-400">How it works:</span>{" "}
            When customers call, the AI uses these packages to quote prices and
            find available time slots based on duration.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-card p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] sm:p-6">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" aria-hidden />
          <h2 className="text-sm font-semibold text-foreground">
            Additional Information
          </h2>
        </div>
        <p className="mt-1 text-xs text-neutral-400">
          Add helpful info like tint laws, warranties, and policies for your AI
          agent to reference.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {infoCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => handleInfoCardClick(card.id)}
                className={cn(
                  "flex items-start gap-3 rounded-xl border px-4 py-4 text-left transition-colors",
                  card.saved
                    ? "border-primary/30 bg-primary/5 hover:bg-primary/10"
                    : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    card.saved
                      ? "bg-primary/20 text-primary"
                      : "bg-white/5 text-neutral-400"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {card.title}
                    </span>
                    {card.saved && (
                      <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">
                        Saved
                      </span>
                    )}
                  </div>
                  {card.content && (
                    <p className="mt-1 line-clamp-2 text-xs text-neutral-400">
                      {card.content}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
