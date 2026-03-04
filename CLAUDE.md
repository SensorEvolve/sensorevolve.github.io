# CLAUDE.md — SensorEvolve Portfolio

## Local Dev

Static site, no build step.

```bash
python -m http.server 8000
```

- Portfolio: `http://localhost:8000`
- Blog: `http://localhost:8000/blog.html`

## Deployment

- **Netlify** auto-deploys on every push to `master` (publishes from `/`)
- **GitHub Pages** lives at `sensorevolve.github.io` — separate repo, push with:
  ```bash
  git push ghpages master:main --force
  ```
  Always push both when making changes.

## Color Palette (Marathon / Y2K Cyberpunk)

Defined in `assets/css/style.css` `:root`:

| Variable | Value | Role |
|---|---|---|
| `--color-primary` | `#c2fe0b` | Acid lime — main accent |
| `--color-secondary` | `#ff2d78` | Neon pink |
| `--color-accent` | `#00cfff` | Electric blue |
| `--color-bg-dark` | `#080c14` | Page background |
| `--color-bg-light` | `#10172a` | Cards / panels |
| `--color-text-primary` | `#FFFFFF` | Body text |
| `--color-text-secondary` | `#8a9ab5` | Muted text |
| `--color-border` | `#1c2640` | Borders |

> Watch for hardcoded `rgba()` values in CSS — update those manually when changing the palette.

## Logo

Text-based, no image. Both `index.html` and `blog.html` use:
```html
<a href="#home" class="logo-text">SENSOR<span>EVOLVE</span></a>
```
Styled in `assets/css/style.css` under `.logo-text`.

## Adding a Project

1. Add a screenshot to `assets/` (e.g. `assets/myproject.png`)
2. Copy a project card block in `index.html` inside `.projects-grid`:

```html
<!-- Project Card N -->
<article class="project-card" data-project="N">
    <div class="project-image">
        <img src="assets/myproject.png" alt="Project Name">
    </div>
    <div class="project-info">
        <span class="project-category">Category · Type</span>
        <h3 class="project-title">Project Name</h3>
        <p class="project-description">Description here.</p>
        <div class="project-tags">
            <span class="tag">React</span>
            <span class="tag">Node.js</span>
        </div>
        <!-- Optional: App Store link -->
        <a href="https://..." target="_blank" class="app-store-link">
            <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store" class="app-store-badge">
        </a>
    </div>
</article>
```

3. Increment `data-project="N"` to the next number.

## Blog / Journal

Posts live in:
- `blog/posts/journal/YYYY-MM-DD.md` — daily git journal entries
- `blog/posts/notebook/` — freeform technical posts

After adding or editing any post, regenerate the index:
```bash
node blog/update-index.js
```

Auto-generate today's journal from git activity:
```
/journal
```

## 3D Globe

File: `assets/js/globe.js`

- Models (`.glb`) live in `assets/3d/`
- Add new models by following the `addYacht()` / `addDrone()` pattern — pass lat/lon and the model is auto-positioned on the globe
- Ring colors: yacht = `0xc2fe0b` (lime), drone = `0xff2d78` (pink)

## Contact

Terminal-style section in `index.html` — no form, just email + copy-to-clipboard.
Update social links (`X`, `Instagram`, `GitHub`) in the `.terminal-socials` block in `index.html`.
