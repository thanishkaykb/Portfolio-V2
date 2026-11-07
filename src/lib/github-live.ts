import { useEffect, useState } from "react";
import { githubContributions } from "./github-contributions";

/**
 * Live GitHub activity.
 *
 * The generated snapshot in github-contributions.ts is always present, so the
 * card renders with real numbers on any static host (Vercel has no serverless
 * route here, and requesting a missing /api/github only logs a 404).
 *
 * A deployment that DOES serve a JSON feed (for example the Cloudflare Worker
 * in sites/worker.js, which reads the public contribution calendar from GitHub
 * and caches it for fifteen minutes) opts in by setting VITE_GITHUB_ENDPOINT at
 * build time. Without it, no request is made and the snapshot is used, which is
 * the correct behaviour for a static Vercel deployment.
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

/** Optional JSON feed; unset on a static host such as Vercel. */
const ENDPOINT: string = (import.meta.env.VITE_GITHUB_ENDPOINT as string | undefined)?.trim() ?? "";

let pending: Promise<GithubActivityData | null> | null = null;

function loadActivity() {
  if (!ENDPOINT) return Promise.resolve(null);
  if (!pending) {
    pending = fetch(ENDPOINT, { headers: { accept: "application/json" } })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: GithubActivityData | null) => {
        if (!data || !Array.isArray(data.weeks) || data.weeks.length === 0) return null;
        return data;
      })
      .catch(() => null);
  }
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
