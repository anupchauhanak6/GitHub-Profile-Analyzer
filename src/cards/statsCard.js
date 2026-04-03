/**
 * Renders an SVG "Stats Card" that displays a GitHub user's profile statistics.
 * The returned string is a self-contained SVG image that can be served directly
 * over HTTP and embedded in a README with a standard <img> tag.
 *
 * Layout
 * ──────
 *  ┌─────────────────────────────────────────────┐
 *  │  GitHub Stats — <name> (@<login>)           │
 *  │─────────────────────────────────────────────│
 *  │  ⭐ Total Stars       🍴 Total Forks         │
 *  │     N                    N                  │
 *  │  📁 Public Repos      👥 Followers           │
 *  │     N                    N                  │
 *  │  👤 Following                               │
 *  │     N                                       │
 *  └─────────────────────────────────────────────┘
 */

const { escapeXml } = require("../utils/helpers");

// Colour palette
const COLOURS = {
  bg: "#0d1117",
  border: "#30363d",
  title: "#e6edf3",
  label: "#8b949e",
  value: "#58a6ff",
  icon: "#f0883e",
};

/**
 * Build a single stat cell (icon label + numeric value).
 */
function statCell(icon, label, value, x, y) {
  return `
    <text x="${x}" y="${y}" fill="${COLOURS.icon}" font-size="13">${icon}</text>
    <text x="${x + 22}" y="${y}" fill="${COLOURS.label}" font-size="13">${escapeXml(label)}</text>
    <text x="${x + 22}" y="${y + 20}" fill="${COLOURS.value}" font-size="17" font-weight="bold">${escapeXml(String(value))}</text>`;
}

/**
 * Render a GitHub Stats SVG card.
 * @param {object} stats  Object returned by githubService.fetchStats()
 * @returns {string}  SVG markup
 */
function renderStatsCard(stats) {
  const width = 480;
  const height = 200;

  const titleText = `GitHub Stats — ${escapeXml(stats.name)} (@${escapeXml(stats.login)})`;

  const cells = [
    { icon: "⭐", label: "Total Stars", value: stats.totalStars, col: 0, row: 0 },
    { icon: "🍴", label: "Total Forks", value: stats.totalForks, col: 1, row: 0 },
    { icon: "📁", label: "Public Repos", value: stats.publicRepos, col: 0, row: 1 },
    { icon: "👥", label: "Followers", value: stats.followers, col: 1, row: 1 },
    { icon: "👤", label: "Following", value: stats.following, col: 0, row: 2 },
  ];

  const colX = [30, 250];
  const rowY = [105, 155, 200 - 30];

  const cellsSvg = cells
    .map((c) => statCell(c.icon, c.label, c.value, colX[c.col], rowY[c.row]))
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="GitHub stats for ${escapeXml(stats.login)}">
  <title>GitHub stats for ${escapeXml(stats.login)}</title>
  <rect width="${width}" height="${height}" rx="10" fill="${COLOURS.bg}" stroke="${COLOURS.border}" stroke-width="1"/>
  <text x="30" y="40" fill="${COLOURS.title}" font-size="15" font-weight="bold" font-family="Segoe UI, Ubuntu, sans-serif">${titleText}</text>
  <line x1="30" y1="52" x2="${width - 30}" y2="52" stroke="${COLOURS.border}" stroke-width="1"/>
  <g font-family="Segoe UI, Ubuntu, sans-serif">${cellsSvg}
  </g>
</svg>`;
}

module.exports = { renderStatsCard };
