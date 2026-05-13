/**
 * ========================================
 * HARON MUTURI - CIVIL ENGINEER PORTFOLIO
 * PROFESSIONAL JAVASCRIPT (CLEANED)
 * ========================================
 * 
 * TABLE OF CONTENTS:
 * 1. DARK MODE TOGGLE
 * 2. MOBILE MENU (Hamburger)
 * 3. SMOOTH SCROLLING
 * 4. SCROLL SPY (Active Nav Link)
 * 5. IMAGE VIEWER MODAL
 * 6. IMAGE UPLOAD
 * 7. CONTACT FORM
 * 8. COMMENTS SECTION
 * 9. LAZY LOADING & SCROLL REVEAL
 * 10. INITIALIZATION
 * ========================================
 */

// ========================================
// GOOGLE APPS SCRIPT API URL
// ========================================
const API_URL = 'https://script.google.com/macros/s/AKfycbzNepqq878tiTtbIrCuEgytwnGiB5bi9dR3p2DdMYCvcNVHkFPypYrn_GNcqdSJUzccDA/exec';

// ========================================
// 1. DARK MODE TOGGLE
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
// 2. MOBILE MENU (Hamburger)
// ========================================
(function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
})();

// ========================================
// 3. SMOOTH SCROLLING
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
// 4. SCROLL SPY (Active Nav Link)
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
// 5. IMAGE VIEWER MODAL
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
    window.attachImageClickListeners = attachListeners;
})();

// ========================================
// 6. IMAGE UPLOAD
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
// 7. CONTACT FORM
// ========================================
(function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = form.querySelector('input[name="name"]')?.value;
        const email = form.querySelector('input[name="email"]')?.value;
        const message = form.querySelector('textarea[name="message"]')?.value;
        
        const btn = form.querySelector('button');
        const originalHtml = btn?.innerHTML || 'Send Message';
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        }

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'sendMessage', name, email, message })
            });
            const data = await res.json();
            
            if (data.success) {
                alert('Message sent successfully! I will get back to you soon.');
                form.reset();
            } else {
                throw new Error(data.error || 'Failed');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to send message. Please try again or email me directly.');
        }
        
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalHtml;
        }
    });
})();

// ========================================
// 8. COMMENTS SECTION
// ========================================
(function initComments() {
    const form = document.getElementById('commentForm');
    const list = document.getElementById('commentsList');
    if (!form || !list) return;

    async function loadComments() {
        try {
            const res = await fetch(`${API_URL}?action=getComments&t=${Date.now()}`);
            const data = await res.json();

            if (!data.success || !data.comments?.length) {
                list.innerHTML = '<div class="no-comments">No comments yet. Be the first to leave a comment!</div>';
                return;
            }

            const escape = (text) => {
                const div = document.createElement('div');
                div.textContent = text;
                return div.innerHTML;
            };

            list.innerHTML = [...data.comments].reverse().map(c => `
                <div class="comment-item">
                    <div class="comment-header">
                        <span class="comment-author">👤 ${escape(c.name || 'Anonymous')}</span>
                        <span class="comment-date">📅 ${c.date || ''}</span>
                    </div>
                    <div class="comment-text">${escape(c.comment || '')}</div>
                </div>
            `).join('');
        } catch (err) {
            console.error(err);
            list.innerHTML = '<div class="no-comments">Unable to load comments. Please try again later.</div>';
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = form.querySelector('input[name="name"]')?.value.trim();
        const comment = form.querySelector('textarea[name="message"]')?.value.trim();
        
        if (!name) return alert('Please enter your name');
        if (!comment) return alert('Please enter your comment');
        
        const btn = form.querySelector('button');
        const originalHtml = btn?.innerHTML || 'Post Comment';
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Posting...';
        }

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'addComment', name, comment })
            });
            const data = await res.json();
            
            if (data.success) {
                alert('Comment posted successfully!');
                form.reset();
                loadComments();
            } else {
                throw new Error(data.error || 'Failed');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to post comment. Please try again.');
        }
        
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalHtml;
        }
    });

    loadComments();
})();

// ========================================
// 9. LAZY LOADING & SCROLL REVEAL
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
        const revealElements = document.querySelectorAll('.exp-card, .achievement-card, .blog-post, .skill');
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
// 10. INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navLinks?.classList.contains('active')) {
            hamburger?.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
});