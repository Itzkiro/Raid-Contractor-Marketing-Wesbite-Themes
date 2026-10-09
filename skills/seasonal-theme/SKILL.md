---
name: seasonal-theme
description: >
  Install, switch, or remove a self-expiring seasonal theme on any
  React/Next.js (Vercel) or static website: falling-element "weather
  effects" (snow, hearts, pumpkins, leaves, sparkles, rain), a themed
  announcement bar with a promo headline, and an offer card with
  compliant terms. Use when the user asks for a holiday or seasonal
  theme, falling/animated elements, a snow/Halloween/Christmas/
  Valentine's effect, or a limited-time seasonal offer. Commands:
  /seasonal-theme <season> [options], /seasonal-theme off,
  /seasonal-theme status.
---

# Seasonal Theme — self-expiring holiday themes for any site

Adds three coordinated, **time-boxed** layers to a website, each of which
disappears automatically for every visitor at a hardcoded end date — even
if the site is never redeployed:

1. **Weather effect** — falling animated elements (emoji particles) over
   every page, like the classic WordPress "falling elements" plugins, in
   pure CSS. No library, no network request.
2. **Announcement bar re-skin** — seasonal gradient + promo headline that
   reverts to the site's normal bar after the end date.
3. **Offer card** — a promo card on the offers/landing page with the
   deal's terms printed directly beside the claim (price, commitment,
   exclusions, end date).

Any layer can be used alone. All three share one date gate.

## Commands

| Command | Action |
|---|---|
| `/seasonal-theme <season>` | Install that season's theme (see catalog). Options below. |
| `/seasonal-theme <season> --promo "TEXT" --promo-href /offers --terms "a; b; c"` | Include the promo bar headline and the offer card with those terms. |
| `/seasonal-theme <season> --ends YYYY-MM-DD --tz America/New_York` | Override the default end date. The theme expires at 00:00 local in `--tz` on that date. |
| `/seasonal-theme <season> --density low\|normal\|high` | Particle count (roughly 10/20/32 desktop; half on phones). |
| `/seasonal-theme <season> --no-weather` / `--no-bar` / `--no-card` | Skip a layer. |
| `/seasonal-theme off` | Remove the seasonal code entirely (it is inert after expiry either way). |
| `/seasonal-theme status` | Report which theme is installed, its end date, and whether it is currently live for visitors. |

When the user names a season casually ("put up the Christmas theme",
"make it snow", "Valentine's hearts please"), treat it as the command.

## Season catalog (defaults — all overridable)

| Season key | Particles | Bar gradient (from → via → to) | Accent | Default end (local) |
|---|---|---|---|---|
| `halloween` | 🎃 🦇 👻 🍂 🍁 🕸️ | `#1a0b2e → #38185c → #1a0b2e` | `text-orange-300` / badge `bg-orange-500` | Nov 1 |
| `christmas` | ❄️ 🎄 ⛄ 🎁 ✨ | `#0b1f3a → #14532d → #0b1f3a` | `text-red-300` / badge `bg-red-500` | Dec 26 |
| `new-year` | ✨ 🎆 ⭐ 🥂 | `#111111 → #3b2f0b → #111111` | `text-yellow-300` / badge `bg-yellow-400` | Jan 2 |
| `valentines` | ❤️ 💘 💝 🌹 | `#4c0519 → #881337 → #4c0519` | `text-pink-300` / badge `bg-pink-500` | Feb 15 |
| `st-patricks` | ☘️ 🍀 ✨ | `#052e16 → #166534 → #052e16` | `text-green-300` / badge `bg-green-500` | Mar 18 |
| `spring` | 🌸 🌷 🦋 🐝 | `#1e3a5f → #2563eb → #1e3a5f` | `text-pink-200` / badge `bg-pink-400` | configurable |
| `summer` | ☀️ 🌊 🍉 😎 | `#0c4a6e → #0891b2 → #0c4a6e` | `text-yellow-200` / badge `bg-yellow-400` | configurable |
| `autumn` | 🍂 🍁 🌰 | `#431407 → #9a3412 → #431407` | `text-amber-200` / badge `bg-amber-500` | Nov 30 |
| `snow` | ❄️ (only) | keep site bar | — | configurable |
| `rain` | 💧 (only) | keep site bar | — | configurable |

`snow` and `rain` default to `--no-bar --no-card` (pure weather).

