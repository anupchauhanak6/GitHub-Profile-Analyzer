/**
 * Tests for the helpers utility module.
 */

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { escapeXml, clamp } = require("../src/utils/helpers");

describe("escapeXml", () => {
  it("escapes & to &amp;", () => {
    assert.equal(escapeXml("a & b"), "a &amp; b");
  });

  it("escapes < to &lt;", () => {
    assert.equal(escapeXml("<tag>"), "&lt;tag&gt;");
  });

  it("escapes > to &gt;", () => {
    assert.equal(escapeXml("a > b"), "a &gt; b");
  });

  it('escapes " to &quot;', () => {
    assert.equal(escapeXml('"hello"'), "&quot;hello&quot;");
  });

  it("escapes ' to &apos;", () => {
    assert.equal(escapeXml("it's"), "it&apos;s");
  });

  it("handles empty string", () => {
    assert.equal(escapeXml(""), "");
  });

  it("coerces non-strings", () => {
    assert.equal(escapeXml(42), "42");
  });
});

describe("clamp", () => {
  it("returns value when within range", () => {
    assert.equal(clamp(50, 0, 100), 50);
  });

  it("clamps to min", () => {
    assert.equal(clamp(-10, 0, 100), 0);
  });

  it("clamps to max", () => {
    assert.equal(clamp(200, 0, 100), 100);
  });

  it("returns min when value equals min", () => {
    assert.equal(clamp(0, 0, 100), 0);
  });

  it("returns max when value equals max", () => {
    assert.equal(clamp(100, 0, 100), 100);
  });
});
