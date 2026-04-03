/**
 * GitHub API service — fetches user profile, repositories, and language data
 * using GitHub's REST API (no token required for public data, but a token
 * is strongly recommended to avoid rate-limiting).
 */

const BASE_URL = "https://api.github.com";

/**
 * Build request headers.  If a GITHUB_TOKEN env-var is set it will be used
 * to authenticate, raising the rate-limit from 60 to 5 000 req/h.
 */
function buildHeaders() {
  const headers = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "github-profile-analyzer",
  };
  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

/**
 * Fetch a single JSON resource from the GitHub API.
 * Throws an Error with a human-readable message on non-2xx responses.
 */
async function fetchJSON(url) {
  // Dynamic import keeps the module compatible with older Node versions that
  // bundle fetch natively but still ship as ESM-only via node-fetch ≥3.
  const { default: fetch } =
    typeof globalThis.fetch === "function"
      ? { default: globalThis.fetch }
      : await import("node-fetch");

  const res = await fetch(url, { headers: buildHeaders() });
  if (res.status === 404) throw new Error("User not found");
  if (res.status === 403) throw new Error("GitHub API rate limit exceeded");
  if (!res.ok)
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  return res.json();
}

/**
 * Fetch a user's public profile data.
 * @param {string} username
 * @returns {Promise<object>} GitHub user object
 */
async function fetchUserProfile(username) {
  return fetchJSON(`${BASE_URL}/users/${username}`);
}

/**
 * Fetch all public repositories for a user (handles pagination).
 * @param {string} username
 * @returns {Promise<object[]>} Array of repository objects
 */
async function fetchUserRepos(username) {
  const repos = [];
  let page = 1;
  while (true) {
    const batch = await fetchJSON(
      `${BASE_URL}/users/${username}/repos?per_page=100&page=${page}&type=owner`
    );
    if (batch.length === 0) break;
    repos.push(...batch);
    if (batch.length < 100) break;
    page++;
  }
  return repos;
}

/**
 * Aggregate the bytes-per-language across all of a user's repositories.
 * @param {object[]} repos  Array of repository objects
 * @returns {Promise<object>} Map of { language: totalBytes }
 */
async function fetchLanguageStats(repos) {
  const langMap = {};
  const languageRequests = repos
    .filter((r) => !r.fork && r.language) // skip forks and repos with no language
    .map((r) =>
      fetchJSON(r.languages_url).catch(() => ({})) // ignore individual failures
    );

  const results = await Promise.all(languageRequests);
  for (const langData of results) {
    for (const [lang, bytes] of Object.entries(langData)) {
      langMap[lang] = (langMap[lang] || 0) + bytes;
    }
  }
  return langMap;
}

/**
 * Fetch aggregate profile stats for a user.
 * Returns an object used by the Stats Card renderer.
 */
async function fetchStats(username) {
  const [profile, repos] = await Promise.all([
    fetchUserProfile(username),
    fetchUserRepos(username),
  ]);

  const totalStars = repos.reduce((acc, r) => acc + r.stargazers_count, 0);
  const totalForks = repos.reduce((acc, r) => acc + r.forks_count, 0);

  return {
    name: profile.name || profile.login,
    login: profile.login,
    avatarUrl: profile.avatar_url,
    bio: profile.bio || "",
    followers: profile.followers,
    following: profile.following,
    publicRepos: profile.public_repos,
    totalStars,
    totalForks,
    createdAt: profile.created_at,
  };
}

/**
 * Fetch top languages (by byte count) for a user's non-forked repos.
 * @param {string} username
 * @param {number} [limit=5]  Maximum number of languages to return
 */
async function fetchTopLanguages(username, limit = 5) {
  const repos = await fetchUserRepos(username);
  const langMap = await fetchLanguageStats(repos);

  const sorted = Object.entries(langMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);

  const total = sorted.reduce((acc, [, v]) => acc + v, 0);

  return sorted.map(([name, bytes]) => ({
    name,
    bytes,
    percentage: total > 0 ? Math.round((bytes / total) * 100) : 0,
  }));
}

module.exports = { fetchStats, fetchTopLanguages };
