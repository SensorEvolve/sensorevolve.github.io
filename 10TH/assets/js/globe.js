/**
 * Three.js Globe with Vertex Shader Points
 * Based on https://github.com/bobbyroe/vertex-earth
 * Uses custom shaders to render Earth as elevated colored points
 */

import * as THREE from 'three';
import getStarfield from './getStarfield.js';

class Globe {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.globeGroup = null;
        this.stars = null;
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
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        this.camera.position.set(0, 0, 3.5);

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

        // Add hemisphere light
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x080820, 3);
        this.scene.add(hemiLight);
    }

    createGlobe() {
        const radius = 1;

        // Load textures
        const textureLoader = new THREE.TextureLoader();
        const colorMap = textureLoader.load('./assets/textures/04_rainbow1k.jpg');
        const elevMap = textureLoader.load('./assets/textures/01_earthbump1k.jpg');
        const alphaMap = textureLoader.load('./assets/textures/02_earthspec1k.jpg');

        // Wireframe sphere base
        const wireGeo = new THREE.IcosahedronGeometry(radius, 10);
        const wireMat = new THREE.MeshBasicMaterial({
            color: 0x202020,
            wireframe: true,
        });
        const wireframe = new THREE.Mesh(wireGeo, wireMat);
        this.globeGroup.add(wireframe);

        // High-detail points geometry
        const detail = 120;
        const pointsGeo = new THREE.IcosahedronGeometry(radius, detail);

        // Vertex shader - elevates points based on elevation map
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
                vVisible = step(0.0, dot(-normalize(mvPosition.xyz), normalize(vNormal)));
                mvPosition.z += 0.35 * elv;
                gl_PointSize = size;
                gl_Position = projectionMatrix * mvPosition;
            }
        `;

        // Fragment shader - colors points and handles transparency
        const fragmentShader = `
            uniform sampler2D colorTexture;
            uniform sampler2D alphaTexture;

            varying vec2 vUv;
            varying float vVisible;

            void main() {
                if (floor(vVisible + 0.1) == 0.0) discard;
                float alpha = 1.0 - texture2D(alphaTexture, vUv).r;
                vec3 color = texture2D(colorTexture, vUv).rgb;
                gl_FragColor = vec4(color, alpha);
            }
        `;

        // Shader uniforms
        const uniforms = {
            size: { type: "f", value: 4.0 },
            colorTexture: { type: "t", value: colorMap },
            elevTexture: { type: "t", value: elevMap },
            alphaTexture: { type: "t", value: alphaMap }
        };

        const pointsMat = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader,
            fragmentShader,
            transparent: true
        });

        const points = new THREE.Points(pointsGeo, pointsMat);
        this.globeGroup.add(points);
    }

    createStarfield() {
        const textureLoader = new THREE.TextureLoader();
        const starSprite = textureLoader.load('./assets/textures/circle.png');

        this.stars = getStarfield({ numStars: 4500, sprite: starSprite });
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
            this.globeGroup.rotation.y += 0.002;
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
