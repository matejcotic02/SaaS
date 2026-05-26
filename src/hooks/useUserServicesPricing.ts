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
  serializeServicesPricing,
  tryDeserializeServicesPricing,
  type InfoCardPersisted,
  type ServiceCategory,
  type ServicesPricingState,
} from "@/types/servicesPricing";

const SAVE_DEBOUNCE_MS = 850;
const UNSAFE_LOAD_MESSAGE =
  "Cloud services & pricing could not be loaded safely. Refresh before editing to avoid overwriting saved data.";

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

  const saveSeq = useRef(0);
  const pendingPayloadRef = useRef<string | null>(null);
  const lastPersistedPayloadRef = useRef<string | null>(null);
  const persistenceEnabledRef = useRef(false);

  const performSave = useCallback(async (user: string, state: ServicesPricingState) => {
    const data = serializeServicesPricing(state);
    const payloadKey = JSON.stringify(data);
    const mySeq = ++saveSeq.current;
    setSaving(true);
    setSaveError(null);

    try {
      const { error } = await supabase.from("user_services_pricing").upsert(
        {
          user_id: user,
          data,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );
      if (saveSeq.current !== mySeq) return;
      if (error) {
        setSaveError(error.message);
        return;
      }
      lastPersistedPayloadRef.current = payloadKey;
      setLastSavedAt(new Date());
    } catch (error) {
      if (saveSeq.current !== mySeq) return;
      setSaveError(error instanceof Error ? error.message : "Save failed.");
    } finally {
      if (saveSeq.current === mySeq) {
        setSaving(false);
      }
    }
  }, []);

  const flushSave = useCallback(async () => {
    if (!userId || !loaded || !persistenceEnabledRef.current) return;
    const state: ServicesPricingState = { categories, infoCards };
    const key = JSON.stringify(serializeServicesPricing(state));
    if (lastPersistedPayloadRef.current === key) return;
    await performSave(userId, state);
  }, [userId, loaded, categories, infoCards, performSave]);

  useEffect(() => {
    saveSeq.current += 1;
    persistenceEnabledRef.current = false;
    lastPersistedPayloadRef.current = null;
    pendingPayloadRef.current = null;
    setLoaded(false);
    setSaving(false);
    setSaveError(null);
    setLastSavedAt(null);

    if (!userId) {
      setLoading(false);
      setCategories([]);
      setInfoCards([]);
      setLoadError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setLoadError(null);

    void (async () => {
      const { data, error } = await supabase
        .from("user_services_pricing")
        .select("data, updated_at")
        .eq("user_id", userId)
        .maybeSingle();

      if (cancelled) return;
      setLoading(false);

      if (error) {
        setLoadError(error.message || UNSAFE_LOAD_MESSAGE);
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
        persistenceEnabledRef.current = true;
      } else {
        const parsed = tryDeserializeServicesPricing(data.data);
        if (!parsed) {
          setLoadError(UNSAFE_LOAD_MESSAGE);
          const d = getDefaultServicesPricingState();
          setCategories(d.categories);
          setInfoCards(d.infoCards);
          setLoaded(true);
          return;
        }
        setCategories(parsed.categories);
        setInfoCards(parsed.infoCards);
        lastPersistedPayloadRef.current = JSON.stringify(serializeServicesPricing(parsed));
        persistenceEnabledRef.current = true;
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
    if (!userId || !loaded || !persistenceEnabledRef.current) return;

    const state: ServicesPricingState = { categories, infoCards };
    const key = JSON.stringify(serializeServicesPricing(state));
    if (lastPersistedPayloadRef.current === key) return;
    pendingPayloadRef.current = key;

    const t = window.setTimeout(() => {
      if (pendingPayloadRef.current !== key) return;
      void performSave(userId, state);
    }, SAVE_DEBOUNCE_MS);

    return () => window.clearTimeout(t);
  }, [userId, loaded, categories, infoCards, performSave]);

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
