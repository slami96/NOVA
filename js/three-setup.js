// js/three-setup.js - Three.js 3D Scene Setup

class ThreeScene {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        this.camera = null;
        this.renderer = null;
        this.objects = [];
        this.clock = new THREE.Clock();
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        
        this.init();
    }
    
    init() {
        this.setupCamera();
        this.setupRenderer();
        this.setupLights();
        this.addEventListeners();
    }
    
    setupCamera() {
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.z = 5;
    }
    
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;
        this.container.appendChild(this.renderer.domElement);
    }
    
    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 0.5);
        this.scene.add(directionalLight);
    }
    
    addEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
        this.container.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }
    
    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
    
    onMouseMove(event) {
        const rect = this.container.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        this.updateObjects(delta);
        
        this.renderer.render(this.scene, this.camera);
    }
    
    updateObjects(delta) {
        this.objects.forEach(obj => {
            if (obj.update) {
                obj.update(delta, this.mouse);
            }
        });
    }
}

// Hero Section 3D Scene
class HeroScene extends ThreeScene {
    constructor() {
        super('hero-3d');
        this.particleSystem = null;
        this.geometricShapes = [];
        this.setupScene();
        this.animate();
    }
    
    setupScene() {
        // Fog for depth
        this.scene.fog = new THREE.Fog(0x0a0a0f, 5, 15);
        
        // Create particle system
        this.createParticleSystem();
        
        // Create floating geometric shapes
        this.createGeometricShapes();
        
        // Create central holographic element
        this.createHologram();
    }
    
    createParticleSystem() {
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 1500; // Reduced from 3000
        const positions = new Float32Array(particlesCount * 3);
        const colors = new Float32Array(particlesCount * 3);
        
        for (let i = 0; i < particlesCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 10;
            positions[i + 1] = (Math.random() - 0.5) * 10;
            positions[i + 2] = (Math.random() - 0.5) * 10;
            
            const color = new THREE.Color();
            color.setHSL(Math.random() * 0.1 + 0.6, 0.8, 0.5);
            colors[i] = color.r;
            colors[i + 1] = color.g;
            colors[i + 2] = color.b;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });
        
        this.particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
        this.scene.add(this.particleSystem);
        this.objects.push({
            mesh: this.particleSystem,
            update: (delta) => {
                this.particleSystem.rotation.y += delta * 0.02; // Reduced rotation speed
            }
        });
    }
    
    createGeometricShapes() {
        const shapes = [
            { geometry: new THREE.OctahedronGeometry(0.3), position: [-2, 1, -1] },
            { geometry: new THREE.TetrahedronGeometry(0.4), position: [2, -1, -1] },
            { geometry: new THREE.IcosahedronGeometry(0.35), position: [-1, -1, 0] },
            { geometry: new THREE.DodecahedronGeometry(0.3), position: [1, 1, -2] }
        ];
        
        shapes.forEach((shape, index) => {
            const material = new THREE.MeshPhongMaterial({
                color: new THREE.Color().setHSL(0.6 + index * 0.1, 0.8, 0.5),
                emissive: new THREE.Color().setHSL(0.6 + index * 0.1, 1, 0.3),
                emissiveIntensity: 0.5,
                shininess: 100,
                specular: 0xffffff,
                transparent: true,
                opacity: 0.8,
                side: THREE.DoubleSide
            });
            
            const mesh = new THREE.Mesh(shape.geometry, material);
            mesh.position.set(...shape.position);
            
            // Add wireframe overlay
            const wireframe = new THREE.LineSegments(
                new THREE.EdgesGeometry(shape.geometry),
                new THREE.LineBasicMaterial({ 
                    color: 0xffffff, 
                    transparent: true, 
                    opacity: 0.3 
                })
            );
            mesh.add(wireframe);
            
            this.scene.add(mesh);
            this.geometricShapes.push(mesh);
            
            this.objects.push({
                mesh: mesh,
                basePosition: mesh.position.clone(),
                rotationSpeed: 0.5 + Math.random() * 0.5,
                floatSpeed: 0.5 + Math.random() * 0.5,
                floatAmount: 0.2 + Math.random() * 0.3,
                update: function(delta, mouse) {
                    // Rotation
                    this.mesh.rotation.x += delta * this.rotationSpeed;
                    this.mesh.rotation.y += delta * this.rotationSpeed * 0.7;
                    
                    // Floating animation
                    const time = Date.now() * 0.001;
                    this.mesh.position.y = this.basePosition.y + 
                        Math.sin(time * this.floatSpeed) * this.floatAmount;
                    
                    // Mouse interaction
                    const targetX = this.basePosition.x + mouse.x * 0.3;
                    const targetZ = this.basePosition.z + mouse.y * 0.3;
                    this.mesh.position.x += (targetX - this.mesh.position.x) * 0.05;
                    this.mesh.position.z += (targetZ - this.mesh.position.z) * 0.05;
                }
            });
        });
    }
    
    createHologram() {
        // Central holographic ring
        const ringGeometry = new THREE.TorusGeometry(1, 0.1, 16, 100);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0x6366f1,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.z = -3;
        this.scene.add(ring);
        
        // Glowing core
        const coreGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const coreMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color1: { value: new THREE.Color(0x6366f1) },
                color2: { value: new THREE.Color(0xf472b6) }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color1;
                uniform vec3 color2;
                varying vec2 vUv;
                
                void main() {
                    vec3 color = mix(color1, color2, sin(time + vUv.y * 10.0) * 0.5 + 0.5);
                    float alpha = 0.6 + sin(time * 3.0) * 0.2;
                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        core.position.z = -3;
        this.scene.add(core);
        
        this.objects.push({
            ring: ring,
            core: core,
            material: coreMaterial,
            update: function(delta) {
                this.ring.rotation.x += delta * 0.5;
                this.ring.rotation.y += delta * 0.3;
                this.material.uniforms.time.value += delta;
            }
        });
    }
}

