/* ============================================
   KŌHĪ — Café Website JavaScript
   Enhanced Animations, Textures & Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── Page Loader ───
    const loader = document.getElementById('loader');

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = 'auto';
            animateHero();
        }, 2200);
    });

    // ─── Custom Cursor ───
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursorFollower');

    if (window.innerWidth > 768 && cursor && cursorFollower) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        function animateCursor() {
            followerX += (mouseX - followerX) * 0.12;
            followerY += (mouseY - followerY) * 0.12;
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        const hoverTargets = document.querySelectorAll(
            'a, button, .menu-item, .gallery-item, .value-card, .contact-card, .menu-tab'
        );

        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => cursorFollower.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorFollower.classList.remove('hover'));
        });
    }

    // ─── Navbar Scroll Effect ───
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        updateActiveNavLink();
        handleParallax(scrollY);
    });

    // ─── Parallax Effects ───
    function handleParallax(scrollY) {
        // Hero background text
        const heroBgText = document.querySelector('.hero-bg-text');
        if (heroBgText) {
            heroBgText.style.transform = `translate(-50%, -50%) translateY(${scrollY * 0.3}px)`;
        }

        // Floating elements parallax
        const leaves = document.querySelectorAll('.floating-leaf');
        leaves.forEach((leaf, i) => {
            const speed = 0.03 + (i * 0.02);
            leaf.style.transform = `translateY(${scrollY * speed}px)`;
        });

        // Hero radial glow
        const glow = document.querySelector('.hero-radial-glow');
        if (glow && scrollY < window.innerHeight) {
            glow.style.transform = `translate(-50%, -50%) translateY(${scrollY * 0.15}px)`;
        }

        // Parallax quote bg
        const parallaxBg = document.querySelector('.parallax-bg');
        if (parallaxBg) {
            const rect = parallaxBg.closest('.parallax-quote').getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                parallaxBg.style.transform = `scale(1.1) translateY(${(progress - 0.5) * 60}px)`;
            }
        }

        // Decorative lines
        const decoLine1 = document.querySelector('.deco-line-1');
        if (decoLine1 && scrollY < window.innerHeight) {
            decoLine1.style.height = `${120 + scrollY * 0.1}px`;
            decoLine1.style.opacity = Math.max(0.08 - scrollY * 0.0001, 0);
        }
    }

    // ─── Back to Top ───
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ─── Mobile Menu ───
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // ─── Active Nav Link ───
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    }

    // ─── Smooth Scroll ───
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ─── Hero Animation ───
    function animateHero() {
        const titleWords = document.querySelectorAll('.title-word');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroDesc = document.querySelector('.hero-description');
        const heroButtons = document.querySelector('.hero-buttons');
        const heroImage = document.querySelector('.hero-image');
        const heroBadge = document.querySelector('.hero-badge');

        if (heroSubtitle) heroSubtitle.classList.add('revealed');

        titleWords.forEach((word, index) => {
            word.style.opacity = '0';
            word.style.transform = 'translateY(60px)';
            word.style.transition = `opacity 0.8s ease ${0.2 + index * 0.12}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + index * 0.12}s`;
            setTimeout(() => {
                word.style.opacity = '1';
                word.style.transform = 'translateY(0)';
            }, 50);
        });

        if (heroDesc) {
            heroDesc.style.transitionDelay = '0.8s';
            heroDesc.classList.add('revealed');
        }

        if (heroButtons) {
            heroButtons.style.transitionDelay = '1s';
            heroButtons.classList.add('revealed');
        }

        if (heroImage) {
            heroImage.style.transitionDelay = '0.5s';
            heroImage.classList.add('revealed');
        }

        if (heroBadge) {
            heroBadge.style.transitionDelay = '1.2s';
            heroBadge.classList.add('revealed');
        }
    }

    // ─── Scroll Reveal ───
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-text, .reveal-image');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        if (!el.closest('.hero')) {
            revealObserver.observe(el);
        }
    });

    // ─── Staggered Reveal ───
    const staggerGroups = document.querySelectorAll('.about-values, .contact-grid');

    staggerGroups.forEach(group => {
        const children = group.children;
        const groupObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    Array.from(children).forEach((child, index) => {
                        child.style.opacity = '0';
                        child.style.transform = 'translateY(30px)';
                        child.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
                        setTimeout(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                        }, 50);
                    });
                    groupObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        groupObserver.observe(group);
    });

    // ─── Counter Animation ───
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const countTo = parseInt(target.getAttribute('data-count'));
                animateCounter(target, 0, countTo, 2000);
                counterObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => counterObserver.observe(num));

    function animateCounter(element, start, end, duration) {
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (end - start) * eased);
            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = end;
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // ─── Menu Tabs ───
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuCategories = document.querySelectorAll('.menu-category');

    menuTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');
            menuTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            menuCategories.forEach(cat => {
                cat.classList.remove('active');
                if (cat.id === category) cat.classList.add('active');
            });
        });
    });

    // ─── Testimonial Slider ───
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentSlide = 0;
    let autoSlideInterval;

    function showSlide(index) {
        testimonialCards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        currentSlide = (index + testimonialCards.length) % testimonialCards.length;
        testimonialCards[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    nextBtn.addEventListener('click', () => { showSlide(currentSlide + 1); resetAutoSlide(); });
    prevBtn.addEventListener('click', () => { showSlide(currentSlide - 1); resetAutoSlide(); });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => { showSlide(index); resetAutoSlide(); });
    });

    function startAutoSlide() { autoSlideInterval = setInterval(() => showSlide(currentSlide + 1), 5000); }
    function resetAutoSlide() { clearInterval(autoSlideInterval); startAutoSlide(); }
    startAutoSlide();

    // ─── Reservation Form ───
    const reservationForm = document.getElementById('reservationForm');
    const formSuccess = document.getElementById('formSuccess');

    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = reservationForm.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = `
                <span>Reserve Now</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M7 17L17 7M17 7H7M17 7V17"/>
                </svg>`;
            submitBtn.disabled = false;
            formSuccess.classList.add('show');
            reservationForm.reset();
            setTimeout(() => formSuccess.classList.remove('show'), 5000);
        }, 1500);
    });

    // ─── Newsletter Form ───
    const newsletterForm = document.getElementById('newsletterForm');

    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector('input');
        const originalPlaceholder = input.placeholder;
        input.value = '';
        input.placeholder = 'Thank you! ♡';
        input.disabled = true;
        setTimeout(() => {
            input.placeholder = originalPlaceholder;
            input.disabled = false;
        }, 3000);
    });

    // ─── Gallery Hover Parallax ───
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            const img = item.querySelector('img');
            img.style.transform = `scale(1.08) translate(${x * 10}px, ${y * 10}px)`;
        });

        item.addEventListener('mouseleave', () => {
            const img = item.querySelector('img');
            img.style.transform = 'scale(1)';
        });
    });

    // ─── Menu Item Hover ───
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.background = 'rgba(200, 149, 108, 0.04)';
            item.style.borderRadius = '8px';
        });
        item.addEventListener('mouseleave', () => {
            item.style.background = 'transparent';
            item.style.borderRadius = '0';
        });
    });

    // ─── Magnetic Button Effect ───
    if (window.innerWidth > 768) {
        const magneticBtns = document.querySelectorAll('.btn-primary, .nav-reserve-btn');

        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    // ─── Card Tilt Effect ───
    if (window.innerWidth > 768) {
        const tiltCards = document.querySelectorAll('.value-card, .contact-card');

        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `translateY(-6px) perspective(1000px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) perspective(1000px) rotateX(0) rotateY(0)';
            });
        });
    }

    // ─── Section Divider Scroll Animation ───
    const dividers = document.querySelectorAll('.section-divider');

    const dividerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const lines = entry.target.querySelectorAll('.divider-line');
                lines.forEach(line => {
                    line.style.transition = 'max-width 1s ease';
                    line.style.maxWidth = '200px';
                });
            }
        });
    }, { threshold: 0.5 });

    dividers.forEach(d => {
        d.querySelectorAll('.divider-line').forEach(line => {
            line.style.maxWidth = '0';
        });
        dividerObserver.observe(d);
    });

    // ─── Floating Elements Mouse Interaction ───
    if (window.innerWidth > 768) {
        const floatingContainer = document.getElementById('floatingElements');

        document.addEventListener('mousemove', (e) => {
            const moveX = (e.clientX / window.innerWidth - 0.5) * 20;
            const moveY = (e.clientY / window.innerHeight - 0.5) * 20;

            if (floatingContainer) {
                const circles = floatingContainer.querySelectorAll('.floating-circle');
                circles.forEach((circle, i) => {
                    const factor = (i + 1) * 0.3;
                    circle.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
                });
            }
        });
    }

    // ─── Ambient Glow Movement ───
    const heroGlow = document.querySelector('.hero-radial-glow');

    if (heroGlow && window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            heroGlow.style.left = `${x}%`;
            heroGlow.style.top = `${y}%`;
        });
    }

    // ─── Image Lazy Load Enhancement ───
    const imagesToPreload = document.querySelectorAll('img[loading="lazy"]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
                imageObserver.unobserve(entry.target);
            }
        });
    }, { rootMargin: '200px' });

    imagesToPreload.forEach(img => imageObserver.observe(img));

    // ─── Dynamic Section Background Shift ───
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionTexture = section.querySelector('.section-texture');
            if (sectionTexture && rect.top < window.innerHeight && rect.bottom > 0) {
                const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                sectionTexture.style.transform = `translateY(${(progress - 0.5) * 30}px)`;
            }
        });
    });

});