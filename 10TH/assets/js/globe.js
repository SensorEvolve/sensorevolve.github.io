/**
 * Three.js Globe Component
 * A stylized, interactive 3D globe with particles and animations
 */

class Globe {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.globe = null;
        this.particles = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };
        this.rotationVelocity = { x: 0, y: 0 };

        this.init();
        this.createGlobe();
        this.createParticles();
        this.createLights();
        this.addEventListeners();
        this.animate();
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x0A0A0A, 10, 50);

        // Camera setup
        const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        this.camera.position.z = 15;

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x0A0A0A, 0);
    }

    createGlobe() {
        const globeGroup = new THREE.Group();

        // Main globe sphere
        const geometry = new THREE.SphereGeometry(5, 64, 64);

        // Custom shader material for the globe
        const material = new THREE.MeshPhongMaterial({
            color: 0x1A1A1A,
            emissive: 0xFF6B35,
            emissiveIntensity: 0.1,
            shininess: 100,
            transparent: true,
            opacity: 0.8,
            wireframe: false
        });

        this.globe = new THREE.Mesh(geometry, material);
        globeGroup.add(this.globe);

        // Wireframe overlay
        const wireframeGeometry = new THREE.SphereGeometry(5.05, 32, 32);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0xFF6B35,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
        globeGroup.add(wireframe);

        // Add glowing rings
        this.createRings(globeGroup);

        this.scene.add(globeGroup);
        this.globeGroup = globeGroup;
    }

    createRings(parent) {
        const ringGeometry = new THREE.TorusGeometry(6, 0.02, 16, 100);

        // Ring 1
        const ring1Material = new THREE.MeshBasicMaterial({
            color: 0x00D9FF,
            transparent: true,
            opacity: 0.6
        });
        const ring1 = new THREE.Mesh(ringGeometry, ring1Material);
        ring1.rotation.x = Math.PI / 2;
        parent.add(ring1);

        // Ring 2
        const ring2Material = new THREE.MeshBasicMaterial({
            color: 0xF72585,
            transparent: true,
            opacity: 0.4
        });
        const ring2 = new THREE.Mesh(ringGeometry, ring2Material);
        ring2.rotation.x = Math.PI / 3;
        ring2.rotation.y = Math.PI / 4;
        parent.add(ring2);

        this.rings = [ring1, ring2];
    }

    createParticles() {
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 1000;
        const positions = new Float32Array(particlesCount * 3);
        const colors = new Float32Array(particlesCount * 3);

        const color1 = new THREE.Color(0xFF6B35);
        const color2 = new THREE.Color(0x00D9FF);
        const color3 = new THREE.Color(0xF72585);

        for (let i = 0; i < particlesCount; i++) {
            const i3 = i * 3;

            // Random position in sphere
            const radius = 8 + Math.random() * 5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);

            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);

            // Random color
            const colorChoice = Math.random();
            const chosenColor = colorChoice < 0.33 ? color1 : colorChoice < 0.66 ? color2 : color3;

            colors[i3] = chosenColor.r;
            colors[i3 + 1] = chosenColor.g;
            colors[i3 + 2] = chosenColor.b;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(particlesGeometry, particlesMaterial);
        this.scene.add(this.particles);
    }

    createLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Key light
        const keyLight = new THREE.DirectionalLight(0xFF6B35, 1);
        keyLight.position.set(5, 5, 5);
        this.scene.add(keyLight);

        // Fill light
        const fillLight = new THREE.DirectionalLight(0x00D9FF, 0.5);
        fillLight.position.set(-5, 0, -5);
        this.scene.add(fillLight);

        // Rim light
        const rimLight = new THREE.DirectionalLight(0xF72585, 0.8);
        rimLight.position.set(0, -5, -5);
        this.scene.add(rimLight);

        // Point lights for extra glow
        const pointLight1 = new THREE.PointLight(0xFF6B35, 1, 20);
        pointLight1.position.set(8, 0, 0);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x00D9FF, 1, 20);
        pointLight2.position.set(-8, 0, 0);
        this.scene.add(pointLight2);
    }

    addEventListeners() {
        // Mouse events for interaction
        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.canvas.addEventListener('mouseleave', this.onMouseUp.bind(this));

        // Touch events for mobile
        this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this));

        // Handle window resize
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
            this.isDragging = true;
            this.previousMousePosition = {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY
            };
        }
    }

    onTouchMove(event) {
        if (!this.isDragging || event.touches.length !== 1) return;

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

        // Rotate particles slowly
        this.particles.rotation.y += 0.0005;
        this.particles.rotation.x += 0.0002;

        // Animate rings
        if (this.rings) {
            this.rings[0].rotation.z += 0.001;
            this.rings[1].rotation.z -= 0.002;
        }

        // Pulse effect on globe
        const time = Date.now() * 0.001;
        const pulse = Math.sin(time) * 0.05 + 1;
        this.globe.material.emissiveIntensity = pulse * 0.1;

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize globe when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const globe = new Globe('globe-canvas');
});