// Product 3D Scene
class ProductScene extends ThreeScene {
    constructor() {
        super('product-3d');
        this.phone = null;
        this.currentColor = 'midnight';
        this.colors = {
            midnight: 0x001f3f,
            aurora: 0x4B0082,
            cosmic: 0xFF1493,
            stellar: 0xC0C0C0
        };
        this.setupScene();
        this.setupControls();
        this.animate();
    }
    
    setupScene() {
        this.camera.position.set(0, 0, 3);
        
        // Create phone model
        this.createPhone();
        
        // Add environment
        this.createEnvironment();
    }
    
    createPhone() {
        const group = new THREE.Group();
        
        // Phone body with rounded corners
        const shape = new THREE.Shape();
        const width = 0.7;
        const height = 1.4;
        const radius = 0.08;
        
        // Create rounded rectangle shape
        shape.moveTo(-width/2 + radius, -height/2);
        shape.lineTo(width/2 - radius, -height/2);
        shape.quadraticCurveTo(width/2, -height/2, width/2, -height/2 + radius);
        shape.lineTo(width/2, height/2 - radius);
        shape.quadraticCurveTo(width/2, height/2, width/2 - radius, height/2);
        shape.lineTo(-width/2 + radius, height/2);
        shape.quadraticCurveTo(-width/2, height/2, -width/2, height/2 - radius);
        shape.lineTo(-width/2, -height/2 + radius);
        shape.quadraticCurveTo(-width/2, -height/2, -width/2 + radius, -height/2);
        
        // Extrude to create 3D phone body
        const extrudeSettings = {
            depth: 0.06,
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.02,
            bevelSegments: 5
        };
        
        const bodyGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        bodyGeometry.center();
        
        const bodyMaterial = new THREE.MeshPhysicalMaterial({
            color: this.colors.midnight,
            metalness: 0.8,
            roughness: 0.2,
            clearcoat: 1,
            clearcoatRoughness: 0.1,
            reflectivity: 0.8
        });
        
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        group.add(body);
        
        // Metal frame
        const frameGeometry = new THREE.TorusGeometry(0.45, 0.015, 4, 4);
        const frameMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x888888,
            metalness: 1,
            roughness: 0.3
        });
        
        // Create frame edges
        const frameShape = new THREE.Shape();
        frameShape.moveTo(-width/2 + radius, -height/2);
        frameShape.lineTo(width/2 - radius, -height/2);
        frameShape.quadraticCurveTo(width/2, -height/2, width/2, -height/2 + radius);
        frameShape.lineTo(width/2, height/2 - radius);
        frameShape.quadraticCurveTo(width/2, height/2, width/2 - radius, height/2);
        frameShape.lineTo(-width/2 + radius, height/2);
        frameShape.quadraticCurveTo(-width/2, height/2, -width/2, height/2 - radius);
        frameShape.lineTo(-width/2, -height/2 + radius);
        frameShape.quadraticCurveTo(-width/2, -height/2, -width/2 + radius, -height/2);
        
        const framePoints = frameShape.getPoints(50);
        const frameGeometry2 = new THREE.BufferGeometry().setFromPoints(framePoints);
        const frameLine = new THREE.Line(frameGeometry2, frameMaterial);
        frameLine.position.z = 0.04;
        group.add(frameLine);
        
        // Screen
        const screenGeometry = new THREE.PlaneGeometry(0.64, 1.34);
        const screenMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x000000,
            metalness: 0,
            roughness: 0.1,
            clearcoat: 1,
            clearcoatRoughness: 0,
            reflectivity: 0.2
        });
        
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.z = 0.041;
        group.add(screen);
        
        // Screen content (display image)
        const screenContentGeometry = new THREE.PlaneGeometry(0.62, 1.32);
        const screenContentMaterial = new THREE.MeshBasicMaterial({
            color: 0x1a1a2e,
            emissive: 0x6366f1,
            emissiveIntensity: 0.2
        });
        
        const screenContent = new THREE.Mesh(screenContentGeometry, screenContentMaterial);
        screenContent.position.z = 0.042;
        
        // Add gradient effect to screen
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 512);
        gradient.addColorStop(0, '#6366f1');
        gradient.addColorStop(0.5, '#f472b6');
        gradient.addColorStop(1, '#1a1a2e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 512);
        
        // Add some UI elements
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(20, 40, 216, 60);
        ctx.fillRect(20, 120, 100, 100);
        ctx.fillRect(136, 120, 100, 100);
        ctx.fillRect(20, 240, 216, 40);
        
        const texture = new THREE.CanvasTexture(canvas);
        screenContent.material.map = texture;
        screenContent.material.emissive = 0x000000;
        screenContent.material.emissiveIntensity = 0;
        
        group.add(screenContent);
        
        // Dynamic Island (notch)
        const notchGeometry = new THREE.CapsuleGeometry(0.08, 0.12, 4, 8);
        notchGeometry.rotateZ(Math.PI / 2);
        const notchMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x000000,
            metalness: 0.5,
            roughness: 0.5
        });
        
        const notch = new THREE.Mesh(notchGeometry, notchMaterial);
        notch.position.set(0, 0.58, 0.045);
        notch.scale.set(1, 0.6, 1);
        group.add(notch);
        
        // Camera module (iPhone-style)
        const cameraGroup = new THREE.Group();
        cameraGroup.position.set(-0.15, 0.48, -0.04);
        
        // Camera bump
        const cameraBumpGeometry = new THREE.BoxGeometry(0.22, 0.22, 0.03);
        cameraBumpGeometry.translate(0, 0, -0.015);
        const cameraBumpMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x1a1a2e,
            metalness: 0.8,
            roughness: 0.3
        });
        const cameraBump = new THREE.Mesh(cameraBumpGeometry, cameraBumpMaterial);
        cameraGroup.add(cameraBump);
        
        // Camera lenses
        const lensGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.02);
        lensGeometry.rotateX(Math.PI / 2);
        const lensMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x222222,
            metalness: 1,
            roughness: 0.2
        });
        
        const lens1 = new THREE.Mesh(lensGeometry, lensMaterial);
        lens1.position.set(-0.05, 0.05, 0);
        cameraGroup.add(lens1);
        
        const lens2 = new THREE.Mesh(lensGeometry, lensMaterial);
        lens2.position.set(0.05, 0.05, 0);
        cameraGroup.add(lens2);
        
        const lens3 = new THREE.Mesh(lensGeometry, lensMaterial);
        lens3.position.set(0, -0.05, 0);
        lens3.scale.set(1.2, 1.2, 1.2);
        cameraGroup.add(lens3);
        
        // Flash
        const flashGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.01);
        flashGeometry.rotateX(Math.PI / 2);
        const flashMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 0.5
        });
        const flash = new THREE.Mesh(flashGeometry, flashMaterial);
        flash.position.set(0.05, -0.05, 0);
        cameraGroup.add(flash);
        
        group.add(cameraGroup);
        
        // Side buttons
        const buttonGeometry = new THREE.BoxGeometry(0.01, 0.08, 0.03);
        const buttonMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x888888,
            metalness: 1,
            roughness: 0.3
        });
        
        // Volume buttons
        const volumeUp = new THREE.Mesh(buttonGeometry, buttonMaterial);
        volumeUp.position.set(-0.365, 0.2, 0);
        group.add(volumeUp);
        
        const volumeDown = new THREE.Mesh(buttonGeometry, buttonMaterial);
        volumeDown.position.set(-0.365, 0.05, 0);
        group.add(volumeDown);
        
        // Power button
        const powerButton = new THREE.Mesh(buttonGeometry, buttonMaterial);
        powerButton.scale.y = 1.5;
        powerButton.position.set(0.365, 0.1, 0);
        group.add(powerButton);
        
        // Add subtle glow to screen
        const screenLight = new THREE.RectAreaLight(0x6366f1, 0.5, 0.6, 1.3);
        screenLight.position.set(0, 0, 0.05);
        group.add(screenLight);
        
        this.phone = group;
        this.scene.add(this.phone);
        
        this.objects.push({
            phone: this.phone,
            update: function(delta, mouse) {
                // Gentle rotation based on mouse
                this.phone.rotation.y = mouse.x * 0.5;
                this.phone.rotation.x = -mouse.y * 0.2;
            }
        });
    }
    
    createEnvironment() {
        // Add floating particles around the phone
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 500;
        const positions = new Float32Array(particlesCount * 3);
        
        for (let i = 0; i < particlesCount * 3; i += 3) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 1.5 + Math.random() * 2;
            positions[i] = Math.cos(angle) * radius;
            positions[i + 1] = (Math.random() - 0.5) * 4;
            positions[i + 2] = Math.sin(angle) * radius;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.01,
            color: 0x6366f1,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        this.scene.add(particles);
        
        this.objects.push({
            particles: particles,
            update: function(delta) {
                this.particles.rotation.y += delta * 0.1;
            }
        });
    }
    
    setupControls() {
        // Color switching
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const color = item.dataset.color;
                this.changePhoneColor(color);
                
                // Update active state
                galleryItems.forEach(g => g.classList.remove('active'));
                item.classList.add('active');
            });
        });
    }
    
    changePhoneColor(colorName) {
        if (this.colors[colorName] && this.phone) {
            const bodyMaterial = this.phone.children[0].material;
            gsap.to(bodyMaterial.color, {
                r: new THREE.Color(this.colors[colorName]).r,
                g: new THREE.Color(this.colors[colorName]).g,
                b: new THREE.Color(this.colors[colorName]).b,
                duration: 0.5,
                ease: "power2.inOut"
            });
        }
    }
}

