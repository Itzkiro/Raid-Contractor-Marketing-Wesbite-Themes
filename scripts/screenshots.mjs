// Regenerates docs/assets/screenshots from the demo page.
// Usage: npm i -D playwright && node scripts/screenshots.mjs
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../docs");
const OUT = path.join(ROOT, "assets/screenshots");
fs.mkdirSync(OUT, { recursive: true });
// shot=1 hides the demo control panel; seed=7 makes particle placement reproducible.
const url = (q) => "file://" + path.join(ROOT, "demo/index.html") + "?shot=1&seed=7&" + q;

const SEASONS = ["halloween", "christmas", "new-year", "valentines", "st-patricks", "spring", "summer", "autumn", "snow", "rain"];
const DESKTOP = { width: 1280, height: 800 };
const PHONE = { width: 390, height: 844 };

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});

async function shot(name, query, viewport, { dpr = 1, mobile = false, scroll = 0 } = {}) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: dpr, isMobile: mobile, hasTouch: mobile });
  const page = await ctx.newPage();
  await page.goto(url(query));
  await page.waitForTimeout(400);
  if (scroll) await page.evaluate((y) => window.scrollTo(0, y), scroll);
  await page.waitForTimeout(200);
  const particles = await page.locator("[data-seasonal-weather] > span").count();
  await page.screenshot({ path: path.join(OUT, `${name}.png`) });
  console.log(`${name}.png  particles=${particles}`);
  await ctx.close();
}

for (const s of SEASONS) await shot(`season-${s}`, `season=${s}`, DESKTOP);
await shot("hero-christmas", "season=christmas&density=high", DESKTOP, { dpr: 2 });
await shot("offer-card-halloween", "season=halloween", DESKTOP, { scroll: 470 });
await shot("expired-halloween", "season=halloween&expired=1", DESKTOP);
await shot("mobile-christmas", "season=christmas", PHONE, { mobile: true, dpr: 2 });
await shot("density-low", "season=autumn&density=low", DESKTOP);
await shot("density-high", "season=autumn&density=high", DESKTOP);

await browser.close();
