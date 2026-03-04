/**
 * Main JavaScript
 * General functionality and interactivity
 */

// Register GSAP ScrollToPlugin
gsap.registerPlugin(ScrollToPlugin);

class PortfolioSite {
    constructor() {
        this.mobileMenuOpen = false;
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupContactForm();
        this.setupScrollToTop();
        this.setupProjectFilters();
        this.setupLazyLoading();
        this.handleExternalLinks();
    }

    /**
     * Mobile menu toggle functionality
     */
    setupMobileMenu() {
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (!menuToggle || !navMenu) return;

        menuToggle.addEventListener('click', () => {
            this.mobileMenuOpen = !this.mobileMenuOpen;

            // Toggle menu visibility
            if (this.mobileMenuOpen) {
                navMenu.style.display = 'flex';
                navMenu.style.flexDirection = 'column';
                navMenu.style.position = 'absolute';
                navMenu.style.top = '100%';
                navMenu.style.left = '0';
                navMenu.style.right = '0';
                navMenu.style.background = 'rgba(10, 10, 10, 0.98)';
                navMenu.style.padding = '2rem';
                navMenu.style.borderTop = '1px solid var(--color-border)';

                // Animate menu items
                gsap.from('.nav-menu li', {
                    x: -50,
                    opacity: 0,
                    stagger: 0.1,
                    duration: 0.5,
                    ease: "power2.out"
                });

                // Animate toggle button
                menuToggle.classList.add('active');
            } else {
                gsap.to('.nav-menu', {
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => {
                        navMenu.style.display = 'none';
                    }
                });

                menuToggle.classList.remove('active');
            }
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                if (this.mobileMenuOpen) {
                    menuToggle.click();
                }
            });
        });

        // Close menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.mobileMenuOpen) {
                navMenu.style.display = '';
                navMenu.style.flexDirection = '';
                navMenu.style.position = '';
                navMenu.style.top = '';
                navMenu.style.left = '';
                navMenu.style.right = '';
                navMenu.style.background = '';
                navMenu.style.padding = '';
                navMenu.style.borderTop = '';
                this.mobileMenuOpen = false;
                menuToggle.classList.remove('active');
            }
        });
    }

    /**
     * Terminal contact animation + copy email
     */
    setupContactForm() {
        // Animate terminal lines in sequence when section scrolls into view
        const lines = document.querySelectorAll('.t-line');
        if (lines.length) {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    lines.forEach((line, i) => {
                        setTimeout(() => line.classList.add('visible'), i * 120);
                    });
                    observer.disconnect();
                }
            }, { threshold: 0.3 });
            observer.observe(document.querySelector('.terminal-box'));
        }

        // Copy email to clipboard
        const copyBtn = document.getElementById('copyEmailBtn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText('sensorevolve@gmail.com').then(() => {
                    const orig = copyBtn.textContent;
                    copyBtn.textContent = '[ COPIED! ]';
                    copyBtn.classList.add('copied');
                    setTimeout(() => {
                        copyBtn.textContent = orig;
                        copyBtn.classList.remove('copied');
                    }, 2000);
                });
            });
        }
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;

        // Styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            padding: '1rem 2rem',
            background: type === 'success' ? 'var(--color-secondary)' : 'var(--color-accent)',
            color: 'var(--color-bg-dark)',
            borderRadius: '10px',
            fontWeight: '600',
            zIndex: '10000',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
        });

        document.body.appendChild(notification);

        // Animate in
        gsap.from(notification, {
            x: 100,
            opacity: 0,
            duration: 0.5,
            ease: "back.out(2)"
        });

        // Remove after 3 seconds
        setTimeout(() => {
            gsap.to(notification, {
                x: 100,
                opacity: 0,
                duration: 0.5,
                ease: "power2.in",
                onComplete: () => notification.remove()
            });
        }, 3000);
    }

    /**
     * Scroll to top button
     */
    setupScrollToTop() {
        const scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.innerHTML = '↑';
        scrollBtn.setAttribute('aria-label', 'Scroll to top');

        // Styles
        Object.assign(scrollBtn.style, {
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
            color: 'white',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            opacity: '0',
            visibility: 'hidden',
            transition: 'all 0.3s',
            zIndex: '1000',
            boxShadow: '0 5px 20px rgba(255, 107, 53, 0.3)'
        });

        document.body.appendChild(scrollBtn);

        // Show/hide on scroll
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                scrollBtn.style.opacity = '1';
                scrollBtn.style.visibility = 'visible';
            } else {
                scrollBtn.style.opacity = '0';
                scrollBtn.style.visibility = 'hidden';
            }
        });

        // Scroll to top on click
        scrollBtn.addEventListener('click', () => {
            gsap.to(window, {
                scrollTo: { y: 0 },
                duration: 1,
                ease: "power3.inOut"
            });
        });
    }

    /**
     * Project filtering (placeholder for future implementation)
     */
    setupProjectFilters() {
        // Add filter buttons if needed
        const projectsSection = document.querySelector('.projects');
        if (!projectsSection) return;

        // This is a placeholder for project filtering functionality
        // Can be expanded to filter projects by category
    }

    /**
     * Lazy loading for images (when real images are added)
     */
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.add('loaded');
                            observer.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    /**
     * Handle external links
     */
    handleExternalLinks() {
        document.querySelectorAll('a[href^="http"]').forEach(link => {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        });
    }
}

// Initialize the site
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioSite();
});

// Page visibility API - pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause any heavy animations or processes
        console.log('Page hidden - pausing animations');
    } else {
        // Resume animations
        console.log('Page visible - resuming animations');
    }
});

// Performance monitoring
window.addEventListener('load', () => {
    // Log performance metrics
    if (window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms`);
    }
});

// Smooth scroll behavior for CTA button
document.querySelector('.cta-button')?.addEventListener('click', () => {
    gsap.to(window, {
        scrollTo: { y: '#projects', offsetY: 80 },
        duration: 1.5,
        ease: "power3.inOut"
    });
});
