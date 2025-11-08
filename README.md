# 10TH Portfolio Website

A professional full-stack portfolio website featuring an interactive Three.js globe with 3D models, modern typography, and production-ready applications showcase.

## 🎨 Features

- **Interactive 3D Globe** - Three.js globe with temperature gradient, clickable 3D models (yacht & drone), and smooth animations
- **Featured Projects** - 6 production applications with detailed technical descriptions
- **Mobile Optimized** - Responsive design with mobile-specific globe rendering optimizations
- **Professional Design** - Modern UI with gradient accents, smooth hover effects, and clear visual hierarchy
- **App Store Integration** - Direct links to published iOS/Android applications

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (Grid/Flexbox), Vanilla JavaScript (ES6+)
- **3D Graphics**: Three.js with WebGL, GLSL shaders for temperature gradients
- **3D Models**: GLB format (yacht.glb, drone.glb) with GLTFLoader
- **Animations**: GSAP 3.12.2, ScrollTrigger, ScrollToPlugin
- **Deployment**: Netlify with custom caching configuration
- **Version Control**: Git/GitHub

## 📁 Project Structure

```
generic_website/
├── index.html                      # Main HTML file
├── netlify.toml                    # Netlify deployment config
├── assets/
│   ├── css/
│   │   └── style.css               # Main stylesheet
│   ├── js/
│   │   ├── globe.js                # Three.js globe with 3D models
│   │   ├── animations.js           # GSAP scroll animations
│   │   └── main.js                 # Navigation and utilities
│   ├── 3d/
│   │   ├── yacht.glb               # Yacht 3D model
│   │   └── drone.glb               # Drone 3D model
│   ├── textures/
│   │   ├── 00_earthmap1k.jpg       # Earth color texture
│   │   ├── 01_earthbump1k.jpg      # Elevation/bump map
│   │   ├── 02_earthspec1k.jpg      # Specular map
│   │   └── 03_earthlights1k.jpg    # City lights (not used)
│   ├── 10th_logo_white.png         # Logo
│   └── [project images].png/jpg    # Project screenshots
└── README.md                       # This file
```

## 🚀 Getting Started

### Local Development

Start a local server to view the website:

