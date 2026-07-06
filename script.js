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
 * 5. MOBILE MENU (Hamburger - Slide from Right)
 * 6. SMOOTH SCROLLING
 * 7. SCROLL SPY (Active Nav Link)
 * 8. IMAGE VIEWER MODAL
 * 9. IMAGE UPLOAD
 * 10. CONTACT FORM (Web3Forms)
 * 11. LAZY LOADING & SCROLL REVEAL
 * 12. ROTATING ROLES
 * 13. CLICKABLE PROFILE PICTURE
 * 14. INITIALIZATION
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
// 5. MOBILE MENU (Slide from Right)
// ========================================
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenu && navMenu) {
    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !mobileMenu.contains(e.target)) {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
    
    // Handle window resize
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
// 8. IMAGE VIEWER MODAL WITH NAVIGATION
// ========================================
(function initImageModal() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.close-modal');
    const prevBtn = document.getElementById('prevImage');
    const nextBtn = document.getElementById('nextImage');
    const viewSpan = document.getElementById('viewCount');
    const likeSpan = document.getElementById('likeCount');
    const dislikeSpan = document.getElementById('dislikeCount');
    const likeBtn = document.getElementById('likeBtn');
    const dislikeBtn = document.getElementById('dislikeBtn');
    const captionEl = document.getElementById('modalCaption');
    
    if (!modal) return;

    const API_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
    
    let currentSrc = '';
    let currentStats = { views: 0, likes: 0, dislikes: 0 };
    let currentIndex = 0;
    let currentGalleryImages = [];

    // Get images from the current gallery only
    function getGalleryImages(imgElement) {
        // Find the parent gallery container
        const gallery = imgElement.closest('.gallery-grid');
        if (!gallery) return [imgElement];
        
        // Get all images in the same gallery
        return Array.from(gallery.querySelectorAll('img'));
    }

    // Navigate to next image (within same gallery)
    function nextImage() {
        if (currentGalleryImages.length === 0) return;
        currentIndex = (currentIndex + 1) % currentGalleryImages.length;
        openModalByIndex(currentIndex);
    }

    // Navigate to previous image (within same gallery)
    function prevImage() {
        if (currentGalleryImages.length === 0) return;
        currentIndex = (currentIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
        openModalByIndex(currentIndex);
    }

    // Open modal by index
    function openModalByIndex(index) {
        if (currentGalleryImages.length === 0) return;
        const img = currentGalleryImages[index];
        if (img) {
            openModal(img);
        }
    }

    async function loadStatsFromCloud(imageSrc) {
        try {
            const response = await fetch(`${API_URL}?action=getStats&imageUrl=${encodeURIComponent(imageSrc)}`);
            const data = await response.json();
            
            if (data.success && data.stats) {
                currentStats = data.stats;
            } else {
                currentStats = { views: 0, likes: 0, dislikes: 0 };
            }
            
            const userLiked = localStorage.getItem(`user_liked_${imageSrc}`) === 'true';
            const userDisliked = localStorage.getItem(`user_disliked_${imageSrc}`) === 'true';
            
            updateDisplay(userLiked, userDisliked);
        } catch (error) {
            console.error('Error loading stats:', error);
            currentStats = { views: 0, likes: 0, dislikes: 0 };
            updateDisplay(false, false);
        }
    }

    async function saveStatsToCloud() {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'updateStats',
                    imageUrl: currentSrc,
                    views: currentStats.views,
                    likes: currentStats.likes,
                    dislikes: currentStats.dislikes
                })
            });
            return await response.json();
        } catch (error) {
            console.error('Error saving stats:', error);
            return false;
        }
    }

    function updateDisplay(userLiked, userDisliked) {
        if (viewSpan) viewSpan.textContent = currentStats.views;
        if (likeSpan) likeSpan.textContent = currentStats.likes;
        if (dislikeSpan) dislikeSpan.textContent = currentStats.dislikes;
        
        if (likeBtn) {
            userLiked ? likeBtn.classList.add('liked') : likeBtn.classList.remove('liked');
        }
        if (dislikeBtn) {
            userDisliked ? dislikeBtn.classList.add('disliked') : dislikeBtn.classList.remove('disliked');
        }
    }

    async function handleLike() {
        const userLiked = localStorage.getItem(`user_liked_${currentSrc}`) === 'true';
        const userDisliked = localStorage.getItem(`user_disliked_${currentSrc}`) === 'true';
        
        if (userLiked) {
            currentStats.likes--;
            localStorage.setItem(`user_liked_${currentSrc}`, 'false');
            updateDisplay(false, userDisliked);
        } else {
            if (userDisliked) {
                currentStats.dislikes--;
                localStorage.setItem(`user_disliked_${currentSrc}`, 'false');
            }
            currentStats.likes++;
            localStorage.setItem(`user_liked_${currentSrc}`, 'true');
            updateDisplay(true, false);
            
            if (likeBtn) {
                likeBtn.style.animation = 'pulse 0.5s ease';
                setTimeout(() => likeBtn.style.animation = '', 500);
            }
        }
        await saveStatsToCloud();
    }

    async function handleDislike() {
        const userLiked = localStorage.getItem(`user_liked_${currentSrc}`) === 'true';
        const userDisliked = localStorage.getItem(`user_disliked_${currentSrc}`) === 'true';
        
        if (userDisliked) {
            currentStats.dislikes--;
            localStorage.setItem(`user_disliked_${currentSrc}`, 'false');
            updateDisplay(userLiked, false);
        } else {
            if (userLiked) {
                currentStats.likes--;
                localStorage.setItem(`user_liked_${currentSrc}`, 'false');
            }
            currentStats.dislikes++;
            localStorage.setItem(`user_disliked_${currentSrc}`, 'true');
            updateDisplay(false, true);
            
            if (dislikeBtn) {
                dislikeBtn.style.animation = 'shake 0.3s ease';
                setTimeout(() => dislikeBtn.style.animation = '', 300);
            }
        }
        await saveStatsToCloud();
    }

    async function openModal(img) {
        currentSrc = img.src;
        modal.style.display = 'block';
        modalImg.src = currentSrc;
        if (captionEl) captionEl.textContent = img.alt || '';
        
        // Get only images from the same gallery
        currentGalleryImages = getGalleryImages(img);
        currentIndex = currentGalleryImages.indexOf(img);
        if (currentIndex === -1) currentIndex = 0;
        
        await loadStatsFromCloud(currentSrc);
        
        currentStats.views++;
        await saveStatsToCloud();
        updateDisplay(
            localStorage.getItem(`user_liked_${currentSrc}`) === 'true',
            localStorage.getItem(`user_disliked_${currentSrc}`) === 'true'
        );
        
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        currentGalleryImages = [];
    }

    const onClick = function() { openModal(this); };

    const attachListeners = () => {
        document.querySelectorAll('.gallery-item img').forEach(img => {
            img.removeEventListener('click', onClick);
            img.addEventListener('click', onClick);
        });
    };

    // Watch for new images
    new MutationObserver(attachListeners).observe(document.body, { childList: true, subtree: true });
    
    // Event Listeners
    closeBtn?.addEventListener('click', closeModal);
    likeBtn?.addEventListener('click', handleLike);
    dislikeBtn?.addEventListener('click', handleDislike);
    prevBtn?.addEventListener('click', prevImage);
    nextBtn?.addEventListener('click', nextImage);
    
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') closeModal();
        if (e.key === 'ArrowLeft' && modal.style.display === 'block') prevImage();
        if (e.key === 'ArrowRight' && modal.style.display === 'block') nextImage();
    });
    
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
// 11. LAZY LOADING & SCROLL REVEAL
// ========================================
(function initLazyAndReveal() {
    if ('IntersectionObserver' in window) {
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
        
        const revealElements = document.querySelectorAll('.exp-card, .achievement-card, .skills-card, .community-card');
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
// 12. ROTATING ROLES
// ========================================
const roles = [
    "Structure Designing", 
    "Feasibility Study", 
    "Designing and Building", 
    "Project Management", 
    "Survey Works", 
    "Quality Assurance", 
    "Construction Manager",
    "Community Impact"
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
// 13. CLICKABLE PROFILE PICTURE
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
// 14. INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Close mobile menu on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu?.classList.contains('active')) {
            mobileMenu?.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});
