/**
 * Tests for the in-memory cache utility.
 */

const { describe, it, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const { Cache } = require("../src/utils/cache");

describe("Cache", () => {
  let cache;

  beforeEach(() => {
    cache = new Cache(500); // 500 ms TTL for fast expiry tests
  });

  it("stores and retrieves a value", () => {
    cache.set("key", "value");
    assert.equal(cache.get("key"), "value");
  });

  it("returns undefined for missing keys", () => {
    assert.equal(cache.get("missing"), undefined);
  });

  it("returns undefined after expiry", async () => {
    cache.set("expiring", "data");
    await new Promise((resolve) => setTimeout(resolve, 600)); // wait for TTL
    assert.equal(cache.get("expiring"), undefined);
  });

  it("deletes an entry", () => {
    cache.set("del", "yes");
    cache.delete("del");
    assert.equal(cache.get("del"), undefined);
  });

  it("reports size correctly", () => {
    cache.set("a", 1);
    cache.set("b", 2);
    assert.equal(cache.size, 2);
  });

  it("prunes expired entries from size count", async () => {
    cache.set("x", 1);
    await new Promise((resolve) => setTimeout(resolve, 600));
    assert.equal(cache.size, 0);
  });
});
