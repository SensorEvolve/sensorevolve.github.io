/**
 * Three.js Enhanced Earth Globe
 * Based on vertex-earth interactive branch by bobbyroe
 * https://github.com/bobbyroe/vertex-earth/tree/interactive
 */

class Globe {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.globeGroup = null;
        this.globe = null;
        this.earthPoints = null;
        this.wireframe = null;
        this.stars = null;
        this.raycaster = new THREE.Raycaster();
        this.pointerPos = new THREE.Vector2();
        this.globeUV = new THREE.Vector2();
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

        // Camera setup - scale 2x from original (z: 4 → 8)
        const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        this.camera.position.set(0, 0, 8);

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
        // Create wireframe backdrop - scale 2x from original (radius: 1 → 2)
        this.createWireframe();

        // Create Earth with colored dots only - no textures
        this.createColoredDotsEarth();

        // Create starfield
        this.createStarfield();

        // Create lights
        this.createLights();
    }

    createWireframe() {
        // Scale 2x: radius 1 → 2, detail 16
        const geo = new THREE.IcosahedronGeometry(2, 16);
        const mat = new THREE.MeshBasicMaterial({
            color: 0x0099ff,
            wireframe: true,
            transparent: true,
            opacity: 0.1
        });
        this.wireframe = new THREE.Mesh(geo, mat);
        this.globeGroup.add(this.wireframe);

        // Store globe reference for raycasting
        this.globe = this.wireframe;
    }

    createColoredDotsEarth() {
        // Scale 2x: radius 1 → 2, detail 120 (keep high detail!)
        const detail = 120;
        const pointsGeo = new THREE.IcosahedronGeometry(2, detail);

        // Add colors to vertices
        const colors = [];
        const positions = pointsGeo.attributes.position.array;
        const uvs = pointsGeo.attributes.uv.array;

        for (let i = 0; i < positions.length; i += 3) {
            const u = uvs[(i / 3) * 2];
            const v = uvs[(i / 3) * 2 + 1];

            // Create colorful gradient based on UV coordinates
            // Hue varies with longitude (u), brightness with latitude (v)
            const hue = u; // 0-1 gives full color spectrum
            const saturation = 0.7 + Math.random() * 0.3;
            const lightness = 0.4 + v * 0.4;

            const color = new THREE.Color();
            color.setHSL(hue, saturation, lightness);

            colors.push(color.r, color.g, color.b);
        }

        pointsGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        // Custom vertex shader without textures
        const vertexShader = `
            uniform float size;
            uniform vec2 mouseUV;

            attribute vec3 color;

            varying vec3 vColor;
            varying vec2 vUv;
            varying float vVisible;
            varying float vDist;

            void main() {
                vUv = uv;
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                vec3 vNormal = normalMatrix * normal;

                // Only show front-facing vertices
                vVisible = step(0.0, dot(-normalize(mvPosition.xyz), normalize(vNormal)));

                // Mouse interaction - bulge effect near cursor
                float dist = distance(mouseUV, vUv);
                float zDisp = 0.0;
                float thresh = 0.04;
                if (dist < thresh) {
                    zDisp = (thresh - dist) * 10.0;
                }
                vDist = dist;
                mvPosition.z += zDisp;

                gl_PointSize = size;
                gl_Position = projectionMatrix * mvPosition;
            }
        `;

        // Custom fragment shader for colored dots
        const fragmentShader = `
            varying vec3 vColor;
            varying vec2 vUv;
            varying float vVisible;
            varying float vDist;

            void main() {
                // Discard back-facing points
                if (floor(vVisible + 0.1) == 0.0) discard;

                vec3 color = vColor;

                // Enhance brightness near mouse cursor
                float thresh = 0.04;
                if (vDist < thresh) {
                    float intensity = (thresh - vDist) / thresh;
                    color = mix(color, vec3(1.0, 1.0, 1.0), intensity * 0.5);
                }

                // Add glow effect to dots
                float dist = length(gl_PointCoord - vec2(0.5));
                float alpha = 1.0 - smoothstep(0.0, 0.5, dist);

                gl_FragColor = vec4(color, alpha);
            }
        `;

        const uniforms = {
            size: { type: 'f', value: 8.0 },
            mouseUV: { type: 'v2', value: new THREE.Vector2(0.0, 0.0) }
        };

        this.uniforms = uniforms;

        const pointsMat = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader,
            fragmentShader,
            transparent: true,
            vertexColors: true,
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
        // Hemisphere light from vertex-earth
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x080820, 3);
        this.scene.add(hemiLight);
    }

    handleRaycast() {
        // Mouse interaction from vertex-earth interactive
        this.raycaster.setFromCamera(this.pointerPos, this.camera);
        const intersects = this.raycaster.intersectObjects([this.globe], false);
        if (intersects.length > 0) {
            this.globeUV.copy(intersects[0].uv);
        }
        this.uniforms.mouseUV.value = this.globeUV;
    }

    addEventListeners() {
        // Mouse events for drag rotation
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
        // Update pointer position for raycasting (normalized)
        this.pointerPos.set(
            (event.clientX / this.canvas.clientWidth) * 2 - 1,
            -(event.clientY / this.canvas.clientHeight) * 2 + 1
        );

        // Handle drag rotation
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
            this.globeGroup.rotation.y += 0.002;
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

        // Handle mouse raycasting for interactive effect
        this.handleRaycast();

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize globe when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const globe = new Globe('globe-canvas');
});