## Non-negotiable engineering rules

These come from production incidents — follow all of them.

1. **Client-side date gate, never server-side.** Static/SSG pages freeze
   server date checks at build time, so a server gate never expires.
   Hardcode the cutoff as a UTC timestamp (convert the end date at 00:00
   in the requested timezone to UTC) and compare against `Date.now()` in
   the browser:
   ```ts
   // Nov 1, 00:00 America/New_York (EDT, UTC-4) == 04:00 UTC
   const ENDS_UTC = Date.UTC(2026, 10, 1, 4, 0, 0);
   ```
   Mind DST when converting (ET is UTC-4 in Oct, UTC-5 in Jan).
2. **Render only after mount.** Server HTML must never contain the theme
   (`useState(false)` + `useEffect(() => setOn(Date.now() < ENDS_UTC))`),
   otherwise hydration mismatches and SEO/meta churn. Vanilla variant:
   run from a deferred script, append to `document.body`.
3. **Overlay must be harmless.** `position: fixed; inset: 0;
   pointer-events: none; overflow: hidden;` and a z-index BELOW the
   site's modals, cookie banners, and sticky CTAs (audit the site's
   z-indexes first; pick e.g. `z-30` when popups are `z-50+`).
4. **Respect reduced motion.** Hide the entire particle field under
   `@media (prefers-reduced-motion: reduce)`.
5. **Skip conversion-critical pages.** If the site has bare ad-landing /
   checkout routes, exclude the weather and bar there (find the site's
   existing "bare route" or layout-suppression mechanism and reuse it).
6. **Mobile gets half density** (`window.innerWidth < 640`). Phone first
   views are already crowded; seasonal fun must not add friction.
7. **Never touch `localStorage`/`sessionStorage` without try/catch.**
   In cross-origin iframes with storage blocked, bare access THROWS and
   can take down the whole page via the framework error boundary.
8. **Promo terms sit beside the claim.** If the theme carries an offer
   ("$1 first month"), the commitment, exclusions, and end date must be
   printed on the same card the price headline is on — no fine-print
   pages. FTC-defensible by construction.
9. **Negative animation delays** (`delay: -rand * cycle`) so the sky is
   already mid-fall on first paint instead of an empty screen.
10. **Leave expiry inert, remove at leisure.** After the end date the
    code renders null everywhere; deleting it is cleanup, not urgency.

## Reference implementation — React / Next.js (App Router)

Create `components/seasonal-theme.tsx` (adapt names/paths to the host
repo; `"use client"` is required):

```tsx
"use client";

import * as React from "react";

// ===== EDIT PER SEASON ======================================================
/** Expires <END DATE> 00:00 <TZ> — written as the UTC equivalent. */
const ENDS_UTC = Date.UTC(2026, 10, 1, 4, 0, 0);
const PARTICLES = ["🎃", "🦇", "👻", "🍂", "🍁", "🕸️"]; // season catalog
const DESKTOP_COUNT = 20; // density normal; low=10 high=32
// ============================================================================

export function useSeason(): boolean {
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    setOn(Date.now() < ENDS_UTC);
  }, []);
  return on;
}

type Particle = {
  left: number; size: number; duration: number;
  delay: number; sway: number; emoji: string; opacity: number;
};

export function SeasonalWeather() {
  const on = useSeason();
  const [particles, setParticles] = React.useState<Particle[] | null>(null);

  React.useEffect(() => {
    if (!on) return;
    const count =
      window.innerWidth < 640 ? Math.ceil(DESKTOP_COUNT / 2) : DESKTOP_COUNT;
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        size: 13 + Math.random() * 15,
        duration: 9 + Math.random() * 11,
        delay: -Math.random() * 20, // mid-fall on first paint
        sway: 3.5 + Math.random() * 4.5,
        emoji: PARTICLES[i % PARTICLES.length],
        opacity: 0.35 + Math.random() * 0.4,
      }))
    );
  }, [on]);

  // If the host site has bare/checkout routes, also return null for them
  // here (reuse its own route-exclusion helper).
  if (!on || !particles) return null;
  return (
    <div
      aria-hidden
      data-seasonal-weather
      className="szn-field pointer-events-none fixed inset-0 z-30 overflow-hidden print:hidden"
    >
      <style>{`
        @keyframes szn-fall { from { transform: translateY(-8vh); } to { transform: translateY(110vh); } }
        @keyframes szn-sway { 0%, 100% { transform: translateX(0) rotate(-16deg); } 50% { transform: translateX(26px) rotate(16deg); } }
        @media (prefers-reduced-motion: reduce) { .szn-field { display: none; } }
      `}</style>
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 will-change-transform"
          style={{
            left: `${p.left}%`, fontSize: `${p.size}px`, opacity: p.opacity,
            animation: `szn-fall ${p.duration}s linear ${p.delay}s infinite`,
          }}
        >
          <span
            className="inline-block"
            style={{ animation: `szn-sway ${p.sway}s ease-in-out ${p.delay}s infinite` }}
          >
            {p.emoji}
          </span>
        </span>
      ))}
    </div>
  );
}
```

