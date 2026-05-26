import { useEffect, useState } from "react";
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
  Sparkles,
  Loader2,
  X,
} from "lucide-react";
import { toast } from "@/components/shared/Toaster";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { PlasticButton } from "@/components/ui/plastic-button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useUserServicesPricing } from "@/hooks/useUserServicesPricing";
import {
  categoryPackageCount,
  getInfoCardIcon,
  infoCardIsSaved,
  INFO_CARD_ICON_KEYS,
  type InfoCardIconKey,
  type InfoCardPersisted,
  type ServiceCategory,
  type ServiceFilm,
  type ServicePackage,
} from "@/types/servicesPricing";

function updateCategoryFilmPackages(
  categories: ServiceCategory[],
  categoryId: string,
  filmId: string,
  fn: (packages: ServicePackage[]) => ServicePackage[],
): ServiceCategory[] {
  return categories.map((cat) => {
    if (cat.id !== categoryId) return cat;
    return {
      ...cat,
      films: cat.films.map((f) =>
        f.id === filmId ? { ...f, packages: fn(f.packages) } : f,
      ),
    };
  });
}

function updateCategoryFilms(
  categories: ServiceCategory[],
  categoryId: string,
  fn: (films: ServiceFilm[]) => ServiceFilm[],
): ServiceCategory[] {
  return categories.map((cat) =>
    cat.id === categoryId ? { ...cat, films: fn(cat.films) } : cat,
  );
}

type PackageEditModalProps = {
  open: boolean;
  initial: ServicePackage | null;
  onSave: (pkg: ServicePackage) => void;
  onCancel: () => void;
};

function PackageEditModal({ open, initial, onSave, onCancel }: PackageEditModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    if (open && initial) {
      setName(initial.name);
      setPrice(initial.price);
      setDuration(initial.duration);
    }
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open || !initial) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pkg-edit-title"
    >
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div
        className={cn(
          "relative z-[101] w-full max-w-md rounded-2xl border border-white/10 bg-card p-5 shadow-[0_24px_60px_rgba(0,0,0,0.5)]",
        )}
      >
        <h2 id="pkg-edit-title" className="text-base font-semibold text-foreground">
          Edit package
        </h2>
        <div className="mt-4 space-y-3">
          <label className="block">
            <span className="text-xs font-medium text-neutral-400">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-neutral-400">Price</span>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-neutral-400">Duration</span>
            <input
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </label>
        </div>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <PlasticButton variant="secondary" size="sm" onClick={onCancel} className="!w-auto">
            Cancel
          </PlasticButton>
          <PlasticButton
            variant="primary"
            size="sm"
            className="!w-auto"
            onClick={() =>
              onSave({
                ...initial,
                name: name.trim() || initial.name,
                price: price.trim() || initial.price,
                duration: duration.trim() || initial.duration,
              })
            }
          >
            Save
          </PlasticButton>
        </div>
      </div>
    </div>
  );
}

type InfoCardEditModalProps = {
  open: boolean;
  initial: InfoCardPersisted | null;
  onSave: (card: InfoCardPersisted) => void;
  onCancel: () => void;
};

const ICON_KEY_LABEL: Record<InfoCardIconKey, string> = {
  scale: "Scale (laws)",
  building2: "Building (company)",
  shield: "Shield (warranty)",
  filetext: "Document (policies)",
};

