# SensorEvolve - Portfolio Website

A modern, responsive portfolio website inspired by the Lando Norris design patterns. Features a dark theme with neon purple accents, smooth scrolling, and elegant animations.

## 🎨 Design Features

- **Signature Color:** Neon Purple (#a855f7)
- **Theme:** Dark mode with high contrast
- **Typography:** Inter variable font family
- **Animations:** Smooth fade-in effects, hover interactions
- **Layout:** Responsive grid system, mobile-first design

## 📁 Project Structure

```
generic_website/
├── index.html          # Main HTML file
├── styles.css          # All styles and responsive design
├── app.js              # Interactive functionality
├── README.md           # This file
└── analysis/           # Lando Norris analysis files
    ├── LANDONORRIS_ANALYSIS.md
    ├── CSS_SNIPPETS.css
    ├── QUICK_START_GUIDE.md
    └── data.json
```

## 🚀 Quick Start

### Option 1: Open Locally

1. Simply open `index.html` in your web browser
2. No build process required - pure HTML/CSS/JS

### Option 2: Use Live Server (Recommended)

If you have VS Code with Live Server extension:

```bash
# Right-click on index.html
# Select "Open with Live Server"
```

Or use Python's built-in server:

```bash
cd generic_website
python -m http.server 8000
# Open http://localhost:8000 in your browser
```

Or use Node.js with npx:

```bash
npx serve .
```

## 📄 Sections

### 1. Hero Section
- Full-screen hero with large typography
- Animated gradient text effect
- Dual CTA buttons
- Scroll indicator

### 2. About Section
- Two-column layout (content + image)
- Stats grid showing achievements
- Clean, readable typography

### 3. Projects Section
- Bento-box style grid layout
- Hover effects on project cards
- Technology tags
- Varied card sizes for visual interest

### 4. Skills Section
- Four main categories:
  - Hardware & Sensors
  - Software Development
  - Cloud & DevOps
  - Data & Analytics
- Icon-based cards with hover effects

### 5. Contact Section
- Contact information display
- Functional contact form
- Form validation
- Success/error states

### 6. Footer
- Multi-column layout
- Social links
- Legal links
- Copyright information

## 🎯 Key Features

### Smooth Scrolling
- Custom smooth scroll implementation
- Works with all anchor links
- 1-second animation duration

### Scroll Animations
- Fade-in effect on scroll
- Intersection Observer API for performance
- Elements animate once when entering viewport

### Navigation
- Fixed navigation with scroll effect
- Becomes opaque with backdrop blur on scroll
- Active link highlighting based on current section
- Fully responsive mobile menu

### Form Handling
- Client-side form validation
- Loading states
- Success/error feedback
- Ready to connect to backend

### Responsive Design
- Mobile-first approach
- Breakpoints at 768px and 992px
- Touch-friendly navigation
- Optimized for all screen sizes

## 🎨 Color Palette

```css
/* Brand Colors */
--color--purple: #a855f7;           /* Primary accent */
--color--purple-dark: #7c3aed;      /* Hover states */
--color--purple-light: #c084fc;     /* Highlights */

/* Dark Theme */
--color--dark: #0f0f23;             /* Main background */
--color--dark-tint-1: #1a1a2e;      /* Cards */
--color--dark-tint-2: #25253f;      /* Borders */
--color--black: #000000;            /* Footer */

/* Neutrals */
--color--white: #f5f5f7;            /* Text on dark */
--color--grey: #9ca3af;             /* Secondary text */
```

## 📱 Responsive Breakpoints

```css
/* Desktop First */
Default: 1400px max-width

/* Tablet */
@media (max-width: 992px)
- Single column layouts
- Adjusted typography

/* Mobile */
@media (max-width: 768px)
- Mobile menu
- Stacked sections
- Full-width buttons

/* Small Mobile */
@media (max-width: 480px)
- Reduced padding
- Hidden scroll indicator
```

## 🛠️ Customization Guide

### Change Colors

Edit the CSS variables in `styles.css`:

```css
:root {
  --color--purple: #your-color;
  /* Change other colors as needed */
}
```

### Add Your Images

Replace the placeholder divs with your images:

```html
<!-- Before -->
<div class="image-placeholder">
  <!-- Placeholder content -->
</div>

<!-- After -->
<img src="your-image.jpg" alt="Description">
```

### Update Content

1. Edit text in `index.html`
2. Update project cards
3. Modify skills lists
4. Change contact information

### Connect Form to Backend

In `app.js`, replace the form submission simulation:

```javascript
// Replace this:
await new Promise(resolve => setTimeout(resolve, 1500));

// With your actual API call:
const response = await fetch('your-api-endpoint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});
```

## 🚀 Deployment

### Netlify (Recommended)

1. Create account at [netlify.com](https://netlify.com)
2. Drag & drop the `generic_website` folder
3. Site goes live instantly
4. Free custom domain support

### Vercel

```bash
npm i -g vercel
vercel
```

### GitHub Pages

1. Create GitHub repository
2. Push code
3. Enable GitHub Pages in repository settings
4. Select branch and root folder

## ⚡ Performance Tips

### Already Implemented:
- ✅ Debounced scroll events
- ✅ Intersection Observer for animations
- ✅ CSS transforms (GPU accelerated)
- ✅ Passive event listeners
- ✅ Minimal JavaScript
- ✅ No external dependencies

### Further Optimization:
- Add actual images and optimize with WebP format
- Implement lazy loading for images
- Minify CSS and JS for production
- Add service worker for PWA functionality

## 🎁 Features & Easter Eggs

### Konami Code
Try typing: ↑ ↑ ↓ ↓ ← → ← → B A

### Optional Enhancements
Uncomment in `app.js` to enable:
- Cursor glow effect following mouse

## 📦 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers

## 🔧 Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern layouts (Grid, Flexbox)
- **Vanilla JavaScript** - No frameworks
- **Google Fonts** - Inter font family

## 📝 Credits

- Design inspired by [landonorris.com](https://landonorris.com)
- Icons: Hand-coded SVG
- Font: [Inter](https://fonts.google.com/specimen/Inter) by Rasmus Andersson

## 📄 License

This is a portfolio template - feel free to use and customize for your own projects!

## 🤝 Contributing

Want to improve this template?
1. Fork the repository
2. Make your changes
3. Submit a pull request

---

**Built with 💜 by SensorEvolve**

*For questions or feedback, reach out at hello@sensorevolve.com*
