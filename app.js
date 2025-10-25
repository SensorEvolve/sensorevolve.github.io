/**
 * SENSOREVOLVE - INTERACTIVE FUNCTIONALITY
 * Smooth scrolling, animations, and UI interactions
 */

// ==========================================
// NAVIGATION SCROLL EFFECT
// ==========================================

const nav = document.getElementById('nav');
let lastScrollY = window.scrollY;

function handleNavScroll() {
  const currentScrollY = window.scrollY;

  if (currentScrollY > 100) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }

  lastScrollY = currentScrollY;
}

window.addEventListener('scroll', handleNavScroll);


// ==========================================
// MOBILE MENU TOGGLE
// ==========================================

const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

function toggleMobileMenu() {
  navToggle.classList.toggle('active');
  mobileMenu.classList.toggle('active');
  document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenu() {
  navToggle.classList.remove('active');
  mobileMenu.classList.remove('active');
  document.body.style.overflow = '';
}

navToggle.addEventListener('click', toggleMobileMenu);

// Close menu when clicking a link
mobileLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    closeMobileMenu();
  });
});

// Close menu when clicking outside
mobileMenu.addEventListener('click', (e) => {
  if (e.target === mobileMenu) {
    closeMobileMenu();
  }
});


// ==========================================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ==========================================

function smoothScroll(target, duration = 1000) {
  const targetElement = document.querySelector(target);
  if (!targetElement) return;

  const targetPosition = targetElement.offsetTop - 80; // Account for fixed nav
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  // Easing function (easeInOutCubic)
  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t * t + b;
    t -= 2;
    return c / 2 * (t * t * t + 2) + b;
  }

  requestAnimationFrame(animation);
}

// Add smooth scrolling to all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    e.preventDefault();
    smoothScroll(href);
  });
});


// ==========================================
// SCROLL ANIMATIONS (FADE IN)
// ==========================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Optional: unobserve after animation to improve performance
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all elements with fade-in class
document.querySelectorAll('.fade-in').forEach(el => {
  observer.observe(el);
});


// ==========================================
// CONTACT FORM HANDLING
// ==========================================

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData);

  // Get the submit button
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;

  // Show loading state
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  // Simulate form submission (replace with actual endpoint)
  try {
    // Here you would normally send to a backend
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Form data:', data);

    // Show success message
    submitBtn.textContent = 'Message Sent! ✓';
    submitBtn.style.background = '#10b981'; // Green success color

    // Reset form
    contactForm.reset();

    // Reset button after delay
    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      submitBtn.style.background = '';
    }, 3000);

  } catch (error) {
    console.error('Form submission error:', error);

    // Show error message
    submitBtn.textContent = 'Error - Try Again';
    submitBtn.style.background = '#ef4444'; // Red error color

    // Reset button after delay
    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      submitBtn.style.background = '';
    }, 3000);
  }
});


// ==========================================
// ACTIVE NAV LINK ON SCROLL
// ==========================================

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNavLink() {
  let currentSection = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    const sectionHeight = section.offsetHeight;

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNavLink);


// ==========================================
// PERFORMANCE: REDUCE SCROLL EVENT CALLS
// ==========================================

let scrollTimer = null;
let ticking = false;

function optimizedScrollHandler() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      handleNavScroll();
      updateActiveNavLink();
      ticking = false;
    });
    ticking = true;
  }
}

window.addEventListener('scroll', optimizedScrollHandler, { passive: true });


// ==========================================
// INITIALIZE ON PAGE LOAD
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // Initial nav state
  handleNavScroll();

  // Initial active link
  updateActiveNavLink();

  // Add visible class to elements already in view
  document.querySelectorAll('.fade-in').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
    }
  });

  console.log('SensorEvolve initialized ✓');
});


// ==========================================
// EASTER EGG: KONAMI CODE
// ==========================================

const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      activateEasterEgg();
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

function activateEasterEgg() {
  // Add special effect
  document.body.style.animation = 'rainbow 2s infinite';

  // Create style element for rainbow animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rainbow {
      0% { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  // Remove after 5 seconds
  setTimeout(() => {
    document.body.style.animation = '';
  }, 5000);

  console.log('🎉 Easter egg activated! You found the secret!');
}


// ==========================================
// UTILITY: DEBOUNCE FUNCTION
// ==========================================

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}


// ==========================================
// CURSOR GLOW EFFECT (OPTIONAL ENHANCEMENT)
// ==========================================

/*
// Uncomment to enable cursor glow effect
const cursorGlow = document.createElement('div');
cursorGlow.style.cssText = `
  position: fixed;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%);
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: 9999;
  transition: opacity 0.3s;
`;
document.body.appendChild(cursorGlow);

document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});

document.addEventListener('mouseenter', () => {
  cursorGlow.style.opacity = '1';
});

document.addEventListener('mouseleave', () => {
  cursorGlow.style.opacity = '0';
});
*/
