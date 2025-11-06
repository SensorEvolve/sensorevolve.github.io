/**
 * Three.js Globe with GeoJSON - Simplified version
 * Displays continents as colored lines using GeoJSON data
 */

import * as THREE from 'three';

class Globe {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.globeGroup = null;
        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };
        this.rotationVelocity = { x: 0, y: 0 };
        this.scrollPosY = 0;

        this.init();
        this.createGlobe();
        this.createStarfield();
        this.addEventListeners();
        this.animate();
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();

        // Camera setup
        const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 1, 100);
        this.camera.position.z = 5;

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

    createGlobe() {
        const radius = 2;

        // Create sphere edges/wireframe
        const geometry = new THREE.SphereGeometry(radius, 32, 32);
        const lineMat = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.15,
        });
        const edges = new THREE.EdgesGeometry(geometry, 10);
        const line = new THREE.LineSegments(edges, lineMat);
        this.globeGroup.add(line);

        // Load and draw continents from GeoJSON
        fetch('./assets/ne_110m_land.json')
            .then(response => response.json())
            .then(data => {
                this.drawGeoJSON(data, radius);
            })
            .catch(error => {
                console.error('Error loading GeoJSON:', error);
            });
    }

    drawGeoJSON(json, radius) {
        const features = json.features || [];

        features.forEach(feature => {
            if (feature.geometry.type === 'Polygon') {
                this.drawPolygon(feature.geometry.coordinates, radius);
            } else if (feature.geometry.type === 'MultiPolygon') {
                feature.geometry.coordinates.forEach(polygon => {
                    this.drawPolygon(polygon, radius);
                });
            }
        });
    }

    drawPolygon(coordinates, radius) {
        coordinates.forEach(ring => {
            const points = [];

            ring.forEach(coord => {
                const lon = coord[0];
                const lat = coord[1];

                // Convert lat/lon to 3D coordinates
                const phi = (90 - lat) * (Math.PI / 180);
                const theta = (lon + 180) * (Math.PI / 180);

                const x = -radius * Math.sin(phi) * Math.cos(theta);
                const y = radius * Math.cos(phi);
                const z = radius * Math.sin(phi) * Math.sin(theta);

                points.push(new THREE.Vector3(x, y, z));
            });

            // Create line from points
            const geometry = new THREE.BufferGeometry().setFromPoints(points);

            // Random color for each landmass (greens, cyans, yellows)
            let hue = 0.3 + Math.random() * 0.2;
            if (Math.random() > 0.5) {
                hue -= 0.3;
            }
            const color = new THREE.Color().setHSL(hue, 0.8, 0.5);

            const material = new THREE.LineBasicMaterial({
                color: color,
                linewidth: 2
            });

            const lineObj = new THREE.Line(geometry, material);
            this.globeGroup.add(lineObj);
        });
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

        // Scroll tracking for scroll-based animations
        window.addEventListener('scroll', () => {
            this.scrollPosY = window.scrollY / document.body.clientHeight;
        });
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

        // Scroll-based rotation
        const goalRotationY = Math.PI * this.scrollPosY * 2;
        const rate = 0.05;

        // Auto-rotate when not dragging
        if (!this.isDragging) {
            // Smoothly interpolate to goal rotation based on scroll
            this.globeGroup.rotation.y += (goalRotationY - this.globeGroup.rotation.y) * rate;
            this.rotationVelocity.x *= 0.95;
            this.rotationVelocity.y *= 0.95;

            // Add gentle continuous rotation
            this.globeGroup.rotation.y += 0.001;
        } else {
            // Apply rotation velocity from dragging
            this.globeGroup.rotation.x += this.rotationVelocity.x;
            this.globeGroup.rotation.y += this.rotationVelocity.y;
        }

        // Subtle star rotation with scroll influence
        if (this.stars) {
            this.stars.rotation.y += 0.0002;
            this.stars.rotation.x += 0.0001;
            this.stars.position.z = -this.scrollPosY * 10;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize globe when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const globe = new Globe('globe-canvas');
});
