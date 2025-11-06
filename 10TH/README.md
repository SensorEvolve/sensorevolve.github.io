# 10TH Portfolio Website

A stunning portfolio website inspired by landonorris.com, featuring a stylized Three.js globe, bold typography, and vibrant animations.

## 🎨 Design Features

- **Interactive Three.js Globe** - A stylized 3D globe with particles, glowing rings, and interactive rotation
- **Bold Typography** - Large, impactful text inspired by modern sports branding
- **Vibrant Color Palette** - Eye-catching gradients and accent colors
- **Smooth Animations** - GSAP-powered scroll animations and transitions
- **Responsive Design** - Fully responsive across all devices
- **Modern UI/UX** - Clean, professional interface with engaging interactions

## 🛠️ Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid, Flexbox, and custom properties
- **JavaScript (ES6+)** - Vanilla JS with class-based architecture
- **Three.js** - 3D globe rendering and WebGL graphics
- **GSAP** - Advanced animations and scroll-triggered effects
- **ScrollTrigger** - Scroll-based animation plugin

## 📁 Project Structure

```
10TH/
├── index.html              # Main HTML file
├── assets/
│   ├── css/
│   │   └── style.css      # Main stylesheet
│   ├── js/
│   │   ├── globe.js       # Three.js globe component
│   │   ├── animations.js  # GSAP animations
│   │   └── main.js        # General functionality
│   └── images/            # Image assets (placeholder)
└── README.md              # This file
```

## 🚀 Getting Started

### Quick Start

1. **Clone or download this folder**
2. **Open `index.html` in a modern web browser**
3. That's it! The site uses CDN links for libraries, so no build process is required.

### Local Development

For local development with a proper server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## ✏️ Customization Guide

### 1. Basic Information

**Update the following placeholders in `index.html`:**

- **Site Title** (line 6): Change "10TH - Portfolio Showcase"
- **Hero Text** (lines 25-29): Update the three title lines
- **Hero Subtitle** (line 30): Update the tagline
- **About Section** (lines 42-82): Replace placeholder stats and feature descriptions
- **Contact Information** (lines 180-194): Update email and social media links
- **Footer** (lines 202-235): Update footer content and links

### 2. Projects

**Replace placeholder projects in `index.html` (lines 87-172):**

For each project card, update:
- `project-category` - Project type (Web Development, Mobile App, etc.)
- `project-title` - Project name
- `project-description` - Brief description
- `project-tags` - Technology tags
- `project-link` - Link to project (or remove if not applicable)
- `project-placeholder` - Replace with actual images

**To add project images:**
```html
<!-- Replace this: -->
<div class="project-placeholder">PROJECT IMAGE</div>

<!-- With this: -->
<img src="assets/images/project-name.jpg" alt="Project Name">
```

### 3. Colors

**Update color scheme in `assets/css/style.css` (lines 9-15):**

```css
:root {
    --color-primary: #FF6B35;      /* Orange accent */
    --color-secondary: #00D9FF;    /* Cyan accent */
    --color-accent: #F72585;       /* Pink accent */
    --color-bg-dark: #0A0A0A;      /* Dark background */
    --color-bg-light: #1A1A1A;     /* Light background */
    --color-text-primary: #FFFFFF; /* Primary text */
    --color-text-secondary: #B0B0B0; /* Secondary text */
}
```

### 4. Logo

**Replace "10TH" text with your logo:**

Option 1 - Update text (line 16 in `index.html`):
```html
<div class="logo">YOUR BRAND</div>
```

Option 2 - Use image logo:
```html
<img src="assets/images/logo.svg" alt="Your Brand" class="logo">
```

### 5. Globe Customization

**Modify globe appearance in `assets/js/globe.js`:**

- **Colors** (lines 58-71): Change globe material colors
- **Size** (line 51): Adjust `SphereGeometry` radius
- **Rotation Speed** (line 216): Modify auto-rotation speed
- **Particles** (lines 97-130): Change particle count and colors
- **Rings** (lines 85-95): Adjust ring colors and positions

### 6. Animations

**Customize animation timings in `assets/js/animations.js`:**

- **Duration** (line 11): Change default animation duration
- **Stagger** (line 13): Adjust stagger timing between elements
- **Easing** (line 12): Modify animation easing functions

## 📝 Content Checklist

Before launching, replace all placeholders:

- [ ] Update site title and meta tags
- [ ] Replace hero section text
- [ ] Update about section content
- [ ] Add real project information (6 projects included)
- [ ] Replace project placeholder images
- [ ] Update contact email and social media links
- [ ] Replace "10TH" logo with your brand
- [ ] Update footer links and content
- [ ] Add real statistics in the stats section
- [ ] Customize color scheme to match your brand

## 🎯 What You Need to Provide

To complete the website, please provide:

1. **Brand Assets**
   - Logo (SVG or PNG format)
   - Brand colors (if different from current scheme)
   - Favicon

2. **Content**
   - Your actual project details (title, description, technologies, links)
   - Project images (recommended size: 1200x800px)
   - About section text and statistics
   - Contact email and social media links

3. **Images**
   - High-quality project screenshots or mockups
   - Any additional imagery for the about section
   - Profile photo or team photo (optional)

4. **Information**
   - Your actual stats (projects completed, clients, awards, etc.)
   - Technology stack preferences
   - Any specific features or sections you want to add

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📦 Dependencies (CDN)

All dependencies are loaded via CDN:

- Three.js r128
- GSAP 3.12.2
- ScrollTrigger (GSAP plugin)

## 🔧 Optional Enhancements

Consider adding:

- **Blog section** for articles and updates
- **Testimonials** from clients
- **Skills section** with technology logos
- **Timeline** showing your journey
- **Dark/Light mode toggle**
- **Multi-language support**
- **Contact form backend** (currently placeholder)
- **Analytics** (Google Analytics, Plausible, etc.)
- **SEO optimization** (meta tags, structured data)

## 📄 License

This is a custom portfolio template. Feel free to use and modify it for your personal or commercial projects.

## 🤝 Support

For questions or issues, please provide:
- Browser and version
- Screenshot of the issue
- Steps to reproduce

---

**Built with 💫 inspiration from landonorris.com**
