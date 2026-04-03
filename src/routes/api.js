/**
 * API routes
 *
 * GET /api/stats?username=<login>
 *   Returns an SVG card with a user's GitHub profile statistics.
 *
 * GET /api/top-langs?username=<login>[&limit=5]
 *   Returns an SVG card with the user's most-used programming languages.
 */

const express = require("express");
const { fetchStats, fetchTopLanguages } = require("../services/github");
const { renderStatsCard } = require("../cards/statsCard");
const { renderTopLangsCard } = require("../cards/topLangsCard");
const { cache } = require("../utils/cache");

const router = express.Router();

/** Send an SVG response with appropriate headers. */
function sendSvg(res, svg) {
  res
    .status(200)
    .setHeader("Content-Type", "image/svg+xml")
    .setHeader("Cache-Control", "public, max-age=1800, s-maxage=1800") // 30 min
    .send(svg);
}

/** Send a structured JSON error. */
function sendError(res, status, message) {
  res.status(status).json({ error: message });
}

// ─── GET /api/stats ──────────────────────────────────────────────────────────

router.get("/stats", async (req, res) => {
  const username = (req.query.username || "").trim();
  if (!username) {
    return sendError(res, 400, "Missing required query parameter: username");
  }

  const cacheKey = `stats:${username.toLowerCase()}`;
  const cached = cache.get(cacheKey);
  if (cached) return sendSvg(res, cached);

  try {
    const stats = await fetchStats(username);
    const svg = renderStatsCard(stats);
    cache.set(cacheKey, svg);
    return sendSvg(res, svg);
  } catch (err) {
    if (err.message === "User not found") return sendError(res, 404, err.message);
    if (err.message.includes("rate limit")) return sendError(res, 429, err.message);
    console.error("[/api/stats]", err);
    return sendError(res, 500, "Failed to fetch GitHub data");
  }
});

// ─── GET /api/top-langs ──────────────────────────────────────────────────────

router.get("/top-langs", async (req, res) => {
  const username = (req.query.username || "").trim();
  if (!username) {
    return sendError(res, 400, "Missing required query parameter: username");
  }

  const limit = Math.min(parseInt(req.query.limit, 10) || 5, 10);
  const cacheKey = `top-langs:${username.toLowerCase()}:${limit}`;
  const cached = cache.get(cacheKey);
  if (cached) return sendSvg(res, cached);

  try {
    const languages = await fetchTopLanguages(username, limit);
    const svg = renderTopLangsCard(languages);
    cache.set(cacheKey, svg);
    return sendSvg(res, svg);
  } catch (err) {
    if (err.message === "User not found") return sendError(res, 404, err.message);
    if (err.message.includes("rate limit")) return sendError(res, 429, err.message);
    console.error("[/api/top-langs]", err);
    return sendError(res, 500, "Failed to fetch GitHub data");
  }
});

module.exports = router;
