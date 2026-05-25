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

  const saveSeq = useRef(0);
  const loadSeq = useRef(0);
  const activeUserRef = useRef<string | null>(userId ?? null);
  const canPersistRef = useRef(false);
  const lastPersistedPayloadRef = useRef<string | null>(null);
  const pendingPayloadRef = useRef<string | null>(null);
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());

  const performSave = useCallback(async (user: string, state: ServicesPricingState) => {
    const data = serializeServicesPricing(state);
    const key = JSON.stringify(data);
    const mySeq = ++saveSeq.current;
    setSaving(true);
    setSaveError(null);

    const save = async () => {
      if (
        !canPersistRef.current ||
        activeUserRef.current !== user ||
        lastPersistedPayloadRef.current === key ||
        pendingPayloadRef.current !== key
      ) {
        return;
      }

      try {
        const savedAt = new Date();
        const { error } = await supabase.from("user_services_pricing").upsert(
          {
            user_id: user,
            data,
            updated_at: savedAt.toISOString(),
          },
          { onConflict: "user_id" },
        );

        if (saveSeq.current !== mySeq) return;
        if (error) {
          setSaveError(error.message);
          return;
        }
        lastPersistedPayloadRef.current = key;
        if (pendingPayloadRef.current === key) {
          pendingPayloadRef.current = null;
        }
        setLastSavedAt(savedAt);
      } catch (error) {
        if (saveSeq.current !== mySeq) return;
        setSaveError(error instanceof Error ? error.message : "Could not save services pricing.");
      }
    };

    const queuedSave = saveQueueRef.current.then(save, save);
    saveQueueRef.current = queuedSave.catch(() => undefined);
    await queuedSave;

    if (saveSeq.current === mySeq) {
      setSaving(false);
    }
  }, []);

  const flushSave = useCallback(async () => {
    if (!userId || !loaded || !canPersistRef.current || activeUserRef.current !== userId) {
      return;
    }
    const state = { categories, infoCards };
    const key = JSON.stringify(serializeServicesPricing(state));
    if (lastPersistedPayloadRef.current === key) return;
    pendingPayloadRef.current = key;
    await performSave(userId, state);
  }, [userId, loaded, categories, infoCards, performSave]);

  useEffect(() => {
    if (!userId) {
      activeUserRef.current = null;
      canPersistRef.current = false;
      lastPersistedPayloadRef.current = null;
      pendingPayloadRef.current = null;
      saveSeq.current += 1;
      setLoading(false);
      setLoaded(false);
      setCategories([]);
      setInfoCards([]);
      setLoadError(null);
      setSaveError(null);
      setLastSavedAt(null);
      return;
    }

    let cancelled = false;
    const myLoadSeq = ++loadSeq.current;
    activeUserRef.current = userId;
    canPersistRef.current = false;
    lastPersistedPayloadRef.current = null;
    pendingPayloadRef.current = null;
    saveSeq.current += 1;
    setLoading(true);
    setLoaded(false);
    setCategories([]);
    setInfoCards([]);
    setLoadError(null);
    setSaveError(null);
    setLastSavedAt(null);

    void (async () => {
      const { data, error } = await supabase
        .from("user_services_pricing")
        .select("data, updated_at")
        .eq("user_id", userId)
        .maybeSingle();

      if (cancelled || loadSeq.current !== myLoadSeq || activeUserRef.current !== userId) {
        return;
      }
      setLoading(false);

      if (error) {
        setLoadError(error.message);
        const d = getDefaultServicesPricingState();
        setCategories(d.categories);
        setInfoCards(d.infoCards);
        return;
      }

      let nextState: ServicesPricingState;
      if (!data) {
        nextState = getDefaultServicesPricingState();
      } else {
        const parsed = parseServicesPricingPayload(data.data);
        nextState = parsed.state;
        if (!parsed.ok) {
          setLoadError(parsed.error);
          setCategories(nextState.categories);
          setInfoCards(nextState.infoCards);
          return;
        }
        if (data.updated_at) {
          setLastSavedAt(new Date(data.updated_at as string));
        }
      }
      setCategories(nextState.categories);
      setInfoCards(nextState.infoCards);
      lastPersistedPayloadRef.current = JSON.stringify(serializeServicesPricing(nextState));
      canPersistRef.current = true;
      setLoaded(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  useEffect(() => {
    if (!userId || !loaded || !canPersistRef.current || activeUserRef.current !== userId) {
      return;
    }

    const state: ServicesPricingState = { categories, infoCards };
    const key = JSON.stringify(serializeServicesPricing(state));
    if (lastPersistedPayloadRef.current === key) {
      if (pendingPayloadRef.current === key) {
        pendingPayloadRef.current = null;
      }
      return;
    }
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
