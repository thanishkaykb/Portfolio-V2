/**
 * Cloudflare Worker for the Sites deployment.
 *
 * Everything is served from the static build except /api/github, which reads
 * Thanishka's public GitHub calendar (and public repositories) on the fly. The
 * result is cached for 15 minutes at the edge, so the portfolio's activity card
 * follows the GitHub account without a rebuild or a token.
 */

const HANDLE = "thanishkaykb";
const CONTRIBUTIONS_URL = `https://github.com/users/${HANDLE}/contributions`;
const REPOS_URL = `https://github.com/${HANDLE}?tab=repositories&sort=pushed`;
const CACHE_SECONDS = 900;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function levelFor(count) {
  return count <= 0 ? 0 : count < 10 ? 1 : count < 30 ? 2 : count < 60 ? 3 : 4;
}

function parseCalendar(html) {
  const dateById = new Map();
  const levelByDate = new Map();
  const dates = [];

  for (const match of html.matchAll(/<td\b[^>]*>/g)) {
    const tag = match[0];
    const date = /data-date="(\d{4}-\d{2}-\d{2})"/.exec(tag)?.[1];
    if (!date) continue;
    const id = /id="([^"]+)"/.exec(tag)?.[1];
    const level = Number(/data-level="(\d)"/.exec(tag)?.[1] ?? 0);
    dateById.set(id, date);
    levelByDate.set(date, level);
    dates.push(date);
  }

  const counts = new Map();
  for (const match of html.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/g)) {
    const date = dateById.get(match[1]);
    if (!date) continue;
    const found = /(\d[\d,]*) contribution/.exec(match[2]);
    counts.set(date, found ? Number(found[1].replace(/,/g, "")) : 0);
  }

  dates.sort();
  if (dates.length === 0) throw new Error("GitHub returned no contribution days");

  const days = dates.map((date) => {
    const count = counts.get(date) ?? 0;
    return [date, count, levelByDate.get(date) ?? levelFor(count)];
  });

  const weeks = [];
  for (let index = 0; index < days.length; index += 7) {
    const week = days.slice(index, index + 7);
    while (week.length < 7) week.push(["", 0, 0]);
    weeks.push(week);
  }

  const total = days.reduce((sum, day) => sum + day[1], 0);
  const activeDays = days.filter((day) => day[1] > 0).length;

  let bestDay = days[0];
  for (const day of days) if (day[1] > bestDay[1]) bestDay = day;

  let longestStreak = 0;
  let run = 0;
  for (const day of days) {
    run = day[1] > 0 ? run + 1 : 0;
    longestStreak = Math.max(longestStreak, run);
  }

  let currentStreak = 0;
  let cursor = days.length - 1;
  if (days[cursor][1] === 0) cursor -= 1;
  while (cursor >= 0 && days[cursor][1] > 0) {
    currentStreak += 1;
    cursor -= 1;
  }

  const months = new Map();
  for (const [date, count] of days) {
    const key = date.slice(0, 7);
    months.set(key, (months.get(key) ?? 0) + count);
  }
  const topMonths = [...months.entries()]
    .sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))
    .slice(0, 4)
    .map(([key, count]) => ({
      label: `${MONTHS[Number(key.slice(5, 7)) - 1]} ${key.slice(0, 4)}`,
      count,
    }));

  const monthLabels = [];
  let previous = null;
  weeks.forEach((week, index) => {
    const date = week[0][0];
    if (!date) return;
    const key = date.slice(0, 7);
    if (key === previous) return;
    monthLabels.push({ week: index, label: MONTHS[Number(key.slice(5, 7)) - 1] });
    previous = key;
  });

  return {
    rangeStart: days[0][0],
    rangeEnd: days[days.length - 1][0],
    total,
    activeDays,
    longestStreak,
    currentStreak,
    bestDay: { date: bestDay[0], count: bestDay[1] },
    topMonths,
    weeks,
    monthLabels,
  };
}

function decodeEntities(value) {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function readRepositories() {
  try {
    const response = await fetch(REPOS_URL, {
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; thanishka-portfolio)",
        accept: "text/html",
      },
      cf: { cacheTtl: CACHE_SECONDS, cacheEverything: true },
    });
    if (!response.ok) return { repositories: null, repositoryCount: null };

    const html = await response.text();
    const counter = /tab=repositories"[\s\S]{0,2000}?Counter">(\d+)</.exec(html);
    const own = html.split('itemprop="owns"').slice(1);
    const repositories = [];

    for (const block of own) {
      const tag = block.slice(0, 300);
      if (/\bfork\b/.test(tag)) continue;
      const name = /itemprop="name codeRepository"/.exec(block)
        ? /href="\/[^/]+\/([^/"]+)" itemprop="name codeRepository"/.exec(block)?.[1]
        : null;
      if (!name) continue;
      const pushedAt = /<relative-time datetime="([^"]+)"/.exec(block)?.[1] ?? "";
      const language = /itemprop="programmingLanguage">([^<]+)</.exec(block)?.[1] ?? "";
      const description = /itemprop="description"[^>]*>([\s\S]*?)<\/p>/.exec(block)?.[1] ?? "";

      repositories.push({
        name,
        description: decodeEntities(description),
        language: decodeEntities(language),
        stars: 0,
        url: `https://github.com/${HANDLE}/${name}`,
        pushedAt,
      });
      if (repositories.length === 4) break;
    }

    return {
      repositoryCount: counter ? Number(counter[1]) : null,
      repositories: repositories.length > 0 ? repositories : null,
    };
  } catch {
    return { repositories: null, repositoryCount: null };
  }
}

async function githubActivity() {
  const cacheKey = new Request("https://portfolio.internal/api/github", { method: "GET" });
  let cache = null;
  try {
    cache = caches.default;
    const hit = await cache.match(cacheKey);
    if (hit) return hit;
  } catch {
    cache = null;
  }

  let calendar;
  try {
    const response = await fetch(CONTRIBUTIONS_URL, {
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; thanishka-portfolio)",
        accept: "text/html",
      },
      cf: { cacheTtl: 300, cacheEverything: true },
    });
    if (!response.ok) throw new Error(`GitHub calendar answered ${response.status}`);
    calendar = parseCalendar(await response.text());
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "GitHub activity is unavailable", detail: String(error) }),
      {
        status: 502,
        headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
      },
    );
  }

  const repos = await readRepositories();
  const payload = {
    handle: HANDLE,
    profile: `https://github.com/${HANDLE}`,
    source: "github.com",
    fetchedAt: new Date().toISOString(),
    ...calendar,
    ...repos,
  };

  const response = new Response(JSON.stringify(payload), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": `public, max-age=300, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=600`,
      "access-control-allow-origin": "*",
    },
  });

  if (cache) {
    try {
      await cache.put(cacheKey, response.clone());
    } catch {
      // A cache miss on the next request is fine.
    }
  }

  return response;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/github") {
      if (request.method !== "GET" && request.method !== "HEAD") {
        return new Response("Method not allowed", { status: 405 });
      }
      return githubActivity();
    }
    return env.ASSETS.fetch(request);
  },
};
