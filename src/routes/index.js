/**
 * Landing page route — renders an HTML documentation page.
 */

const express = require("express");

const router = express.Router();

router.get("/", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8").send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GitHub Profile Analyzer</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0d1117; color: #c9d1d9; font-family: "Segoe UI", Ubuntu, sans-serif; padding: 40px 24px; }
    h1 { color: #e6edf3; font-size: 2rem; margin-bottom: 8px; }
    h2 { color: #e6edf3; font-size: 1.25rem; margin: 32px 0 12px; }
    p  { color: #8b949e; line-height: 1.6; margin-bottom: 12px; }
    a  { color: #58a6ff; }
    code, pre { background: #161b22; border: 1px solid #30363d; border-radius: 6px; }
    code { padding: 2px 6px; font-size: 0.9em; }
    pre  { padding: 16px; overflow-x: auto; margin-bottom: 16px; }
    .badge { display: inline-block; margin: 8px 4px; }
    .endpoint { display: flex; align-items: baseline; gap: 8px; margin-bottom: 6px; }
    .method { background: #1f6feb; color: #fff; border-radius: 4px; padding: 2px 8px; font-size: 0.8em; font-weight: bold; }
    .path   { font-family: monospace; color: #79c0ff; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 16px; }
    th, td { text-align: left; padding: 8px 12px; border: 1px solid #30363d; }
    th { background: #161b22; color: #e6edf3; }
    .container { max-width: 860px; margin: 0 auto; }
  </style>
</head>
<body>
  <div class="container">
    <h1>📊 GitHub Profile Analyzer</h1>
    <p>An embeddable API that generates beautiful SVG stat cards for any GitHub profile.
       Drop the card URLs into your <code>README.md</code> and your stats will always be up to date.</p>

    <h2>Endpoints</h2>

    <div class="endpoint">
      <span class="method">GET</span>
      <span class="path">/api/stats?username=&#123;login&#125;</span>
    </div>
    <p>Returns an SVG card with the user's stars, forks, public repos, followers, and following count.</p>

    <div class="endpoint">
      <span class="method">GET</span>
      <span class="path">/api/top-langs?username=&#123;login&#125;[&amp;limit=5]</span>
    </div>
    <p>Returns an SVG card with the user's most-used programming languages (default 5, max 10).</p>

    <h2>Query Parameters</h2>
    <table>
      <thead><tr><th>Parameter</th><th>Endpoint</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>username</code></td><td>both</td><td><strong>Required.</strong> GitHub login name.</td></tr>
        <tr><td><code>limit</code></td><td>/api/top-langs</td><td>Number of languages to show (1–10, default 5).</td></tr>
      </tbody>
    </table>

    <h2>Add to your README</h2>
    <p>Replace <code>YOUR_SERVER</code> with the base URL where this service is deployed, and
       <code>your-username</code> with your GitHub login.</p>

    <pre><code>![GitHub Stats](https://YOUR_SERVER/api/stats?username=your-username)

![Top Languages](https://YOUR_SERVER/api/top-langs?username=your-username)</code></pre>

    <p>Or with a clickable link to your profile:</p>
    <pre><code>[![GitHub Stats](https://YOUR_SERVER/api/stats?username=your-username)](https://github.com/your-username)</code></pre>

    <h2>GitHub Token (optional but recommended)</h2>
    <p>Set the <code>GITHUB_TOKEN</code> environment variable to a personal access token to raise
       the API rate-limit from 60 to 5,000 requests/hour.</p>
    <pre><code>GITHUB_TOKEN=ghp_xxxx node src/index.js</code></pre>
  </div>
</body>
</html>`);
});

module.exports = router;
