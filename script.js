// =====================================================
// Gupta Dental Care - JavaScript Functionality
// =====================================================

const SITE = {
    home: './',
    booking: 'booking/',
    symptoms: 'symptoms/',
    gallery: 'gallery/',
    login: 'login/',
    admin: 'admin/'
};

const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/AraLLAGuS63JFRBz9';
const GOOGLE_MAPS_REVIEWS_URL = GOOGLE_MAPS_URL;

// Helper to detect browser language (defaults to 'hi' if Hindi, otherwise 'en')
const getBrowserLanguage = () => {
    const lang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    return lang.startsWith('hi') ? 'hi' : 'en';
};

// Language state - checks localStorage first, then browser language
let currentLanguage = localStorage.getItem('preferredLanguage') || getBrowserLanguage();

// ==================== Document Ready ====================
document.addEventListener('DOMContentLoaded', function () {
    // Initialize features
    initNavbar();
    initSmoothScroll();
    initActiveNavLinks();
    initGalleryPopup();
    initTheme();
    initScrollProgressBar();
    initFAQ();
    initSymptomChecker();

    console.log('Gupta Dental Care website loaded successfully!');
});

// ==================== Navbar Functionality ====================
function initNavbar() {
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (window.innerWidth < 992) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    toggle: false
                });
                bsCollapse.hide();
            }
        });
    });
}

// ==================== Smooth Scrolling ====================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Ignore empty hash and non-section links
            if (href === '#' || href === '#!') {
                return;
            }

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== Active Navigation Links ====================
function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    window.addEventListener('scroll', function () {
        let current = '';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');

            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ==================== Language Toggle ====================
function toggleLanguage() {
    // Toggle language state
    currentLanguage = currentLanguage === 'en' ? 'hi' : 'en';

    // Update body attribute for font family
    document.body.setAttribute('data-lang', currentLanguage);

    // Update desktop button text
    const langText = document.getElementById('lang-text');
    if (langText) langText.textContent = currentLanguage === 'en' ? 'हिंदी' : 'English';

    // Update mobile button text (short form)
    const langTextMobile = document.getElementById('lang-text-mobile');
    if (langTextMobile) langTextMobile.textContent = currentLanguage === 'en' ? 'हिं' : 'En';

    // Update all bilingual content
    updateContent();

    // Store preference
    localStorage.setItem('preferredLanguage', currentLanguage);

    // Show notification
    showNotification(currentLanguage === 'en' ? 'Language changed to English' : 'भाषा हिंदी में बदल गई');
}

// ==================== Update Content ====================
function updateContent() {
    const elements = document.querySelectorAll('[data-en][data-hi]');

    elements.forEach(element => {
        const englishText = element.getAttribute('data-en');
        const hindiText = element.getAttribute('data-hi');

        if (currentLanguage === 'en') {
            element.textContent = englishText;
        } else {
            element.textContent = hindiText;
        }
    });

    // Recalculate max-height of active FAQ contents
    document.querySelectorAll('.faq-item.active .faq-content').forEach(content => {
        content.style.maxHeight = content.scrollHeight + 'px';
    });
}

// ==================== Notification System ====================
function showNotification(message) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.custom-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(14, 165, 233, 0.9);
        backdrop-filter: blur(10px);
        color: white;
        padding: 0.8rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        font-weight: 600;
        border: 1px solid rgba(255,255,255,0.1);
        animation: slideInRight 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), fadeOut 0.5s ease 2.5s;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ==================== Scroll Animations ====================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => observer.observe(card));

    // Observe testimonial cards
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(card => observer.observe(card));

    // Observe gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => observer.observe(item));

    // Observe contact cards
    const contactCards = document.querySelectorAll('.contact-card');
    contactCards.forEach(card => observer.observe(card));
}

