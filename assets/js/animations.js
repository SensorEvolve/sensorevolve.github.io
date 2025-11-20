/**
 * GSAP Animations
 * Scroll-triggered animations inspired by landonorris.com
 */

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Animation settings
const animationConfig = {
    duration: 1,
    ease: "power3.out",
    stagger: 0.1
};

/**
 * Initialize all animations when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    initHeroAnimations();
    initScrollAnimations();
    initProjectCardAnimations();
    initParallaxEffects();
    initNavbarAnimation();
});

/**
 * Hero section entrance animations
 */
function initHeroAnimations() {
    const tl = gsap.timeline({ defaults: { ease: animationConfig.ease } });

    // Animate title lines
    tl.from('.title-line', {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out"
    })
    .from('.hero-subtitle', {
        y: 30,
        opacity: 0,
        duration: 0.8
    }, "-=0.5")
    .from('.cta-button', {
        y: 30,
        opacity: 0,
        scale: 0.9,
        duration: 0.8
    }, "-=0.5")
    .from('.globe-container', {
        scale: 0.8,
        opacity: 0,
        duration: 1.2,
        ease: "back.out(1.7)"
    }, "-=1")
    .from('.scroll-indicator', {
        opacity: 0,
        y: -20,
        duration: 0.8
    }, "-=0.5");
}

/**
 * Scroll-triggered animations for sections
 */
function initScrollAnimations() {
    // Section headers
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header.querySelector('.section-label'), {
            scrollTrigger: {
                trigger: header,
                start: "top 80%",
                end: "top 20%",
                toggleActions: "play none none reverse"
            },
            x: -50,
            opacity: 0,
            duration: 0.8,
            ease: animationConfig.ease
        });

        gsap.from(header.querySelector('.section-title'), {
            scrollTrigger: {
                trigger: header,
                start: "top 80%",
                end: "top 20%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: animationConfig.ease
        });
    });

    // Stats animation
    gsap.utils.toArray('.stat-item').forEach((stat, index) => {
        gsap.from(stat, {
            scrollTrigger: {
                trigger: stat,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            scale: 0.8,
            duration: 0.8,
            delay: index * 0.1,
            ease: "back.out(1.7)"
        });

        // Animate the number counting (only for numeric values)
        const numberElement = stat.querySelector('.stat-number');
        const finalNumber = parseInt(numberElement.textContent);

        // Only animate if it's a valid number
        if (!isNaN(finalNumber)) {
            ScrollTrigger.create({
                trigger: stat,
                start: "top 85%",
                onEnter: () => {
                    gsap.to(numberElement, {
                        innerHTML: finalNumber,
                        duration: 2,
                        snap: { innerHTML: 1 },
                        ease: "power2.out",
                        onUpdate: function() {
                            numberElement.innerHTML = Math.ceil(this.targets()[0].innerHTML) + '+';
                        }
                    });
                }
            });
        }
    });

    // Feature cards
    gsap.utils.toArray('.feature-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 60,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.15,
            ease: animationConfig.ease
        });
    });

    // Contact section
    gsap.from('.contact-text', {
        scrollTrigger: {
            trigger: '.contact',
            start: "top 70%",
            toggleActions: "play none none reverse"
        },
        x: -60,
        opacity: 0,
        duration: 1,
        ease: animationConfig.ease
    });

    gsap.from('.contact-form', {
        scrollTrigger: {
            trigger: '.contact',
            start: "top 70%",
            toggleActions: "play none none reverse"
        },
        x: 60,
        opacity: 0,
        duration: 1,
        ease: animationConfig.ease
    });
}

/**
 * Project card hover and scroll animations
 */
function initProjectCardAnimations() {
    gsap.utils.toArray('.project-card').forEach((card, index) => {
        // Entrance animation
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 80,
            opacity: 0,
            scale: 0.9,
            duration: 0.8,
            delay: (index % 3) * 0.15,
            ease: "back.out(1.4)"
        });

        // Parallax effect on scroll
        gsap.to(card, {
            scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            },
            y: -20,
            ease: "none"
        });

        // Image reveal on scroll
        const projectImage = card.querySelector('.project-image');
        gsap.from(projectImage, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            scale: 1.2,
            duration: 1.2,
            ease: "power2.out"
        });
    });
}

/**
 * Parallax effects for depth
 */
function initParallaxEffects() {
    // Globe and starfield stay in hero section - no parallax needed

    // Hero text subtle parallax
    gsap.to('.hero-text', {
        scrollTrigger: {
            trigger: '.hero',
            start: "top top",
            end: "bottom top",
            scrub: 1
        },
        y: 100,
        opacity: 0.3,
        ease: "none"
    });

    // Background color transitions
    const sections = gsap.utils.toArray('section');
    sections.forEach((section, index) => {
        const bgColor = index % 2 === 0 ? '#0A0A0A' : '#1A1A1A';

        ScrollTrigger.create({
            trigger: section,
            start: "top 50%",
            end: "bottom 50%",
            onEnter: () => gsap.to('body', { backgroundColor: bgColor, duration: 0.5 }),
            onEnterBack: () => gsap.to('body', { backgroundColor: bgColor, duration: 0.5 })
        });
    });
}

/**
 * Navbar scroll behavior
 */
function initNavbarAnimation() {
    const nav = document.querySelector('.nav');

    ScrollTrigger.create({
        start: "top -80",
        end: 99999,
        toggleClass: {
            targets: nav,
            className: "nav-scrolled"
        },
        onEnter: () => {
            gsap.to(nav, {
                backgroundColor: "rgba(10, 10, 10, 0.95)",
                duration: 0.3
            });
        },
        onLeaveBack: () => {
            gsap.to(nav, {
                backgroundColor: "rgba(10, 10, 10, 0.8)",
                duration: 0.3
            });
        }
    });
}

/**
 * Smooth scroll to anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            gsap.to(window, {
                duration: 1,
                scrollTo: {
                    y: target,
                    offsetY: 80
                },
                ease: "power3.inOut"
            });
        }
    });
});

/**
 * Button hover effects
 */
gsap.utils.toArray('.cta-button').forEach(button => {
    button.addEventListener('mouseenter', () => {
        gsap.to(button, {
            scale: 1.05,
            duration: 0.3,
            ease: "back.out(2)"
        });
    });

    button.addEventListener('mouseleave', () => {
        gsap.to(button, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    });
});

/**
 * Cursor trail effect (optional enhancement)
 */
function initCursorEffect() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    gsap.ticker.add(() => {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;

        gsap.set(cursor, {
            x: cursorX,
            y: cursorY
        });
    });
}

// Add custom cursor styles
const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
    .custom-cursor {
        width: 20px;
        height: 20px;
        border: 2px solid #FF6B35;
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        opacity: 0.5;
        transition: width 0.3s, height 0.3s, opacity 0.3s;
    }

    a:hover ~ .custom-cursor,
    button:hover ~ .custom-cursor {
        width: 40px;
        height: 40px;
        opacity: 1;
    }
`;
document.head.appendChild(cursorStyle);

// Uncomment to enable custom cursor
// initCursorEffect();
