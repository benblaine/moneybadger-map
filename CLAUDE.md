# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MoneyBadger Merchant Map — a static, zero-build interactive map showing Bitcoin Lightning merchants in South Africa. Built with MapLibre GL JS + CARTO Dark Matter tiles. No build step, no server, no API keys.

## Development

Open `index.html` directly in a browser. No install or build commands. To deploy, upload the folder to any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages).

## Architecture

This is a single-page static site with no build toolchain:

- **`index.html`** — Self-contained HTML/CSS/JS. All application logic lives in a single `<script>` block. MapLibre GL JS and fonts are loaded from CDN.
- **`merchants.json`** — GeoJSON FeatureCollection. This is the sole data source. Each Feature has `name`, `address`, `category` (required) and optional `image`/`logo` properties.
- **`assets/`** — SVG brand logos (light/dark variants).

### Map Layers (defined in `initLayers()`)

Four MapLibre layers on a single `merchants` GeoJSON source with clustering enabled:
1. `clusters` — circle layer for clustered points
2. `cluster-count` — symbol layer showing cluster counts
3. `pins` — circle layer for individual merchants, color-coded by category
4. `pin-glow` — translucent circle behind each pin for glow effect

### Category System

Categories and their colors are defined in `CATEGORY_COLORS` (line ~98). To add a new category: add it to `CATEGORY_COLORS`, add a filter button in the HTML `#filters` section, and add the color to the `'circle-color'` match expression in the `pins` layer paint.

Built-in: `fuel` (#4FC3F7), `retail` (#81C784), `food` (#FF8A65), `community` (#CE93D8). Fallback: `other` (#F5A623).

### Key Globals

`allData` (raw GeoJSON), `activeFilter` (category string or `'all'`), `searchQuery` (text), `map` (MapLibre instance), `popup` (current popup).

### Merchant Data Format

GeoJSON coordinates are `[longitude, latitude]` (not lat,lng). South Africa ranges: lon 16–33, lat -22 to -35.

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update docs after shipping → invoke document-release
- Weekly retro → invoke retro
- Design system, brand → invoke design-consultation
- Visual audit, design polish → invoke design-review
- Architecture review → invoke plan-eng-review
- Save progress, checkpoint, resume → invoke checkpoint
- Code quality, health check → invoke health