Mount `<SeasonalWeather />` once — ideally inside the site's existing
announcement-bar or layout component so route exclusions are shared.

**Announcement bar:** in the site's bar component, call `useSeason()` and
swap the wrapper gradient, text colors, and headline while `true`; the
original bar is the `false` branch, so reversion is automatic.

**Offer card:** a gated component on the offers page, header in the
season gradient, headline + sub, then the terms list (rule 8) and a CTA
to the site's quote/checkout flow. Return `null` when `useSeason()` is
false. Localize if the site has language variants.

## Reference implementation — vanilla JS (static sites)

For plain HTML/Astro/11ty sites, one deferred script, no framework:

```html
<script defer>
(() => {
  var ENDS_UTC = Date.UTC(2026, 10, 1, 4, 0, 0);
  if (Date.now() >= ENDS_UTC) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var EMOJI = ["🎃","🦇","👻","🍂","🍁","🕸️"];
  var N = innerWidth < 640 ? 10 : 20;
  var field = document.createElement("div");
  field.setAttribute("aria-hidden", "true");
  field.style.cssText = "position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:30";
  var css = document.createElement("style");
  css.textContent = "@keyframes szn-fall{from{transform:translateY(-8vh)}to{transform:translateY(110vh)}}@keyframes szn-sway{0%,100%{transform:translateX(0) rotate(-16deg)}50%{transform:translateX(26px) rotate(16deg)}}";
  document.head.appendChild(css);
  for (var i = 0; i < N; i++) {
    var outer = document.createElement("span");
    var inner = document.createElement("span");
    var dur = 9 + Math.random() * 11, delay = -Math.random() * 20;
    outer.style.cssText = "position:absolute;top:0;left:" + (Math.random() * 100) + "%;font-size:" + (13 + Math.random() * 15) + "px;opacity:" + (0.35 + Math.random() * 0.4) + ";will-change:transform;animation:szn-fall " + dur + "s linear " + delay + "s infinite";
    inner.style.cssText = "display:inline-block;animation:szn-sway " + (3.5 + Math.random() * 4.5) + "s ease-in-out " + delay + "s infinite";
    inner.textContent = EMOJI[i % EMOJI.length];
    outer.appendChild(inner); field.appendChild(outer);
  }
  document.body.appendChild(field);
})();
</script>
```

## Install procedure (what Claude does on `/seasonal-theme <season>`)

1. **Scout the host repo**: framework (Next/React vs static), where the
   layout and announcement bar live, existing z-index ceiling, any
   bare-route/landing exclusion helper, language variants, offers page.
2. **Compute the cutoff**: end date at 00:00 in the given timezone →
   UTC timestamp. State the exact expiry moment in your summary.
3. **Install** the component(s) from the catalog row, wiring the bar and
   card only if asked (promo text/terms supplied or implied).
4. **Verify with a headless browser** before shipping:
   - Active clock: particles exist, are animating (element positions
     change between two samples), bar shows the seasonal headline, card
     shows terms; mobile viewport shows ~half the particles.
   - **Faked future clock** (init-script overriding `Date.now` past the
     cutoff): zero seasonal elements, bar reverted, card gone.
   - Conversion pages (if any were excluded): clean.
5. **Commit** with the expiry date in the message. If the host deploys
   from main (Vercel git integration), merging/pushing IS the deploy.

## Removal (`/seasonal-theme off`)

Delete the seasonal component file, revert the bar's seasonal branch,
remove the card include, build, verify the bar shows its normal content,
commit. Safe any time — before expiry it ends the promo early; after
expiry it is pure cleanup.
