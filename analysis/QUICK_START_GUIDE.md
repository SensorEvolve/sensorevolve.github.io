# Quick Start Guide - Implementing Lando Norris Design Patterns

## 🎨 Color Palette Reference

```css
/* Copy these exact colors for the Lando Norris look */
:root {
  --lime: #d2ff00;      /* ████ Primary accent - use sparingly for CTAs */
  --dark: #282c20;      /* ████ Main background */
  --cream: #f4f4ed;     /* ████ Text on dark backgrounds */
  --black: #111112;     /* ████ True black for depth */
  --grey: #b9bbad;      /* ████ Secondary text */
}
```

### Color Usage Rules
1. **80% dark backgrounds** (#282c20)
2. **15% cream/white text** (#f4f4ed)
3. **5% lime accents** (#d2ff00) - CTAs, hovers, highlights only

---

## 📦 Essential Libraries

### 1. Install Lenis (Smooth Scroll)
```bash
npm install @studio-freight/lenis
```

```javascript
// Initialize smooth scrolling
import Lenis from '@studio-freight/lenis'

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  smooth: true,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)
```

### 2. Install Rive (Vector Animations)
```bash
npm install @rive-app/canvas
```

```javascript
// Load Rive animation
import { Rive } from '@rive-app/canvas'

const r = new Rive({
  src: 'animation.riv',
  canvas: document.getElementById('canvas'),
  autoplay: true,
})
```

### 3. Install Three.js (3D Graphics)
```bash
npm install three
```

---

## 🚀 Quick Implementation Example

### HTML Structure
```html
<!DOCTYPE html>
<html lang="en" class="lenis">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Racing Driver Portfolio</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <!-- Navigation -->
  <nav class="nav">
    <div class="container">
      <a href="#" class="nav-logo">Logo</a>
      <div class="nav-links">
        <a href="#" class="nav-link active">Home</a>
        <a href="#" class="nav-link">About</a>
        <a href="#" class="nav-link">Gallery</a>
        <a href="#store" class="btn btn-primary">Store</a>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="hero">
    <div class="hero-content">
      <p class="text-eyebrow text-lime">McLaren F1 Driver</p>
      <h1 class="hero-title">Your Name</h1>
      <h2 class="hero-subtitle">Redefining limits, fighting for wins</h2>
      <a href="#about" class="btn btn-primary">Learn More</a>
    </div>
  </section>

  <!-- Image Grid -->
  <section class="section section-light">
    <div class="container">
      <div class="grid-bento-2col">
        <div class="img-card grid-item-span-2">
          <img src="image1.jpg" alt="Racing">
          <div class="img-overlay">
            <p class="text-eyebrow">Monaco GP, 2024</p>
          </div>
        </div>
        <div class="img-card">
          <img src="image2.jpg" alt="Podium">
          <div class="img-overlay">
            <p class="text-eyebrow">Victory</p>
          </div>
        </div>
        <div class="img-card">
          <img src="image3.jpg" alt="Portrait">
        </div>
      </div>
    </div>
  </section>

  <script src="app.js"></script>
</body>
</html>
```

### Minimal CSS
```css
/* Import the CSS snippets from CSS_SNIPPETS.css */
@import url('CSS_SNIPPETS.css');

/* Your custom styles here */
```

---

## 🎬 Animation Patterns

### 1. Fade In on Scroll
```css
.fade-in {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.75s cubic-bezier(0.65, 0.05, 0, 1),
              transform 0.75s cubic-bezier(0.65, 0.05, 0, 1);
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}
```

```javascript
// Intersection Observer for scroll animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
```

### 2. Hover Scale Effect
```css
.hover-scale {
  transition: transform 0.75s cubic-bezier(0.65, 0.05, 0, 1);
}

.hover-scale:hover {
  transform: scale(1.05);
}
```

### 3. Button Hover Glow
```css
.btn-glow {
  position: relative;
  overflow: hidden;
}

.btn-glow::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at center,
    rgba(210, 255, 0, 0.3) 0%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.75s cubic-bezier(0.65, 0.05, 0, 1);
}

.btn-glow:hover::before {
  opacity: 1;
}
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */

/* Mobile: 320px - 767px (default styles) */

/* Tablet: 768px - 991px */
@media (min-width: 768px) {
  :root {
    --text--h1: 3.5rem;
    --padding--container: 2rem;
  }
}

/* Desktop: 992px - 1920px */
@media (min-width: 992px) {
  :root {
    --text--impact: 7.9375rem;
    --text--h1: 4rem;
    --text--h2: 4.5rem;
  }
}

/* Large Desktop: 1920px+ */
@media (min-width: 1920px) {
  .container {
    max-width: 1920px;
  }
}
```

---

## 🛠️ Webflow Alternative (No-Code)

If you want the Webflow experience without coding:

1. **Sign up:** [webflow.com](https://webflow.com)
2. **Start from blank** or use a template
3. **Import colors:** Use the color palette above
4. **Add fonts:** Upload Brier or use similar (like Druk)
5. **Install Lenis:** Custom code in site settings
6. **Build visually:** Drag and drop components

### Webflow Custom Code (in Site Settings)
```html
<!-- In <head> -->
<link rel="stylesheet" href="https://unpkg.com/@studio-freight/lenis@1.0.0/dist/lenis.css">

<!-- Before </body> -->
<script src="https://unpkg.com/@studio-freight/lenis@1.0.0/dist/lenis.min.js"></script>
<script>
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  })

  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }

  requestAnimationFrame(raf)
</script>
```

---

## 🎯 Component Checklist

Use this checklist when building a similar site:

- [ ] Fixed navigation with scroll effect
- [ ] Full-screen hero with large typography
- [ ] Signature brand color (lime green equivalent)
- [ ] Dark theme as primary
- [ ] Image grid with varied sizes (bento box)
- [ ] Horizontal scroll gallery
- [ ] Smooth scrolling (Lenis)
- [ ] Hover animations on all interactive elements
- [ ] Pill-shaped buttons (large border-radius)
- [ ] Generous spacing (3-5rem between sections)
- [ ] Variable fonts for performance
- [ ] WebP images
- [ ] Mobile-first responsive design
- [ ] Footer with social links
- [ ] Custom cursor (optional, advanced)

---

## 💡 Pro Tips

### 1. Typography
- **Don't use pure white** - use cream (#f4f4ed) for softer look
- **Line height 1.65** for body text, 1.1 for headings
- **Letter spacing** slightly increased on uppercase text

### 2. Colors
- **Lime green is powerful** - use it strategically
- **Create hierarchy** with color opacity (75%, 50%, 25%)
- **Test contrast** - ensure WCAG AA compliance

### 3. Performance
- **Variable fonts** = 1 file instead of 6
- **WebP images** = 30% smaller than JPEG
- **Lazy load** images below the fold
- **Preload hero image** for instant LCP

### 4. Animation
- **0.75s duration** feels professional
- **Custom cubic-bezier** feels more natural than ease
- **Animate transform and opacity** (GPU accelerated)
- **Avoid animating** width, height, top, left (slow)

### 5. Images
- **High quality** photography is essential
- **Consistent aspect ratios** in grids
- **Add captions** with overlays
- **Use filters** for brand consistency

---

## 📚 Recommended Reading

- [Lenis Documentation](https://github.com/studio-freight/lenis)
- [Rive Tutorials](https://rive.app/learn)
- [Three.js Journey](https://threejs-journey.com/)
- [Webflow University](https://university.webflow.com/)
- [CSS Tricks - Custom Properties](https://css-tricks.com/a-complete-guide-to-custom-properties/)

---

## 🎨 Alternative Fonts (Free)

If you can't use Brier or Mona Sans:

**Display (instead of Brier):**
- Druk (paid but similar)
- Anton (Google Fonts - free)
- Bebas Neue (Google Fonts - free)
- Archivo Black (Google Fonts - free)

**Body (instead of Mona Sans):**
- Inter Variable (Google Fonts - free)
- Public Sans Variable (Google Fonts - free)
- Manrope Variable (Google Fonts - free)
- DM Sans (Google Fonts - free)

---

## ✅ Final Checklist

Before launching your site:

- [ ] Test on mobile, tablet, desktop
- [ ] Check all animations are smooth (60fps)
- [ ] Verify all links work
- [ ] Optimize images (WebP, correct sizes)
- [ ] Test loading speed (PageSpeed Insights)
- [ ] Verify accessibility (WAVE, axe DevTools)
- [ ] Check browser compatibility
- [ ] Add meta tags (OG, Twitter cards)
- [ ] Set up analytics
- [ ] Add favicon

---

*You now have everything you need to recreate the Lando Norris website style!*
