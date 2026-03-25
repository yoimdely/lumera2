/* ULTRA PREMIUM JS WITH GSAP & LENIS */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Initialize Lenis (Smooth Scrolling)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        smoothTouch: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Integrate GSAP with Lenis
    gsap.registerPlugin(ScrollTrigger);
    
    // 2. Custom Cursor
    const cursor = document.querySelector('.js-cursor');
    const cursorFollower = document.querySelector('.js-cursor-follower');
    
    if (cursor && cursorFollower) {
        let mouseX = 0, mouseY = 0;
        let cX = 0, cY = 0;
        
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            // Immediate cursor
            gsap.set(cursor, { x: mouseX - 4, y: mouseY - 4 });
        });

        // Smooth follower
        gsap.ticker.add(() => {
            cX += (mouseX - cX) * 0.15;
            cY += (mouseY - cY) * 0.15;
            gsap.set(cursorFollower, { x: cX - 20, y: cY - 20 });
        });

        // Hover states for links and buttons
        const interactables = document.querySelectorAll('a, button, .limitations__trigger, .magnetic');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('is-hovering'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('is-hovering'));
        });
    }

    // 3. Magnetic Hover Effect
    const magneticElements = document.querySelectorAll('.magnetic');
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const strength = el.dataset.strength || 20;
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * strength;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * strength;
            
            gsap.to(el, { x: x, y: y, duration: 0.5, ease: "power2.out" });
        });
        
        el.addEventListener('mouseleave', () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
        });
    });

    // 4. SplitText Animation (using SplitType library)
    const splitElements = document.querySelectorAll('.js-split-text');
    splitElements.forEach(el => {
        const text = new SplitType(el, { types: 'lines, words, chars', tagName: 'span' });
        
        gsap.from(text.chars, {
            scrollTrigger: {
                trigger: el,
                start: "top 90%",
            },
            y: "110%",
            opacity: 0,
            rotationZ: "5deg",
            duration: 0.8,
            stagger: 0.02,
            ease: "power4.out"
        });
    });

    // 5. Fade Up Elements
    const fadeUpElements = document.querySelectorAll('.js-fade-up');
    fadeUpElements.forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // 6. Image Reveals
    const imgReveals = document.querySelectorAll('.js-img-reveal');
    imgReveals.forEach(el => {
        gsap.fromTo(el, 
            { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" },
            { 
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                duration: 1.5,
                ease: "power4.inOut",
                scrollTrigger: {
                    trigger: el,
                    start: "top 80%",
                }
            }
        );
    });

    // 7. Parallax Images
    const parallaxImages = document.querySelectorAll('.js-parallax');
    parallaxImages.forEach(img => {
        const speed = img.dataset.speed || 0.5;
        gsap.to(img, {
            yPercent: 20 * speed,
            ease: "none",
            scrollTrigger: {
                trigger: img.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // 8. Header Hide/Show on Scroll
    let lastScroll = 0;
    const header = document.querySelector('.js-header');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > lastScroll && currentScroll > 100) {
            header.classList.add('is-hidden');
        } else {
            header.classList.remove('is-hidden');
        }
        lastScroll = currentScroll;
    });

    // 9. Limitations Accordion
    const limitTrigger = document.querySelector('.js-limitations-trigger');
    const limitContent = document.querySelector('.limitations__content');
    const limitIcon = limitTrigger?.querySelector('i');
    let limitOpen = false;

    if (limitTrigger) {
        limitTrigger.addEventListener('click', () => {
            if (!limitOpen) {
                gsap.to(limitContent, { height: 'auto', duration: 0.5, ease: 'power2.out' });
                gsap.to(limitIcon, { rotation: 45, duration: 0.3 });
                limitOpen = true;
            } else {
                gsap.to(limitContent, { height: 0, duration: 0.5, ease: 'power2.inOut' });
                gsap.to(limitIcon, { rotation: 0, duration: 0.3 });
                limitOpen = false;
            }
        });
    }

    // 10. Modal Interactivity
    const modal = document.querySelector('.js-modal');
    const openBtns = document.querySelectorAll('.js-open-modal');
    const closeBtns = document.querySelectorAll('.js-close-modal');

    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('is-active');
            lenis.stop(); // stop scrolling
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.remove('is-active');
            lenis.start(); // resume scrolling
        });
    });

    const form = document.querySelector('.js-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Optional success state animation
            const btn = form.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Отправлено <i class="ri-check-line"></i>';
            btn.style.background = '#4CAF50';
            btn.style.color = 'white';
            
            setTimeout(() => {
                modal.classList.remove('is-active');
                lenis.start();
                form.reset();
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style = '';
                }, 500);
            }, 2000);
        });
    }
});
