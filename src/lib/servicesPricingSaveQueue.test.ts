import { describe, expect, it, vi } from "vitest";
import {
  createLatestServicesPricingSaveQueue,
  type ServicesPricingSaveRequest,
  type ServicesPricingSaveResult,
} from "@/lib/servicesPricingSaveQueue";

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}

function request(key: string): ServicesPricingSaveRequest {
  return {
    userId: "user-1",
    key,
    state: { categories: [], infoCards: [] },
  };
}

describe("createLatestServicesPricingSaveQueue", () => {
  it("waits for an in-flight save before writing the latest queued state", async () => {
    const saves: Array<{
      request: ServicesPricingSaveRequest;
      result: ReturnType<typeof deferred<ServicesPricingSaveResult>>;
    }> = [];
    const savedKeys: string[] = [];
    const saveRequest = vi.fn((save: ServicesPricingSaveRequest) => {
      const result = deferred<ServicesPricingSaveResult>();
      saves.push({ request: save, result });
      return result.promise;
    });
    const queue = createLatestServicesPricingSaveQueue(saveRequest, {
      onSavingChange: vi.fn(),
      onError: vi.fn(),
      onSaved: (_savedAt, key) => savedKeys.push(key),
    });

    const run = queue.enqueue(request("first-edit"));
    queue.enqueue(request("second-edit"));

    expect(saveRequest).toHaveBeenCalledTimes(1);
    expect(saves[0].request.key).toBe("first-edit");

    saves[0].result.resolve({ error: null });
    await vi.waitFor(() => expect(saveRequest).toHaveBeenCalledTimes(2));

    expect(saves[1].request.key).toBe("second-edit");

    saves[1].result.resolve({ error: null });
    await run;

    expect(savedKeys).toEqual(["first-edit", "second-edit"]);
    expect(queue.getLastSavedKey()).toBe("second-edit");
  });

  it("drops superseded queued states while a prior save is in flight", async () => {
    const saves: Array<{
      request: ServicesPricingSaveRequest;
      result: ReturnType<typeof deferred<ServicesPricingSaveResult>>;
    }> = [];
    const saveRequest = vi.fn((save: ServicesPricingSaveRequest) => {
      const result = deferred<ServicesPricingSaveResult>();
      saves.push({ request: save, result });
      return result.promise;
    });
    const queue = createLatestServicesPricingSaveQueue(saveRequest, {
      onSavingChange: vi.fn(),
      onError: vi.fn(),
      onSaved: vi.fn(),
    });

    const run = queue.enqueue(request("first-edit"));
    queue.enqueue(request("superseded-edit"));
    queue.enqueue(request("latest-edit"));

    saves[0].result.resolve({ error: null });
    await vi.waitFor(() => expect(saveRequest).toHaveBeenCalledTimes(2));

    expect(saves[1].request.key).toBe("latest-edit");

    saves[1].result.resolve({ error: null });
    await run;

    expect(saveRequest).toHaveBeenCalledTimes(2);
    expect(queue.getLastSavedKey()).toBe("latest-edit");
  });
});
