# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Local Development

This is a static site — no build step required. Serve it with:

```bash
python -m http.server 8000
# or
npx http-server -p 8000
```

Open `http://localhost:8000` for the portfolio and `http://localhost:8000/blog.html` for the blog.

## Deployment

Pushing to `master` triggers an automatic Netlify deploy. The site publishes from the root directory (`publish = "."`). No build command is configured.

## Architecture

**Portfolio (`index.html`)** is a single-page static site using:
- **Three.js** (via importmap CDN, v0.170) for the interactive 3D globe
- **GSAP** (CDN) with ScrollTrigger and ScrollToPlugin for animations
- All JS in `assets/js/`: `globe.js` (Three.js globe + GLB model loading), `animations.js` (GSAP scroll animations), `main.js` (nav/utilities), `starfield.js`, `getStarfield.js`, `threeGeoJSON.js`
- CSS variables for the color scheme are defined at the top of `assets/css/style.css`

**Blog (`blog.html`)** is a separate static page:
- Reads `blog/posts.json` (auto-generated index) to list posts
- Renders markdown client-side using `assets/js/blog.js`
- Posts live in `blog/posts/journal/` (date-prefixed: `YYYY-MM-DD-title.md`) or `blog/posts/notebook/`
- After adding/modifying posts, regenerate the index: `node blog/update-index.js`

**Globe 3D models** (`.glb` files in `assets/3d/`) are positioned using lat/lon → spherical coordinates conversion. The `addYacht()` and `addDrone()` methods in `globe.js` are the reference patterns for adding new models.

## Blog Workflow

Use `/journal` to auto-generate a journal entry from today's git activity. It saves to `blog/posts/journal/YYYY-MM-DD.md` and updates the index.

To create posts manually:
1. Write markdown to the appropriate `blog/posts/` subdirectory
2. Run `node blog/update-index.js` to refresh `blog/posts.json`
