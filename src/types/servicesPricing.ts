import type { LucideIcon } from "lucide-react";
import {
  Scale,
  Building2,
  Shield,
  FileText,
} from "lucide-react";

export const SERVICES_PRICING_VERSION = 1;

export type ServicePackage = {
  id: string;
  name: string;
  price: string;
  duration: string;
};

export type ServiceFilm = {
  id: string;
  name: string;
  packages: ServicePackage[];
};

export type ServiceCategory = {
  id: string;
  name: string;
  icon: string;
  notes: string;
  films: ServiceFilm[];
};

/** Persisted info card (no React icon reference). */
export type InfoCardPersisted = {
  id: string;
  title: string;
  iconKey: InfoCardIconKey;
  content: string;
};

export type InfoCardIconKey = "scale" | "building2" | "shield" | "filetext";

export const INFO_CARD_ICON_KEYS: readonly InfoCardIconKey[] = [
  "scale",
  "building2",
  "shield",
  "filetext",
] as const;

const INFO_CARD_ICON_MAP: Record<InfoCardIconKey, LucideIcon> = {
  scale: Scale,
  building2: Building2,
  shield: Shield,
  filetext: FileText,
};

export function getInfoCardIcon(key: string): LucideIcon {
  if (key in INFO_CARD_ICON_MAP) {
    return INFO_CARD_ICON_MAP[key as InfoCardIconKey];
  }
  return FileText;
}

export function isInfoCardIconKey(k: string): k is InfoCardIconKey {
  return (INFO_CARD_ICON_KEYS as readonly string[]).includes(k);
}

export type ServicesPricingPayload = {
  version: number;
  categories: ServiceCategory[];
  infoCards: InfoCardPersisted[];
};

export type ServicesPricingState = {
  categories: ServiceCategory[];
  infoCards: InfoCardPersisted[];
};

const STANDARD_FILM_ID = "standard";

function singleFilmCategory(
  id: string,
  name: string,
  icon: string,
  notes: string,
  packages: ServicePackage[],
): ServiceCategory {
  return {
    id,
    name,
    icon,
    notes,
    films: [{ id: STANDARD_FILM_ID, name: "Standard", packages }],
  };
}

