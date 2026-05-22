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

function getSerializedKey(state: ServicesPricingState) {
  return JSON.stringify(serializeServicesPricing(state));
}

async function saveServicesPricing(user: string, state: ServicesPricingState) {
  const data = serializeServicesPricing(state);
  return supabase.from("user_services_pricing").upsert(
    {
      user_id: user,
      data,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
}

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

type SaveRequest = {
  user: string;
  state: ServicesPricingState;
  key: string;
  silent: boolean;
};

export function useUserServicesPricing(
  userId: string | undefined,
): UseUserServicesPricingResult {
  const [categories, setCategoriesState] = useState<ServiceCategory[]>([]);
  const [infoCards, setInfoCardsState] = useState<InfoCardPersisted[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(!!userId);
  const [saveEnabled, setSaveEnabled] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const saveSeq = useRef(0);
  const pendingPayloadRef = useRef<string | null>(null);
  const latestPayloadRef = useRef<string | null>(null);
  const lastPersistedPayloadRef = useRef<string | null>(null);
  const hasUserChangesRef = useRef(false);
  const mountedRef = useRef(true);
  const saveInFlightRef = useRef(false);
  const queuedSaveRef = useRef<SaveRequest | null>(null);
  const latestDraftRef = useRef<{
    user: string;
    state: ServicesPricingState;
    key: string;
    canSave: boolean;
  } | null>(null);

  const setCategories: Dispatch<SetStateAction<ServiceCategory[]>> = useCallback((value) => {
    hasUserChangesRef.current = true;
    setCategoriesState(value);
  }, []);

  const setInfoCards: Dispatch<SetStateAction<InfoCardPersisted[]>> = useCallback((value) => {
    hasUserChangesRef.current = true;
    setInfoCardsState(value);
  }, []);

  const performSave = useCallback(async (
    user: string,
    state: ServicesPricingState,
    key = getSerializedKey(state),
    options: { silent?: boolean } = {},
  ) => {
    const request: SaveRequest = {
      user,
      state,
      key,
      silent: options.silent ?? false,
    };

    if (saveInFlightRef.current) {
      queuedSaveRef.current = request;
      return;
    }

    saveInFlightRef.current = true;
    let current: SaveRequest | null = request;

    while (current) {
      queuedSaveRef.current = null;
      const mySeq = ++saveSeq.current;
      if (mountedRef.current && !current.silent) {
        setSaving(true);
        setSaveError(null);
      }

      const { error } = await saveServicesPricing(current.user, current.state);

      if (error) {
        if (mountedRef.current && saveSeq.current === mySeq && !current.silent) {
          setSaving(false);
          setSaveError(error.message);
        }
        current = queuedSaveRef.current;
        continue;
      }

      lastPersistedPayloadRef.current = current.key;
      if (pendingPayloadRef.current === current.key) {
        pendingPayloadRef.current = null;
      }
      if (latestPayloadRef.current === current.key) {
        hasUserChangesRef.current = false;
      }
      if (mountedRef.current && saveSeq.current === mySeq && !current.silent) {
        setSaving(false);
        setLastSavedAt(new Date());
      }

      current = queuedSaveRef.current;
    }

    saveInFlightRef.current = false;
  }, []);

  const flushSave = useCallback(async () => {
    if (!userId || !loaded || !saveEnabled || !hasUserChangesRef.current) return;
    const state = { categories, infoCards };
    const key = getSerializedKey(state);
    if (key === lastPersistedPayloadRef.current) {
      hasUserChangesRef.current = false;
      pendingPayloadRef.current = null;
      return;
    }
    await performSave(userId, state, key);
  }, [userId, loaded, saveEnabled, categories, infoCards, performSave]);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setLoaded(false);
      setSaveEnabled(false);
      setCategoriesState([]);
      setInfoCardsState([]);
      setLoadError(null);
      setSaveError(null);
      setLastSavedAt(null);
      hasUserChangesRef.current = false;
      latestPayloadRef.current = null;
      lastPersistedPayloadRef.current = null;
      pendingPayloadRef.current = null;
      return;
    }

    let cancelled = false;
    setLoading(true);
    setSaveEnabled(false);
    setLoadError(null);
    setSaveError(null);
    hasUserChangesRef.current = false;
    pendingPayloadRef.current = null;

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
        setCategoriesState(d.categories);
        setInfoCardsState(d.infoCards);
        lastPersistedPayloadRef.current = null;
        setLoaded(true);
        return;
      }

      if (!data) {
        const d = getDefaultServicesPricingState();
        setCategoriesState(d.categories);
        setInfoCardsState(d.infoCards);
        lastPersistedPayloadRef.current = getSerializedKey(d);
        setSaveEnabled(true);
      } else {
        const parsed = tryDeserializeServicesPricing(data.data);
        if (!parsed) {
          const d = getDefaultServicesPricingState();
          setLoadError(
            "Saved services and pricing could not be read. Reload before editing to avoid overwriting cloud data.",
          );
          setCategoriesState(d.categories);
          setInfoCardsState(d.infoCards);
          lastPersistedPayloadRef.current = null;
          setLoaded(true);
          return;
        }
        setCategoriesState(parsed.categories);
        setInfoCardsState(parsed.infoCards);
        lastPersistedPayloadRef.current = getSerializedKey(parsed);
        setSaveEnabled(true);
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
    const state: ServicesPricingState = { categories, infoCards };
    const key = getSerializedKey(state);
    latestPayloadRef.current = key;
    latestDraftRef.current = userId
      ? { user: userId, state, key, canSave: loaded && saveEnabled }
      : null;

    if (!userId || !loaded || !saveEnabled || !hasUserChangesRef.current) return;

    if (key === lastPersistedPayloadRef.current) {
      hasUserChangesRef.current = false;
      pendingPayloadRef.current = null;
      return;
    }

    pendingPayloadRef.current = key;

    const t = window.setTimeout(() => {
      if (pendingPayloadRef.current !== key) return;
      void performSave(userId, state, key);
    }, SAVE_DEBOUNCE_MS);

    return () => window.clearTimeout(t);
  }, [userId, loaded, saveEnabled, categories, infoCards, performSave]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      const draft = latestDraftRef.current;
      const shouldFlush =
        draft &&
        draft.canSave &&
        hasUserChangesRef.current &&
        draft.key !== lastPersistedPayloadRef.current;

      if (shouldFlush) {
        void performSave(draft.user, draft.state, draft.key, { silent: true });
      }

      mountedRef.current = false;
    };
  }, [performSave]);

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
