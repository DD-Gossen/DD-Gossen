// Main functionality
document.addEventListener('DOMContentLoaded', function() {

    // Mobile Menu Toggle (for future expansion)
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');

    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Close mobile menu if open
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // CTA Button scroll to contact


    // Header hide/show on scroll
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    let scrollThreshold = 100;

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Change background based on scroll position
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.45)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.15)';
        }
        
        // Hide/show header based on scroll direction
        if (scrollTop > scrollThreshold) {
            if (scrollTop > lastScrollTop) {
                // Scrolling down - hide header
                header.classList.add('hidden');
            } else {
                // Scrolling up - show header
                header.classList.remove('hidden');
            }
        } else {
            // Always show header at the top
            header.classList.remove('hidden');
        }
        
        lastScrollTop = scrollTop;
    });

    // Simple Carousel Functionality
    const slides = document.querySelectorAll('.carousel-slide');
    const projectInfos = document.querySelectorAll('.project-info');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentSlide = 0;

    function updateCarousel() {
        // Update slides
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === currentSlide) {
                slide.classList.add('active');
            }
        });
        
        // Update project info
        projectInfos.forEach((info, index) => {
            info.classList.remove('active');
            if (index === currentSlide) {
                info.classList.add('active');
            }
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateCarousel();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateCarousel();
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
    }

    // Initialize carousel
    if (slides.length > 0) {
        updateCarousel();
    }

    // Touch/Swipe functionality for mobile
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    let isSwiping = false;
    const carouselContainer = document.querySelector('.carousel-container');
    
    if (carouselContainer) {
        carouselContainer.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isSwiping = false;
        }, { passive: true });
        
        carouselContainer.addEventListener('touchmove', function(e) {
            if (!isSwiping) {
                const currentX = e.touches[0].clientX;
                const currentY = e.touches[0].clientY;
                const diffX = Math.abs(currentX - startX);
                const diffY = Math.abs(currentY - startY);
                
                // Only start swiping if horizontal movement is clearly dominant
                if (diffX > 10 && diffX > diffY * 2) {
                    isSwiping = true;
                    e.preventDefault();
                }
            } else {
                e.preventDefault();
            }
        }, { passive: false });
        
        carouselContainer.addEventListener('touchend', function(e) {
            if (isSwiping) {
                endX = e.changedTouches[0].clientX;
                endY = e.changedTouches[0].clientY;
                handleSwipe();
            }
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Only trigger if horizontal movement is significant and dominant
            if (Math.abs(diffX) > swipeThreshold && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
                if (diffX > 0) {
                    // Swipe left - next slide
                    nextSlide();
                } else {
                    // Swipe right - previous slide
                    prevSlide();
                }
            }
        }
    }

    // Auto-play carousel removed per user request

    // Contact form handling
    const form = document.querySelector('.contact-form');
    if (form) {
        const submitButton = form.querySelector('.submit-button');
        const originalButtonText = submitButton.textContent;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Change button text based on page language
            const isEnglish = window.location.pathname.includes('/en/');
            submitButton.textContent = isEnglish ? 'Sending...' : 'Wird gesendet...';
            submitButton.disabled = true;
            
            // Submit form via fetch
            fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    // Success
                    const successMessage = isEnglish ? 
                        'Thank you! Your message has been sent successfully.' :
                        'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.';
                    showFormMessage(successMessage, 'success');
                    form.reset();
                } else {
                    throw new Error('Network response was not ok');
                }
            }).catch(error => {
                // Error
                const errorMessage = isEnglish ?
                    'Sorry, there was an error sending your message. Please try again.' :
                    'Entschuldigung, es gab einen Fehler beim Senden. Bitte versuchen Sie es erneut.';
                showFormMessage(errorMessage, 'error');
            }).finally(() => {
                // Reset button
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            });
        });
    }

    function showFormMessage(message, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;
        
        // Insert message before submit button
        const form = document.querySelector('.contact-form');
        const submitButton = form.querySelector('.submit-button');
        form.insertBefore(messageDiv, submitButton);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    // Scroll Animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Debug logging
                console.log('Animating element:', element.className);
                
                // Add animate class to trigger animations
                element.classList.add('animate');
                
                // Stop observing this element
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Hero animations on page load
    window.addEventListener('load', () => {
        const heroElements = document.querySelectorAll('.hero-content .animate-on-scroll');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('animate');
            }, index * 200);
        });
    });

    // Background lazy loading für bessere Performance (entfernt, da jetzt per CSS)
    // function loadBackgroundImage() {
    //     const img = new Image();
    //     img.onload = function() {
    //         document.body.classList.add('background-loaded');
    //         console.log('Background image loaded successfully');
    //     };
    //     img.onerror = function() {
    //         console.warn('Background image failed to load');
    //     };
    //     const isEnglish = window.location.pathname.includes('/en/');
    //     img.src = isEnglish ? '../DD-background.webp' : 'DD-background.webp';
    // }
    // setTimeout(loadBackgroundImage, 100); // Minimale Verzögerung für Performance
});

// Burger-Menü auf Legal-Pages (deutsch & englisch) ausblenden
window.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.legal-page')) {
        var burgers = document.querySelectorAll('.mobile-menu-toggle');
        burgers.forEach(function(burger) {
            burger.style.display = 'none';
        });
    }
}); 