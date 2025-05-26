// js/animations.js - GSAP Animation Setup

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin, CustomEase, MotionPathPlugin);

// Custom ease curves
CustomEase.create("smooth", "0.4, 0, 0.2, 1");
CustomEase.create("bounce", "0.68, -0.55, 0.265, 1.55");

// Animation Controller
class AnimationController {
    constructor() {
        this.animations = {};
        this.init();
    }
    
    init() {
        // Loading animation
        this.setupLoadingAnimation();
        
        // Hero animations
        this.setupHeroAnimations();
        
        // Scroll-triggered animations
        this.setupScrollAnimations();
        
        // Interactive animations
        this.setupInteractiveAnimations();
        
        // Sound effects
        this.setupSoundEffects();
    }
    
    setupLoadingAnimation() {
        const loadingTimeline = gsap.timeline({
            onComplete: () => {
                document.querySelector('.loading-screen').classList.add('loaded');
                this.playIntroAnimation();
            }
        });
        
        // Simulate loading progress
        loadingTimeline.to('.loading-progress', {
            width: '100%',
            duration: 2,
            ease: 'power2.inOut',
            onUpdate: function() {
                const progress = Math.round(this.progress() * 100);
                document.querySelector('.loading-percentage').textContent = progress + '%';
            }
        });
    }
    
