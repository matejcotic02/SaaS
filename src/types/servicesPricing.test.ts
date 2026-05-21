import { describe, expect, it } from "vitest";
import {
  getDefaultServicesPricingState,
  parseServicesPricingPayload,
  serializeServicesPricing,
} from "@/types/servicesPricing";

describe("parseServicesPricingPayload", () => {
  it("marks unreadable payloads invalid instead of silently accepting defaults", () => {
    const parsed = parseServicesPricingPayload({ version: 1, categories: [] });

    expect(parsed.ok).toBe(false);
    expect(parsed.state).toEqual(getDefaultServicesPricingState());
  });

  it("rejects future versions so callers can avoid overwriting newer saved data", () => {
    const defaults = getDefaultServicesPricingState();
    const parsed = parseServicesPricingPayload({
      ...serializeServicesPricing(defaults),
      version: 999,
    });

    expect(parsed.ok).toBe(false);
    expect(parsed.state).toEqual(defaults);
  });

  it("returns valid persisted data when the payload shape is supported", () => {
    const defaults = getDefaultServicesPricingState();
    const parsed = parseServicesPricingPayload(serializeServicesPricing(defaults));

    expect(parsed.ok).toBe(true);
    expect(parsed.state).toEqual(defaults);
  });
});