```bash
# Option 1: Python (recommended)
python -m http.server 8000

# Option 2: Node.js http-server
npx http-server -p 8000

# Option 3: PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

### Deployment to Netlify

The site is configured for automatic Netlify deployment:

1. Push changes to GitHub
2. Netlify automatically deploys from the `master` branch
3. Site publishes from root directory (configured in `netlify.toml`)

**Cache Configuration:**
- HTML: Always revalidate (max-age=0)
- CSS/JS: 1 hour cache (max-age=3600)
- Images: 24 hour cache (max-age=86400)

## 🌍 Globe Customization Guide

### Adding a New 3D Model to the Globe

**Step 1: Prepare your GLB model**
- Place the `.glb` file in `assets/3d/`
- Recommended: Keep file size under 50MB for performance

**Step 2: Add the model in `globe.js`**

Find the section after `addDrone()` and add your new method:

```javascript
addYourModel() {
  // Set latitude/longitude position
  const lat = 40;  // Latitude in degrees (-90 to 90)
  const lon = -74; // Longitude in degrees (-180 to 180)
  const radius = 1.01; // Distance from center (1.01 = just above surface)

  // Convert lat/lon to 3D position
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  // Create breathing ring (optional)
  const ringGeometry = new THREE.RingGeometry(0.02, 0.025, 32);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,  // Change color (hex format)
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8,
  });
  this.yourRing = new THREE.Mesh(ringGeometry, ringMaterial);
  this.yourRing.position.set(x, y, z);

  // Orient ring to face outward from globe
  const ringNormal = new THREE.Vector3(x, y, z).normalize();
  this.yourRing.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    ringNormal
  );

  this.globeGroup.add(this.yourRing);

  // Load 3D model
  const loader = new GLTFLoader();
  loader.load(
    "./assets/3d/yourmodel.glb",
    (gltf) => {
      this.yourModel = gltf.scene;
      this.yourModel.scale.set(0.05, 0.05, 0.05); // Adjust scale
      this.yourModel.position.set(x, y, z);

      // Orient model to lie flat on globe surface
      const normal = new THREE.Vector3(x, y, z).normalize();
      this.yourModel.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0), // Model's up axis
        normal
      );

      // Optional: Rotate model heading
      const heading = 0; // Rotation angle in radians
      this.yourModel.rotateOnAxis(normal, heading);

      // Make model clickable
      this.yourModel.userData.clickable = true;

      this.globeGroup.add(this.yourModel);
    },
    undefined,
    (error) => console.error("Error loading model:", error)
  );
}
```

**Step 3: Call the method in `init()`**

Add to the `init()` method around line 75:

```javascript
this.addYacht();
this.addDrone();
this.addYourModel(); // Add this line
```

**Step 4: Add breathing animation**

In the `animate()` method, add to the ring animations section:

```javascript
if (this.yourRing) {
  const scale = 1 + Math.sin(Date.now() * 0.002) * 0.15;
  this.yourRing.scale.set(scale, scale, 1);
}
```

**Step 5: Add click handler**

In the `onClick()` method, add to the click detection section:

```javascript
if (intersects[0].object.parent === this.yourModel) {
  gsap.to(window, {
    duration: 1,
    scrollTo: "#projects" // Or your target section
  });
  return;
}
```

### Globe Appearance Settings

**Location:** `assets/js/globe.js`

**Geometry Detail** (line 101):
```javascript
const detail = this.isMobile ? 80 : 120; // Lower = faster, Higher = smoother
```

**Temperature Gradient Colors** (lines 116-158):
Edit the fragment shader colors:
```javascript
vec3 polarColor = vec3(1.0, 1.0, 1.0);        // White poles
vec3 arcticColor = vec3(0.7, 0.85, 1.0);      // Light blue arctic
vec3 temperateColor = vec3(1.0, 0.8, 0.3);    // Yellow/orange temperate
vec3 tropicalColor = vec3(1.0, 0.4, 0.2);     // Red/orange tropical
```

**Elevation Multiplier** (line 106):
```javascript
const elevationScale = 0.03; // Increase for more pronounced terrain
```

**Globe Rotation Speed** (line 336):
```javascript
this.globeGroup.rotation.y += 0.0005; // Increase for faster rotation
```

**Model Scale** (inside each `addModel()` method):
```javascript
this.yacht.scale.set(0.06, 0.06, 0.06); // Adjust all three values
```

**Model Position Offset** (radius value):
```javascript
const radius = 1.01;  // 1.0 = on surface, higher = farther out
```

**Ring Colors**:
```javascript
color: 0xff0000,  // Red for yacht
color: 0x0000ff,  // Blue for drone
// Use hex color codes
```

### Finding Latitude/Longitude Coordinates

To position models on the globe:

1. Go to [Google Maps](https://maps.google.com)
2. Right-click on your desired location
3. Click the coordinates that appear (e.g., "40.7128, -74.0060")
4. Use these values for `lat` and `lon` in your code

**Examples:**
- Mediterranean Sea (yacht): `lat = 145, lon = -20`
- North America (drone): `lat = 40, lon = -100`
- Tokyo: `lat = 35.6762, lon = 139.6503`
- London: `lat = 51.5074, lon = -0.1278`

## 🎨 Styling Customization

### Color Scheme

Edit CSS variables in `assets/css/style.css` (lines 7-16):

```css
:root {
    --color-primary: #FF6B35;      /* Orange accent */
    --color-secondary: #00D9FF;    /* Cyan accent */
    --color-accent: #F72585;       /* Pink accent */
    --color-bg-dark: #0A0A0A;      /* Dark background */
    --color-bg-light: #1A1A1A;     /* Card background */
    --color-text-primary: #FFFFFF; /* Main text */
    --color-text-secondary: #B0B0B0; /* Secondary text */
    --color-border: #2A2A2A;       /* Border color */
}
```

### Project Cards

Update project information in `index.html`:

**Project structure** (starts around line 122):
```html
<article class="project-card" data-project="1">
    <div class="project-image">
        <img src="assets/projectname.png" alt="Project Name">
    </div>
    <div class="project-info">
        <span class="project-category">Category · Type</span>
        <h3 class="project-title">Project Title</h3>
        <p class="project-description">
            Description with <strong>Frontend:</strong> details,
            <strong>Backend:</strong> details, etc.
        </p>
        <div class="project-tags">
            <span class="tag">Technology</span>
        </div>
        <a href="https://link.com" target="_blank" class="project-link">View Project →</a>
    </div>