// ==================== Load Saved Language Preference ====================
window.addEventListener('load', function () {
    const savedLanguage = localStorage.getItem('preferredLanguage') || getBrowserLanguage();

    currentLanguage = savedLanguage;
    document.body.setAttribute('data-lang', currentLanguage);

    const langText = document.getElementById('lang-text');
    if (langText) langText.textContent = currentLanguage === 'en' ? 'हिंदी' : 'English';

    const langTextMobile = document.getElementById('lang-text-mobile');
    if (langTextMobile) langTextMobile.textContent = currentLanguage === 'en' ? 'हिं' : 'En';

    updateContent();
});

// ==================== Gallery Image Modal (Optional Enhancement) ====================
function initGalleryModal() {
    const galleryItems = document.querySelectorAll('.gallery-item img');

    galleryItems.forEach(img => {
        img.addEventListener('click', function () {
            // Create modal overlay
            const modal = document.createElement('div');
            modal.className = 'gallery-modal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                cursor: pointer;
            `;

            // Create image
            const modalImg = document.createElement('img');
            modalImg.src = this.src;
            modalImg.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                border-radius: 10px;
                box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
            `;

            modal.appendChild(modalImg);
            document.body.appendChild(modal);

            // Close on click
            modal.addEventListener('click', function () {
                modal.remove();
            });

            // Close on ESC key
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') {
                    modal.remove();
                }
            });
        });
    });
}

// Initialize gallery modal
initGalleryModal();