    playIntroAnimation() {
        const introTimeline = gsap.timeline();
        
        // Animate hero content
        introTimeline
            .fromTo('.hero-badge', 
                { opacity: 0, y: 20, scale: 0.9 },
                { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'smooth' }
            )
            .fromTo('.title-word',
                { opacity: 0, y: '100%' },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'smooth' },
                '-=0.4'
            )
            .fromTo('.hero-description',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'smooth' },
                '-=0.4'
            )
            .fromTo('.hero-cta-group',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'smooth' },
                '-=0.4'
            )
            .fromTo('.hero-stats',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'smooth' },
                '-=0.4'
            )
            .fromTo('.scroll-indicator',
                { opacity: 0 },
                { opacity: 1, duration: 1, ease: 'smooth' },
                '-=0.4'
            );
        
        // Animate stats numbers
        document.querySelectorAll('.stat-number').forEach(stat => {
            const endValue = parseFloat(stat.dataset.value);
            gsap.to(stat, {
                textContent: endValue,
                duration: 2,
                ease: 'power2.out',
                snap: { textContent: endValue % 1 === 0 ? 1 : 0.1 },
                onUpdate: function() {
                    stat.textContent = this.targets()[0].textContent;
                }
            });
        });
        
        // Floating cards animation
        gsap.fromTo('.floating-card',
            { opacity: 0, y: 20, scale: 0.9 },
            { 
                opacity: 0.8, 
                y: 0, 
                scale: 1, 
                duration: 1, 
                stagger: 0.2,
                ease: 'smooth',
                delay: 1
            }
        );
        
        // Continuous floating animation
        document.querySelectorAll('.floating-card').forEach((card, index) => {
            const speed = parseFloat(card.dataset.speed) || 0.5;
            gsap.to(card, {
                y: -20,
                duration: 3 / speed,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
                delay: index * 0.5
            });
        });
    }
    
    setupHeroAnimations() {
        // Badge glow pulse
        gsap.to('.badge-glow', {
            scale: 1.2,
            opacity: 0.6,
            duration: 2,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true
        });
        
        // Button glow on hover is handled by CSS
        
        // Parallax effect for hero content
        gsap.to('.hero-content', {
            y: -100,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            }
        });
    }
    
    setupScrollAnimations() {
        // Section headers
        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.fromTo(header,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'smooth',
                    scrollTrigger: {
                        trigger: header,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
        
        // Bento grid items
        gsap.utils.toArray('.bento-item').forEach((item, index) => {
            gsap.fromTo(item,
                { opacity: 0, y: 50, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: 'smooth',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
        
        // Feature boxes
        gsap.utils.toArray('.feature-box').forEach((box, index) => {
            gsap.fromTo(box,
                { opacity: 0, y: 50, rotateY: -10 },
                {
                    opacity: 1,
                    y: 0,
                    rotateY: 0,
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: 'smooth',
                    scrollTrigger: {
                        trigger: box,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
        
        // Timeline items
        const timelineItems = gsap.utils.toArray('.timeline-item');
        
        timelineItems.forEach((item, index) => {
            gsap.fromTo(item,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'smooth',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse',
                        onEnter: () => {
                            // Activate marker
                            item.querySelector('.timeline-marker').classList.add('active');
                        },
                        onLeaveBack: () => {
                            item.querySelector('.timeline-marker').classList.remove('active');
                        }
                    }
                }
            );
        });
        
        // Timeline progress line
        gsap.to('.timeline-progress', {
            height: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: '.timeline-container',
                start: 'top center',
                end: 'bottom center',
                scrub: 1
            }
        });
        
        // Network stats counter
        const networkStats = document.querySelectorAll('.network-stat .stat-value');
        
        networkStats.forEach(stat => {
            const endValue = parseFloat(stat.dataset.value);
            
            ScrollTrigger.create({
                trigger: stat,
                start: 'top 80%',
                once: true,
                onEnter: () => {
                    gsap.to(stat, {
                        textContent: endValue,
                        duration: 2,
                        ease: 'power2.out',
                        snap: { textContent: 1 }
                    });
                }
            });
        });
        
        // Navigation progress bar
        gsap.to('.nav-progress', {
            width: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: true
            }
        });
    }
    
    setupInteractiveAnimations() {
        // Product feature cards
        const featureCards = document.querySelectorAll('.feature-card');
        
        featureCards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove active from all
                featureCards.forEach(c => c.classList.remove('active'));
                
                // Add active to clicked
                card.classList.add('active');
                
                // Animate the change
                gsap.fromTo(card,
                    { scale: 0.95 },
                    { scale: 1, duration: 0.3, ease: 'bounce' }
                );
                
                // Trigger feature change animation
                const feature = card.dataset.feature;
                this.changeProductFeature(feature);
            });
        });
        
        // Navigation dots
        const navDots = document.querySelectorAll('.nav-dot');
        
        navDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const section = document.getElementById(dot.dataset.section);
                if (section) {
                    gsap.to(window, {
                        scrollTo: { y: section, offsetY: 80 },
                        duration: 1.2,
                        ease: 'smooth'
                    });
                }
            });
        });
        
        // Smooth scroll for nav links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    gsap.to(window, {
                        scrollTo: { y: target, offsetY: 80 },
                        duration: 1.2,
                        ease: 'smooth'
                    });
                }
            });
        });
        
        // Theme toggle animation
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = document.getElementById('theme-icon');
        
        themeToggle.addEventListener('click', () => {
            const body = document.body;
            const currentTheme = body.dataset.theme;
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // Rotate icon
            gsap.to(themeIcon, {
                rotation: 360,
                duration: 0.5,
                ease: 'smooth',
                onComplete: () => {
                    themeIcon.classList.toggle('fa-moon');
                    themeIcon.classList.toggle('fa-sun');
                    gsap.set(themeIcon, { rotation: 0 });
                }
            });
            
            // Change theme
            body.dataset.theme = newTheme;
        });
        
        // Mobile menu toggle
        const menuToggle = document.getElementById('menu-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Animate menu items
            if (navMenu.classList.contains('active')) {
                gsap.fromTo('.nav-link',
                    { opacity: 0, x: -20 },
                    { opacity: 1, x: 0, duration: 0.3, stagger: 0.1, ease: 'smooth' }
                );
            }
        });
    }
    
    setupMagneticCursor() {
        const cursor = document.getElementById('cursor');
        const cursorDot = cursor.querySelector('.cursor-dot');
        const cursorRing = cursor.querySelector('.cursor-ring');
        const magneticElements = document.querySelectorAll('.magnetic-element');
        
        let mouse = { x: 0, y: 0 };
        let cursorPos = { x: 0, y: 0 };
        let isHovering = false;
        
        // Track mouse position
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        
        // Smooth cursor movement
        const updateCursor = () => {
            if (!isHovering) {
                cursorPos.x += (mouse.x - cursorPos.x) * 0.1;
                cursorPos.y += (mouse.y - cursorPos.y) * 0.1;
            }
            
            gsap.set(cursor, {
                x: cursorPos.x,
                y: cursorPos.y
            });
            
            requestAnimationFrame(updateCursor);
        };
        
        updateCursor();
        
        // Magnetic effect
        magneticElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                isHovering = true;
                document.body.classList.add('cursor-hover');
                
                const rect = element.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                gsap.to(cursorPos, {
                    x: centerX,
                    y: centerY,
                    duration: 0.3,
                    ease: 'power2.out'
                });
                
                gsap.to(element, {
                    x: (mouse.x - centerX) * 0.2,
                    y: (mouse.y - centerY) * 0.2,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            element.addEventListener('mouseleave', () => {
                isHovering = false;
                document.body.classList.remove('cursor-hover');
                
                gsap.to(element, {
                    x: 0,
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            element.addEventListener('mousemove', (e) => {
                if (isHovering) {
                    const rect = element.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    
                    gsap.to(element, {
                        x: (e.clientX - centerX) * 0.2,
                        y: (e.clientY - centerY) * 0.2,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
        });
        
        // Hide cursor when leaving window
        document.addEventListener('mouseout', (e) => {
            if (!e.relatedTarget) {
                gsap.to(cursor, { opacity: 0, duration: 0.3 });
            }
        });
        
        document.addEventListener('mouseover', () => {
            gsap.to(cursor, { opacity: 1, duration: 0.3 });
        });
    }
    
    setupSoundEffects() {
        // Create audio context
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        let audioContext = null;
        
        // Initialize audio on first interaction
        const initAudio = () => {
            if (!audioContext) {
                audioContext = new AudioContext();
            }
        };
        
        document.addEventListener('click', initAudio, { once: true });
        
        // Hover sound effect
        const playHoverSound = () => {
            if (!audioContext) return;
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        };
        
        // Click sound effect
        const playClickSound = () => {
            if (!audioContext) return;
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        };
        
        // Add sound to interactive elements
        document.querySelectorAll('.btn, .nav-link, .nav-dot').forEach(element => {
            element.addEventListener('mouseenter', playHoverSound);
            element.addEventListener('click', playClickSound);
        });
    }
    
    changeProductFeature(feature) {
        // This would update the 3D model view
        // For now, just animate the info change
        const info = document.querySelector('.product-info');
        
        gsap.fromTo(info,
            { opacity: 0.7, x: -10 },
            { opacity: 1, x: 0, duration: 0.5, ease: 'smooth' }
        );
    }
    
    // Update scroll progress and active nav dots
    updateScrollProgress() {
        const sections = document.querySelectorAll('section[id]');
        const navDots = document.querySelectorAll('.nav-dot');
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY;
        
        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + scrollY;
            const sectionHeight = rect.height;
            const sectionMiddle = sectionTop + sectionHeight / 2;
            
            // Check if section is in viewport
            if (scrollY + windowHeight / 2 > sectionTop && scrollY + windowHeight / 2 < sectionTop + sectionHeight) {
                // Update active nav dot
                navDots.forEach(dot => dot.classList.remove('active'));
                if (navDots[index]) {
                    navDots[index].classList.add('active');
                }
                
                // Update header style based on section theme
                const theme = section.dataset.theme;
                const header = document.getElementById('site-header');
                
                if (theme === 'light') {
                    header.classList.add('light-section');
                } else {
                    header.classList.remove('light-section');
                }
            }
        });
        
        // Update header scroll state
        const header = document.getElementById('site-header');
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
}

// Parallax controller for various elements
class ParallaxController {
    constructor() {
        this.elements = [];
        this.ticking = false;
        this.scrollY = 0;
        this.init();
    }
    
    init() {
        // Find all parallax elements
        this.setupParallaxElements();
        
        // Throttled scroll handler
        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    }
    
    setupParallaxElements() {
        // Hero 3D container - reduced parallax effect
        this.addElement({
            element: document.querySelector('.hero-3d-container'),
            speed: 0.3, // Reduced from 0.5
            offset: 0
        });
        
        // Floating elements - only on desktop
        if (window.innerWidth > 768) {
            document.querySelectorAll('.floating-card').forEach(card => {
                this.addElement({
                    element: card,
                    speed: parseFloat(card.dataset.speed) * 0.3 || 0.2, // Reduced speed
                    offset: 0
                });
            });
        }
        
        // Bento items with glow - only animate rotation
        document.querySelectorAll('.bento-glow').forEach(glow => {
            this.addElement({
                element: glow,
                speed: 0.1, // Reduced from 0.3
                rotation: true
            });
        });
    }
    
    addElement(config) {
        if (config.element) {
            this.elements.push(config);
        }
    }
    
    onScroll() {
        this.scrollY = window.scrollY;
        
        if (!this.ticking) {
            requestAnimationFrame(() => this.updateElements());
            this.ticking = true;
        }
    }
    
    updateElements() {
        this.elements.forEach(item => {
            if (!item.element) return;
            
            const speed = item.speed || 0.5;
            
            if (item.rotation) {
                gsap.to(item.element, {
                    rotation: this.scrollY * 0.01,
                    duration: 0.5,
                    ease: 'none'
                });
            } else {
                const yPos = -(this.scrollY * speed);
                gsap.to(item.element, {
                    y: yPos,
                    duration: 0.5,
                    ease: 'none'
                });
            }
        });
        
        this.ticking = false;
    }
}

// Text animation effects
class TextEffects {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupTypewriter();
        this.setupTextReveal();
        this.setupGlitchEffect();
    }
    
    setupTypewriter() {
        const typewriterElements = document.querySelectorAll('[data-typewriter]');
        
        typewriterElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            
            ScrollTrigger.create({
                trigger: element,
                start: 'top 80%',
                once: true,
                onEnter: () => {
                    gsap.to(element, {
                        text: text,
                        duration: text.length * 0.05,
                        ease: 'none'
                    });
                }
            });
        });
    }
    
    setupTextReveal() {
        const splitTextElements = document.querySelectorAll('[data-text-reveal]');
        
        splitTextElements.forEach(element => {
            const text = element.textContent;
            const words = text.split(' ');
            
            element.innerHTML = words.map(word => 
                `<span class="word"><span class="word-inner">${word}</span></span>`
            ).join(' ');
            
            gsap.fromTo(element.querySelectorAll('.word-inner'),
                { y: '100%', opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.05,
                    ease: 'smooth',
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
    }
    
    setupGlitchEffect() {
        const glitchElements = document.querySelectorAll('[data-glitch]');
        
        glitchElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                const originalText = element.textContent;
                const glitchChars = '01░▒▓█▀▄■□▪▫◊○●◐◑◒◓◔◕◖◗';
                let iterations = 0;
                
                const interval = setInterval(() => {
                    element.textContent = originalText
                        .split('')
                        .map((char, index) => {
                            if (index < iterations) {
                                return originalText[index];
                            }
                            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                        })
                        .join('');
                    
                    iterations += 1 / 3;
                    
                    if (iterations > originalText.length) {
                        clearInterval(interval);
                        element.textContent = originalText;
                    }
                }, 30);
            });
        });
    }
}

// Visual effects for sections
class VisualEffects {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupCanvasAnimations();
        this.setupGlowEffects();
        this.setupRippleEffects();
    }
    
    setupCanvasAnimations() {
        const visionCanvas = document.getElementById('vision-canvas');
        if (visionCanvas) {
            const ctx = visionCanvas.getContext('2d');
            const width = visionCanvas.width = visionCanvas.offsetWidth;
            const height = visionCanvas.height = visionCanvas.offsetHeight;
            
            // Simple particle system
            const particles = [];
            const particleCount = 50;
            
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: Math.random() * 2 + 1,
                    opacity: Math.random() * 0.5 + 0.5
                });
            }
            
            const animate = () => {
                ctx.clearRect(0, 0, width, height);
                
                particles.forEach(particle => {
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    
                    if (particle.x < 0 || particle.x > width) particle.vx *= -1;
                    if (particle.y < 0 || particle.y > height) particle.vy *= -1;
                    
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(99, 102, 241, ${particle.opacity})`;
                    ctx.fill();
                });
                
                // Draw connections
                particles.forEach((p1, i) => {
                    particles.slice(i + 1).forEach(p2 => {
                        const distance = Math.hypot(p1.x - p2.x, p1.y - p2.y);
                        if (distance < 100) {
                            ctx.beginPath();
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 * (1 - distance / 100)})`;
                            ctx.stroke();
                        }
                    });
                });
                
                requestAnimationFrame(animate);
            };
            
            animate();
        }
    }
    
    setupGlowEffects() {
        // Pulsing glow for active elements
        const glowElements = document.querySelectorAll('.icon-glow, .marker-glow, .btn-glow');
        
        glowElements.forEach(element => {
            gsap.to(element, {
                scale: 1.2,
                opacity: 0.6,
                duration: 2,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true
            });
        });
    }
    
    setupRippleEffects() {
        // Add ripple effect to buttons
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('div');
                ripple.className = 'ripple';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                
                button.appendChild(ripple);
                
                gsap.fromTo(ripple,
                    { width: 0, height: 0, opacity: 1 },
                    {
                        width: 200,
                        height: 200,
                        opacity: 0,
                        duration: 0.6,
                        ease: 'power2.out',
                        onComplete: () => ripple.remove()
                    }
                );
            });
        });
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animation controller
    const animationController = new AnimationController();
    
    // Initialize parallax
    const parallaxController = new ParallaxController();
    
    // Initialize text effects
    const textEffects = new TextEffects();
    
    // Initialize visual effects
    const visualEffects = new VisualEffects();
    
    // Update scroll progress
    window.addEventListener('scroll', () => {
        animationController.updateScrollProgress();
    });
    
    // Initial scroll check
    animationController.updateScrollProgress();
    
    // Refresh ScrollTrigger on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 250);
    });
});