// Network Visualization Scene
class NetworkScene extends ThreeScene {
    constructor() {
        super('network-3d');
        this.nodes = [];
        this.connections = [];
        this.setupScene();
        this.animate();
    }
    
    setupScene() {
        this.camera.position.set(0, 0, 10);
        
        // Create network nodes
        this.createNetworkNodes();
        
        // Create connections
        this.createConnections();
        
        // Add globe
        this.createGlobe();
    }
    
    createNetworkNodes() {
        const nodeCount = 50;
        const nodeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        
        for (let i = 0; i < nodeCount; i++) {
            const material = new THREE.MeshPhongMaterial({
                color: new THREE.Color().setHSL(0.6 + Math.random() * 0.2, 0.8, 0.6),
                emissive: new THREE.Color().setHSL(0.6 + Math.random() * 0.2, 1, 0.3),
                emissiveIntensity: 0.5
            });
            
            const node = new THREE.Mesh(nodeGeometry, material);
            
            // Position nodes on a sphere
            const phi = Math.acos(2 * Math.random() - 1);
            const theta = 2 * Math.PI * Math.random();
            const radius = 4 + Math.random() * 2;
            
            node.position.x = radius * Math.sin(phi) * Math.cos(theta);
            node.position.y = radius * Math.sin(phi) * Math.sin(theta);
            node.position.z = radius * Math.cos(phi);
            
            this.scene.add(node);
            this.nodes.push(node);
            
            // Add glow
            const glowGeometry = new THREE.SphereGeometry(0.15, 8, 8);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: material.color,
                transparent: true,
                opacity: 0.3,
                blending: THREE.AdditiveBlending
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            node.add(glow);
        }
        
        this.objects.push({
            nodes: this.nodes,
            update: function(delta) {
                this.nodes.forEach((node, i) => {
                    node.rotation.y += delta * 0.5;
                    
                    // Pulsing effect
                    const scale = 1 + Math.sin(Date.now() * 0.001 + i) * 0.1;
                    node.scale.set(scale, scale, scale);
                });
            }
        });
    }
    
