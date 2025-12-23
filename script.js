// Main functionality
document.addEventListener('DOMContentLoaded', function() {

    // Language choice tracking
    const languageFlags = document.querySelectorAll('.language-flag');
    languageFlags.forEach(flag => {
        flag.addEventListener('click', function() {
            // Store user's language choice
            localStorage.setItem('languageChoice', 'true');
        });
    });

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

    // Review Carousel Functionality
    const reviewCarouselTrack = document.getElementById('reviewCarouselTrack');
    const reviewCards = document.querySelectorAll('.review-card');
    const reviewPrevBtn = document.getElementById('reviewPrevBtn');
    const reviewNextBtn = document.getElementById('reviewNextBtn');
    let currentReviewIndex = 0;
    
    function isMobileView() {
        return window.innerWidth <= 768;
    }
    
    function updateReviewCarousel() {
        if (!reviewCarouselTrack || reviewCards.length === 0) return;
        
        const mobile = isMobileView();
        
        if (mobile) {
            // Mobile: Single card with visible edges
            const cardWidth = reviewCards[0].offsetWidth;
            const gap = 16; // 1rem gap
            const wrapper = document.querySelector('.review-carousel-wrapper');
            const wrapperWidth = wrapper ? wrapper.offsetWidth : window.innerWidth;
            const wrapperPadding = wrapper ? parseInt(window.getComputedStyle(wrapper).paddingLeft) : 20;
            
            // Calculate the visible area width (wrapper width minus padding on both sides)
            const visibleWidth = wrapperWidth - (wrapperPadding * 2);
            
            // Calculate offset to center the active card
            // For index 0, the card should be centered: padding accounts for the left edge
            // The card width is already calc(100% - 40px), so it fits in the visible area
            // We just need to center it: (visibleWidth - cardWidth) / 2
            const centerOffset = (visibleWidth - cardWidth) / 2;
            const cardOffset = -(currentReviewIndex * (cardWidth + gap));
            const offset = centerOffset + cardOffset;
            reviewCarouselTrack.style.transform = `translateX(${offset}px)`;
        } else {
            // Desktop: Show 3 cards, infinite scroll
            if (reviewCards[0].offsetWidth === 0) {
                // Wait for layout
                setTimeout(updateReviewCarousel, 100);
                return;
            }
            const cardWidth = reviewCards[0].offsetWidth;
            const gap = 32; // 2rem gap
            const maxIndex = Math.max(0, reviewCards.length - 3);
            
            // Infinite scroll: wrap around if out of bounds
            if (currentReviewIndex > maxIndex) {
                currentReviewIndex = 0;
            } else if (currentReviewIndex < 0) {
                currentReviewIndex = maxIndex;
            }
            
            const offset = -(currentReviewIndex * (cardWidth + gap));
            reviewCarouselTrack.style.transform = `translateX(${offset}px)`;
        }
    }
    
    // Function to collapse all review texts
    function collapseAllReviews() {
        if (!isMobileView()) return;
        
        const reviewQuotes = document.querySelectorAll('.review-quote');
        const expandButtons = document.querySelectorAll('.review-expand-btn');
        
        reviewQuotes.forEach((quote, index) => {
            const button = expandButtons[index];
            if (!button) return;
            
            // Only collapse if it was expanded (has more than 8 lines)
            if (quote.classList.contains('expanded') && button.classList.contains('show')) {
                quote.classList.remove('expanded');
                quote.classList.add('collapsed');
                button.textContent = 'Mehr anzeigen';
                button.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    function nextReview() {
        const mobile = isMobileView();
        // Collapse current review before switching
        if (mobile) {
            collapseAllReviews();
        }
        if (mobile) {
            currentReviewIndex = (currentReviewIndex + 1) % reviewCards.length;
        } else {
            // Desktop: Infinite scroll
            const maxIndex = Math.max(0, reviewCards.length - 3);
            currentReviewIndex = currentReviewIndex + 1;
            // Wrap around if beyond max
            if (currentReviewIndex > maxIndex) {
                currentReviewIndex = 0;
            }
        }
        updateReviewCarousel();
    }
    
    function prevReview() {
        const mobile = isMobileView();
        // Collapse current review before switching
        if (mobile) {
            collapseAllReviews();
        }
        if (mobile) {
            currentReviewIndex = (currentReviewIndex - 1 + reviewCards.length) % reviewCards.length;
        } else {
            // Desktop: Infinite scroll
            const maxIndex = Math.max(0, reviewCards.length - 3);
            currentReviewIndex = currentReviewIndex - 1;
            // Wrap around if before start
            if (currentReviewIndex < 0) {
                currentReviewIndex = maxIndex;
            }
        }
        updateReviewCarousel();
    }
    
    if (reviewPrevBtn && reviewNextBtn) {
        reviewPrevBtn.addEventListener('click', prevReview);
        reviewNextBtn.addEventListener('click', nextReview);
    }
    
    // Touch/Swipe functionality for review carousel on mobile
    let reviewStartX = 0;
    let reviewStartY = 0;
    let reviewEndX = 0;
    let reviewEndY = 0;
    let reviewIsSwiping = false;
    const reviewCarouselWrapper = document.querySelector('.review-carousel-wrapper');
    
    if (reviewCarouselWrapper) {
        reviewCarouselWrapper.addEventListener('touchstart', function(e) {
            if (!isMobileView()) return;
            reviewStartX = e.touches[0].clientX;
            reviewStartY = e.touches[0].clientY;
            reviewIsSwiping = false;
        }, { passive: true });
        
        reviewCarouselWrapper.addEventListener('touchmove', function(e) {
            if (!isMobileView()) return;
            if (!reviewIsSwiping) {
                const currentX = e.touches[0].clientX;
                const currentY = e.touches[0].clientY;
                const diffX = Math.abs(currentX - reviewStartX);
                const diffY = Math.abs(currentY - reviewStartY);
                
                if (diffX > 10 && diffX > diffY * 2) {
                    reviewIsSwiping = true;
                    e.preventDefault();
                }
            } else {
                e.preventDefault();
            }
        }, { passive: false });
        
        reviewCarouselWrapper.addEventListener('touchend', function(e) {
            if (!isMobileView()) return;
            if (reviewIsSwiping) {
                reviewEndX = e.changedTouches[0].clientX;
                reviewEndY = e.changedTouches[0].clientY;
                handleReviewSwipe();
            }
        }, { passive: true });
        
        function handleReviewSwipe() {
            const swipeThreshold = 50;
            const diffX = reviewStartX - reviewEndX;
            const diffY = reviewStartY - reviewEndY;
            
            if (Math.abs(diffX) > swipeThreshold && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
                // Collapse all reviews before swiping
                collapseAllReviews();
                
                if (diffX > 0) {
                    nextReview();
                } else {
                    prevReview();
                }
            }
        }
    }
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            currentReviewIndex = 0;
            updateReviewCarousel();
        }, 250);
    });
    
    // Initialize review carousel
    if (reviewCards.length > 0) {
        // Wait for layout to be ready
        window.addEventListener('load', function() {
            updateReviewCarousel();
            initReviewExpandButtons();
        });
        // Also try immediately
        setTimeout(function() {
            updateReviewCarousel();
            initReviewExpandButtons();
        }, 100);
    }
    
    // Review Expand/Collapse Functionality for Mobile
    function initReviewExpandButtons() {
        const reviewQuotes = document.querySelectorAll('.review-quote');
        const expandButtons = document.querySelectorAll('.review-expand-btn');
        
        if (!isMobileView()) {
            // Hide all buttons on desktop
            expandButtons.forEach(btn => {
                btn.style.display = 'none';
            });
            reviewQuotes.forEach(quote => {
                quote.classList.remove('collapsed', 'expanded');
            });
            return;
        }
        
        reviewQuotes.forEach((quote, index) => {
            const button = expandButtons[index];
            if (!button) return;
            
            // Remove existing event listeners by cloning
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Reset to check line count
            quote.classList.remove('collapsed', 'expanded');
            quote.style.maxHeight = 'none';
            
            // Force reflow to get accurate measurements
            void quote.offsetHeight;
            
            const lineHeight = parseFloat(window.getComputedStyle(quote).lineHeight) || 1.6 * parseFloat(window.getComputedStyle(quote).fontSize);
            const height = quote.scrollHeight;
            const lines = Math.ceil(height / lineHeight);
            
            if (lines > 8) {
                // More than 8 lines - show button and collapse
                quote.classList.add('collapsed');
                newButton.classList.add('show');
                newButton.textContent = 'Mehr anzeigen';
                newButton.setAttribute('aria-expanded', 'false');
            } else {
                // 8 lines or less - hide button
                quote.classList.add('expanded');
                newButton.classList.remove('show');
            }
            
            // Toggle functionality - only allow expanding the active card
            newButton.addEventListener('click', function() {
                const quoteIndex = index;
                
                // Check if this is the currently active card
                const isActiveCard = quoteIndex === currentReviewIndex;
                
                // Only allow interaction with the active card
                if (!isActiveCard) {
                    return;
                }
                
                const isExpanded = quote.classList.contains('expanded');
                const allCards = document.querySelectorAll('.review-card');
                const activeCard = allCards[quoteIndex];
                
                // Collapse all other cards first (including those in viewport edges)
                const allQuotes = document.querySelectorAll('.review-quote');
                const allButtons = document.querySelectorAll('.review-expand-btn');
                allQuotes.forEach((q, i) => {
                    if (i !== quoteIndex) {
                        const btn = allButtons[i];
                        if (btn && q.classList.contains('expanded') && btn.classList.contains('show')) {
                            q.classList.remove('expanded');
                            q.classList.add('collapsed');
                            btn.textContent = 'Mehr anzeigen';
                            btn.setAttribute('aria-expanded', 'false');
                        }
                    }
                });
                
                if (isExpanded) {
                    // Collapse
                    // First, fix height of all non-active cards
                    allCards.forEach((card, i) => {
                        if (i !== quoteIndex) {
                            const currentHeight = card.offsetHeight;
                            card.style.height = currentHeight + 'px';
                            card.style.minHeight = currentHeight + 'px';
                        }
                    });
                    
                    // Then collapse the active card
                    quote.classList.remove('expanded');
                    quote.classList.add('collapsed');
                    newButton.textContent = 'Mehr anzeigen';
                    newButton.setAttribute('aria-expanded', 'false');
                    
                    // Remove fixed heights after collapse
                    setTimeout(() => {
                        allCards.forEach((card, i) => {
                            if (i !== quoteIndex) {
                                card.style.height = '';
                                card.style.minHeight = '';
                            }
                        });
                    }, 100);
                } else {
                    // Expand (only active card can be expanded)
                    // First, fix height of all non-active cards to prevent them from changing
                    allCards.forEach((card, i) => {
                        if (i !== quoteIndex) {
                            const currentHeight = card.offsetHeight;
                            card.style.height = currentHeight + 'px';
                            card.style.minHeight = currentHeight + 'px';
                        } else {
                            // Ensure active card can grow freely
                            card.style.height = '';
                            card.style.minHeight = '';
                        }
                    });
                    
                    // Then expand the active card
                    quote.classList.remove('collapsed');
                    quote.classList.add('expanded');
                    newButton.textContent = 'Weniger anzeigen';
                    newButton.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }
    
    // Re-initialize on resize
    let reviewResizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(reviewResizeTimeout);
        reviewResizeTimeout = setTimeout(function() {
            initReviewExpandButtons();
        }, 250);
    });

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