import { describe, it, expect, vi } from "vitest";
import { cacheWithTTL } from "../../src/utils/ttl-cache";

describe("cacheWithTTL", () => {
  it("shares one in-flight fetch between concurrent callers", async () => {
    const fn = vi.fn().mockResolvedValue("value");
    const cache = cacheWithTTL(1000, fn);

    await expect(Promise.all([cache(), cache()])).resolves.toEqual([
      "value",
      "value",
    ]);
    await expect(cache()).resolves.toBe("value");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("retries on the next call after a failed fetch", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error("db down"))
      .mockResolvedValue("value");
    const cache = cacheWithTTL(1000, fn);

    await expect(cache()).rejects.toThrow("db down");
    await expect(cache()).resolves.toBe("value");
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
