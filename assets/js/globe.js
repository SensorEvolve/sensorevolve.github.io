/**
 * Three.js Globe with Vertex Shader Points
 * Based on https://github.com/bobbyroe/vertex-earth
 * Uses custom shaders to render Earth as elevated colored points
 * Updated: 2025-01-08 - Added drone and mobile optimizations
 */

import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import { GLTFLoader } from "jsm/loaders/GLTFLoader.js";
import getStarfield from "./getStarfield.js";

class Globe {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.globeGroup = null;
    this.stars = null;
    this.scrollPosY = 0;
    this.yacht = null;
    this.yachtRing = null;
    this.drone = null;
    this.droneRing = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Detect mobile devices
    this.isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    this.init();
    this.createGlobe();
    // this.createStarfield(); // Removed - too much visual noise
    this.addYacht();
    this.addDrone();
    this.addEventListeners();
    this.animate();
  }

  init() {
    // Scene setup
    this.scene = new THREE.Scene();

    // Camera setup
    const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    this.camera.position.set(0, 0, 2.8); // Zoomed in for better mobile/desktop view

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: !this.isMobile, // Disable antialiasing on mobile for performance
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    // Limit pixel ratio on mobile to improve performance
    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2)
    );
    this.renderer.setClearColor(0x0a0a0a, 1);

    // Create globe group
    this.globeGroup = new THREE.Group();
    this.scene.add(this.globeGroup);

    // Add hemisphere light
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x080820, 3);
    this.scene.add(hemiLight);

    // Setup OrbitControls
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = true;
    this.controls.enablePan = false;
    this.controls.minDistance = 1.8; // Closer minimum zoom
    this.controls.maxDistance = 10;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.05;
  }

  createGlobe() {
    const radius = 1;

    // Load textures
    const textureLoader = new THREE.TextureLoader();
    const colorMap = textureLoader.load("./assets/textures/04_rainbow1k.jpg");
    const elevMap = textureLoader.load("./assets/textures/01_earthbump1k.jpg");
    const alphaMap = textureLoader.load("./assets/textures/02_earthspec1k.jpg");

    // Wireframe sphere base (hidden)
    // const wireGeo = new THREE.IcosahedronGeometry(radius, 10);
    // const wireMat = new THREE.MeshBasicMaterial({
    //   color: 0x202020,
    //   wireframe: true,
    // });
    // const wireframe = new THREE.Mesh(wireGeo, wireMat);
    // this.globeGroup.add(wireframe);

    // High-detail points geometry (reduce on mobile for performance)
    const detail = this.isMobile ? 80 : 120;
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
                mvPosition.z += 0.15 * elv;
                gl_PointSize = size;
                gl_Position = projectionMatrix * mvPosition;
            }
        `;

    // Fragment shader - colors points with temperature gradient and handles transparency
    const fragmentShader = `
            uniform sampler2D colorTexture;
            uniform sampler2D alphaTexture;

            varying vec2 vUv;
            varying float vVisible;

            void main() {
                if (floor(vVisible + 0.1) == 0.0) discard;

                // Make points circular instead of square
                vec2 center = gl_PointCoord - vec2(0.5);
                if (length(center) > 0.5) discard;

                // Calculate latitude from UV (-1 at south pole, 0 at equator, 1 at north pole)
                float latitude = (vUv.y - 0.5) * 2.0;

                // Calculate absolute latitude for temperature (0 at equator, 1 at poles)
                float absLat = abs(latitude);

                // Temperature gradient colors
                vec3 polarColor = vec3(1.0, 1.0, 1.0);        // White for poles
                vec3 arcticColor = vec3(0.7, 0.85, 1.0);      // Light blue for arctic
                vec3 temperateColor = vec3(1.0, 0.8, 0.3);    // Yellow/orange for temperate
                vec3 tropicalColor = vec3(1.0, 0.4, 0.2);     // Red/orange for tropical

                // Blend colors based on latitude
                vec3 tempColor;
                if (absLat > 0.7) {
                    // Polar regions (>63 degrees)
                    float t = (absLat - 0.7) / 0.3;
                    tempColor = mix(arcticColor, polarColor, t);
                } else if (absLat > 0.45) {
                    // Arctic/Temperate transition (40-63 degrees)
                    float t = (absLat - 0.45) / 0.25;
                    tempColor = mix(temperateColor, arcticColor, t);
                } else {
                    // Tropical/Temperate (0-40 degrees)
                    float t = absLat / 0.45;
                    tempColor = mix(tropicalColor, temperateColor, t);
                }

                // Make ocean areas black (opaque) to hide stars
                float alphaMap = 1.0 - texture2D(alphaTexture, vUv).r;
                vec3 oceanColor = vec3(0.0, 0.0, 0.0); // Black for oceans

                // If alpha is low (ocean), use black; if high (land), use temperature color
                vec3 finalColor = mix(oceanColor, tempColor, alphaMap);
                gl_FragColor = vec4(finalColor, 1.0); // Fully opaque
            }
        `;

    // Shader uniforms
    const uniforms = {
      size: { type: "f", value: 5.0 },
      colorTexture: { type: "t", value: colorMap },
      elevTexture: { type: "t", value: elevMap },
      alphaTexture: { type: "t", value: alphaMap },
    };

    const pointsMat = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    const points = new THREE.Points(pointsGeo, pointsMat);
    this.globeGroup.add(points);

    // Set initial rotation to show Europe
    // Rotate to show Europe (around 4.9 and 0.5° East)
    this.globeGroup.rotation.y = -4.9; // Longitude - show eastern hemisphere
    this.globeGroup.rotation.x = 0.3; // Latitude - slight tilt to show northern hemisphere better
  }

  createStarfield() {
    const textureLoader = new THREE.TextureLoader();
    const starSprite = textureLoader.load("./assets/textures/circle.png");

    // Reduce stars on mobile for better performance
    const numStars = this.isMobile ? 2000 : 4500;
    this.stars = getStarfield({ numStars, sprite: starSprite });
    // this.scene.add(this.stars);
  }

  addYacht() {
    // Mediterranean Sea coordinates: approximately 35°N, 18°E
    const lat = 145; // degrees
    const lon = -20; // degrees
    const radius = 1.01; // Close to globe surface

    // Convert lat/lon to 3D position
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    // Create breathing ring
    const ringGeometry = new THREE.RingGeometry(0.02, 0.025, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    this.yachtRing = new THREE.Mesh(ringGeometry, ringMaterial);
    this.yachtRing.position.set(x, y, z);

    // Orient ring to face outward from globe center
    const ringNormal = new THREE.Vector3(x, y, z).normalize();
    this.yachtRing.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      ringNormal
    );

    this.globeGroup.add(this.yachtRing);

    // Load yacht model
    const loader = new GLTFLoader();
    loader.load(
      "./assets/3d/yacht.glb",
      (gltf) => {
        this.yacht = gltf.scene;
        this.yacht.scale.set(0.06, 0.06, 0.06);
        this.yacht.position.set(x, y, z);

        // Orient yacht to lie flat on globe surface (same approach as ring)
        const normal = new THREE.Vector3(x, y, z).normalize();

        // First, orient yacht to face outward from globe (lying flat)
        this.yacht.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0), // Yacht's default up axis
          normal
        );

        // Then rotate around the normal axis for heading direction
        // Adjust this value (in radians) to change which way yacht points:
        // 0 = default, Math.PI/2 = 90° clockwise, Math.PI = 180°, etc.
        const heading = 0; // Change this value to rotate the yacht
        this.yacht.rotateOnAxis(normal, heading);

        // Make yacht clickable
        this.yacht.userData.clickable = true;

        this.globeGroup.add(this.yacht);
      },
      undefined,
      (error) => {
        console.error("Error loading yacht model:", error);
      }
    );
  }

  addDrone() {
    // Place drone in North America / USA area: approximately 40°N, 100°W
    const lat = 130; // degrees
    const lon = 10; // degrees
    const radius = 1.1; // Close to globe surface

    // Convert lat/lon to 3D position
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    // Create breathing ring (blue for drone)
    const ringGeometry = new THREE.RingGeometry(0.02, 0.025, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x00d9ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    this.droneRing = new THREE.Mesh(ringGeometry, ringMaterial);
    this.droneRing.position.set(x, y, z);

    // Orient ring to face outward from globe center
    const ringNormal = new THREE.Vector3(x, y, z).normalize();
    this.droneRing.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      ringNormal
    );

    this.globeGroup.add(this.droneRing);

    // Load drone model
    const loader = new GLTFLoader();
    loader.load(
      "./assets/3d/drone.glb",
      (gltf) => {
        this.drone = gltf.scene;
        this.drone.scale.set(0.03, 0.03, 0.03);
        this.drone.position.set(x, y, z);

        // Orient drone to lie flat on globe surface (same approach as yacht)
        const normal = new THREE.Vector3(x, y, z).normalize();

        // First, orient drone to face outward from globe (lying flat)
        this.drone.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0), // Drone's default up axis
          normal
        );

        // Then rotate around the normal axis for heading direction
        const heading = 0; // Adjust to change drone direction
        this.drone.rotateOnAxis(normal, heading);

        // Make drone clickable
        this.drone.userData.clickable = true;

        this.globeGroup.add(this.drone);
      },
      undefined,
      (error) => {
        console.error("Error loading drone model:", error);
      }
    );
  }

  addEventListeners() {
    // Window resize
    window.addEventListener("resize", this.onWindowResize.bind(this));

    // Scroll tracking for scroll-based animations
    window.addEventListener("scroll", () => {
      this.scrollPosY = window.scrollY / document.body.clientHeight;
    });

    // Mouse move for hover effect
    this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));

    // Click handling for yacht
    this.canvas.addEventListener("click", this.onYachtClick.bind(this));
  }

  onMouseMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Update raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Check for yacht or drone intersection
    let hasIntersection = false;
    if (this.yacht) {
      const yachtIntersects = this.raycaster.intersectObject(this.yacht, true);
      hasIntersection = yachtIntersects.length > 0;
    }
    if (!hasIntersection && this.drone) {
      const droneIntersects = this.raycaster.intersectObject(this.drone, true);
      hasIntersection = droneIntersects.length > 0;
    }
    this.canvas.style.cursor = hasIntersection ? "pointer" : "default";
  }

  onYachtClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Update raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Check for yacht intersection
    if (this.yacht) {
      const yachtIntersects = this.raycaster.intersectObject(this.yacht, true);
      if (yachtIntersects.length > 0) {
        // Scroll to projects section
        document
          .querySelector("#projects")
          .scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    // Check for drone intersection
    if (this.drone) {
      const droneIntersects = this.raycaster.intersectObject(this.drone, true);
      if (droneIntersects.length > 0) {
        // Scroll directly to AeroHub project (data-project="2")
        const aerohubCard = document.querySelector('[data-project="2"]');
        if (aerohubCard) {
          aerohubCard.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }
  }

  onWindowResize() {
    const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    // Update orbit controls
    this.controls.update();

    // Scroll-based rotation influence (subtle)
    const scrollInfluence = this.scrollPosY * 0.5;
    this.globeGroup.rotation.y += scrollInfluence * 0.001;

    // Subtle star rotation with scroll influence
    if (this.stars) {
      this.stars.rotation.y += 0.0002;
      this.stars.rotation.x += 0.0001;
      this.stars.position.z = -this.scrollPosY * 10;
    }

    // Breathing animation for yacht ring
    if (this.yachtRing) {
      const time = Date.now() * 0.001;
      const breathScale = 1 + Math.sin(time * 2) * 0.3;
      this.yachtRing.scale.set(breathScale, breathScale, 1);
      this.yachtRing.material.opacity = 0.5 + Math.sin(time * 2) * 0.3;
    }

    // Breathing animation for drone ring (slightly different timing)
    if (this.droneRing) {
      const time = Date.now() * 0.001;
      const breathScale = 1 + Math.sin(time * 2.5) * 0.3;
      this.droneRing.scale.set(breathScale, breathScale, 1);
      this.droneRing.material.opacity = 0.5 + Math.sin(time * 2.5) * 0.3;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Initialize globe when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const globe = new Globe("globe-canvas");
});
