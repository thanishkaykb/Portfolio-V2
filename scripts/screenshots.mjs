/**
 * Visual QC pass. Requires the dev server on :3000 and playwright chromium.
 *   node scripts/screenshots.mjs
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const OUT = "artifacts";
mkdirSync(OUT, { recursive: true });

const sections = [
  ["skills", "doors"],
  ["ability", "ability"],
  ["about", "about"],
  ["story", "story"],
  ["projects", "projects"],
  ["web", "web"],
  ["experience", "experience"],
  ["frames", "frames"],
  ["contact", "contact"],
];

const errors = [];

async function collect(page, label) {
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`[${label}] ${message.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`[${label}] PAGEERROR ${error.message}`));
}

async function gotoSection(page, id) {
  await page.evaluate((sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 60 });
  }, id);
  await page.waitForTimeout(1300);
}

const browser = await chromium.launch({
  args: [
    "--no-sandbox",
    "--disable-gpu",
    "--use-gl=swiftshader",
    "--in-process-gpu",
    "--disable-dev-shm-usage",
  ],
});

/* ---------------- desktop, reduced motion (deterministic layout) -------- */
const desktop = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
const page = await desktop.newPage();
await collect(page, "desktop");
await page.goto("http://127.0.0.1:3000/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}/desktop-hero.png` });

for (const [id, name] of sections) {
  await gotoSection(page, id);
  await page.screenshot({ path: `${OUT}/desktop-${name}.png` });
}

// door overlay
await gotoSection(page, "skills");
await page.getByRole("button", { name: /Open door 01/i }).first().click();
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}/desktop-door-open.png` });

// case study
await gotoSection(page, "projects");
await page.getByRole("button", { name: /Read the case study/i }).first().click();
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}/desktop-case-study.png` });
await page.keyboard.press("Escape");

/* ---------------- desktop, full motion (hero) --------------------------- */
const motionContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const motionPage = await motionContext.newPage();
await collect(motionPage, "motion");
await motionPage.goto("http://127.0.0.1:3000/", { waitUntil: "domcontentloaded" });
await motionPage.waitForTimeout(3600);
await motionPage.screenshot({ path: `${OUT}/desktop-hero-motion.png` });
await gotoSection(motionPage, "skills");
await motionPage.screenshot({ path: `${OUT}/desktop-doors-motion.png` });

/* ---------------- tablet ------------------------------------------------ */
const tablet = await browser.newContext({
  viewport: { width: 834, height: 1112 },
  reducedMotion: "reduce",
});
const tabletPage = await tablet.newPage();
await collect(tabletPage, "tablet");
await tabletPage.goto("http://127.0.0.1:3000/", { waitUntil: "domcontentloaded" });
await tabletPage.waitForTimeout(1200);
await tabletPage.screenshot({ path: `${OUT}/tablet-hero.png` });
await gotoSection(tabletPage, "skills");
await tabletPage.screenshot({ path: `${OUT}/tablet-doors.png` });
await gotoSection(tabletPage, "projects");
await tabletPage.screenshot({ path: `${OUT}/tablet-projects.png` });

/* ---------------- mobile ------------------------------------------------ */
const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  reducedMotion: "reduce",
});
const mobilePage = await mobile.newPage();
await collect(mobilePage, "mobile");
await mobilePage.goto("http://127.0.0.1:3000/", { waitUntil: "domcontentloaded" });
await mobilePage.waitForTimeout(1200);
await mobilePage.screenshot({ path: `${OUT}/mobile-hero.png` });

const overflow = await mobilePage.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
);
await mobilePage.getByRole("button", { name: /Open menu/i }).click();
await mobilePage.waitForTimeout(600);
await mobilePage.screenshot({ path: `${OUT}/mobile-menu.png` });
await mobilePage.keyboard.press("Escape");
await mobilePage.waitForTimeout(400);

for (const [id, name] of [
  ["skills", "doors"],
  ["ability", "ability"],
  ["about", "about"],
  ["story", "story"],
  ["projects", "projects"],
  ["frames", "frames"],
  ["contact", "contact"],
]) {
  await gotoSection(mobilePage, id);
  await mobilePage.screenshot({ path: `${OUT}/mobile-${name}.png` });
}

const overflowAfter = await mobilePage.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
);

await browser.close();
console.log(JSON.stringify({ errors, overflow, overflowAfter }, null, 2));
