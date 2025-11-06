/**
 * Three.js Enhanced Earth Globe
 * A realistic, interactive 3D Earth with custom shaders, elevation mapping, and starfield
 * Inspired by vertex-earth with additional stylistic enhancements
 */

class Globe {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.globeGroup = null;
        this.earthPoints = null;
        this.wireframe = null;
        this.stars = null;
        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };
        this.rotationVelocity = { x: 0, y: 0 };
        this.textureLoader = new THREE.TextureLoader();

        this.init();
        this.loadTexturesAndCreateGlobe();
        this.addEventListeners();
        this.animate();
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();

        // Camera setup
        const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.set(0, 0, 15);

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x0A0A0A, 1);

        // Create globe group
        this.globeGroup = new THREE.Group();
        this.scene.add(this.globeGroup);
    }

    loadTexturesAndCreateGlobe() {
        // Load Earth textures
        const colorMap = this.textureLoader.load('./assets/textures/04_rainbow1k.jpg');
        const elevMap = this.textureLoader.load('./assets/textures/01_earthbump1k.jpg');
        const alphaMap = this.textureLoader.load('./assets/textures/02_earthspec1k.jpg');

        // Create wireframe backdrop
        this.createWireframe();

        // Create Earth with custom shaders
        this.createShaderEarth(colorMap, elevMap, alphaMap);

        // Create starfield
        this.createStarfield();

        // Create lights
        this.createLights();
    }

    createWireframe() {
        const geo = new THREE.IcosahedronGeometry(4, 10);
        const mat = new THREE.MeshBasicMaterial({
            color: 0x303030,
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });
        this.wireframe = new THREE.Mesh(geo, mat);
        this.globeGroup.add(this.wireframe);
    }

    createShaderEarth(colorMap, elevMap, alphaMap) {
        const detail = 80;
        const pointsGeo = new THREE.IcosahedronGeometry(4, detail);

        // Custom vertex shader for elevation and visibility
        const vertexShader = `
            uniform float size;
            uniform sampler2D elevTexture;

            varying vec2 vUv;
            varying float vVisible;

            void main() {
                vUv = uv;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                float elv = texture2D(elevTexture, vUv).r;
                vec3 vNormal = normalMatrix * normal;

                // Only show front-facing vertices
                vVisible = step(0.0, dot(-normalize(mvPosition.xyz), normalize(vNormal)));

                // Apply elevation
                mvPosition.z += 0.35 * elv;

                gl_PointSize = size;
                gl_Position = projectionMatrix * mvPosition;
            }
        `;

        // Custom fragment shader for coloring and transparency
        const fragmentShader = `
            uniform sampler2D colorTexture;
            uniform sampler2D alphaTexture;

            varying vec2 vUv;
            varying float vVisible;

            void main() {
                // Discard back-facing points
                if (floor(vVisible + 0.1) == 0.0) discard;

                float alpha = 1.0 - texture2D(alphaTexture, vUv).r;
                vec3 color = texture2D(colorTexture, vUv).rgb;

                // Add glow effect
                float dist = length(gl_PointCoord - vec2(0.5));
                float glow = 1.0 - smoothstep(0.0, 0.5, dist);

                gl_FragColor = vec4(color, alpha * glow);
            }
        `;

        const uniforms = {
            size: { type: 'f', value: 3.5 },
            colorTexture: { type: 't', value: colorMap },
            elevTexture: { type: 't', value: elevMap },
            alphaTexture: { type: 't', value: alphaMap }
        };

        const pointsMat = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader,
            fragmentShader,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        this.earthPoints = new THREE.Points(pointsGeo, pointsMat);
        this.globeGroup.add(this.earthPoints);
    }

    createStarfield() {
        const numStars = 8000;
        const verts = [];
        const colors = [];
        const sizes = [];

        for (let i = 0; i < numStars; i++) {
            // Random position in large sphere to fill viewport
            const radius = Math.random() * 80 + 20;
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);

            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);

            verts.push(x, y, z);

            // Varied color - whites, blues, and subtle tints
            const colorChoice = Math.random();
            const col = new THREE.Color();

            if (colorChoice < 0.7) {
                // Most stars are white/blue-white
                col.setHSL(0.6, Math.random() * 0.1, 0.8 + Math.random() * 0.2);
            } else if (colorChoice < 0.85) {
                // Some are cyan/blue accent
                col.setHSL(0.55, 0.3, 0.7 + Math.random() * 0.3);
            } else {
                // Few are orange accent
                col.setHSL(0.08, 0.4, 0.7 + Math.random() * 0.3);
            }

            colors.push(col.r, col.g, col.b);
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
        geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const mat = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            sizeAttenuation: true
        });

        this.stars = new THREE.Points(geo, mat);
        this.scene.add(this.stars);
    }

    createLights() {
        // Hemisphere light for ambient
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x080820, 2);
        this.scene.add(hemiLight);

        // Accent lights for drama
        const keyLight = new THREE.DirectionalLight(0xFF6B35, 0.8);
        keyLight.position.set(5, 3, 5);
        this.scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight(0x00D9FF, 0.4);
        fillLight.position.set(-5, 0, -3);
        this.scene.add(fillLight);
    }

    addEventListeners() {
        // Mouse events
        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.canvas.addEventListener('mouseleave', this.onMouseUp.bind(this));

        // Touch events
        this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this));

        // Window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    onMouseDown(event) {
        this.isDragging = true;
        this.previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }

    onMouseMove(event) {
        if (!this.isDragging) return;

        const deltaX = event.clientX - this.previousMousePosition.x;
        const deltaY = event.clientY - this.previousMousePosition.y;

        this.rotationVelocity.x = deltaY * 0.005;
        this.rotationVelocity.y = deltaX * 0.005;

        this.previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }

    onMouseUp() {
        this.isDragging = false;
    }

    onTouchStart(event) {
        if (event.touches.length === 1) {
            event.preventDefault();
            this.isDragging = true;
            this.previousMousePosition = {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY
            };
        }
    }

    onTouchMove(event) {
        if (!this.isDragging || event.touches.length !== 1) return;

        event.preventDefault();
        const deltaX = event.touches[0].clientX - this.previousMousePosition.x;
        const deltaY = event.touches[0].clientY - this.previousMousePosition.y;

        this.rotationVelocity.x = deltaY * 0.005;
        this.rotationVelocity.y = deltaX * 0.005;

        this.previousMousePosition = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        };
    }

    onTouchEnd() {
        this.isDragging = false;
    }

    onWindowResize() {
        const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        // Auto-rotate when not dragging
        if (!this.isDragging) {
            this.globeGroup.rotation.y += 0.001;
            this.rotationVelocity.x *= 0.95;
            this.rotationVelocity.y *= 0.95;
        }

        // Apply rotation velocity
        this.globeGroup.rotation.x += this.rotationVelocity.x;
        this.globeGroup.rotation.y += this.rotationVelocity.y;

        // Subtle star rotation
        if (this.stars) {
            this.stars.rotation.y += 0.0002;
            this.stars.rotation.x += 0.0001;
        }

        // Wireframe counter-rotation for effect
        if (this.wireframe) {
            this.wireframe.rotation.y -= 0.0003;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize globe when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const globe = new Globe('globe-canvas');
});
