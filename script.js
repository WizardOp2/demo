/* ===========================================
   ZED'S CAFÉ — Frontend Scripts
   =========================================== */

(function () {
    'use strict';

    // ---- PRELOADER ----
    window.addEventListener('load', function () {
        setTimeout(function () {
            document.getElementById('preloader').classList.add('done');
        }, 1800);
    });

    // ---- NAVBAR SCROLL ----
    const navbar = document.getElementById('navbar');
    const btt = document.getElementById('btt');

    function onScroll() {
        const y = window.scrollY;
        navbar.classList.toggle('scrolled', y > 60);
        btt.classList.toggle('show', y > 500);
        updateActiveNav();
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    // ---- ACTIVE NAV ----
    const navAnchors = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollY = window.scrollY + 200;
        sections.forEach(function (sec) {
            const top = sec.offsetTop;
            const h = sec.offsetHeight;
            const id = sec.id;
            if (scrollY >= top && scrollY < top + h) {
                navAnchors.forEach(function (a) {
                    a.classList.toggle('active', a.getAttribute('href') === '#' + id);
                });
            }
        });
    }

    // ---- MOBILE MENU ----
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const overlay = document.getElementById('mobileOverlay');

    function closeMenu() {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
    }
    function openMenu() {
        hamburger.classList.add('open');
        navLinks.classList.add('open');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    hamburger.addEventListener('click', function () {
        if (navLinks.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    overlay.addEventListener('click', closeMenu);

    navAnchors.forEach(function (a) {
        a.addEventListener('click', closeMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeMenu();
    });

    // ---- HERO SLIDER ----
    const heroSlides = document.querySelectorAll('.hero-slide');
    let heroIndex = 0;

    function nextSlide() {
        heroSlides[heroIndex].classList.remove('active');
        heroIndex = (heroIndex + 1) % heroSlides.length;
        heroSlides[heroIndex].classList.add('active');
    }
    setInterval(nextSlide, 6000);

    // ---- HERO PARALLAX ----
    var heroContent = document.querySelector('.hero-content');
    var ticking = false;

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                var y = window.scrollY;
                if (y < window.innerHeight && heroContent) {
                    heroContent.style.transform = 'translateY(' + (y * 0.25) + 'px)';
                    heroContent.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 0.7));
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // ---- SCROLL REVEAL ----
    var reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    function checkReveal() {
        var wh = window.innerHeight;
        reveals.forEach(function (el) {
            var top = el.getBoundingClientRect().top;
            if (top < wh - 80) {
                el.classList.add('revealed');
            }
        });
    }
    window.addEventListener('scroll', checkReveal, { passive: true });
    window.addEventListener('load', checkReveal);
    // Also trigger after preloader hides
    setTimeout(checkReveal, 2000);

    // ---- COUNTER ANIMATION ----
    var counters = document.querySelectorAll('[data-count]');
    var counted = new Set();

    function animateCounters() {
        var wh = window.innerHeight;
        counters.forEach(function (el) {
            if (counted.has(el)) return;
            var top = el.getBoundingClientRect().top;
            if (top < wh - 60) {
                counted.add(el);
                var target = parseInt(el.getAttribute('data-count'), 10);
                var start = 0;
                var duration = 2000;
                var steps = 60;
                var increment = target / steps;
                var step = 0;
                var timer = setInterval(function () {
                    step++;
                    start += increment;
                    if (step >= steps) {
                        el.textContent = target.toLocaleString();
                        clearInterval(timer);
                    } else {
                        el.textContent = Math.floor(start).toLocaleString();
                    }
                }, duration / steps);
            }
        });
    }
    window.addEventListener('scroll', animateCounters, { passive: true });
    window.addEventListener('load', animateCounters);
    setTimeout(animateCounters, 2200);

    // ---- MENU FILTER ----
    var filters = document.querySelectorAll('.filter');
    var cards = document.querySelectorAll('.menu-card');

    filters.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filters.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            var cat = btn.getAttribute('data-filter');
            var delay = 0;

            cards.forEach(function (card) {
                var c = card.getAttribute('data-category');
                if (cat === 'all' || c === cat) {
                    card.classList.remove('hide');
                    card.classList.add('show');
                    card.style.animationDelay = delay + 's';
                    delay += 0.08;
                } else {
                    card.classList.add('hide');
                    card.classList.remove('show');
                }
            });
        });
    });

    // ---- REVIEW SLIDER ----
    var track = document.getElementById('reviewTrack');
    var revCards = document.querySelectorAll('.review-card');
    var revPrev = document.getElementById('revPrev');
    var revNext = document.getElementById('revNext');
    var dotsWrap = document.getElementById('revDots');
    var revIndex = 0;
    var autoRevTimer;

    // Create dots
    revCards.forEach(function (_, i) {
        var d = document.createElement('button');
        d.classList.add('rev-dot');
        d.setAttribute('aria-label', 'Go to review ' + (i + 1));
        if (i === 0) d.classList.add('active');
        d.addEventListener('click', function () { goToReview(i); });
        dotsWrap.appendChild(d);
    });

    function goToReview(i) {
        revIndex = i;
        track.style.transform = 'translateX(-' + (i * 100) + '%)';
        var dots = dotsWrap.querySelectorAll('.rev-dot');
        dots.forEach(function (d, idx) {
            d.classList.toggle('active', idx === i);
        });
    }

    revNext.addEventListener('click', function () {
        goToReview((revIndex + 1) % revCards.length);
        resetAutoRev();
    });
    revPrev.addEventListener('click', function () {
        goToReview((revIndex - 1 + revCards.length) % revCards.length);
        resetAutoRev();
    });

    function startAutoRev() {
        autoRevTimer = setInterval(function () {
            goToReview((revIndex + 1) % revCards.length);
        }, 5000);
    }
    function resetAutoRev() {
        clearInterval(autoRevTimer);
        startAutoRev();
    }
    startAutoRev();

    // Touch swipe for reviews
    (function () {
        var startX = 0;
        var diff = 0;

        track.addEventListener('touchstart', function (e) {
            startX = e.touches[0].clientX;
        }, { passive: true });

        track.addEventListener('touchmove', function (e) {
            diff = e.touches[0].clientX - startX;
        }, { passive: true });

        track.addEventListener('touchend', function () {
            if (Math.abs(diff) > 50) {
                if (diff < 0) {
                    goToReview((revIndex + 1) % revCards.length);
                } else {
                    goToReview((revIndex - 1 + revCards.length) % revCards.length);
                }
                resetAutoRev();
            }
            diff = 0;
        });
    })();

    // ---- GALLERY LIGHTBOX ----
    var lightbox = document.getElementById('lightbox');
    var lbImage = document.getElementById('lbImage');
    var lbClose = document.getElementById('lbClose');

    document.querySelectorAll('.gallery-item').forEach(function (item) {
        item.addEventListener('click', function () {
            var src = item.querySelector('img').src;
            lbImage.src = src;
            lightbox.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
    });

    // ---- BACK TO TOP ----
    btt.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ---- TOAST ----
    var toastEl = document.getElementById('toast');
    var toastMsg = document.getElementById('toastMsg');
    var toastTimer;

    function showToast(msg) {
        toastMsg.textContent = msg;
        toastEl.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            toastEl.classList.remove('show');
        }, 2800);
    }

    // ---- NEWSLETTER ----
    var nlBtn = document.getElementById('newsletterBtn');
    var nlInput = document.getElementById('newsletterEmail');

    nlBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var val = nlInput.value.trim();
        if (val && val.indexOf('@') > 0) {
            showToast('Subscribed successfully! ☕');
            nlInput.value = '';
        } else {
            showToast('Please enter a valid email.');
        }
    });

    // ---- SMOOTH ANCHOR SCROLL (iOS fix) ----
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                var offset = navbar.offsetHeight;
                var top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    // ---- CONSOLE ----
    console.log('%c☕ Zed\'s Café', 'color:#c8a97e;font-size:20px;font-weight:bold');
    console.log('%cWhere every cup tells a story.', 'color:#807590;font-size:12px');

})();