/**
 * Enhanced Animation Controller
 * Smooth, performant animations with modern JavaScript
 */

class AnimationController {
    constructor() {
        this.isInitialized = false;
        this.animations = {};
        this.config = {
            locomotive: {
                el: document.querySelector('#main'),
                smooth: true,
                multiplier: 1,
                class: 'is-revealed',
                scrollbarContainer: false,
                scrollFromAnywhere: false,
                touchMultiplier: 2,
                smoothMobile: true,
                smartphone: {
                    smooth: true
                },
                tablet: {
                    smooth: true
                }
            },
            swiper: {
                slidesPerView: "auto",
                centeredSlides: true,
                spaceBetween: 100,
                speed: 800,
                grabCursor: true,
                loop: true,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                },
                effect: 'coverflow',
                coverflowEffect: {
                    rotate: 20,
                    stretch: 0,
                    depth: 200,
                    modifier: 1,
                    slideShadows: true,
                }
            },
            loader: {
                duration: 4200,
                easing: 'cubic-bezier(0.77, 0, 0.175, 1)'
            }
        };
        
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        this.waitForDOM(() => {
            this.initLocomotiveScroll();
            this.initSwiperAnimation();
            this.initPage4Animation();
            this.initMenuAnimation();
            this.initLoaderAnimation();
            this.initScrollTriggers();
            this.isInitialized = true;
        });
    }

    waitForDOM(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    initLocomotiveScroll() {
        try {
            if (typeof LocomotiveScroll !== 'undefined') {
                this.scroll = new LocomotiveScroll(this.config.locomotive);
                
                // Smooth scroll to sections
                this.scroll.on('scroll', (instance) => {
                    this.handleScrollProgress(instance.scroll.y);
                });
            }
        } catch (error) {
            console.warn('Locomotive Scroll initialization failed:', error);
        }
    }

    handleScrollProgress(scrollY) {
        // Add parallax effects based on scroll position
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        parallaxElements.forEach(el => {
            const speed = el.dataset.parallax || 0.5;
            const yPos = -(scrollY * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    }

    initPage4Animation() {
        const elemContainer = document.querySelector("#elem-container");
        const fixedImage = document.querySelector("#fixed-image");
        const elements = document.querySelectorAll(".elem");

        if (!elemContainer || !fixedImage) return;

        // Enhanced hover effects with smooth transitions
        elemContainer.addEventListener("mouseenter", () => {
            this.showFixedImage(fixedImage);
        });

        elemContainer.addEventListener("mouseleave", () => {
            this.hideFixedImage(fixedImage);
        });

        // Smooth image transitions for each element
        elements.forEach((elem, index) => {
            elem.addEventListener("mouseenter", (e) => {
                this.updateFixedImage(fixedImage, elem, e);
            });

            // Add stagger animation on load
            elem.style.opacity = '0';
            elem.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                elem.style.transition = 'all 0.6s cubic-bezier(0.77, 0, 0.175, 1)';
                elem.style.opacity = '1';
                elem.style.transform = 'translateY(0)';
            }, index * 100);
        });

        // Mouse follow effect
        elemContainer.addEventListener("mousemove", (e) => {
            this.updateImagePosition(fixedImage, e);
        });
    }

    showFixedImage(fixedImage) {
        fixedImage.style.display = "block";
        fixedImage.style.opacity = "0";
        fixedImage.style.transform = "scale(0.8)";
        
        requestAnimationFrame(() => {
            fixedImage.style.transition = "all 0.4s cubic-bezier(0.77, 0, 0.175, 1)";
            fixedImage.style.opacity = "1";
            fixedImage.style.transform = "scale(1)";
        });
    }

    hideFixedImage(fixedImage) {
        fixedImage.style.transition = "all 0.3s ease-out";
        fixedImage.style.opacity = "0";
        fixedImage.style.transform = "scale(0.8)";
        
        setTimeout(() => {
            fixedImage.style.display = "none";
        }, 300);
    }

    updateFixedImage(fixedImage, elem, event) {
        const imageUrl = elem.getAttribute("data-image");
        if (imageUrl) {
            // Preload image for smooth transition
            const img = new Image();
            img.onload = () => {
                fixedImage.style.backgroundImage = `url(${imageUrl})`;
                fixedImage.style.backgroundSize = 'cover';
                fixedImage.style.backgroundPosition = 'center';
            };
            img.src = imageUrl;
        }
    }

    updateImagePosition(fixedImage, event) {
        const { clientX, clientY } = event;
        const { innerWidth, innerHeight } = window;
        
        const xPercent = (clientX / innerWidth) * 100;
        const yPercent = (clientY / innerHeight) * 100;
        
        fixedImage.style.transform = `translate(${xPercent * 0.1}px, ${yPercent * 0.1}px) scale(1)`;
    }

    initSwiperAnimation() {
        try {
            if (typeof Swiper !== 'undefined') {
                const swiperContainer = document.querySelector(".mySwiper");
                if (swiperContainer) {
                    this.swiper = new Swiper(".mySwiper", this.config.swiper);
                    
                    // Add custom slide animations
                    this.swiper.on('slideChange', () => {
                        this.animateSlideContent();
                    });
                }
            }
        } catch (error) {
            console.warn('Swiper initialization failed:', error);
        }
    }

    animateSlideContent() {
        const activeSlide = document.querySelector('.swiper-slide-active');
        if (activeSlide) {
            const content = activeSlide.querySelectorAll('[data-animate]');
            content.forEach((el, index) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    el.style.transition = 'all 0.6s cubic-bezier(0.77, 0, 0.175, 1)';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }
    }

    initMenuAnimation() {
        const menuTrigger = document.querySelector("nav h3");
        const fullScreen = document.querySelector("#full-scr");
        const navImage = document.querySelector("nav img");
        
        if (!menuTrigger || !fullScreen) return;

        let isMenuOpen = false;
        
        menuTrigger.addEventListener("click", () => {
            this.toggleMenu(fullScreen, navImage, isMenuOpen);
            isMenuOpen = !isMenuOpen;
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMenuOpen) {
                this.toggleMenu(fullScreen, navImage, isMenuOpen);
                isMenuOpen = false;
            }
        });
    }

    toggleMenu(fullScreen, navImage, isOpen) {
        const duration = 0.8;
        const easing = 'cubic-bezier(0.77, 0, 0.175, 1)';
        
        if (!isOpen) {
            // Open menu
            fullScreen.style.transition = `transform ${duration}s ${easing}`;
            fullScreen.style.transform = 'translateY(0%)';
            
            if (navImage) {
                navImage.style.transition = `opacity 0.3s ease-out`;
                navImage.style.opacity = '0';
            }
            
            // Animate menu items
            this.animateMenuItems(true);
        } else {
            // Close menu
            fullScreen.style.transform = 'translateY(-100%)';
            
            if (navImage) {
                setTimeout(() => {
                    navImage.style.opacity = '1';
                }, 400);
            }
            
            this.animateMenuItems(false);
        }
    }

    animateMenuItems(show) {
        const menuItems = document.querySelectorAll('#full-scr .menu-item');
        menuItems.forEach((item, index) => {
            if (show) {
                item.style.opacity = '0';
                item.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    item.style.transition = 'all 0.6s cubic-bezier(0.77, 0, 0.175, 1)';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, (index * 100) + 300);
            } else {
                item.style.transition = 'all 0.3s ease-out';
                item.style.opacity = '0';
                item.style.transform = 'translateY(-20px)';
            }
        });
    }

    initLoaderAnimation() {
        const loader = document.querySelector("#loader");
        if (!loader) return;

        // Enhanced loader with progress animation
        const progressBar = loader.querySelector('.progress-bar');
        const loaderText = loader.querySelector('.loader-text');
        
        // Animate progress bar
        if (progressBar) {
            progressBar.style.width = '0%';
            progressBar.style.transition = `width ${this.config.loader.duration}ms ${this.config.loader.easing}`;
            
            setTimeout(() => {
                progressBar.style.width = '100%';
            }, 100);
        }

        // Animate loader text
        if (loaderText) {
            this.typeWriter(loaderText, loaderText.textContent, 50);
        }

        // Hide loader with smooth animation
        setTimeout(() => {
            this.hideLoader(loader);
        }, this.config.loader.duration);
    }

    hideLoader(loader) {
        loader.style.transition = `transform 1s ${this.config.loader.easing}`;
        loader.style.transform = 'translateY(-100%)';
        
        setTimeout(() => {
            loader.style.display = 'none';
            // Trigger page entrance animations
            this.triggerPageEntrance();
        }, 1000);
    }

    typeWriter(element, text, speed) {
        element.textContent = '';
        let i = 0;
        
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    }

    triggerPageEntrance() {
        const animatedElements = document.querySelectorAll('[data-entrance]');
        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            
            setTimeout(() => {
                el.style.transition = 'all 0.8s cubic-bezier(0.77, 0, 0.175, 1)';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }

    initScrollTriggers() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements with scroll animation
        document.querySelectorAll('[data-scroll-animate]').forEach(el => {
            observer.observe(el);
        });
    }

    // Public methods for external control
    destroy() {
        if (this.scroll) this.scroll.destroy();
        if (this.swiper) this.swiper.destroy();
        this.isInitialized = false;
    }

    refresh() {
        if (this.scroll) this.scroll.update();
        if (this.swiper) this.swiper.update();
    }
}

// Initialize animations when DOM is ready
const animationController = new AnimationController();

// Export for external use
window.AnimationController = animationController;

// Add CSS for smooth animations (inject into head)
const style = document.createElement('style');
style.textContent = `
    [data-scroll-animate] {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s cubic-bezier(0.77, 0, 0.175, 1);
    }
    
    [data-scroll-animate].animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .elem {
        transition: all 0.3s cubic-bezier(0.77, 0, 0.175, 1);
    }
    
    .elem:hover {
        transform: translateY(-5px);
    }
    
    #fixed-image {
        transition: all 0.4s cubic-bezier(0.77, 0, 0.175, 1);
        will-change: transform, opacity;
    }
    
    #full-scr {
        transform: translateY(-100%);
        will-change: transform;
    }
    
    .menu-item {
        will-change: transform, opacity;
    }
`;
document.head.appendChild(style);