# GitHub Profile Analyzer

A lightweight Node.js API that generates embeddable **SVG stat cards** for any
GitHub profile. Drop the card URLs into your `README.md` and your stats are
always fresh.

---

## ✨ Features

| Card | What it shows |
|------|---------------|
| **Stats Card** | Total stars, forks, public repos, followers, following |
| **Top Languages Card** | Most-used programming languages with a % progress bar |

Both cards return dark-themed SVG images that look great in GitHub READMEs.

---

## 🚀 Quick start

```bash
# 1. Clone and install dependencies
git clone https://github.com/anupchauhanak6/GitHub-Profile-Analyzer.git
cd GitHub-Profile-Analyzer
npm install

# 2. (Optional) set a GitHub personal access token to avoid rate limits
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx

# 3. Start the server
npm start
# → GitHub Profile Analyzer listening on http://localhost:3000
```

---

## 📡 API Reference

### `GET /api/stats?username=<login>`

Returns an SVG card with the user's GitHub statistics.

**Query parameters**

| Parameter  | Required | Description              |
|------------|----------|--------------------------|
| `username` | ✅ yes   | GitHub login name        |

**Example**

```
http://localhost:3000/api/stats?username=torvalds
```

---

### `GET /api/top-langs?username=<login>[&limit=5]`

Returns an SVG card showing the most-used programming languages across all
non-forked public repositories.

**Query parameters**

| Parameter  | Required | Default | Description                          |
|------------|----------|---------|--------------------------------------|
| `username` | ✅ yes   | —       | GitHub login name                    |
| `limit`    | ❌ no    | `5`     | Number of languages to show (1–10)   |

**Example**

```
http://localhost:3000/api/top-langs?username=torvalds&limit=6
```

---

## 🖼 Add to your README

Replace `YOUR_SERVER` with your deployed base URL and `your-username` with
your GitHub login:

```markdown
## 📊 GitHub Stats

![GitHub Stats](https://git-hub-profile-analyzer-self.vercel.app/api/stats?username=your-username)

## 🗂 Top Languages

![Top Languages](https://git-hub-profile-analyzer-self.vercel.app/api/top-langs?username=your-username)
```

Clickable version (links to your GitHub profile):

```markdown
[![GitHub Stats](https://git-hub-profile-analyzer-self.vercel.app/api/stats?username=your-username)](https://github.com/your-username)
```

---

## 🔑 GitHub Token (recommended)

Without a token the GitHub REST API allows **60 requests per hour**.  
With a token the limit rises to **5,000 requests per hour**.

```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

Create a token at <https://github.com/settings/tokens> — no scopes are
required for reading public data.

---

## 🛠 Project structure

```
src/
  index.js              ← Express app entry point
  routes/
    index.js            ← Landing / documentation page
    api.js              ← /api/stats and /api/top-langs routes
  services/
    github.js           ← GitHub REST API client (with pagination)
  cards/
    statsCard.js        ← SVG Stats Card renderer
    topLangsCard.js     ← SVG Top Languages Card renderer
  utils/
    cache.js            ← In-memory TTL cache
    helpers.js          ← XML escaping, clamp
tests/
  statsCard.test.js
  topLangsCard.test.js
  cache.test.js
  helpers.test.js
```

---

## 🧪 Tests

```bash
npm test
```

32 unit tests covering card renderers, cache behaviour, and utility helpers.

---

## ⚙️ Environment variables

| Variable       | Default | Description                          |
|----------------|---------|--------------------------------------|
| `PORT`         | `3000`  | TCP port the server listens on       |
| `GITHUB_TOKEN` | —       | Optional GitHub personal access token|

---

## 📄 License

MIT