// ==================== Scroll to Top Button ====================
function initScrollToTop() {
    // Create scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 150px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #0d6efd, #00a8e8);
        color: white;
        border: none;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 998;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    `;

    document.body.appendChild(scrollBtn);

    // Show/hide on scroll
    window.addEventListener('scroll', function () {
        if (window.scrollY > 500) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });

    // Scroll to top on click
    scrollBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Hover effect
    scrollBtn.addEventListener('mouseenter', function () {
        this.style.transform = 'scale(1.1)';
    });

    scrollBtn.addEventListener('mouseleave', function () {
        this.style.transform = 'scale(1)';
    });
}

// Initialize scroll to top button
initScrollToTop();

// ==================== Form Validation (If needed in future) ====================
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
        }
    });

    return isValid;
}

// ==================== Animation for notification ====================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== WhatsApp Click Tracking ====================
const whatsappBtn = document.querySelector('.whatsapp-btn');
if (whatsappBtn) {
    whatsappBtn.addEventListener('click', function () {
        console.log('WhatsApp button clicked');
    });
}

// ==================== Call Button Click Tracking ====================
const callBtn = document.querySelector('.call-btn');
if (callBtn) {
    callBtn.addEventListener('click', function () {
        console.log('Call button clicked');
    });
}

// ==================== Performance Optimization ====================
// Lazy load images
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ==================== Service Worker Registration (Optional for PWA) ====================
if ('serviceWorker' in navigator) {
    // Uncomment to enable service worker
    // navigator.serviceWorker.register('/sw.js')
    //     .then(reg => console.log('Service Worker registered', reg))
    //     .catch(err => console.log('Service Worker registration failed', err));
}

// ==================== Console Welcome Message ====================
console.log('%c Welcome to Gupta Dental Care! ', 'background: #0d6efd; color: white; font-size: 16px; padding: 10px; border-radius: 5px;');
console.log('%c For inquiries, call: +91 98765 43210 ', 'color: #0d6efd; font-size: 14px;');

// ==================== Prevent Right Click on Images (Optional) ====================
// Uncomment to enable
// document.querySelectorAll('img').forEach(img => {
//     img.addEventListener('contextmenu', e => e.preventDefault());
// });

// ==================== Analytics Placeholder ====================
function trackEvent(eventName, eventData) {
    // Placeholder for Google Analytics or other analytics tools
    console.log('Event tracked:', eventName, eventData);

    // Example: gtag('event', eventName, eventData);
}

// Track page sections viewed
const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('id');
            trackEvent('section_view', { section: sectionId });
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('section[id]').forEach(section => {
    sectionObserver.observe(section);
});

// ==================== Gallery Navigation Logic ====================
function initGalleryPopup() {
    const visitBtn = document.getElementById('visitGalleryBtn');
    if (visitBtn) {
        visitBtn.onclick = () => { window.location.href = SITE.gallery; };
    }
}

// ==================== Theme & Background Mode ====================
function initTheme() {
    const mode = localStorage.getItem('backgroundMode');
    if (!mode || mode === 'light') {
        setLightMode();
    } else {
        setDarkMode();
    }
}

function setLightMode() {
    document.body.classList.add('light-mode');
    document.documentElement.classList.add('light-mode');
    const bgText = document.getElementById('bg-mode-text');
    if (bgText) bgText.textContent = 'Dark Mode';
    // Sync mobile toggle icon
    const mobileBtn = document.getElementById('bg-toggle-mobile');
    if (mobileBtn) mobileBtn.querySelector('i').className = 'fas fa-moon';
    const desktopBtn = document.getElementById('bg-toggle');
    if (desktopBtn) desktopBtn.querySelector('i').className = 'fas fa-moon';
    localStorage.setItem('backgroundMode', 'light');
}

function setDarkMode() {
    document.body.classList.remove('light-mode');
    document.documentElement.classList.remove('light-mode');
    const bgText = document.getElementById('bg-mode-text');
    if (bgText) bgText.textContent = 'Light Mode';
    // Sync mobile toggle icon
    const mobileBtn = document.getElementById('bg-toggle-mobile');
    if (mobileBtn) mobileBtn.querySelector('i').className = 'fas fa-sun';
    const desktopBtn = document.getElementById('bg-toggle');
    if (desktopBtn) desktopBtn.querySelector('i').className = 'fas fa-sun';
    localStorage.setItem('backgroundMode', 'dark');
}

function toggleBackgroundMode() {
    if (document.body.classList.contains('light-mode')) {
        setDarkMode();
        showNotification('Dark Mode enabled');
    } else {
        setLightMode();
        showNotification('Light Mode enabled');
    }
}

window.toggleBackgroundMode = toggleBackgroundMode;

// ==================== Scroll Progress Bar ====================
function initScrollProgressBar() {
    // Inject the progress bar container dynamically if not present in markup
    if (!document.getElementById('scrollProgress')) {
        const container = document.createElement('div');
        container.className = 'scroll-progress-container';
        container.innerHTML = '<div class="scroll-progress-bar" id="scrollProgress"></div>';
        document.body.prepend(container);
    }

    window.addEventListener('scroll', function () {
        const bar = document.getElementById('scrollProgress');
        if (!bar) return;
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        bar.style.width = scrolled + "%";
    });
}

// ==================== Interactive FAQ Accordion ====================
function initFAQ() {
    const faqHeaders = document.querySelectorAll('.faq-header');
    
    faqHeaders.forEach(header => {
        header.addEventListener('click', function () {
            const faqItem = this.parentElement;
            const faqContent = faqItem.querySelector('.faq-content');
            const isActive = faqItem.classList.contains('active');
            
            // Close all other FAQs
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-content').style.maxHeight = '0px';
            });
            
            // Toggle clicked FAQ
            if (!isActive) {
                faqItem.classList.add('active');
                faqContent.style.maxHeight = faqContent.scrollHeight + "px";
            }
        });
    });
}

// ==================== Interactive Symptom Checker ====================
function initSymptomChecker() {
    const symptomCards = document.querySelectorAll('.symptom-card');
    const adviceBoxes = document.querySelectorAll('.symptom-advice-box');
    
    if (symptomCards.length === 0) return;

    symptomCards.forEach(card => {
        card.addEventListener('click', function () {
            // Remove active classes
            symptomCards.forEach(c => c.classList.remove('active'));
            adviceBoxes.forEach(b => b.classList.remove('active'));

            // Set active states
            this.classList.add('active');
            const symptomId = this.getAttribute('data-symptom-id');
            const targetAdviceBox = document.getElementById(`symptom-advice-${symptomId}`);
            
            if (targetAdviceBox) {
                targetAdviceBox.classList.add('active');

                // Scroll smoothly to advice box
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                window.scrollTo({
                    top: targetAdviceBox.offsetTop - navbarHeight - 40,
                    behavior: 'smooth'
                });
            }
        });
    });
}