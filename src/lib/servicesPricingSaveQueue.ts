import type { ServicesPricingState } from "@/types/servicesPricing";

export type ServicesPricingSaveRequest = {
  userId: string;
  state: ServicesPricingState;
  key: string;
};

export type ServicesPricingSaveResult = {
  error: { message: string } | null;
};

type SaveQueueHandlers = {
  onSavingChange: (saving: boolean) => void;
  onError: (message: string | null) => void;
  onSaved: (savedAt: Date, key: string) => void;
};

export function createLatestServicesPricingSaveQueue(
  saveRequest: (
    request: ServicesPricingSaveRequest,
  ) => Promise<ServicesPricingSaveResult>,
  handlers: SaveQueueHandlers,
) {
  let queued: ServicesPricingSaveRequest | null = null;
  let inFlight: Promise<void> | null = null;
  let lastSavedKey: string | null = null;

  const run = async () => {
    handlers.onSavingChange(true);

    try {
      while (queued) {
        const request = queued;
        queued = null;
        handlers.onError(null);

        const { error } = await saveRequest(request);

        if (error) {
          if (!queued) {
            queued = request;
          }
          handlers.onError(error.message);
          return;
        }

        lastSavedKey = request.key;
        handlers.onSaved(new Date(), request.key);
      }
    } finally {
      inFlight = null;
      handlers.onSavingChange(false);
    }
  };

  return {
    clear() {
      queued = null;
      lastSavedKey = null;
    },
    getLastSavedKey() {
      return lastSavedKey;
    },
    setLastSavedKey(key: string) {
      queued = null;
      lastSavedKey = key;
    },
    enqueue(request: ServicesPricingSaveRequest) {
      if (request.key === lastSavedKey) {
        return inFlight ?? Promise.resolve();
      }

      queued = request;

      if (!inFlight) {
        inFlight = run();
      }

      return inFlight;
    },
  };
}
