// js/main.js - Main Application Controller

class NovaApp {
    constructor() {
        this.performanceMode = this.checkPerformanceMode();
        this.init();
    }
    
    checkPerformanceMode() {
        // Check URL params for performance mode
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('performance') === 'high') {
            return false; // Full effects
        }
        
        // Auto-detect based on device
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const isLowEndDevice = navigator.hardwareConcurrency <= 4;
        
        return isMobile || isLowEndDevice;
    }
    
    init() {
        // Apply performance mode
        if (this.performanceMode) {
            document.body.classList.add('performance-mode');
            console.log('Performance mode enabled for better scrolling');
        }
        
        // Performance monitoring
        this.initPerformanceMonitoring();
        
        // Lazy loading for images
        this.initLazyLoading();
        
        // Smooth scroll behavior
        this.initSmoothScroll();
        
        // Form handling
        this.initForms();
        
        // Accessibility features
        this.initAccessibility();
        
        // Device detection
        this.detectDevice();
        
        // Service worker for PWA
        this.initServiceWorker();
        
        // Initialize product image switcher
        this.initProductImageSwitcher();
    }
    
    initPerformanceMonitoring() {
        // Monitor FPS
        let lastTime = performance.now();
        let frames = 0;
        let fps = 0;
        
        const updateFPS = () => {
            frames++;
            const currentTime = performance.now();
            
            if (currentTime >= lastTime + 1000) {
                fps = Math.round((frames * 1000) / (currentTime - lastTime));
                frames = 0;
                lastTime = currentTime;
                
                // Reduce quality if FPS is too low
                if (fps < 30 && window.heroScene) {
                    console.log('Low FPS detected, reducing quality...');
                    // Reduce particle count or disable some effects
                }
            }
            
            requestAnimationFrame(updateFPS);
        };
        
        if (window.location.hostname === 'localhost') {
            updateFPS();
        }
    }
    
    initLazyLoading() {
        // Intersection Observer for images
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                        img.removeAttribute('data-srcset');
                    }
                    
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        // Observe all lazy images
        document.querySelectorAll('img[data-src], img[data-srcset]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    initSmoothScroll() {
        // Remove the wheel event override - let browser handle native scrolling
        // This was causing the choppy scroll issue
        
        // Just enhance anchor link scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href && href !== '#' && href.length > 1) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const offset = 80; // Header height
                        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
    
    initForms() {
        // Handle newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(newsletterForm);
                const email = formData.get('email');
                
                // Show loading state
                const submitBtn = newsletterForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Subscribing...';
                submitBtn.disabled = true;
                
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success message
                submitBtn.textContent = 'Subscribed!';
                submitBtn.classList.add('success');
                
                // Reset after delay
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('success');
                    newsletterForm.reset();
                }, 3000);
            });
        }
    }
    
    initAccessibility() {
        // Skip to main content
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Focus management
        const handleTabKey = (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        };
        
        const handleMouseClick = () => {
            document.body.classList.remove('keyboard-nav');
        };
        
        window.addEventListener('keydown', handleTabKey);
        window.addEventListener('mousedown', handleMouseClick);
        
        // Reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            // Disable complex animations
            gsap.globalTimeline.timeScale(0);
            document.body.classList.add('reduced-motion');
        }
        
        prefersReducedMotion.addEventListener('change', (e) => {
            if (e.matches) {
                gsap.globalTimeline.timeScale(0);
                document.body.classList.add('reduced-motion');
            } else {
                gsap.globalTimeline.timeScale(1);
                document.body.classList.remove('reduced-motion');
            }
        });
        
        // ARIA live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
        
        window.announce = (message) => {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        };
    }
    
    detectDevice() {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(navigator.userAgent);
        
        document.body.classList.add(isMobile ? 'mobile' : 'desktop');
        if (isTablet) document.body.classList.add('tablet');
        
        // Detect touch capability
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
        }
        
        // Detect browser
        const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        const isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
        const isFirefox = /Firefox/.test(navigator.userAgent);
        
        if (isChrome) document.body.classList.add('chrome');
        if (isSafari) document.body.classList.add('safari');
        if (isFirefox) document.body.classList.add('firefox');
    }
    
    initServiceWorker() {
        if ('serviceWorker' in navigator && location.protocol === 'https:') {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        }
    }
    
    initProductImageSwitcher() {
        const viewButtons = document.querySelectorAll('.view-btn');
        const productImages = document.querySelectorAll('.product-image');
        
        viewButtons.forEach(button => {
            button.addEventListener('click', () => {
                const view = button.dataset.view;
                
                // Update active button
                viewButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Update active image
                productImages.forEach(img => img.classList.remove('active'));
                const targetImage = document.getElementById(`product-${view}`);
                if (targetImage) {
                    targetImage.classList.add('active');
                }
                
                // Animate the change
                gsap.fromTo(targetImage, 
                    { scale: 0.9, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' }
                );
            });
        });
        
        // Gallery color changes (if you want to keep this functionality)
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                // Update active state
                galleryItems.forEach(g => g.classList.remove('active'));
                item.classList.add('active');
                
                // You can add logic here to change the phone image based on color
                // For now, it just updates the active state
            });
        });
    }
}

// Utility functions
const Utils = {
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Format number with commas
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    
    // Get random from array
    getRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },
    
    // Linear interpolation
    lerp(start, end, amt) {
        return (1 - amt) * start + amt * end;
    },
    
    // Map value from one range to another
    map(value, start1, stop1, start2, stop2) {
        return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
    },
    
    // Clamp value between min and max
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
};

// Ripple effect style
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: translate(-50%, -50%);
        pointer-events: none;
    }
    
    .skip-link {
        position: absolute;
        top: -40px;
        left: 0;
        background: var(--primary);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 0 0 4px 0;
        transition: top 0.3s;
    }
    
    .skip-link:focus {
        top: 0;
    }
    
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
    
    body.keyboard-nav *:focus {
        outline: 2px solid var(--primary);
        outline-offset: 2px;
    }
    
    body.reduced-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
    
    img.loaded {
        animation: fadeIn 0.5s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.novaApp = new NovaApp();
    
    // Export utils for global use
    window.Utils = Utils;
    
    console.log(
        '%c NOVA %c Experience Tomorrow Today ',
        'background: linear-gradient(135deg, #6366f1, #f472b6); color: white; padding: 5px 10px; border-radius: 3px 0 0 3px; font-weight: bold;',
        'background: #1a1a2e; color: white; padding: 5px 10px; border-radius: 0 3px 3px 0;'
    );
});
