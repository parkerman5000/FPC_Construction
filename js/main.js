/**
 * FPC CONSTRUCTION - Elite JavaScript
 * TB12 Mentality - Championship Level Interactions
 * ============================================
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initPreloader();
    initScrollProgress();
    initNavigation();
    initHeroCarousel();
    initCounterAnimation();
    initTestimonialSlider();
    initProjectFilter();
    initFAQ();
    initContactForm();
    initBackToTop();
    initFloatingCTA();
    initSmoothScroll();
    initAOS();
});

/**
 * Preloader
 */
function initPreloader() {
    const preloader = document.getElementById('preloader');

    if (!preloader) return;

    // Hide preloader when page is loaded
    window.addEventListener('load', function() {
        setTimeout(function() {
            preloader.classList.add('hidden');
            document.body.classList.remove('no-scroll');
        }, 500);
    });

    // Fallback - hide after 3 seconds max
    setTimeout(function() {
        preloader.classList.add('hidden');
        document.body.classList.remove('no-scroll');
    }, 3000);
}

/**
 * Scroll Progress Bar
 */
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');

    if (!progressBar) return;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

/**
 * Navigation
 */
function initNavigation() {
    const header = document.getElementById('header');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!header) return;

    // Scroll effect for header
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // Close menu when clicking a link
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    }

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', function() {
        const scrollY = window.pageYOffset + 200;

        sections.forEach(function(section) {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector('.nav-link[href="#' + sectionId + '"]');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                });
                if (navLink) navLink.classList.add('active');
            }
        });
    });
}

/**
 * Hero Carousel with Ken Burns Effect
 */