</article>
```

## 📝 Essential Git Commands

### Committing Changes

```bash
# Check what files changed
git status

# Stage specific files
git add index.html
git add assets/css/style.css
git add assets/js/globe.js

# Stage all changes
git add .

# Commit with message
git commit -m "Your commit message"

# Push to GitHub (triggers Netlify deploy)
git push
```

### Viewing History

```bash
# View recent commits
git log --oneline -10

# See what changed in last commit
git show

# See changes in a specific file
git log -p assets/js/globe.js
```

### Undoing Changes

```bash
# Discard changes to a file (before staging)
git restore filename.html

# Unstage a file (keep changes)
git restore --staged filename.html

# Revert last commit (creates new commit)
git revert HEAD
```

## 🔧 Common Tasks

### Adding a New Project

1. Add project image to `assets/` folder
2. Open `index.html`
3. Find the Projects section (around line 113)
4. Copy an existing project card
5. Update all the details (image, title, description, tags, link)
6. Commit and push:
```bash
git add assets/yourimage.png index.html
git commit -m "Add new project: Project Name"
git push
```

### Updating About Section

1. Open `index.html`
2. Find the About section (around line 65)
3. Update the text, stats, or feature cards
4. Commit and push:
```bash
git add index.html
git commit -m "Update about section"
git push
```

### Changing Logo

1. Add new logo to `assets/` folder
2. Open `index.html`
3. Find logo references (lines ~22 and ~402)
4. Update the image src:
```html
<img src="assets/your_logo.png" alt="Your Logo">
```
5. Adjust size in `assets/css/style.css` (line 124-130)

## 🐛 Troubleshooting

### Globe not loading
- Check browser console for errors (F12)
- Verify texture files exist in `assets/textures/`
- Check if Three.js CDN is accessible

### 3D model not appearing
- Verify `.glb` file path is correct
- Check file size (should be < 50MB)
- Look for console errors
- Verify model scale (try increasing/decreasing)

### Changes not showing on Netlify
- Do a hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Check Netlify deploy log for errors
- Verify git push was successful
- Check netlify.toml cache settings

### Mobile performance issues
- Reduce globe detail (line 101 in globe.js)
- Optimize 3D model file sizes
- Reduce texture resolution

## 📱 Mobile Optimization

The site automatically detects mobile devices and applies:
- Reduced globe geometry detail (80 vs 120 segments)
- Disabled antialiasing for performance
- Limited pixel ratio to 1.5x
- Responsive viewport height (svh units)
- Touch-optimized UI elements

## 🌐 Browser Support

- Chrome/Edge 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Mobile Safari (iOS 14+) ✅
- Chrome Mobile (Android) ✅

**Note:** Three.js requires WebGL support

## 📦 Dependencies (CDN)

```html
<!-- Three.js -->
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.170/build/three.module.js",
    "jsm/": "https://cdn.jsdelivr.net/npm/three@0.170/examples/jsm/"
  }
}
</script>

<!-- GSAP -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollToPlugin.min.js"></script>
```

## 🚀 Performance Tips

1. **Optimize images**: Use WebP format, compress to < 500KB
2. **3D models**: Keep GLB files under 10MB when possible
3. **Textures**: Use 1K resolution for globe textures (1024x512px)
4. **Lazy loading**: Images load as needed
5. **CDN caching**: Netlify CDN serves static assets globally

## 📈 Future Enhancements

- [ ] Add more 3D models to globe (satellites, landmarks)
- [ ] Implement dark/light mode toggle
- [ ] Add blog section for articles
- [ ] Integrate contact form backend (Netlify Forms)
- [ ] Add loading screen for 3D assets
- [ ] Implement smooth camera transitions between models
- [ ] Add VR/AR view option
- [ ] Integrate analytics (Google Analytics 4)

## 🤝 Support

For issues or questions:
1. Check browser console for errors (F12 → Console)
2. Review this README for common solutions
3. Check git commit history for recent changes
4. Verify all file paths are correct

---

**Built with Three.js, GSAP, and modern web technologies**
