/**
 * ========================================
 * HARON MUTURI - CIVIL ENGINEER PORTFOLIO
 * COMPLETE JAVASCRIPT
 * ========================================
 * 
 * TABLE OF CONTENTS:
 * 1. PRELOADER
 * 2. PROGRESS BAR
 * 3. BACK TO TOP BUTTON
 * 4. DARK MODE TOGGLE
 * 5. MOBILE MENU (Hamburger)
 * 6. SMOOTH SCROLLING
 * 7. SCROLL SPY (Active Nav Link)
 * 8. IMAGE VIEWER MODAL
 * 9. IMAGE UPLOAD
 * 10. CONTACT FORM
 * 11. NEWSLETTER FORM
 * 12. LAZY LOADING & SCROLL REVEAL
 * 13. ROTATING ROLES
 * 14. CLICKABLE PROFILE PICTURE
 * 15. TESTIMONIALS CAROUSEL
 * 16. INITIALIZATION
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
        const scrolled = (winScroll / height) * 100;
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
// ========================================
(function initDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    if (!toggle) return;

    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        toggle.textContent = '☀️';
    }

    toggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        toggle.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    });
})();

// ========================================
// 5. MOBILE MENU (Hamburger)
// ========================================
(function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
})();

// ========================================
// 6. SMOOTH SCROLLING
// ========================================
(function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
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
            link.classList.toggle('active', href === `#${current}`);
        });
    }

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
})();

// ========================================
// 8. IMAGE VIEWER MODAL
// ========================================
(function initImageModal() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.close-modal');
    const viewSpan = document.getElementById('viewCount');
    const likeSpan = document.getElementById('likeCount');
    const dislikeSpan = document.getElementById('dislikeCount');
    const likeBtn = document.getElementById('likeBtn');
    const dislikeBtn = document.getElementById('dislikeBtn');
    const captionEl = document.getElementById('modalCaption');
    
    if (!modal) return;

    let stats = {};
    let currentSrc = '';

    const getStats = (src) => {
        if (!stats[src]) {
            const saved = localStorage.getItem(`img_stats_${src}`);
            stats[src] = saved ? JSON.parse(saved) : { views: 0, likes: 0, dislikes: 0, userLiked: false, userDisliked: false };
        }
        return stats[src];
    };

    const updateDisplay = () => {
        const s = stats[currentSrc];
        if (!s) return;
        if (viewSpan) viewSpan.textContent = s.views;
        if (likeSpan) likeSpan.textContent = s.likes;
        if (dislikeSpan) dislikeSpan.textContent = s.dislikes;
        if (likeBtn) likeBtn.classList.toggle('liked', s.userLiked);
        if (dislikeBtn) dislikeBtn.classList.toggle('disliked', s.userDisliked);
    };

    const saveStats = (src) => localStorage.setItem(`img_stats_${src}`, JSON.stringify(stats[src]));

    const handleLike = () => {
        const s = stats[currentSrc];
        if (!s) return;
        
        if (s.userLiked) {
            s.likes--;
            s.userLiked = false;
        } else {
            if (s.userDisliked) {
                s.dislikes--;
                s.userDisliked = false;
                if (dislikeBtn) dislikeBtn.classList.remove('disliked');
            }
            s.likes++;
            s.userLiked = true;
            if (likeBtn) {
                likeBtn.style.animation = 'pulse 0.5s ease';
                setTimeout(() => likeBtn.style.animation = '', 500);
            }
        }
        saveStats(currentSrc);
        updateDisplay();
    };

    const handleDislike = () => {
        const s = stats[currentSrc];
        if (!s) return;
        
        if (s.userDisliked) {
            s.dislikes--;
            s.userDisliked = false;
        } else {
            if (s.userLiked) {
                s.likes--;
                s.userLiked = false;
                if (likeBtn) likeBtn.classList.remove('liked');
            }
            s.dislikes++;
            s.userDisliked = true;
            if (dislikeBtn) {
                dislikeBtn.style.animation = 'shake 0.3s ease';
                setTimeout(() => dislikeBtn.style.animation = '', 300);
            }
        }
        saveStats(currentSrc);
        updateDisplay();
    };

    const openModal = (img) => {
        currentSrc = img.src;
        modal.style.display = 'block';
        modalImg.src = currentSrc;
        if (captionEl) captionEl.textContent = img.alt || '';
        
        const s = getStats(currentSrc);
        s.views++;
        saveStats(currentSrc);
        updateDisplay();
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    const onClick = function() { openModal(this); };

    const attachListeners = () => {
        document.querySelectorAll('.gallery-item img').forEach(img => {
            img.removeEventListener('click', onClick);
            img.addEventListener('click', onClick);
        });
    };

    new MutationObserver(attachListeners).observe(document.body, { childList: true, subtree: true });
    
    closeBtn?.addEventListener('click', closeModal);
    likeBtn?.addEventListener('click', handleLike);
    dislikeBtn?.addEventListener('click', handleDislike);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.style.display === 'block') closeModal(); });
    
    attachListeners();
})();

// ========================================
// 9. IMAGE UPLOAD
// ========================================
window.uploadImage = function(galleryId) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    
    input.onchange = (e) => {
        const files = Array.from(e.target.files);
        const gallery = document.getElementById(galleryId);
        if (!gallery) return;
        
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                const img = document.createElement('img');
                img.src = ev.target.result;
                img.alt = file.name;
                item.appendChild(img);
                gallery.appendChild(item);
                
                img.addEventListener('click', () => {
                    const clickEvent = new Event('click');
                    img.dispatchEvent(clickEvent);
                });
            };
            reader.readAsDataURL(file);
        });
    };
    input.click();
};

// ========================================
// 10. CONTACT FORM (Web3Forms)
// ========================================
(function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    newForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = newForm.querySelector('button');
        const originalHtml = btn?.innerHTML || 'Send Message';
        
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        }

        try {
            const formData = new FormData(newForm);
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            
            if (data.success) {
                alert('✅ Message sent successfully! I will get back to you soon.');
                newForm.reset();
            } else {
                throw new Error(data.message || 'Failed to send');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            alert('❌ Failed to send message. Please email me directly at haronmuturi739@gmail.com');
        }
        
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalHtml;
        }
    });
})();

// ========================================
// 11. NEWSLETTER FORM
// ========================================
(function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;

    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    newForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = newForm.querySelector('button');
        const originalHtml = btn?.innerHTML || 'Subscribe';
        
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
        }

        try {
            const formData = new FormData(newForm);
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            
            if (data.success) {
                alert('✅ Successfully subscribed! Thank you.');
                newForm.reset();
            } else {
                throw new Error(data.message || 'Failed to subscribe');
            }
        } catch (error) {
            console.error('Newsletter error:', error);
            alert('❌ Failed to subscribe. Please try again.');
        }
        
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalHtml;
        }
    });
})();

// ========================================
// 12. LAZY LOADING & SCROLL REVEAL
// ========================================
(function initLazyAndReveal() {
    if ('IntersectionObserver' in window) {
        // Lazy loading images
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
        
        // Scroll reveal animations
        const revealElements = document.querySelectorAll('.exp-card, .achievement-card, .blog-post, .skill, .testimonial-card');
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
    }
})();

// ========================================
// 13. ROTATING ROLES
// ========================================
const roles = [
    "Civil Engineer", 
    "Planning and Feasibility Study", 
    "Designing and Building", 
    "Project Management", 
    "Survey Works", 
    "Quality Assurance", 
    "Maintenance and Retrofitting"
];
let roleIndex = 0;
const roleElement = document.getElementById('rotatingRole');

if (roleElement) {
    setInterval(() => {
        roleIndex = (roleIndex + 1) % roles.length;
        roleElement.style.opacity = '0';
        setTimeout(() => {
            roleElement.textContent = roles[roleIndex];
            roleElement.style.opacity = '1';
        }, 300);
    }, 3000);
}

// ========================================
// 14. CLICKABLE PROFILE PICTURE - ZOOM MODAL
// ========================================
(function initProfileClick() {
    const profileContainer = document.getElementById('profileClickable');
    const profileImg = document.getElementById('nav-photo');
    
    if (!profileContainer || !profileImg) return;
    
    const profileModal = document.createElement('div');
    profileModal.className = 'profile-modal';
    profileModal.id = 'profileModal';
    profileModal.innerHTML = `
        <span class="profile-modal-close">&times;</span>
        <div class="profile-modal-content">
            <img class="profile-modal-img" src="${profileImg.src}" alt="Haron Muturi - Professional Profile">
            <div class="profile-modal-caption">
                <i class="fas fa-user"></i> Haron Muturi - Civil Engineer
            </div>
        </div>
    `;
    document.body.appendChild(profileModal);
    
    const modal = document.getElementById('profileModal');
    const closeBtn = modal.querySelector('.profile-modal-close');
    const modalImg = modal.querySelector('.profile-modal-img');
    
    profileContainer.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        modalImg.src = profileImg.src;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') closeModal();
    });
})();

// ========================================
// 15. TESTIMONIALS CAROUSEL (Optional)
// ========================================
(function initTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    if (!testimonials.length || testimonials.length <= 3) return;
    
    // Simple fade-in animation for testimonials on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    testimonials.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(card);
    });
})();

// ========================================
// 16. INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navLinks?.classList.contains('active')) {
            hamburger?.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});