function initHeroCarousel() {
    const slides = document.querySelectorAll('.hero-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const progressFill = document.querySelector('.progress-fill');
    const currentCounter = document.querySelector('.slide-counter .current');
    const totalCounter = document.querySelector('.slide-counter .total');

    if (slides.length === 0) return;

    let currentSlide = 0;
    let autoPlayInterval;
    let progressInterval;
    const totalSlides = slides.length;
    const slideDuration = 6000; // 6 seconds
    const progressStep = 100 / (slideDuration / 50); // Update every 50ms

    // Set total slides counter
    if (totalCounter) {
        totalCounter.textContent = String(totalSlides).padStart(2, '0');
    }

    // Go to specific slide
    function goToSlide(index) {
        // Remove active class from all slides
        slides.forEach(function(slide) {
            slide.classList.remove('active');
        });

        // Update index
        currentSlide = index;
        if (currentSlide >= totalSlides) currentSlide = 0;
        if (currentSlide < 0) currentSlide = totalSlides - 1;

        // Add active class to current slide
        slides[currentSlide].classList.add('active');

        // Update counter
        if (currentCounter) {
            currentCounter.textContent = String(currentSlide + 1).padStart(2, '0');
        }

        // Reset progress
        resetProgress();
    }

    // Next slide
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    // Previous slide
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    // Progress bar animation
    function startProgress() {
        let progress = 0;
        if (progressFill) progressFill.style.width = '0%';

        progressInterval = setInterval(function() {
            progress += progressStep;
            if (progressFill) progressFill.style.width = progress + '%';

            if (progress >= 100) {
                nextSlide();
            }
        }, 50);
    }

    // Reset progress
    function resetProgress() {
        clearInterval(progressInterval);
        if (progressFill) progressFill.style.width = '0%';
        startProgress();
    }

    // Stop autoplay
    function stopAutoPlay() {
        clearInterval(progressInterval);
        if (progressFill) progressFill.style.width = '0%';
    }

    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            prevSlide();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            nextSlide();
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    const heroSection = document.querySelector('.hero');

    if (heroSection) {
        heroSection.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        heroSection.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    // Pause on hover (desktop)
    if (heroSection) {
        heroSection.addEventListener('mouseenter', stopAutoPlay);
        heroSection.addEventListener('mouseleave', startProgress);
    }

    // Start carousel
    startProgress();
}

/**
 * Counter Animation
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    if (counters.length === 0) return;

    const animateCounter = function(counter) {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = function() {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    };

    // Intersection Observer for triggering animation
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(function(counter) {
        observer.observe(counter);
    });
}

/**
 * Testimonial Slider
 */
function initTestimonialSlider() {
    const track = document.getElementById('testimonialsTrack');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.testimonials-section .testimonial-btn.prev');
    const nextBtn = document.querySelector('.testimonials-section .testimonial-btn.next');
    const dotsContainer = document.querySelector('.testimonial-dots');

    if (!track || cards.length === 0) return;

    let currentIndex = 0;
    const totalCards = cards.length;

    // Create dots
    if (dotsContainer) {
        for (let i = 0; i < totalCards; i++) {
            const dot = document.createElement('div');
            dot.classList.add('testimonial-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', function() {
                goToSlide(i);
            });
            dotsContainer.appendChild(dot);
        }
    }

    const dots = document.querySelectorAll('.testimonial-dot');

    function updateSlider() {
        track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';

        // Update dots
        dots.forEach(function(dot, index) {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        if (currentIndex >= totalCards) currentIndex = 0;
        if (currentIndex < 0) currentIndex = totalCards - 1;
        updateSlider();
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Auto-advance every 5 seconds
    setInterval(nextSlide, 5000);

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
    }, { passive: true });
}

/**
 * Project Filter
 */
function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length === 0 || projectCards.length === 0) return;

    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            // Update active button
            filterBtns.forEach(function(b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');

            // Filter projects
            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(function(card) {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

/**
 * FAQ Accordion
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function(item) {
        const question = item.querySelector('.faq-question');

        if (question) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');

                // Close all items
                faqItems.forEach(function(faq) {
                    faq.classList.remove('active');
                });

                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
}

/**
 * Contact Form
 */
function initContactForm() {
    const form = document.getElementById('contactForm');

    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;

        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(function() {
            // Show success message
            showNotification('Thank you! Your message has been sent successfully. We\'ll be in touch soon!', 'success');

            // Reset form
            form.reset();

            // Restore button
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
        }, 1500);
    });

    // Form validation feedback
    const inputs = form.querySelectorAll('input, select, textarea');

    inputs.forEach(function(input) {
        input.addEventListener('blur', function() {
            if (input.required && !input.value) {
                input.style.borderColor = '#ef4444';
            } else {
                input.style.borderColor = '';
            }
        });

        input.addEventListener('input', function() {
            input.style.borderColor = '';
        });
    });
}

/**
 * Notification Toast
 */
function showNotification(message, type) {
    // Remove existing notifications
    const existing = document.querySelector('.notification-toast');
    if (existing) existing.remove();

    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification-toast notification-' + type;
    notification.innerHTML = '<i class="fas ' + (type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle') + '"></i><span>' + message + '</span>';

    // Styles
    notification.style.cssText = 'position: fixed; top: 120px; right: 24px; background: ' + (type === 'success' ? '#22c55e' : '#ef4444') + '; color: white; padding: 16px 24px; border-radius: 12px; display: flex; align-items: center; gap: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); z-index: 10000; animation: slideIn 0.4s ease; max-width: 400px; font-size: 14px;';

    // Add animation styles
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = '@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } } @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }';
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(function() {
        notification.style.animation = 'slideOut 0.4s ease forwards';
        setTimeout(function() {
            notification.remove();
        }, 400);
    }, 5000);
}

/**
 * Back to Top Button
 */
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');

    if (!backToTop) return;

    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    // Scroll to top on click
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Floating CTA Button
 */
function initFloatingCTA() {
    const floatingCTA = document.querySelector('.floating-cta');

    if (!floatingCTA) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 800) {
            floatingCTA.classList.add('visible');
        } else {
            floatingCTA.classList.remove('visible');
        }
    });
}

/**
 * Smooth Scroll for anchor links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize AOS (Animate On Scroll)
 */
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50,
            disable: 'mobile'
        });
    }
}

/**
 * Utility: Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(function() {
                inThrottle = false;
            }, limit);
        }
    };
}

/**
 * Utility: Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    };
}

// Optimized scroll event handling
window.addEventListener('scroll', throttle(function() {
    // All scroll-based functionality is handled in their respective functions
}, 16));

// Handle window resize
window.addEventListener('resize', debounce(function() {
    // Reinitialize AOS on resize
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}, 250));

// Console branding
console.log('%c FPC CONSTRUCTION ', 'background: #d4a017; color: #000; padding: 10px 20px; font-size: 16px; font-weight: bold;');
console.log('%c Built with excellence - TB12 mentality ', 'color: #6b6b6b; font-size: 12px;');
