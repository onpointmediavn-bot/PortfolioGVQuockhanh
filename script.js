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
 * LIGHTBOX FOR IMAGES (With Swipe & Section Grouping)
 */
const initLightbox = () => {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const images = section.querySelectorAll('.img-original, .img-placeholder');
        if (images.length === 0) return;
        
        // Convert to array of sources
        const sources = Array.from(images).map(img => {
            if (img.tagName === 'IMG') {
                return img.src;
            } else {
                const bg = window.getComputedStyle(img).backgroundImage;
                return bg.replace(/url\(['"]?(.*?)['"]?\)/, '$1');
            }
        }).filter(src => src && src !== 'none');
        
        images.forEach((img, index) => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', function() {
                let currentIndex = index;
                
                // Create modal
                const modal = document.createElement('div');
                modal.className = 'lightbox-modal';
                
                const imgElement = document.createElement('img');
                imgElement.src = sources[currentIndex];
                imgElement.className = 'lightbox-img';
                
                modal.appendChild(imgElement);
                
                const closeBtn = document.createElement('button');
                closeBtn.className = 'modal-close-btn';
                closeBtn.innerHTML = '&times;';
                
                modal.appendChild(closeBtn);
                
                // Add navigation if more than 1 image
                if (sources.length > 1) {
                    const prevBtn = document.createElement('button');
                    prevBtn.className = 'lightbox-nav prev';
                    prevBtn.innerHTML = '&#10094;';
                    modal.appendChild(prevBtn);
                    
                    const nextBtn = document.createElement('button');
                    nextBtn.className = 'lightbox-nav next';
                    nextBtn.innerHTML = '&#10095;';
                    modal.appendChild(nextBtn);
                    
                    const updateImage = (idx) => {
                        currentIndex = (idx + sources.length) % sources.length;
                        imgElement.src = sources[currentIndex];
                    };
                    
                    prevBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        updateImage(currentIndex - 1);
                    });
                    
                    nextBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        updateImage(currentIndex + 1);
                    });
                    
                    // Touch events for swiping
                    let touchStartX = 0;
                    let touchEndX = 0;
                    
                    modal.addEventListener('touchstart', (e) => {
                        touchStartX = e.changedTouches[0].screenX;
                    }, {passive: true});
                    
                    modal.addEventListener('touchend', (e) => {
                        touchEndX = e.changedTouches[0].screenX;
                        handleSwipe();
                    }, {passive: true});
                    
                    const handleSwipe = () => {
                        const swipeThreshold = 50;
                        if (touchStartX - touchEndX > swipeThreshold) {
                            updateImage(currentIndex + 1); // Swipe left -> Next
                        }
                        if (touchEndX - touchStartX > swipeThreshold) {
                            updateImage(currentIndex - 1); // Swipe right -> Prev
                        }
                    };
                }
                
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
