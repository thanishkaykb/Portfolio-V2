import { useEffect, useState } from "react";
import { githubContributions } from "./github-contributions";

/**
 * Live GitHub activity.
 *
 * The Worker at /api/github reads the public contribution calendar (and the
 * public repositories) straight from GitHub and caches the result for fifteen
 * minutes. The generated snapshot in github-contributions.ts is the fallback,
 * so the card still renders if the endpoint is unreachable.
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

let pending: Promise<GithubActivityData | null> | null = null;

function loadActivity() {
  if (!pending) {
    pending = fetch("/api/github", { headers: { accept: "application/json" } })
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
