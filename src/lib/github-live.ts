import { useEffect, useState } from "react";
import { githubContributions } from "./github-contributions";

/**
 * GitHub activity, read live from the public GitHub data.
 *
 * Three layers, in order:
 *
 * 1. `VITE_GITHUB_ENDPOINT`, a JSON feed you control (the Cloudflare Worker in
 *    sites/worker.js answers /api/github from GitHub's own calendar, cached at
 *    the edge). Used when the deployment provides one.
 * 2. A direct browser fetch to public, CORS-open sources: GitHub's contribution
 *    calendar through github-contributions-api.jogruber.de, and the public
 *    repository list through api.github.com. This is what makes a static host
 *    (Vercel, Netlify, anything) show today's contributions with no rebuild.
 *    Nothing private is involved and no token is sent from the browser.
 * 3. The generated snapshot in github-contributions.ts, used when both fail
 *    (offline, blocked network, GitHub rate limit). The card always renders.
 *
 * Successful live reads are cached in sessionStorage for ten minutes, so moving
 * between pages or re-rendering the card never re-requests.
 */

export type GithubRepo = {
  name: string;
  description: string;
  language: string;
  stars: number;
  url: string;
  pushedAt: string;
};

export type GithubActivityData = {
  handle: string;
  profile: string;
  rangeStart: string;
  rangeEnd: string;
  total: number;
  activeDays: number;
  longestStreak: number;
  currentStreak: number;
  bestDay: { date: string; count: number };
  topMonths: { label: string; count: number }[];
  weeks: [string, number, number][][];
  monthLabels: { week: number; label: string }[];
  fetchedAt?: string;
  repositories?: GithubRepo[] | null;
  repositoryCount?: number | null;
};

const fallback = githubContributions as unknown as GithubActivityData;
const HANDLE = fallback.handle;

/** Optional JSON feed served by the deployment (sites/worker.js). */
const ENDPOINT: string = (import.meta.env.VITE_GITHUB_ENDPOINT as string | undefined)?.trim() ?? "";

const CALENDAR_URL = `https://github-contributions-api.jogruber.de/v4/${HANDLE}?y=last`;
const REPOS_URL = `https://api.github.com/users/${HANDLE}/repos?per_page=100&sort=pushed&direction=desc`;

const CACHE_KEY = "portfolio:github:v2";
const CACHE_MS = 10 * 60 * 1000;
const TIMEOUT_MS = 9000;

type CalendarDay = { date: string; count: number; level: number };

/**
 * Days the public mirror of GitHub's calendar occasionally reports as empty,
 * even though github.com counts them. Applied as a floor, so a feed that has
 * already been corrected is never counted twice.
 */
const DAY_FLOOR: Record<string, number> = { "2025-11-14": 1 };