    createConnections() {
        // Create connections between nearby nodes
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const distance = this.nodes[i].position.distanceTo(this.nodes[j].position);
                
                if (distance < 3 && Math.random() > 0.7) {
                    const geometry = new THREE.BufferGeometry();
                    const positions = new Float32Array(6);
                    
                    positions[0] = this.nodes[i].position.x;
                    positions[1] = this.nodes[i].position.y;
                    positions[2] = this.nodes[i].position.z;
                    positions[3] = this.nodes[j].position.x;
                    positions[4] = this.nodes[j].position.y;
                    positions[5] = this.nodes[j].position.z;
                    
                    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                    
                    const material = new THREE.LineBasicMaterial({
                        color: 0x6366f1,
                        transparent: true,
                        opacity: 0.3,
                        blending: THREE.AdditiveBlending
                    });
                    
                    const line = new THREE.Line(geometry, material);
                    this.scene.add(line);
                    this.connections.push({
                        line: line,
                        material: material,
                        startNode: this.nodes[i],
                        endNode: this.nodes[j]
                    });
                }
            }
        }
        
        this.objects.push({
            connections: this.connections,
            update: function(delta) {
                this.connections.forEach((conn, i) => {
                    // Animated opacity
                    conn.material.opacity = 0.2 + Math.sin(Date.now() * 0.001 + i) * 0.1;
                    
                    // Update line positions
                    const positions = conn.line.geometry.attributes.position.array;
                    positions[0] = conn.startNode.position.x;
                    positions[1] = conn.startNode.position.y;
                    positions[2] = conn.startNode.position.z;
                    positions[3] = conn.endNode.position.x;
                    positions[4] = conn.endNode.position.y;
                    positions[5] = conn.endNode.position.z;
                    conn.line.geometry.attributes.position.needsUpdate = true;
                });
            }
        });
    }
    
    createGlobe() {
        // Central globe
        const globeGeometry = new THREE.SphereGeometry(2, 32, 32);
        const globeMaterial = new THREE.MeshPhongMaterial({
            color: 0x0a0a0f,
            emissive: 0x1a1a2e,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.8,
            wireframe: true
        });
        
        const globe = new THREE.Mesh(globeGeometry, globeMaterial);
        this.scene.add(globe);
        
        // Globe glow
        const glowGeometry = new THREE.SphereGeometry(2.2, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x6366f1,
            transparent: true,
            opacity: 0.1,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending
        });
        
        const globeGlow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.scene.add(globeGlow);
        
        this.objects.push({
            globe: globe,
            update: function(delta) {
                this.globe.rotation.y += delta * 0.1;
            }
        });
    }
}

// Initialize 3D scenes when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if containers exist
    if (document.getElementById('hero-3d')) {
        window.heroScene = new HeroScene();
    }
    
    if (document.getElementById('product-3d')) {
        window.productScene = new ProductScene();
    }
    
    if (document.getElementById('network-3d')) {
        window.networkScene = new NetworkScene();
    }
});
