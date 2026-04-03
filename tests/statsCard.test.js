/**
 * Tests for the Stats Card SVG renderer.
 */

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { renderStatsCard } = require("../src/cards/statsCard");

const sampleStats = {
  name: "Ada Lovelace",
  login: "ada",
  avatarUrl: "https://example.com/avatar.png",
  bio: "First programmer",
  followers: 42,
  following: 7,
  publicRepos: 15,
  totalStars: 300,
  totalForks: 50,
  createdAt: "2010-01-01T00:00:00Z",
};

describe("renderStatsCard", () => {
  it("returns a string containing SVG root element", () => {
    const svg = renderStatsCard(sampleStats);
    assert.ok(typeof svg === "string");
    assert.ok(svg.includes("<svg"));
    assert.ok(svg.includes("</svg>"));
  });

  it("embeds the user login in the SVG", () => {
    const svg = renderStatsCard(sampleStats);
    assert.ok(svg.includes("ada"));
  });

  it("embeds the user name in the SVG", () => {
    const svg = renderStatsCard(sampleStats);
    assert.ok(svg.includes("Ada Lovelace"));
  });

  it("shows totalStars value", () => {
    const svg = renderStatsCard(sampleStats);
    assert.ok(svg.includes("300"));
  });

  it("shows totalForks value", () => {
    const svg = renderStatsCard(sampleStats);
    assert.ok(svg.includes("50"));
  });

  it("shows followers value", () => {
    const svg = renderStatsCard(sampleStats);
    assert.ok(svg.includes("42"));
  });

  it("shows publicRepos value", () => {
    const svg = renderStatsCard(sampleStats);
    assert.ok(svg.includes("15"));
  });

  it("XML-escapes special characters in name", () => {
    const svg = renderStatsCard({ ...sampleStats, name: '<script>alert("xss")</script>' });
    assert.ok(!svg.includes("<script>"));
    assert.ok(svg.includes("&lt;script&gt;"));
  });
});