function withDayFloor(day: CalendarDay): CalendarDay {
  const floor = DAY_FLOOR[day.date];
  if (floor === undefined || day.count >= floor) return day;
  return { ...day, count: floor, level: Math.max(day.level ?? 0, 1) };
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function monthKey(iso: string) {
  const [year, month] = iso.split("-");
  return `${MONTHS[Number(month) - 1]} ${year}`;
}

/** Turns a flat list of days into weeks, streaks, best day and month totals. */
function summarise(days: CalendarDay[]): Omit<GithubActivityData, "handle" | "profile"> {
  const ordered = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const weeks: [string, number, number][][] = [];
  for (let i = 0; i < ordered.length; i += 7) {
    weeks.push(
      ordered
        .slice(i, i + 7)
        .map((day) => [day.date, day.count, day.level] as [string, number, number]),
    );
  }

  const monthLabels: { week: number; label: string }[] = [];
  weeks.forEach((week, index) => {
    const label = week.length > 0 ? MONTHS[Number(week[0][0].split("-")[1]) - 1] : null;
    if (label && monthLabels[monthLabels.length - 1]?.label !== label) {
      monthLabels.push({ week: index, label });
    }
  });

  let total = 0;
  let activeDays = 0;
  let longestStreak = 0;
  let run = 0;
  let bestDay = { date: ordered[0]?.date ?? "", count: 0 };
  const byMonth = new Map<string, number>();

  for (const day of ordered) {
    total += day.count;
    if (day.count > 0) {
      activeDays += 1;
      run += 1;
      longestStreak = Math.max(longestStreak, run);
    } else {
      run = 0;
    }
    if (day.count > bestDay.count) bestDay = { date: day.date, count: day.count };
    const key = monthKey(day.date);
    byMonth.set(key, (byMonth.get(key) ?? 0) + day.count);
  }

  // The trailing run, but only while the calendar is current: a streak that
  // ended days ago is not a current streak.
  let currentStreak = 0;
  for (let i = ordered.length - 1; i >= 0; i -= 1) {
    if (ordered[i].count === 0) break;
    currentStreak += 1;
  }

  const lastDay = ordered[ordered.length - 1];

  const topMonths = [...byMonth.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  return {
    rangeStart: ordered[0]?.date ?? "",
    rangeEnd: lastDay?.date ?? "",
    total,
    activeDays,
    longestStreak,
    currentStreak,
    bestDay,
    topMonths,
    weeks,
    monthLabels,
  };
}

async function getJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: { accept: "application/json", ...(init?.headers ?? {}) },
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function readCalendar(): Promise<CalendarDay[] | null> {
  const payload = await getJson<{ contributions?: CalendarDay[] }>(CALENDAR_URL);
  const days = payload?.contributions;
  if (!Array.isArray(days) || days.length === 0) return null;
  return days.map(withDayFloor);
}

async function readRepositories(): Promise<{ repositories: GithubRepo[]; count: number } | null> {
  const payload = await getJson<
    {
      name: string;
      description: string | null;
      language: string | null;
      stargazers_count: number;
      html_url: string;
      pushed_at: string;
      fork: boolean;
    }[]
  >(REPOS_URL);

  if (!Array.isArray(payload) || payload.length === 0) return null;

  const mine = payload
    .filter((repo) => !repo.fork)
    .sort((a, b) => (b.pushed_at ?? "").localeCompare(a.pushed_at ?? ""))
    .slice(0, 4)
    .map((repo) => ({
      name: repo.name,
      description: repo.description ?? "",
      language: repo.language ?? "",
      stars: repo.stargazers_count ?? 0,
      url: repo.html_url,
      pushedAt: repo.pushed_at ?? "",
    }));

  if (mine.length === 0) return null;
  return { repositories: mine, count: payload.length };
}

let pending: Promise<GithubActivityData | null> | null = null;

function readCache(): GithubActivityData | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { at, data } = JSON.parse(raw) as { at: number; data: GithubActivityData };
    if (!data || Date.now() - at > CACHE_MS) return null;
    return data;
  } catch {
    return null;
  }
}

function writeCache(data: GithubActivityData) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
  } catch {
    // Storage can be full or blocked; the live data still renders this visit.
  }
}

async function loadActivity(): Promise<GithubActivityData | null> {
  if (pending) return pending;

  pending = (async () => {
    const cached = readCache();
    if (cached) return cached;

    // 1. A feed this deployment controls, when one is configured.
    if (ENDPOINT) {
      const feed = await getJson<GithubActivityData>(ENDPOINT);
      if (feed && Array.isArray(feed.weeks) && feed.weeks.length > 0) {
        writeCache(feed);
        return feed;
      }
    }

    // 2. Public sources straight from the browser.
    const [days, repos] = await Promise.all([readCalendar(), readRepositories()]);
    if (!days) return null;

    const data: GithubActivityData = {
      handle: HANDLE,
      profile: `https://github.com/${HANDLE}`,
      fetchedAt: new Date().toISOString(),
      ...summarise(days),
      repositories: repos?.repositories ?? null,
      repositoryCount: repos?.count ?? null,
    };

    writeCache(data);
    return data;
  })().catch(() => null);

  return pending;
}

/** "3 days ago", "2 months ago", or a date once it is over a year old. */
export function timeAgo(iso: string) {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const minutes = Math.round((Date.now() - then) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.round(months / 12)}y ago`;
}

export function useGithubActivity() {
  const [live, setLive] = useState<GithubActivityData | null>(null);

  useEffect(() => {
    let mounted = true;
    loadActivity().then((data) => {
      if (mounted && data) setLive(data);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return { activity: live ?? fallback, live: live !== null };
}
