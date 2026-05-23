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
  deserializeServicesPricing,
  getDefaultServicesPricingState,
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
  const [categories, setCategoriesState] = useState<ServiceCategory[]>([]);
  const [infoCards, setInfoCardsState] = useState<InfoCardPersisted[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(!!userId);
  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const pendingPayloadRef = useRef<string | null>(null);
  const lastPersistedPayloadRef = useRef<string | null>(null);
  const dirtyRef = useRef(false);
  const saveInFlightRef = useRef(false);
  const saveRequestedRef = useRef(false);
  const mountedRef = useRef(false);
  const userIdRef = useRef(userId);
  const loadedRef = useRef(loaded);
  const latestStateRef = useRef<ServicesPricingState>({ categories: [], infoCards: [] });
  const latestPayloadRef = useRef(
    JSON.stringify(serializeServicesPricing(latestStateRef.current)),
  );

  latestStateRef.current = { categories, infoCards };
  latestPayloadRef.current = JSON.stringify(
    serializeServicesPricing(latestStateRef.current),
  );
  userIdRef.current = userId;
  loadedRef.current = loaded;

  const hydrateState = useCallback((state: ServicesPricingState) => {
    setCategoriesState(state.categories);
    setInfoCardsState(state.infoCards);
    dirtyRef.current = false;
    pendingPayloadRef.current = null;
  }, []);

  const drainSaves = useCallback(async () => {
    if (saveInFlightRef.current) {
      saveRequestedRef.current = true;
      return;
    }

    saveInFlightRef.current = true;
    if (mountedRef.current) {
      setSaving(true);
      setSaveError(null);
    }

    try {
      while (true) {
        saveRequestedRef.current = false;

        const user = userIdRef.current;
        if (!user || !loadedRef.current || !dirtyRef.current) {
          break;
        }

        const state = latestStateRef.current;
        const data = serializeServicesPricing(state);
        const payload = JSON.stringify(data);
        if (lastPersistedPayloadRef.current === payload) {
          dirtyRef.current = false;
          pendingPayloadRef.current = null;
          break;
        }

        pendingPayloadRef.current = payload;
        if (mountedRef.current) {
          setSaveError(null);
        }

        const savedAt = new Date();
        const { error } = await supabase.from("user_services_pricing").upsert(
          {
            user_id: user,
            data,
            updated_at: savedAt.toISOString(),
          },
          { onConflict: "user_id" },
        );

        if (error) {
          if (mountedRef.current) {
            setSaveError(error.message);
          }
          break;
        }

        lastPersistedPayloadRef.current = payload;
        if (latestPayloadRef.current === payload) {
          dirtyRef.current = false;
          pendingPayloadRef.current = null;
        }

        if (mountedRef.current) {
          setLastSavedAt(savedAt);
        }

        if (!dirtyRef.current) {
          break;
        }
      }
    } finally {
      saveInFlightRef.current = false;
      if (mountedRef.current) {
        setSaving(false);
      }
      if (saveRequestedRef.current && dirtyRef.current) {
        void drainSaves();
      }
    }
  }, []);

  const requestSave = useCallback(() => {
    saveRequestedRef.current = true;
    void drainSaves();
  }, [drainSaves]);

  const setCategories: Dispatch<SetStateAction<ServiceCategory[]>> = useCallback((next) => {
    dirtyRef.current = true;
    setCategoriesState(next);
  }, []);

  const setInfoCards: Dispatch<SetStateAction<InfoCardPersisted[]>> = useCallback((next) => {
    dirtyRef.current = true;
    setInfoCardsState(next);
  }, []);

  const flushSave = useCallback(async () => {
    if (!userIdRef.current || !loadedRef.current || !dirtyRef.current) return;
    await drainSaves();
  }, [drainSaves]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (dirtyRef.current) {
        requestSave();
      }
    };
  }, [requestSave]);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setLoaded(false);
      hydrateState({ categories: [], infoCards: [] });
      setLoadError(null);
      setSaveError(null);
      setLastSavedAt(null);
      lastPersistedPayloadRef.current = null;
      return;
    }

    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    setSaveError(null);
    setLastSavedAt(null);
    setLoaded(false);
    dirtyRef.current = false;
    pendingPayloadRef.current = null;
    lastPersistedPayloadRef.current = null;

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
        hydrateState(d);
        setLoaded(true);
        return;
      }

      if (!data) {
        const d = getDefaultServicesPricingState();
        hydrateState(d);
      } else {
        const parsed = deserializeServicesPricing(data.data);
        hydrateState(parsed);
        lastPersistedPayloadRef.current = JSON.stringify(serializeServicesPricing(parsed));
        if (data.updated_at) {
          setLastSavedAt(new Date(data.updated_at as string));
        }
      }
      setLoaded(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, hydrateState]);

  useEffect(() => {
    if (!userId || !loaded || !dirtyRef.current) return;

    const state: ServicesPricingState = { categories, infoCards };
    const key = JSON.stringify(serializeServicesPricing(state));
    if (lastPersistedPayloadRef.current === key) {
      dirtyRef.current = false;
      pendingPayloadRef.current = null;
      return;
    }

    pendingPayloadRef.current = key;

    const t = window.setTimeout(() => {
      if (pendingPayloadRef.current !== key) return;
      requestSave();
    }, SAVE_DEBOUNCE_MS);

    return () => window.clearTimeout(t);
  }, [userId, loaded, categories, infoCards, requestSave]);

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
