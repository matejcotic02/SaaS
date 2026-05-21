import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { createLatestServicesPricingSaveQueue } from "@/lib/servicesPricingSaveQueue";
import { supabase } from "@/lib/supabase";
import {
  getServicesPricingPayloadKey,
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

  const pendingPayloadRef = useRef<string | null>(null);
  const saveEnabledRef = useRef(false);
  const saveQueueRef = useRef<ReturnType<
    typeof createLatestServicesPricingSaveQueue
  > | null>(null);

  if (!saveQueueRef.current) {
    saveQueueRef.current = createLatestServicesPricingSaveQueue(
      async ({ userId: saveUserId, state }) => {
        const data = serializeServicesPricing(state);
        const { error } = await supabase.from("user_services_pricing").upsert(
          {
            user_id: saveUserId,
            data,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        );
        return { error };
      },
      {
        onSavingChange: setSaving,
        onError: setSaveError,
        onSaved: (savedAt) => setLastSavedAt(savedAt),
      },
    );
  }

  const queueSave = useCallback(async (user: string, state: ServicesPricingState) => {
    const key = getServicesPricingPayloadKey(state);
    const queue = saveQueueRef.current;

    if (!queue || key === queue.getLastSavedKey()) {
      return;
    }

    if (!saveEnabledRef.current) {
      setSaveError(
        "Cloud data could not be loaded. Refresh before editing to avoid overwriting saved pricing.",
      );
      return;
    }

    await queue.enqueue({ userId: user, state, key });
  }, []);

  const flushSave = useCallback(async () => {
    if (!userId || !loaded) return;
    await queueSave(userId, { categories, infoCards });
  }, [userId, loaded, categories, infoCards, queueSave]);

  useEffect(() => {
    saveEnabledRef.current = false;
    saveQueueRef.current?.clear();
    pendingPayloadRef.current = null;

    if (!userId) {
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
    setLoading(true);
    setLoaded(false);
    setLoadError(null);
    setSaveError(null);
    setLastSavedAt(null);

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
        saveQueueRef.current?.setLastSavedKey(getServicesPricingPayloadKey(d));
        setLoaded(true);
        return;
      }

      if (!data) {
        const d = getDefaultServicesPricingState();
        setCategories(d.categories);
        setInfoCards(d.infoCards);
        saveQueueRef.current?.setLastSavedKey(getServicesPricingPayloadKey(d));
        saveEnabledRef.current = true;
      } else {
        const parsed = parseServicesPricingPayload(data.data);
        setCategories(parsed.state.categories);
        setInfoCards(parsed.state.infoCards);
        saveQueueRef.current?.setLastSavedKey(
          getServicesPricingPayloadKey(parsed.state),
        );
        if (!parsed.ok) {
          setLoadError("Saved services and pricing data could not be loaded safely.");
        } else {
          saveEnabledRef.current = true;
        }
        if (parsed.ok && data.updated_at) {
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
    if (!userId || !loaded) return;

    const state: ServicesPricingState = { categories, infoCards };
    const key = getServicesPricingPayloadKey(state);
    if (key === saveQueueRef.current?.getLastSavedKey()) return;

    pendingPayloadRef.current = key;

    const t = window.setTimeout(() => {
      if (pendingPayloadRef.current !== key) return;
      void queueSave(userId, state);
    }, SAVE_DEBOUNCE_MS);

    return () => window.clearTimeout(t);
  }, [userId, loaded, categories, infoCards, queueSave]);

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