export function getDefaultServicesPricingState(): ServicesPricingState {
  return {
    categories: [
      singleFilmCategory("tinting", "Tinting", "🎨", "", [
        {
          id: "1",
          name: "standard film coupe 2 windows",
          price: "$100",
          duration: "1hr",
        },
        {
          id: "2",
          name: "standard film coupe full car",
          price: "$150",
          duration: "1hr 30min",
        },
        {
          id: "3",
          name: "standard film sedan 2 windows",
          price: "$100",
          duration: "1hr",
        },
        {
          id: "4",
          name: "standard film sedan full car",
          price: "$200",
          duration: "2hr",
        },
        {
          id: "5",
          name: "standard film suv 2 windows",
          price: "150-250",
          duration: "1hr",
        },
        {
          id: "6",
          name: "standard film suv full car",
          price: "250-350",
          duration: "2hr",
        },
        {
          id: "7",
          name: "standard film truck 2 windows",
          price: "150-200",
          duration: "1hr",
        },
        {
          id: "8",
          name: "standard film truck full vehicle",
          price: "$300",
          duration: "2hr",
        },
      ]),
      singleFilmCategory("ppf", "PPF", "🔵", "", []),
      singleFilmCategory("ceramic", "Ceramic", "✨", "", []),
      singleFilmCategory("detailing", "Detailing", "🟡", "", []),
      singleFilmCategory("wrap", "Wrap", "🔴", "", []),
      singleFilmCategory("other", "Other", "📦", "", []),
    ],
    infoCards: [
      {
        id: "tint-laws",
        title: "Tint Laws",
        iconKey: "scale",
        content:
          "Delaware tint laws: front windows no tint, back windows any darkness, no tint on windshield",
      },
      {
        id: "company-info",
        title: "Company Info",
        iconKey: "building2",
        content: "",
      },
      {
        id: "warranties",
        title: "Warranties",
        iconKey: "shield",
        content: "",
      },
      {
        id: "policies",
        title: "Policies",
        iconKey: "filetext",
        content: "",
      },
    ],
  };
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function parsePackage(v: unknown): ServicePackage | null {
  if (!isRecord(v)) return null;
  const { id, name, price, duration } = v;
  if (
    typeof id === "string" &&
    typeof name === "string" &&
    typeof price === "string" &&
    typeof duration === "string"
  ) {
    return { id, name, price, duration };
  }
  return null;
}

function parseFilm(v: unknown): ServiceFilm | null {
  if (!isRecord(v)) return null;
  const { id, name, packages: pkgs } = v;
  if (typeof id !== "string" || typeof name !== "string" || !Array.isArray(pkgs)) {
    return null;
  }
  const packages: ServicePackage[] = [];
  for (const p of pkgs) {
    const pkg = parsePackage(p);
    if (pkg) packages.push(pkg);
  }
  return { id, name, packages };
}

function parseCategory(v: unknown): ServiceCategory | null {
  if (!isRecord(v)) return null;
  const { id, name, icon, notes, films } = v;
  if (
    typeof id !== "string" ||
    typeof name !== "string" ||
    typeof icon !== "string" ||
    typeof notes !== "string" ||
    !Array.isArray(films)
  ) {
    return null;
  }
  const parsedFilms: ServiceFilm[] = [];
  for (const f of films) {
    const film = parseFilm(f);
    if (film) parsedFilms.push(film);
  }
  if (parsedFilms.length === 0) {
    parsedFilms.push({ id: STANDARD_FILM_ID, name: "Standard", packages: [] });
  }
  return { id, name, icon, notes, films: parsedFilms };
}

function parseInfoCard(v: unknown): InfoCardPersisted | null {
  if (!isRecord(v)) return null;
  const { id, title, iconKey, content } = v;
  if (
    typeof id !== "string" ||
    typeof title !== "string" ||
    typeof content !== "string" ||
    typeof iconKey !== "string"
  ) {
    return null;
  }
  const key: InfoCardIconKey = isInfoCardIconKey(iconKey) ? iconKey : "filetext";
  return { id, title, iconKey: key, content };
}

/** Parse DB jsonb into state; on any failure returns defaults. */
export function deserializeServicesPricing(raw: unknown): ServicesPricingState {
  const defaults = getDefaultServicesPricingState();
  if (!isRecord(raw)) return defaults;
  const version = raw.version;
  if (typeof version !== "number" || version < 1 || version > SERVICES_PRICING_VERSION) {
    return defaults;
  }
  const catsRaw = raw.categories;
  const cardsRaw = raw.infoCards;
  if (!Array.isArray(catsRaw) || !Array.isArray(cardsRaw)) return defaults;

  const categories: ServiceCategory[] = [];
  for (const c of catsRaw) {
    const cat = parseCategory(c);
    if (cat) categories.push(cat);
  }
  const infoCards: InfoCardPersisted[] = [];
  for (const c of cardsRaw) {
    const card = parseInfoCard(c);
    if (card) infoCards.push(card);
  }

  if (categories.length === 0 || infoCards.length === 0) return defaults;

  return { categories, infoCards };
}

export function serializeServicesPricing(state: ServicesPricingState): ServicesPricingPayload {
  return {
    version: SERVICES_PRICING_VERSION,
    categories: state.categories,
    infoCards: state.infoCards,
  };
}

export function infoCardIsSaved(card: InfoCardPersisted): boolean {
  return card.content.trim().length > 0;
}

export function categoryPackageCount(cat: ServiceCategory): number {
  return cat.films.reduce((n, f) => n + f.packages.length, 0);
}
