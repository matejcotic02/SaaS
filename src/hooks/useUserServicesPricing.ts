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
  deserializeServicesPricingResult,
  getDefaultServicesPricingState,
  serializeServicesPricing,
  type InfoCardPersisted,
  type ServiceCategory,
  type ServicesPricingState,
} from "@/types/servicesPricing";

const SAVE_DEBOUNCE_MS = 850;
const PARSE_FALLBACK_ERROR =
  "Saved services data could not be read. Cloud sync is paused to avoid overwriting it.";

type SaveRequest = {
  user: string;
  data: ReturnType<typeof serializeServicesPricing>;
  key: string;
};

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

  const pendingPayloadRef = useRef<string | null>(null);
  const lastPersistedPayloadRef = useRef<string | null>(null);
  const loadedUserIdRef = useRef<string | null>(null);
  const saveQueueRef = useRef<SaveRequest | null>(null);
  const saveDrainPromiseRef = useRef<Promise<void> | null>(null);

  const drainSaveQueue = useCallback(() => {
    if (saveDrainPromiseRef.current) {
      return saveDrainPromiseRef.current;
    }

    const promise = (async () => {
      setSaving(true);
      try {
        while (saveQueueRef.current) {
          const request = saveQueueRef.current;
          saveQueueRef.current = null;
          setSaveError(null);

          const { error } = await supabase.from("user_services_pricing").upsert(
            {
              user_id: request.user,
              data: request.data,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" },
          );

          if (error) {
            if (!saveQueueRef.current) {
              saveQueueRef.current = request;
            }
            setSaveError(error.message);
            return;
          }

          lastPersistedPayloadRef.current = request.key;
          setLastSavedAt(new Date());
        }
      } finally {
        saveDrainPromiseRef.current = null;
        setSaving(false);
      }
    })();

    saveDrainPromiseRef.current = promise;
    return promise;
  }, []);

  const performSave = useCallback(async (user: string, state: ServicesPricingState) => {
    const data = serializeServicesPricing(state);
    const key = JSON.stringify(data);
    saveQueueRef.current = { user, data, key };
    await drainSaveQueue();
  }, [drainSaveQueue]);

  const rememberLoadedState = useCallback((state: ServicesPricingState) => {
    const key = JSON.stringify(serializeServicesPricing(state));
    lastPersistedPayloadRef.current = key;
    pendingPayloadRef.current = null;
  }, []);

  const flushSave = useCallback(async () => {
    if (!userId || !loaded || loadedUserIdRef.current !== userId || loadError) return;
    await performSave(userId, { categories, infoCards });
  }, [userId, loaded, loadError, categories, infoCards, performSave]);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setLoaded(false);
      setCategories([]);
      setInfoCards([]);
      setLoadError(null);
      setSaveError(null);
      setSaving(false);
      saveQueueRef.current = null;
      pendingPayloadRef.current = null;
      lastPersistedPayloadRef.current = null;
      loadedUserIdRef.current = null;
      return;
    }

    let cancelled = false;
    setLoaded(false);
    setLoading(true);
    setLoadError(null);
    setSaveError(null);
    setLastSavedAt(null);
    saveQueueRef.current = null;
    pendingPayloadRef.current = null;
    lastPersistedPayloadRef.current = null;
    loadedUserIdRef.current = null;

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
        rememberLoadedState(d);
        loadedUserIdRef.current = userId;
        setCategories(d.categories);
        setInfoCards(d.infoCards);
        setLoaded(true);
        return;
      }

      if (!data) {
        const d = getDefaultServicesPricingState();
        rememberLoadedState(d);
        loadedUserIdRef.current = userId;
        setCategories(d.categories);
        setInfoCards(d.infoCards);
      } else {
        const parsed = deserializeServicesPricingResult(data.data);
        rememberLoadedState(parsed.state);
        loadedUserIdRef.current = userId;
        setCategories(parsed.state.categories);
        setInfoCards(parsed.state.infoCards);
        if (parsed.usedFallback) {
          setLoadError(PARSE_FALLBACK_ERROR);
        }
        if (data.updated_at) {
          setLastSavedAt(new Date(data.updated_at as string));
        }
      }
      setLoaded(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, rememberLoadedState]);

  useEffect(() => {
    if (!userId || !loaded || loadedUserIdRef.current !== userId || loadError) return;

    const state: ServicesPricingState = { categories, infoCards };
    const key = JSON.stringify(serializeServicesPricing(state));
    if (key === lastPersistedPayloadRef.current) return;

    pendingPayloadRef.current = key;

    const t = window.setTimeout(() => {
      if (pendingPayloadRef.current !== key) return;
      void performSave(userId, state);
    }, SAVE_DEBOUNCE_MS);

    return () => window.clearTimeout(t);
  }, [userId, loaded, loadError, categories, infoCards, performSave]);

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
