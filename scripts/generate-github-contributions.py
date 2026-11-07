#!/usr/bin/env python3
"""Regenerate src/lib/github-contributions.ts from GitHub's public calendar.

GitHub's GraphQL contributions API needs a token, but the public profile
fragment https://github.com/users/<handle>/contributions is server rendered and
carries every day's count in its tooltips. This script parses that fragment so
the activity card always shows the real numbers.

Usage: python3 scripts/generate-github-contributions.py [handle]
"""

from __future__ import annotations

import json
import re
import sys
import urllib.request
from datetime import date, datetime, timedelta

HANDLE = sys.argv[1] if len(sys.argv) > 1 else "thanishkaykb"
URL = f"https://github.com/users/{HANDLE}/contributions"
OUT = "src/lib/github-contributions.ts"
MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

request = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0"})
html = urllib.request.urlopen(request, timeout=30).read().decode("utf-8")

# Every cell is a <td data-date="YYYY-MM-DD" ... data-level="N">, and its count
# lives in a <tool-tip for="cell-id">N contributions on ...</tool-tip>.
cell_ids = dict(
    re.findall(r'<td[^>]*data-date="([^"]+)"[^>]*id="([^"]+)"', html)
    + re.findall(r'<td[^>]*id="([^"]+)"[^>]*data-date="([^"]+)"', html)
)
id_to_date = {cell_id: day for day, cell_id in cell_ids.items()}
if not id_to_date:
    for match in re.finditer(r"<td\b[^>]*>", html):
        tag = match.group(0)
        day = re.search(r'data-date="([^"]+)"', tag)
        cell_id = re.search(r'id="([^"]+)"', tag)
        if day and cell_id:
            id_to_date[cell_id.group(1)] = day.group(1)

levels = {}
for match in re.finditer(r"<td\b[^>]*>", html):
    tag = match.group(0)
    day = re.search(r'data-date="([^"]+)"', tag)
    level = re.search(r'data-level="(\d)"', tag)
    if day and level:
        levels[day.group(1)] = int(level.group(1))

counts = {}
for match in re.finditer(r'<tool-tip[^>]*for="([^"]+)"[^>]*>(.*?)</tool-tip>', html, re.S):
    cell_id, text = match.group(1), match.group(2)
    day = id_to_date.get(cell_id)
    if day is None:
        continue
    found = re.search(r"(\d[\d,]*) contribution", text)
    counts[day] = int(found.group(1).replace(",", "")) if found else 0

days = sorted(day for day in counts if day)
if not days:
    raise SystemExit("no contribution days parsed")

# GitHub's grid runs Sunday to Saturday, one <td> per week column, top to bottom.
ordered = [counts[day] for day in days]
weeks = []
for start in range(0, len(ordered), 7):
    chunk = ordered[start:start + 7]
    week_days = days[start:start + 7]
    weeks.append(
        [
            [day, count, levels.get(day, 0)]
            for day, count in zip(week_days, chunk)
        ]
        + [["", 0, 0]] * (7 - len(chunk))
    )

range_start, range_end = days[0], days[-1]
total = sum(counts.values())
active_days = sum(1 for count in counts.values() if count > 0)
header = re.search(r"([\d,]+)\s*contributions\s*in the last year", html)
header_total = int(header.group(1).replace(",", "")) if header else None
if header_total is not None and header_total != total:
    raise SystemExit(f"parsed total {total} does not match page total {header_total}")

best_day, best_count = None, -1
for day in days:
    if counts[day] > best_count:
        best_day, best_count = day, counts[day]

longest = run = 0
for day in days:
    run = run + 1 if counts[day] > 0 else 0
    longest = max(longest, run)

current = 0
cursor = len(days) - 1
if counts[days[cursor]] == 0 and cursor > 0:
    cursor -= 1
while cursor >= 0 and counts[days[cursor]] > 0:
    current += 1
    cursor -= 1

months: dict[str, int] = {}
for day in days:
    key = day[:7]
    months[key] = months.get(key, 0) + counts[day]
top_months = sorted(months.items(), key=lambda item: (-item[1], item[0]))[:4]
top_months = [
    {"label": f"{MONTHS[int(key[5:7]) - 1]} {key[:4]}", "count": count}
    for key, count in top_months
]

month_labels = []
previous = None
for index, week in enumerate(weeks):
    if not week[0][0]:
        continue
    month = int(week[0][0][5:7])
    if previous is not None and week[0][0][:7] == previous:
        continue
    month_labels.append({"week": index, "label": MONTHS[month - 1]})
    previous = week[0][0][:7]

data = {
    "handle": HANDLE,
    "profile": f"https://github.com/{HANDLE}",
    "rangeStart": range_start,
    "rangeEnd": range_end,
    "total": total,
    "activeDays": active_days,
    "longestStreak": longest,
    "currentStreak": current,
    "bestDay": {"date": best_day, "count": best_count},
    "topMonths": top_months,
    "weeks": weeks,
    "monthLabels": month_labels,
}

fetched = datetime.now().strftime("%Y-%m-%d")
body = (
    f"// Generated from {URL}\n"
    f"// Range: {range_start} to {range_end}, fetched {fetched}\n"
    "export type ContributionDay = [date: string, count: number, level: number];\n\n"
    f"export const githubContributions = {json.dumps(data, separators=(',', ':'))} as const;\n"
)
with open(OUT, "w", encoding="utf-8") as handle:
    handle.write(body)

print(
    f"{total} contributions, {active_days} active days,"
    f" longest {longest}, current {current}, {len(weeks)} weeks"
)
