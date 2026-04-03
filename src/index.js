/**
 * Entry point — creates and configures the Express application.
 *
 * Start the server:
 *   node src/index.js
 *   PORT=3000 node src/index.js
 */

const express = require("express");
const indexRouter = require("./routes/index");
const apiRouter = require("./routes/api");

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────

// Parse JSON bodies (useful if future endpoints accept POST requests).
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use("/", indexRouter);
app.use("/api", apiRouter);

// ─── 404 handler ──────────────────────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// ─── Start ────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;

/* istanbul ignore next */
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`GitHub Profile Analyzer listening on http://localhost:${PORT}`);
  });
}

module.exports = app; // exported for tests
