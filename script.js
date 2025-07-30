
document.addEventListener('DOMContentLoaded', function() {
    let profileCarousel; // Store carousel instance
    
    // Get all navigation links and sections
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    // Function to show only the target section
    function showSection(targetId) {
        // Hide all sections
        sections.forEach(section => {
            section.style.cssText = 'display: none !important;';
            section.classList.remove('active-section');
        });
        
        // Show the target section
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.style.cssText = 'display: block !important;';
            targetSection.classList.add('active-section');
        }
        
        // Update active nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to clicked link
        const activeLink = document.querySelector(`a[href="#${targetId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // Scroll to top of the page
        window.scrollTo(0, 0);
        
        // Initialize carousel if profile section is shown
        if (targetId === 'profile' || targetId === 'about') {
            setTimeout(() => {
                if (!profileCarousel) {
                    profileCarousel = new ProfileCarousel();
                }
            }, 100);
        }
    }
    
    // Function to show section from hash
    function showSectionFromHash() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            showSection(hash);
        } else {
            showSection('home');
        }
    }
    
    // Add click event listeners to navigation links (single handler)
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section ID from href
            const targetId = this.getAttribute('href').substring(1);
            
            // Show the target section
            showSection(targetId);
            
            // Update URL hash
            window.history.pushState(null, null, `#${targetId}`);
            
            // Close mobile menu if open
            const navMenu = document.querySelector('.nav-menu');
            const toggleIcon = document.getElementById('toggle-icon');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (toggleIcon) {
                    toggleIcon.textContent = '☰';
                }
            }
        });
    });
    
    // Handle hash changes
    window.addEventListener("hashchange", showSectionFromHash);
    window.addEventListener("load", showSectionFromHash);
    
    // Initialize - show home section by default
    showSection('home');
    
   
    
    // CV Download function
    window.downloadCV = function() {
        const cvUrl = 'path/to/your/cv.pdf';
        const link = document.createElement('a');
        link.href = cvUrl;
        link.download = 'Chandni_Bhadarka_CV.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    // Mobile menu toggle
    window.toggleMobileMenu = function() {
        const navMenu = document.querySelector('.nav-menu');
        const toggleIcon = document.getElementById('toggle-icon');
        
        if (navMenu && toggleIcon) {
            navMenu.classList.toggle('active');
            toggleIcon.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
        }
    };
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.9)';
            }
        }
    });
    
    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Thank you for your message! I will get back to you soon.');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
    
    // Scroll to top button
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.style.display = 'block';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        });
        
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// Profile Carousel Class - Fixed Version
class ProfileCarousel {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 4;
        this.isAutoPlay = true;
        this.autoPlayInterval = null;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.startAutoPlay();
        this.animateOnLoad();
    }

    bindEvents() {
        // Navigation buttons - Fixed selector and event handling
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.previousSlide();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.nextSlide();
            });
        }

        // Indicator dots
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.goToSlide(index);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const activeSection = document.querySelector('section.active-section');
            if (activeSection && (activeSection.id === 'profile' || activeSection.id === 'about')) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.previousSlide();
                }
                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextSlide();
                }
            }
        });

        // Touch/swipe support
        const carousel = document.querySelector('.carousel-container');
        if (carousel) {
            carousel.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
            carousel.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
            
            // Pause auto-play on hover
            carousel.addEventListener('mouseenter', () => this.pauseAutoPlay());
            carousel.addEventListener('mouseleave', () => this.startAutoPlay());
        }

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoPlay();
            } else {
                this.startAutoPlay();
            }
        });
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateCarousel();
        console.log('Next slide:', this.currentSlide); // Debug log
    }

    previousSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateCarousel();
        console.log('Previous slide:', this.currentSlide); // Debug log
    }

    goToSlide(index) {
        if (index >= 0 && index < this.totalSlides) {
            this.currentSlide = index;
            this.updateCarousel();
            console.log('Go to slide:', this.currentSlide); // Debug log
        }
    }

    updateCarousel() {
        const track = document.getElementById('carouselTrack');
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.indicator');

        if (track) {
            // Calculate the translation - assumes 4 slides displayed at 25% each
            const translateX = -this.currentSlide * 25;
            track.style.transform = `translateX(${translateX}%)`;
            track.style.transition = 'transform 0.5s ease-in-out';
        }

        // Update slide visibility
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
            if (index === this.currentSlide) {
                slide.classList.add('entering');
                setTimeout(() => slide.classList.remove('entering'), 600);
            }
        });

        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });

        // Add animation to current slide
        this.animateCurrentSlide();
    }

    animateCurrentSlide() {
        const currentSlideElement = document.querySelector('.carousel-slide.active');
        if (!currentSlideElement) return;

        // Animate profile image
        const profileImage = currentSlideElement.querySelector('.profile-image');
        if (profileImage) {
            profileImage.style.transform = 'scale(0.8)';
            profileImage.style.opacity = '0';
            
            setTimeout(() => {
                profileImage.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                profileImage.style.transform = 'scale(1)';
                profileImage.style.opacity = '1';
            }, 100);
        }

        // Animate platform link
        const platformLink = currentSlideElement.querySelector('.platform-link');
        if (platformLink) {
            platformLink.style.transform = 'translateY(20px)';
            platformLink.style.opacity = '0';
            
            setTimeout(() => {
                platformLink.style.transition = 'all 0.6s ease';
                platformLink.style.transform = 'translateY(0)';
                platformLink.style.opacity = '1';
            }, 300);
        }
    }

    startAutoPlay() {
        if (!this.isAutoPlay) return;
        
        this.pauseAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
    }

    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].clientX;
        this.handleSwipe();
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.previousSlide();
            }
        }
    }

    animateOnLoad() {
        setTimeout(() => {
            const header = document.querySelector('.section-header');
            if (header) header.classList.add('fade-in-up');
        }, 200);
        
        setTimeout(() => {
            const container = document.querySelector('.carousel-container');
            if (container) container.classList.add('fade-in-up');
            this.animateCurrentSlide();
        }, 600);
    }

    handleResize() {
        const track = document.getElementById('carouselTrack');
        if (track) {
            const translateX = -this.currentSlide * 25;
            track.style.transform = `translateX(${translateX}%)`;
        }
    }
}

// Initialize carousel when needed
window.addEventListener('resize', function() {
    if (window.profileCarousel) {
        window.profileCarousel.handleResize();
    }
});

// Store carousel instance globally for debugging
window.profileCarousel = null;
