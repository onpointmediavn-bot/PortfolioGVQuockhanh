// MC Quốc Khánh Portfolio - Optimized Version

/**
 * REVEAL ANIMATION ON SCROLL
 * Uses IntersectionObserver for high-performance scroll triggers
 */
const initReveal = () => {
    const reveals = document.querySelectorAll(".reveal");
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -80px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                // Stop observing once animation is triggered
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    reveals.forEach(el => observer.observe(el));
};

/**
 * PARALLAX EFFECT FOR SHAPES
 * Uses requestAnimationFrame for smooth 60fps movement
 */
const initParallax = () => {
    const shapes = document.querySelectorAll('.shape');
    if (shapes.length === 0) return;

    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    const speed = 0.05;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, { passive: true });

    const animate = () => {
        targetX += (mouseX - targetX) * speed;
        targetY += (mouseY - targetY) * speed;

        shapes.forEach(shape => {
            const factor = 0.02;
            const x = (window.innerWidth / 2 - targetX) * factor;
            const y = (window.innerHeight / 2 - targetY) * factor;
            shape.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        });

        requestAnimationFrame(animate);
    };

    animate();
};

/**
 * SMOOTH SCROLL FOR LINKS
 */
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
};


/**
 * VIDEO PLAYER FACADE HANDLER
 */
const initVideoPlayer = () => {
    const containers = document.querySelectorAll('.video-container');
    
    containers.forEach(container => {
        container.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video-id');
            if (!videoId) return;
            
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'video-modal';
            
            const iframeContainer = document.createElement('div');
            iframeContainer.className = 'modal-iframe-container';
            
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            iframe.allowFullscreen = true;
            iframe.allow = 'autoplay; encrypted-media';
            
            iframeContainer.appendChild(iframe);
            modal.appendChild(iframeContainer);
            
            const closeBtn = document.createElement('button');
            closeBtn.className = 'modal-close-btn';
            closeBtn.innerHTML = '&times;';
            
            modal.appendChild(closeBtn);
            
            const closeModal = () => {
                document.body.removeChild(modal);
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
            };
            
            closeBtn.addEventListener('click', closeModal);
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });
            
            document.body.appendChild(modal);
            
            // Request full screen for the modal if supported
            if (modal.requestFullscreen) {
                modal.requestFullscreen();
            } else if (modal.webkitRequestFullscreen) {
                modal.webkitRequestFullscreen();
            }
        });
    });
};


/**
 * LIGHTBOX FOR IMAGES
 */
const initLightbox = () => {
    const images = document.querySelectorAll('.img-original, .img-placeholder');
    
    images.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
            let src = '';
            if (this.tagName === 'IMG') {
                src = this.src;
            } else {
                const bg = window.getComputedStyle(this).backgroundImage;
                src = bg.replace(/url\(['"]?(.*?)['"]?\)/, '$1');
            }
            
            if (!src || src === 'none') return;
            
            const modal = document.createElement('div');
            modal.className = 'lightbox-modal';
            
            const imgElement = document.createElement('img');
            imgElement.src = src;
            imgElement.className = 'lightbox-img';
            
            modal.appendChild(imgElement);
            
            const closeBtn = document.createElement('button');
            closeBtn.className = 'modal-close-btn';
            closeBtn.innerHTML = '&times;';
            
            modal.appendChild(closeBtn);
            
            const closeModal = () => {
                document.body.removeChild(modal);
            };
            
            closeBtn.addEventListener('click', closeModal);
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });
            
            document.body.appendChild(modal);
        });
    });
};


// INITIALIZE ALL SYSTEMS
document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    initParallax();
    initSmoothScroll();
    initVideoPlayer();
    initLightbox();
});
