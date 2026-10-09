# ❄️ seasonal-theme: self-expiring holiday themes for any website

A [Claude Code](https://docs.claude.com/en/docs/claude-code/overview) skill that adds a seasonal theme to any **React/Next.js (Vercel) or static website** with one command, typed into the Claude Code cloud session that manages your site's GitHub repo: falling weather effects, a themed announcement bar and an offer card with compliant terms.

The expiry date is **hardcoded and checked in the visitor's browser**, so the theme disappears for every visitor on the end date, even if the site is never redeployed.

**[📖 Docs site](https://itzkiro.github.io/Raid-Contractor-Marketing-Wesbite-Themes/)** · **[🎮 Live demo](https://itzkiro.github.io/Raid-Contractor-Marketing-Wesbite-Themes/demo/)** · **[📄 SKILL.md](skills/seasonal-theme/SKILL.md)**

> The docs site and live demo links work once GitHub Pages is enabled (see [Hosting the docs site](#hosting-the-docs-site)).

![Christmas theme on a demo site: emoji falling over the page and a navy-to-green promo bar](docs/assets/screenshots/hero-christmas.png)

---

## Contents

- [What it is](#what-it-is)
- [Quick start](#quick-start)
- [Installation](#installation)
- [Commands](#commands)
- [Options](#options)
- [Season catalog](#season-catalog)
- [Screenshots](#screenshots)
- [Why it's safe for production](#why-its-safe-for-production)
- [License](#license)

## What it is

The skill installs three coordinated, **time-boxed** layers. Each works on its own, and all three share one date gate:

| Layer | What it does |
|---|---|
| 🌨️ **Weather effect** | Falling animated emoji particles over every page, in pure CSS. No library, no network request. |
| 📣 **Announcement bar re-skin** | Seasonal gradient and promo headline on your existing bar. The normal bar comes back on its own after the end date. |
| 🏷️ **Offer card** | A promo card on your offers/landing page with the terms (price, commitment, exclusions, end date) printed beside the claim. |

After the end date the code renders nothing anywhere. Removing it is cleanup, not an emergency.

## Quick start

Built for websites that **live in a GitHub repo, deploy on Vercel**, and are run from a **Claude Code cloud session** (claude.ai/code or the Claude app) attached to that repo. You type everything into the Claude session; there's no local terminal involved.

```text
Website repo on GitHub  ──►  Claude Code cloud session  ──►  push / PR  ──►  Vercel preview  ──►  merge to main  ──►  Vercel production
```

1. **Install once:** paste the [install prompt](#installation) into a Claude session on your website repo. Claude adds the skill file and commits it.
2. **Start a new session** on the same repo. Skills are read when a session starts.
3. **Run a season:**
   ```text
   /seasonal-theme christmas --promo "Holiday deal: first month $1" --promo-href /offers --terms "$1 month one, then $49/mo; 12-month commitment; new customers only"
   ```
4. **Check the Vercel preview, then merge.** Claude pushes to a branch, Vercel builds a preview URL for it, and merging to `main` takes it to production.

You can also ask in plain words, e.g. *"put up the Christmas theme"*, *"make it snow"* or *"Valentine's hearts please"*.

## Installation

The skill is a single file. It has to be **committed inside your website repo** at `.claude/skills/seasonal-theme/SKILL.md`: a cloud session starts from a fresh clone of the repo every time, so anything not in the repo is gone in the next session.

### 1. Paste this into a Claude Code session on your website repo

```text
Install the seasonal-theme Claude Code skill into this repo.

Download https://raw.githubusercontent.com/Itzkiro/Raid-Contractor-Marketing-Wesbite-Themes/main/skills/seasonal-theme/SKILL.md
to .claude/skills/seasonal-theme/SKILL.md. If that host is blocked, run
git clone --depth 1 https://github.com/Itzkiro/Raid-Contractor-Marketing-Wesbite-Themes.git
in a temp folder and copy skills/seasonal-theme/ into .claude/skills/.

Don't edit the file and don't change anything else. Commit it as
"Add seasonal-theme Claude Code skill" and push.
```

Claude runs the equivalent of:

```bash
mkdir -p .claude/skills/seasonal-theme
curl -fsSL https://raw.githubusercontent.com/Itzkiro/Raid-Contractor-Marketing-Wesbite-Themes/main/skills/seasonal-theme/SKILL.md \
  -o .claude/skills/seasonal-theme/SKILL.md
git add .claude/skills/seasonal-theme && git commit -m "Add seasonal-theme Claude Code skill" && git push
```

### 2. Get it onto `main`

Cloud sessions push to their own `claude/...` branch. Open a PR for that branch (or ask Claude to) and merge it, so every new session on the repo starts with the skill. The skill is a Markdown file under `.claude/`, so Vercel ignores it and the site doesn't change.

### 3. Start a new session and check it loaded

Open a new Claude Code session on the repo and type `/`. `seasonal-theme` should be in the list, or ask *"what skills do you have?"*. If it's missing, check that the file is at exactly `.claude/skills/seasonal-theme/SKILL.md` on the branch the session started from.

### Shipping a theme with Vercel

1. Run `/seasonal-theme <season> ...` in the session. Claude installs the theme, checks it in a headless browser (live clock and a clock faked past the end date), commits and pushes to its branch.
2. Vercel builds a **preview deployment** for that branch. The link shows up on the PR and in the Vercel dashboard. Check the falling particles, the bar and the offer card there.
3. **Merge to `main`.** Vercel deploys to production.
4. On the end date the theme disappears by itself. No redeploy is needed. Run `/seasonal-theme off` in a later session to remove the code.

### Network access in the cloud environment

The install needs `raw.githubusercontent.com` or `github.com`, which the default *Trusted* network level allows. If your environment uses a stricter level and the download is blocked, add `raw.githubusercontent.com` under **Allowed domains**: open the cloud environment menu in the session's title bar, then **Edit → Network access**. See the [cloud environments docs](https://code.claude.com/docs/en/cloud-environments#network-access).

<details>
<summary>Installing from a local terminal instead</summary>

From the root of the website repo:

```bash
mkdir -p .claude/skills/seasonal-theme
curl -fsSL https://raw.githubusercontent.com/Itzkiro/Raid-Contractor-Marketing-Wesbite-Themes/main/skills/seasonal-theme/SKILL.md \
  -o .claude/skills/seasonal-theme/SKILL.md
git add .claude/skills/seasonal-theme && git commit -m "Add seasonal-theme Claude Code skill" && git push
```

Or with degit: `npx degit Itzkiro/Raid-Contractor-Marketing-Wesbite-Themes/skills/seasonal-theme .claude/skills/seasonal-theme`

</details>

## Commands

| Command | Action |
|---|---|
| `/seasonal-theme <season> [options]` | Install that season's theme from the [catalog](#season-catalog). |
| `/seasonal-theme off` | Remove the seasonal code entirely. It is inert after expiry either way. |
| `/seasonal-theme status` | Report which theme is installed, its end date, and whether it is currently live for visitors. |

### Recipes

```text
# Weather only
/seasonal-theme snow --ends 2027-01-15 --tz America/Chicago

# Full campaign: weather + bar + offer card
/seasonal-theme halloween --promo "Spooky-season special: $1 first month" --promo-href /offers --terms "$1 month one, then $49/mo; 12-month commitment; new customers only"

# Promo bar only
/seasonal-theme valentines --promo "Refer a friend, both save $25" --no-weather --no-card

# Subtle effect for a busy site
/seasonal-theme autumn --density low --no-bar --no-card

# Custom end date and time zone
/seasonal-theme summer --ends 2027-09-02 --tz Europe/London --promo "Summer kickoff: $1 first month"

# Check what's live, then take it down
/seasonal-theme status
/seasonal-theme off
```

## Options

| Flag | Value | Effect |
|---|---|---|
| `--ends` | `YYYY-MM-DD` | Override the default end date. The theme expires at 00:00 local in `--tz` on that date. |
| `--tz` | IANA zone, e.g. `America/New_York` | Time zone for the cutoff. Converted to a UTC timestamp, accounting for DST. |
| `--promo` | `"TEXT"` | Promo headline for the announcement bar and offer card. |
| `--promo-href` | path, e.g. `/offers` | Where the bar's promo links to. |
| `--terms` | `"a; b; c"` | Semicolon-separated offer terms, printed on the card beside the claim. |
| `--density` | `low` \| `normal` \| `high` | Particle count: roughly 10 / 20 / 32 on desktop, half on phones. |
| `--no-weather` | — | Skip the falling-particle layer. |
| `--no-bar` | — | Leave the announcement bar unchanged. |
| `--no-card` | — | Skip the offer card. |

## Season catalog

Defaults; all overridable.

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

## Screenshots

These are from the demo in [`docs/demo/`](docs/demo/index.html), a generic site running the skill's vanilla reference script. Click a screenshot to see it full size.

> **Try the demo yourself:** open `docs/demo/index.html` in a browser (no server needed), or use the [hosted demo](https://itzkiro.github.io/Raid-Contractor-Marketing-Wesbite-Themes/demo/) once GitHub Pages is enabled ([setup](#hosting-the-docs-site)).

### Every theme

| | | |
|:-:|:-:|:-:|
| [![halloween](docs/assets/screenshots/season-halloween.png)](docs/assets/screenshots/season-halloween.png)<br>`halloween` | [![christmas](docs/assets/screenshots/season-christmas.png)](docs/assets/screenshots/season-christmas.png)<br>`christmas` | [![new-year](docs/assets/screenshots/season-new-year.png)](docs/assets/screenshots/season-new-year.png)<br>`new-year` |
| [![valentines](docs/assets/screenshots/season-valentines.png)](docs/assets/screenshots/season-valentines.png)<br>`valentines` | [![st-patricks](docs/assets/screenshots/season-st-patricks.png)](docs/assets/screenshots/season-st-patricks.png)<br>`st-patricks` | [![spring](docs/assets/screenshots/season-spring.png)](docs/assets/screenshots/season-spring.png)<br>`spring` |
| [![summer](docs/assets/screenshots/season-summer.png)](docs/assets/screenshots/season-summer.png)<br>`summer` | [![autumn](docs/assets/screenshots/season-autumn.png)](docs/assets/screenshots/season-autumn.png)<br>`autumn` | [![snow](docs/assets/screenshots/season-snow.png)](docs/assets/screenshots/season-snow.png)<br>`snow` |
| [![rain](docs/assets/screenshots/season-rain.png)](docs/assets/screenshots/season-rain.png)<br>`rain` | | |

### Offer card with terms beside the claim

![Halloween offer card listing its terms next to the headline](docs/assets/screenshots/offer-card-halloween.png)

### Before and after the cutoff (same build)

| Live (`Date.now() < ENDS_UTC`) | Clock faked past the cutoff |
|:-:|:-:|
| ![Halloween theme live](docs/assets/screenshots/season-halloween.png) | ![Same page after expiry: plain bar, nothing falling](docs/assets/screenshots/expired-halloween.png) |

### Mobile (half density) and density levels

| Phone, 390px | `--density low` | `--density high` |
|:-:|:-:|:-:|
| <img src="docs/assets/screenshots/mobile-christmas.png" width="220" alt="Christmas theme on a phone"> | ![Autumn at low density](docs/assets/screenshots/density-low.png) | ![Autumn at high density](docs/assets/screenshots/density-high.png) |

<details>
<summary>Regenerate the screenshots</summary>

```bash
npm i -D playwright   # or use a global install
node scripts/screenshots.mjs
```

</details>

## Why it's safe for production

These rules come from production incidents. The skill makes Claude follow all of them on every install:

- **Client-side UTC date gate.** The cutoff is a hardcoded UTC timestamp compared with `Date.now()` in the browser. A server-side check on a static/SSG page is frozen at build time and never expires.
- **Mount-only rendering.** Server HTML never contains the theme, so there's no hydration mismatch and no SEO footprint.
- **`pointer-events: none` overlay.** It's fixed and clipped, with a z-index below your modals, cookie banners and sticky CTAs.
- **Hidden under `prefers-reduced-motion`.**
- **Skipped on conversion-critical routes.** Bare ad-landing and checkout pages stay clean, using the site's existing exclusion helper.
- **Half density on phones** (viewports under 640px).
- **`try/catch` around all storage.** Bare `localStorage` access throws in blocked cross-origin iframes and can take the whole page down.
- **Promo terms printed beside the claim.** Commitment, exclusions and end date go on the same card as the price headline. No fine-print pages.

The full rules and the React/Next.js and vanilla JS reference implementations are in [`skills/seasonal-theme/SKILL.md`](skills/seasonal-theme/SKILL.md), which is the canonical source.

## Repository layout

```
skills/seasonal-theme/SKILL.md   ← the skill (copy this into .claude/skills/)
docs/                            ← GitHub Pages site + live demo + screenshots
scripts/screenshots.mjs          ← regenerates docs/assets/screenshots
```

## Hosting the docs site

The docs site and live demo live in `docs/` and are served by GitHub Pages:

1. Merge to `main`.
2. Go to **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/docs`, then click **Save**.
3. After a minute or two the site is live at `https://itzkiro.github.io/Raid-Contractor-Marketing-Wesbite-Themes/`.

Until then, the links to the docs site and the hosted demo return 404.

## License

[MIT](LICENSE)
