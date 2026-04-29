# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development

This is a **static website with no build step, framework, or package manager**. To preview locally:

```bash
python -m http.server 8000
# or
npx serve .
```

## Architecture

The site follows a **shell-rendered MPA** pattern:

- **Every HTML page** has only `<div id="site-header">` and `<div id="site-footer">` placeholders. On `DOMContentLoaded`, `app.js:renderShell()` injects the full nav bar and footer into both placeholders from templates defined in JS.
- **Each page** sets `data-page` on `<body>` (e.g., `data-page="home"`). The `initPage()` router in `app.js` dispatches to the correct initializer based on this value.
- **Data** is loaded at runtime via `fetch()` from static JSON files in `data/`. The homepage fetches `data/cases.json` and `data/news-index.json` in parallel. News detail pages fetch individual `data/news/{id}.json` files.
- **Images** are served from the remote CDN at `https://sensekernel.com/image/`. Relative paths in news content are rewritten by `normalizeRichContent()`.
- **Styling** is a single file, `styles.css`, using CSS custom properties for a dark NASA-inspired theme. Google Fonts ("Barlow Condensed" for headings, "IBM Plex Sans" for body) are loaded via `@import`.

## Key conventions

- Sticky header with backdrop blur; mobile hamburger toggle at ≤860px.
- Three responsive breakpoints: 1100px, 860px, 640px.
- Scroll-reveal animations via `[data-reveal]` attribute + IntersectionObserver.
- `data/cases.json` uses a columnar/table-like format normalized by `normalizeCollection()` — rows are transposed from parallel arrays into objects. Each case has `category` ("detection" | "monitoring"), `visible`, and `order` fields used for filtering and sorting.
- The `SITE` config object in `app.js` holds brand name, contact info, and the external subscription platform URL.
- Navigation items (`NAV_ITEMS`), footer link groups (`FOOTER_GROUPS`), and monitoring sectors (`MONITORING_SECTORS`) are hardcoded arrays in `app.js`.
- News content JSON files embed base64 images inline in the `content` field as full HTML.
