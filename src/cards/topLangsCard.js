/**
 * Renders an SVG "Top Languages Card" that shows a horizontal bar chart of the
 * most-used programming languages across a user's non-forked public repositories.
 *
 * Layout
 * ──────
 *  ┌─────────────────────────────────────────────┐
 *  │  Most Used Languages                        │
 *  │─────────────────────────────────────────────│
 *  │  JavaScript  ████████████████░░░░  65 %     │
 *  │  TypeScript  ███████░░░░░░░░░░░░░  28 %     │
 *  │  CSS         ██░░░░░░░░░░░░░░░░░░   7 %     │
 *  └─────────────────────────────────────────────┘
 */

const { escapeXml, clamp } = require("../utils/helpers");

// Colour palette
const COLOURS = {
  bg: "#0d1117",
  border: "#30363d",
  title: "#e6edf3",
  label: "#c9d1d9",
  barBg: "#21262d",
  pct: "#8b949e",
};

/** A visually distinct colour for each language index. */
const BAR_COLOURS = [
  "#58a6ff",
  "#f0883e",
  "#3fb950",
  "#d2a8ff",
  "#ff7b72",
  "#79c0ff",
  "#ffa657",
];

/**
 * Render a Top Languages SVG card.
 * @param {object[]} languages  Array from githubService.fetchTopLanguages()
 *   Each item: { name: string, bytes: number, percentage: number }
 * @returns {string}  SVG markup
 */
function renderTopLangsCard(languages) {
  if (!languages || languages.length === 0) {
    return renderEmptyCard("No language data found.");
  }

  const width = 480;
  const rowHeight = 46;
  const paddingTop = 68;
  const paddingBottom = 20;
  const height = paddingTop + languages.length * rowHeight + paddingBottom;

  const barX = 160;
  const barWidth = width - barX - 80;

  const rows = languages.map((lang, i) => {
    const pct = clamp(lang.percentage, 0, 100);
    const fillWidth = Math.round((pct / 100) * barWidth);
    const y = paddingTop + i * rowHeight;
    const colour = BAR_COLOURS[i % BAR_COLOURS.length];

    return `
    <!-- ${escapeXml(lang.name)} -->
    <text x="30" y="${y + 16}" fill="${COLOURS.label}" font-size="13" font-family="Segoe UI, Ubuntu, sans-serif">${escapeXml(lang.name)}</text>
    <rect x="${barX}" y="${y}" width="${barWidth}" height="18" rx="4" fill="${COLOURS.barBg}"/>
    <rect x="${barX}" y="${y}" width="${fillWidth}" height="18" rx="4" fill="${colour}"/>
    <text x="${barX + barWidth + 8}" y="${y + 14}" fill="${COLOURS.pct}" font-size="12" font-family="Segoe UI, Ubuntu, sans-serif">${pct}%</text>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Top languages">
  <title>Most Used Languages</title>
  <rect width="${width}" height="${height}" rx="10" fill="${COLOURS.bg}" stroke="${COLOURS.border}" stroke-width="1"/>
  <text x="30" y="40" fill="${COLOURS.title}" font-size="15" font-weight="bold" font-family="Segoe UI, Ubuntu, sans-serif">Most Used Languages</text>
  <line x1="30" y1="52" x2="${width - 30}" y2="52" stroke="${COLOURS.border}" stroke-width="1"/>
  ${rows.join("")}
</svg>`;
}

function renderEmptyCard(message) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="100" viewBox="0 0 480 100">
  <rect width="480" height="100" rx="10" fill="#0d1117" stroke="#30363d" stroke-width="1"/>
  <text x="30" y="55" fill="#8b949e" font-size="14" font-family="Segoe UI, Ubuntu, sans-serif">${escapeXml(message)}</text>
</svg>`;
}

module.exports = { renderTopLangsCard };
