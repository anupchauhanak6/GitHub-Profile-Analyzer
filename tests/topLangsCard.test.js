/**
 * Tests for the Top Languages Card SVG renderer.
 */

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { renderTopLangsCard } = require("../src/cards/topLangsCard");

const sampleLangs = [
  { name: "JavaScript", bytes: 65000, percentage: 65 },
  { name: "TypeScript", bytes: 28000, percentage: 28 },
  { name: "CSS",        bytes:  7000, percentage:  7 },
];

describe("renderTopLangsCard", () => {
  it("returns an SVG string", () => {
    const svg = renderTopLangsCard(sampleLangs);
    assert.ok(typeof svg === "string");
    assert.ok(svg.includes("<svg"));
    assert.ok(svg.includes("</svg>"));
  });

  it("includes each language name", () => {
    const svg = renderTopLangsCard(sampleLangs);
    for (const lang of sampleLangs) {
      assert.ok(svg.includes(lang.name), `Expected ${lang.name} in SVG`);
    }
  });

  it("shows percentage values", () => {
    const svg = renderTopLangsCard(sampleLangs);
    assert.ok(svg.includes("65%"));
    assert.ok(svg.includes("28%"));
    assert.ok(svg.includes("7%"));
  });

  it("renders an empty-state card when languages array is empty", () => {
    const svg = renderTopLangsCard([]);
    assert.ok(svg.includes("<svg"));
    assert.ok(svg.includes("No language data found"));
  });

  it("renders an empty-state card when languages is null/undefined", () => {
    const svg = renderTopLangsCard(null);
    assert.ok(svg.includes("No language data found"));
  });

  it("XML-escapes language names with special characters", () => {
    const langs = [{ name: '<fake>', bytes: 1000, percentage: 100 }];
    const svg = renderTopLangsCard(langs);
    assert.ok(!svg.includes("<fake>"));
    assert.ok(svg.includes("&lt;fake&gt;"));
  });
});
