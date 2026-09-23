/**
 * ========================================
 * HARON MUTURI - CIVIL ENGINEER PORTFOLIO
 * ========================================
 */

// ========================================
// 1. PRELOADER
// ========================================
(function initPreloader() {
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    });
})();

// ========================================
// 2. PROGRESS BAR
// ========================================
(function initProgressBar() {
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        progressBar.style.width = scrolled + '%';
    });
})();

// ========================================
// 3. BACK TO TOP BUTTON
// ========================================
(function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

// ========================================
// 4. DARK MODE TOGGLE
// Only stores a plain 'enabled'/'disabled' flag in localStorage —
// no personal data, no cross-site data involved.
// ========================================
(function initDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    if (!toggle) return;

    try {
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
            toggle.textContent = '☀️';
        }
    } catch (e) {
        // localStorage unavailable (private browsing, etc.) — fail silently.
    }

    toggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        toggle.textContent = isDark ? '☀️' : '🌙';
        try {
            localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
        } catch (e) {
            // ignore storage errors
        }
    });
})();

// ========================================
// 5. MOBILE MENU (Slide from Right)
// ========================================
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenu && navMenu) {
    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !mobileMenu.contains(e.target)) {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// ========================================
// 6. SMOOTH SCROLLING
// ========================================
(function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
})();

// ========================================
// 7. SCROLL SPY (Active Nav Link)
// ========================================
(function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!sections.length) return;

    function updateActiveLink() {
        const scrollPos = window.scrollY + 200;
        let current = '';

        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            if (scrollPos >= top && scrollPos < bottom) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                link.classList.toggle('active', href === `#${current}`);
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
})();

// ========================================
// 8. SCROLL INDICATOR - Scroll to Next Section
// ========================================
(function initScrollButton() {
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    const aboutSection = document.querySelector('#about');

    if (scrollIndicator && aboutSection) {
        scrollIndicator.addEventListener('click', function () {
            const targetPosition = aboutSection.offsetTop - 70;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    }
})();

// ========================================
// 9. IMAGE VIEWER MODAL
// Simple lightbox: view, navigate, close. No external network calls,
// no tracking, no data stored about the visitor.
// ========================================
(function initImageModal() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.close-modal');
    const prevBtn = document.getElementById('prevImage');
    const nextBtn = document.getElementById('nextImage');
    const captionEl = document.getElementById('modalCaption');

    if (!modal || !modalImg) return;

    let currentIndex = 0;
    let currentGalleryImages = [];

    function getGalleryImages(imgElement) {
        const gallery = imgElement.closest('.gallery-grid') || imgElement.closest('.media-grid');
        if (!gallery) return [imgElement];
        return Array.from(gallery.querySelectorAll('img'));
    }

    function showImage(index) {
        if (!currentGalleryImages.length) return;
        const img = currentGalleryImages[index];
        if (!img) return;
        modalImg.src = img.src;
        modalImg.alt = img.alt || '';
        if (captionEl) captionEl.textContent = img.alt || '';
        currentIndex = index;
    }

    function nextImage() {
        if (!currentGalleryImages.length) return;
        showImage((currentIndex + 1) % currentGalleryImages.length);
    }

    function prevImage() {
        if (!currentGalleryImages.length) return;
        showImage((currentIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length);
    }

    function openModal(img) {
        currentGalleryImages = getGalleryImages(img);
        currentIndex = currentGalleryImages.indexOf(img);
        if (currentIndex === -1) currentIndex = 0;

        modal.style.display = 'block';
        showImage(currentIndex);
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        currentGalleryImages = [];
    }

    function onImageClick() {
        openModal(this);
    }

    function attachListeners() {
        document.querySelectorAll('.gallery-item img, .media-item img').forEach(img => {
            img.removeEventListener('click', onImageClick);
            img.addEventListener('click', onImageClick);
            img.style.cursor = 'pointer';
        });
    }

    closeBtn?.addEventListener('click', closeModal);
    prevBtn?.addEventListener('click', prevImage);
    nextBtn?.addEventListener('click', nextImage);

    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => {
        if (modal.style.display !== 'block') return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
    });

    attachListeners();
})();

// ========================================
// 10. CONTACT FORM (Web3Forms)
// Client-side validation only; the actual spam/abuse protection is the
// honeypot field plus Web3Forms' own server-side checks.
// ========================================
(function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = form.querySelector('button[type="submit"]');
        const originalHtml = btn ? btn.innerHTML : 'Send Message';

        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        }

        try {
            const formData = new FormData(form);
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { Accept: 'application/json' },
                body: formData
            });
            const data = await response.json();

            if (data.success) {
                alert('Message sent successfully. I will get back to you soon.');
                form.reset();
            } else {
                throw new Error(data.message || 'Failed to send');
            }
        } catch (error) {
            alert('Sorry, your message could not be sent. Please email me directly at haronmuturi739@gmail.com');
        }

        if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalHtml;
        }
    });
})();

// ========================================
// 11. ROTATING ROLES
// ========================================
(function initRotatingRoles() {
    const roles = [
        'Civil Engineer',
        'Infrastructure Developer',
        'Project Engineer',
        'Affordable Housing Specialist',
        'Community Impact Engineer'
    ];
    let roleIndex = 0;
    const roleElement = document.getElementById('rotatingRole');
    if (!roleElement) return;

    setInterval(() => {
        roleIndex = (roleIndex + 1) % roles.length;
        roleElement.style.opacity = '0';
        setTimeout(() => {
            roleElement.textContent = roles[roleIndex];
            roleElement.style.opacity = '1';
        }, 300);
    }, 3000);
})();

// ========================================
// 12. LAZY LOADING & SCROLL REVEAL
// ========================================
(function initLazyAndReveal() {
    if (!('IntersectionObserver' in window)) return;

    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
                imageObserver.unobserve(entry.target);
            }
        });
    });
    lazyImages.forEach(img => imageObserver.observe(img));

    const revealElements = document.querySelectorAll('.exp-card, .achievement-card, .skills-card, .community-card, .project-card');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });
})();
