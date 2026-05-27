import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { supabase } from "@/lib/supabase";
import {
  getDefaultServicesPricingState,
  parseServicesPricingPayload,
  serializeServicesPricing,
  type InfoCardPersisted,
  type ServiceCategory,
  type ServicesPricingState,
} from "@/types/servicesPricing";

const SAVE_DEBOUNCE_MS = 850;

export type UseUserServicesPricingResult = {
  categories: ServiceCategory[];
  setCategories: Dispatch<SetStateAction<ServiceCategory[]>>;
  infoCards: InfoCardPersisted[];
  setInfoCards: Dispatch<SetStateAction<InfoCardPersisted[]>>;
  loaded: boolean;
  loading: boolean;
  saving: boolean;
  lastSavedAt: Date | null;
  loadError: string | null;
  saveError: string | null;
  flushSave: () => Promise<void>;
};

export function useUserServicesPricing(
  userId: string | undefined,
): UseUserServicesPricingResult {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [infoCards, setInfoCards] = useState<InfoCardPersisted[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(!!userId);
  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [canPersist, setCanPersist] = useState(false);

  const saveSeq = useRef(0);
  const pendingPayloadRef = useRef<string | null>(null);

  const performSave = useCallback(async (user: string, state: ServicesPricingState) => {
    const data = serializeServicesPricing(state);
    const mySeq = ++saveSeq.current;
    setSaving(true);
    setSaveError(null);
    const { error } = await supabase.from("user_services_pricing").upsert(
      {
        user_id: user,
        data,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
    if (saveSeq.current !== mySeq) return;
    setSaving(false);
    if (error) {
      setSaveError(error.message);
      return;
    }
    setLastSavedAt(new Date());
  }, []);

  const flushSave = useCallback(async () => {
    if (!userId || !loaded || !canPersist) return;
    await performSave(userId, { categories, infoCards });
  }, [userId, loaded, canPersist, categories, infoCards, performSave]);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setLoaded(false);
      setCanPersist(false);
      setCategories([]);
      setInfoCards([]);
      setLoadError(null);
      setSaveError(null);
      setLastSavedAt(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setLoaded(false);
    setCanPersist(false);
    setLoadError(null);
    setSaveError(null);

    void (async () => {
      const { data, error } = await supabase
        .from("user_services_pricing")
        .select("data, updated_at")
        .eq("user_id", userId)
        .maybeSingle();

      if (cancelled) return;
      setLoading(false);

      if (error) {
        setLoadError(error.message);
        const d = getDefaultServicesPricingState();
        setCategories(d.categories);
        setInfoCards(d.infoCards);
        setLoaded(true);
        return;
      }

      if (!data) {
        const d = getDefaultServicesPricingState();
        setCategories(d.categories);
        setInfoCards(d.infoCards);
        setCanPersist(true);
      } else {
        const parsed = parseServicesPricingPayload(data.data);
        if (!parsed) {
          setLoadError(
            "Saved services and pricing data could not be loaded safely. Refresh before editing.",
          );
          const d = getDefaultServicesPricingState();
          setCategories(d.categories);
          setInfoCards(d.infoCards);
          setLoaded(true);
          return;
        }
        setCategories(parsed.categories);
        setInfoCards(parsed.infoCards);
        setCanPersist(true);
        if (data.updated_at) {
          setLastSavedAt(new Date(data.updated_at as string));
        }
      }
      setLoaded(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  useEffect(() => {
    if (!userId || !loaded || !canPersist) return;

    const state: ServicesPricingState = { categories, infoCards };
    const key = JSON.stringify(serializeServicesPricing(state));
    pendingPayloadRef.current = key;

    const t = window.setTimeout(() => {
      if (pendingPayloadRef.current !== key) return;
      void performSave(userId, state);
    }, SAVE_DEBOUNCE_MS);

    return () => window.clearTimeout(t);
  }, [userId, loaded, canPersist, categories, infoCards, performSave]);

  return {
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
  };
}