function InfoCardEditModal({ open, initial, onSave, onCancel }: InfoCardEditModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [iconKey, setIconKey] = useState<InfoCardIconKey>("filetext");

  useEffect(() => {
    if (open && initial) {
      setTitle(initial.title);
      setContent(initial.content);
      setIconKey(initial.iconKey);
    }
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open || !initial) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="info-edit-title"
    >
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative z-[101] w-full max-w-md rounded-2xl border border-white/10 bg-card p-5 shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
        <h2 id="info-edit-title" className="text-base font-semibold text-foreground">
          Edit information
        </h2>
        <div className="mt-4 space-y-3">
          <label className="block">
            <span className="text-xs font-medium text-neutral-400">Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-neutral-400">Icon</span>
            <select
              value={iconKey}
              onChange={(e) => setIconKey(e.target.value as InfoCardIconKey)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
            >
              {INFO_CARD_ICON_KEYS.map((k) => (
                <option key={k} value={k}>
                  {ICON_KEY_LABEL[k]}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-medium text-neutral-400">Content</span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="mt-1 w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
              placeholder="Details your AI agent should know…"
            />
          </label>
        </div>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <PlasticButton variant="secondary" size="sm" onClick={onCancel} className="!w-auto">
            Cancel
          </PlasticButton>
          <PlasticButton
            variant="primary"
            size="sm"
            className="!w-auto"
            onClick={() =>
              onSave({
                ...initial,
                title: title.trim() || initial.title,
                content,
                iconKey,
              })
            }
          >
            Save
          </PlasticButton>
        </div>
      </div>
    </div>
  );
}

export function ServicesPricingView() {
  const { user } = useAuth();
  const {
    categories,
    setCategories,
    infoCards,
    setInfoCards,
    loaded,
    loading,
    saving,
    lastSavedAt,
    loadError,
    saveError,
    flushSave,
  } = useUserServicesPricing(user?.id);

  const [activeCategory, setActiveCategory] = useState("tinting");
  const [activeFilm, setActiveFilm] = useState("standard");
  const [expandedNotes, setExpandedNotes] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [newFilmName, setNewFilmName] = useState("");
  const [packageEditor, setPackageEditor] = useState<ServicePackage | null>(null);
  const [infoEditor, setInfoEditor] = useState<InfoCardPersisted | null>(null);
  const [filmDeleteTarget, setFilmDeleteTarget] = useState<{
    film: ServiceFilm;
  } | null>(null);

  const currentCategory = categories.find((c) => c.id === activeCategory);
  const currentFilm = currentCategory?.films.find((f) => f.id === activeFilm);

  useEffect(() => {
    const cat = categories.find((c) => c.id === activeCategory);
    if (!cat || cat.films.length === 0) return;
    setActiveFilm((prev) =>
      cat.films.some((f) => f.id === prev) ? prev : cat.films[0].id,
    );
  }, [activeCategory, categories]);

  useEffect(() => {
    if (!saveError) return;
    toast("Could not save", { description: saveError });
  }, [saveError]);

  const handleDeletePackage = (packageId: string) => {
    setCategories((prev) =>
      updateCategoryFilmPackages(prev, activeCategory, activeFilm, (pkgs) =>
        pkgs.filter((p) => p.id !== packageId),
      ),
    );
    toast("Package removed", {
      description: "The service package has been deleted.",
    });
  };

  const handleAddPackage = () => {
    const newPackage: ServicePackage = {
      id: crypto.randomUUID(),
      name: "New package",
      price: "$0",
      duration: "1hr",
    };
    setCategories((prev) =>
      updateCategoryFilmPackages(prev, activeCategory, activeFilm, (pkgs) => [
        ...pkgs,
        newPackage,
      ]),
    );
    toast("Package added", {
      description: "Edit the package details to customize it.",
    });
  };

  const handleMovePackage = (packageId: string, delta: -1 | 1) => {
    setCategories((prev) =>
      updateCategoryFilmPackages(prev, activeCategory, activeFilm, (pkgs) => {
        const i = pkgs.findIndex((p) => p.id === packageId);
        if (i < 0) return pkgs;
        const j = i + delta;
        if (j < 0 || j >= pkgs.length) return pkgs;
        const next = [...pkgs];
        [next[i], next[j]] = [next[j], next[i]];
        return next;
      }),
    );
  };

  const handleNotesChange = (notes: string) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === activeCategory ? { ...cat, notes } : cat)),
    );
  };

  const handleAddFilm = () => {
    const name = newFilmName.trim();
    if (!name) {
      toast("Name required", { description: "Enter a film or product line name." });
      return;
    }
    const id = crypto.randomUUID();
    setCategories((prev) =>
      updateCategoryFilms(prev, activeCategory, (films) => [
        ...films,
        { id, name, packages: [] },
      ]),
    );
    setActiveFilm(id);
    setNewFilmName("");
    toast("Film added", { description: `${name} is ready for packages.` });
  };

  const confirmRemoveFilm = () => {
    if (!filmDeleteTarget || !currentCategory) return;
    const { film } = filmDeleteTarget;
    setCategories((prev) =>
      updateCategoryFilms(prev, activeCategory, (films) =>
        films.filter((f) => f.id !== film.id),
      ),
    );
    if (activeFilm === film.id) {
      const remaining = currentCategory.films.filter((f) => f.id !== film.id);
      setActiveFilm(remaining[0]?.id ?? "standard");
    }
    setFilmDeleteTarget(null);
    toast("Film removed", { description: `${film.name} was deleted.` });
  };

  const requestRemoveFilm = (film: ServiceFilm) => {
    if (currentCategory && currentCategory.films.length <= 1) return;
    if (film.packages.length > 0) {
      setFilmDeleteTarget({ film });
      return;
    }
    setCategories((prev) =>
      updateCategoryFilms(prev, activeCategory, (films) =>
        films.filter((f) => f.id !== film.id),
      ),
    );
    if (activeFilm === film.id) {
      const remaining =
        currentCategory?.films.filter((f) => f.id !== film.id) ?? [];
      setActiveFilm(remaining[0]?.id ?? "standard");
    }
    toast("Film removed", { description: `${film.name} was deleted.` });
  };

  const saveStatusLine = () => {
    if (loadError) {
      return "Cloud load failed. Refresh before editing to protect saved pricing.";
    }
    if (!loaded || loading) return "Loading your services…";
    if (saveError) return "Save failed. Check your connection and try again.";
    if (saving) return "Saving…";
    if (lastSavedAt) {
      return `Saved ${lastSavedAt.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}`;
    }
    return "Changes save automatically.";
  };

  if (!user) {
    return (
      <p className="text-sm text-neutral-400">Sign in to manage services and pricing.</p>
    );
  }

  if (loading && !loaded) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-neutral-400">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
        <p className="text-sm">Loading services & pricing…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PackageEditModal
        open={!!packageEditor}
        initial={packageEditor}
        onCancel={() => setPackageEditor(null)}
        onSave={(pkg) => {
          setCategories((prev) =>
            updateCategoryFilmPackages(prev, activeCategory, activeFilm, (pkgs) =>
              pkgs.map((p) => (p.id === pkg.id ? pkg : p)),
            ),
          );
          setPackageEditor(null);
          toast("Package updated", { description: "Changes will sync to the cloud." });
        }}
      />

      <InfoCardEditModal
        open={!!infoEditor}
        initial={infoEditor}
        onCancel={() => setInfoEditor(null)}
        onSave={(card) => {
          setInfoCards((prev) => prev.map((c) => (c.id === card.id ? card : c)));
          setInfoEditor(null);
          toast("Information updated", { description: "Saved to your account." });
        }}
      />

      <ConfirmDialog
        open={!!filmDeleteTarget}
        title="Delete this film?"
        description={`${filmDeleteTarget?.film.name} has ${filmDeleteTarget?.film.packages.length} package(s). This cannot be undone.`}
        confirmLabel="Delete film"
        cancelLabel="Cancel"
        destructive
        onConfirm={confirmRemoveFilm}
        onCancel={() => setFilmDeleteTarget(null)}
      />

      <header>
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" aria-hidden />
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Services & Pricing
          </h1>
        </div>
        <p className="mt-1 text-sm text-neutral-400">
          Organize your services by category and film type. Add packages with pricing and
          duration. Changes sync to your account automatically.
        </p>
      </header>

      <section className="rounded-2xl border border-white/10 bg-card shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
        <div className="flex flex-wrap items-center gap-2 border-b border-white/5 px-4 py-3 sm:px-5">
          {categories.map((cat) => {
            const isActive = cat.id === activeCategory;
            const count = categoryPackageCount(cat);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white/10 text-foreground"
                    : "text-neutral-400 hover:bg-white/5 hover:text-foreground",
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
                        : "bg-white/10 text-neutral-300",
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
                Advanced settings for {currentCategory?.name} will be available here.
                Configure custom pricing rules, appointment buffers, and more.
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
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {currentCategory?.films.map((film) => {
              const isActive = film.id === activeFilm;
              const canRemove = (currentCategory?.films.length ?? 0) > 1;
              return (
                <div key={film.id} className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => setActiveFilm(film.id)}
                    className={cn(
                      "rounded-md px-4 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-white"
                        : "bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-foreground",
                    )}
                  >
                    {film.name}
                  </button>
                  {canRemove ? (
                    <button
                      type="button"
                      onClick={() => requestRemoveFilm(film)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-white/10 hover:text-foreground"
                      aria-label={`Remove ${film.name}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                </div>
              );
            })}
            <div className="flex min-w-[12rem] flex-1 flex-wrap items-center gap-2 sm:flex-initial">
              <input
                value={newFilmName}
                onChange={(e) => setNewFilmName(e.target.value)}
                placeholder="New film name"
                className="min-w-[8rem] flex-1 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-neutral-500 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 sm:max-w-[200px]"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddFilm();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddFilm}
                className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-neutral-400 transition-colors hover:bg-white/5 hover:text-foreground"
              >
                <Plus className="h-4 w-4" />
                Add Film
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <p className="text-xs font-medium text-neutral-400">
            {currentFilm ? `${currentFilm.name} packages` : "Packages"}
          </p>

          <div className="mt-3 space-y-2">
            {currentFilm?.packages.map((pkg, idx, arr) => (
              <div
                key={pkg.id}
                className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-2 py-2 transition-colors hover:bg-white/[0.04] sm:gap-3 sm:px-3 sm:py-3"
              >
                <div className="flex shrink-0 flex-col gap-0.5">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMovePackage(pkg.id, -1)}
                    className="rounded p-0.5 text-neutral-500 hover:bg-white/10 hover:text-foreground disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === arr.length - 1}
                    onClick={() => handleMovePackage(pkg.id, 1)}
                    className="rounded p-0.5 text-neutral-500 hover:bg-white/10 hover:text-foreground disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>
                <GripVertical
                  className="hidden h-4 w-4 shrink-0 text-neutral-600 sm:block"
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
                  onClick={() => setPackageEditor(pkg)}
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

            {currentFilm?.packages.length === 0 && (
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
            {currentFilm ? `Add package to ${currentFilm.name}` : "Add package"}
          </button>
        </div>

        <div className="border-t border-white/5 bg-emerald-500/5 px-4 py-3 sm:px-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin text-emerald-400" aria-hidden />
              ) : saveError ? (
                <X className="h-4 w-4 text-amber-400" aria-hidden />
              ) : (
                <Check className="h-4 w-4 text-emerald-400" aria-hidden />
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  saveError ? "text-amber-400" : "text-emerald-400",
                )}
              >
                {saveError ? "Save issue" : saving ? "Saving…" : "Cloud sync"}
              </span>
            </div>
            {saveError ? (
              <button
                type="button"
                onClick={() => void flushSave()}
                className="text-xs font-medium text-primary hover:underline"
              >
                Retry save
              </button>
            ) : null}
          </div>
          <p className="mt-0.5 text-xs text-neutral-500">{saveStatusLine()}</p>
        </div>

        <div className="border-t border-white/5 px-4 py-3 sm:px-5">
          <p className="text-xs text-neutral-500">
            <span className="font-medium text-neutral-400">How it works:</span> When
            customers call, the AI uses these packages to quote prices and find available
            time slots based on duration.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-card p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] sm:p-6">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" aria-hidden />
          <h2 className="text-sm font-semibold text-foreground">Additional Information</h2>
        </div>
        <p className="mt-1 text-xs text-neutral-400">
          Add helpful info like tint laws, warranties, and policies for your AI agent to
          reference.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {infoCards.map((card) => {
            const Icon = getInfoCardIcon(card.iconKey);
            const saved = infoCardIsSaved(card);
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => setInfoEditor(card)}
                className={cn(
                  "flex items-start gap-3 rounded-xl border px-4 py-4 text-left transition-colors",
                  saved
                    ? "border-primary/30 bg-primary/5 hover:bg-primary/10"
                    : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]",
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    saved ? "bg-primary/20 text-primary" : "bg-white/5 text-neutral-400",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{card.title}</span>
                    {saved ? (
                      <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">
                        Saved
                      </span>
                    ) : null}
                  </div>
                  {card.content ? (
                    <p className="mt-1 line-clamp-2 text-xs text-neutral-400">
                      {card.content}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-neutral-500">Tap to add details…</p>
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
