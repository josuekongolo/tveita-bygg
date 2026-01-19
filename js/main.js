/* ============================================
   TVEITA BYGG ENK - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initMobileMenu();
    initHeaderScroll();
    initSmoothScroll();
    initContactForm();
    initAnimations();
    setActiveNavLink();
});

/* ============================================
   Mobile Menu Toggle
   ============================================ */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');

        // Prevent body scroll when menu is open
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ============================================
   Header Scroll Effect
   ============================================ */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 80;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Add scrolled class when scrolled past threshold
        if (currentScroll > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });
}

/* ============================================
   Smooth Scroll for Anchor Links
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            e.preventDefault();

            const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/* ============================================
   Contact Form Handler
   ============================================ */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const formSuccess = document.querySelector('.form-success');

        // Validate form
        if (!validateForm(form)) {
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sender...</span>';

        // Collect form data
        const formData = {
            name: form.querySelector('#name').value.trim(),
            email: form.querySelector('#email').value.trim(),
            phone: form.querySelector('#phone').value.trim(),
            address: form.querySelector('#address')?.value.trim() || '',
            projectType: form.querySelector('#projectType').value,
            description: form.querySelector('#description').value.trim(),
            wantSiteVisit: form.querySelector('#siteVisit')?.checked || false
        };

        try {
            // Simulate form submission (replace with actual API call)
            await simulateFormSubmission(formData);

            // Show success message
            form.style.display = 'none';
            if (formSuccess) {
                formSuccess.classList.add('show');
            }

            // Reset form
            form.reset();

        } catch (error) {
            console.error('Form submission error:', error);
            alert('Det oppstod en feil ved sending. Vennligst prøv igjen eller ring meg direkte.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Send Henvendelse</span>';
        }
    });

    // Real-time validation
    form.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            // Clear error state on input
            this.classList.remove('error');
            const errorMsg = this.parentNode.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) existingError.remove();
    field.classList.remove('error');

    // Check if required and empty
    if (field.required && !value) {
        isValid = false;
        errorMessage = 'Dette feltet er påkrevd';
    }

    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Vennligst oppgi en gyldig e-postadresse';
        }
    }

    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\d\s+()-]{8,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Vennligst oppgi et gyldig telefonnummer';
        }
    }

    // Show error if invalid
    if (!isValid) {
        field.classList.add('error');
        const errorEl = document.createElement('span');
        errorEl.className = 'error-message';
        errorEl.textContent = errorMessage;
        errorEl.style.cssText = 'color: #EF4444; font-size: 0.875rem; margin-top: 0.25rem; display: block;';
        field.parentNode.appendChild(errorEl);
    }

    return isValid;
}

async function simulateFormSubmission(data) {
    // Simulate API call delay
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Form data submitted:', data);
            resolve({ success: true });
        }, 1500);
    });
}

/* ============================================
   Scroll Animations
   ============================================ */
function initAnimations() {
    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) return;

    const animatedElements = document.querySelectorAll(
        '.service-card, .why-us-item, .value-card, .project-card, .pricing-card, ' +
        '.service-area-card, .area-card, .project-type-card, .weather-point, .trust-point'
    );

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay based on position in grid
                const delay = (index % 4) * 100;
                entry.target.style.transitionDelay = `${delay}ms`;
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        .animate-fade-in-up {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/* ============================================
   Active Navigation State
   ============================================ */
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');

        // Check if this link matches the current page
        if (currentPath.endsWith(href) ||
            (currentPath === '/' && href === 'index.html') ||
            (currentPath.endsWith('/') && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/* ============================================
   Utility Functions
   ============================================ */

// Debounce function for performance
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Format phone number for display
function formatPhoneNumber(phone) {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');
    // Format as Norwegian phone number
    if (cleaned.length === 8) {
        return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5)}`;
    }
    return phone;
}

/* ============================================
   Click-to-Call for Mobile
   ============================================ */
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', function() {
        // Track phone call clicks (for analytics)
        if (typeof gtag === 'function') {
            gtag('event', 'click', {
                'event_category': 'Contact',
                'event_label': 'Phone Call'
            });
        }
    });
});

/* ============================================
   Lazy Loading Images
   ============================================ */
function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for older browsers
        const lazyImages = document.querySelectorAll('img[data-src]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback: load all images immediately
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }
}

// Initialize lazy loading
initLazyLoading();
