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

    // 1.5 Preloader Integration
    const preloader = document.querySelector('.js-preloader');
    if (preloader) {
        // Prevent scroll
        lenis.stop();
        window.scrollTo(0, 0);

        // We wrap preloader characters if we want to stagger them, else just simple opacity. We'll use SplitType.
        const preloaderText = new SplitType('.js-preloader-text', { types: 'chars' });
        
        // Hide chars initially manually so they don't flash
        gsap.set(preloaderText.chars, { y: "110%", opacity: 0, rotationZ: "5deg" });

        const tl = gsap.timeline({
            onComplete: () => {
                preloader.style.pointerEvents = 'none';
                lenis.start(); // Enable scroll
                ScrollTrigger.refresh(); // Now initialize scroll animations
            }
        });

        tl.to(preloaderText.chars, {
            y: "0%",
            opacity: 1,
            rotationZ: "0deg",
            duration: 1,
            stagger: 0.05,
            ease: "power4.out",
            delay: 0.2
        })
        .to('.preloader__progress-wrap', {
            opacity: 1,
            duration: 0.5
        }, "-=0.5")
        .to('.js-preloader-progress', {
            width: "100%",
            duration: 1.2,
            ease: "power2.inOut"
        })
        .to(preloader, {
            yPercent: -100,
            duration: 1.2,
            ease: "power4.inOut"
        }, "+=0.2");
        
        // By adding delay to our standard `.js-fade-up` and `.js-split-text`, they trigger naturally on scroll once preloader lifts.
    }
    
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

    // 7. Parallax Images - Disabled as per user request (images should not slide)

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
    const appsScriptUrl = 'https://script.google.com/macros/s/AKfycbzhDZygLClx4IkvdlJhdQJU9X2fQbC-hcDKVORmM_wtnxivERu9N_Th6MN9j08dbcru/exec';
    const modal = document.querySelector('.js-modal');
    const timedPopup = document.querySelector('.js-timed-popup');
    const openBtns = document.querySelectorAll('.js-open-modal');
    const closeBtns = document.querySelectorAll('.js-close-modal');
    const closePopupBtns = document.querySelectorAll('.js-close-popup');
    const forms = document.querySelectorAll('.js-form');

    const openModal = (modalElement) => {
        if (!modalElement) {
            return;
        }

        modalElement.classList.add('is-active');
        lenis.stop();
    };

    const closeModal = (modalElement) => {
        if (!modalElement) {
            return;
        }

        modalElement.classList.remove('is-active');
        lenis.start();
    };

    const fillFormMeta = (form, triggerLabel = '') => {
        const pageUrlInput = form.querySelector('[name="page_url"]');
        const pageTitleInput = form.querySelector('[name="page_title"]');
        const submittedAtInput = form.querySelector('[name="submitted_at"]');
        const ctaLabelInput = form.querySelector('[name="cta_label"]');
        const formNameInput = form.querySelector('[name="form_name"]');

        form.action = appsScriptUrl;

        if (pageUrlInput) {
            pageUrlInput.value = window.location.href;
        }

        if (pageTitleInput) {
            pageTitleInput.value = document.title;
        }

        if (submittedAtInput) {
            submittedAtInput.value = new Date().toISOString();
        }

        if (ctaLabelInput && triggerLabel) {
            ctaLabelInput.value = triggerLabel;
        }

        if (formNameInput && !formNameInput.value) {
            formNameInput.value = form.dataset.formName || 'Заявка с сайта';
        }
    };

    const setFormStatus = (form, type, message) => {
        const status = form.querySelector('.js-form-status');

        if (!status) {
            return;
        }

        status.textContent = message;
        status.classList.remove('is-error', 'is-success');

        if (type === 'error') {
            status.classList.add('is-error');
        }

        if (type === 'success') {
            status.classList.add('is-success');
        }
    };

    const setSubmitState = (form, state) => {
        const btn = form.querySelector('.js-form-submit');
        const label = btn?.querySelector('span');

        if (!btn || !label) {
            return;
        }

        if (!btn.dataset.defaultText) {
            btn.dataset.defaultText = label.textContent.trim();
        }

        btn.disabled = state === 'loading';
        btn.classList.toggle('is-loading', state === 'loading');

        if (state === 'loading') {
            label.textContent = 'Отправляем...';
            return;
        }

        if (state === 'success') {
            label.textContent = 'Отправлено';
            return;
        }

        label.textContent = btn.dataset.defaultText;
    };

    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            const triggerLabel = btn.dataset.leadSource || btn.textContent.replace(/\s+/g, ' ').trim();

            modal?.querySelectorAll('.js-form').forEach(form => fillFormMeta(form, triggerLabel));
            openModal(modal);
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => closeModal(modal));
    });

    // 11. Timed Popup
    if (timedPopup) {
        setTimeout(() => {
            const isPrimaryModalOpen = modal?.classList.contains('is-active');

            if (!isPrimaryModalOpen && !timedPopup.classList.contains('is-shown-once')) {
                timedPopup.classList.add('is-shown-once');
                timedPopup.querySelectorAll('.js-form').forEach(form => fillFormMeta(form));
                openModal(timedPopup);
            }
        }, 15000);

        closePopupBtns.forEach(btn => {
            btn.addEventListener('click', () => closeModal(timedPopup));
        });
    }

    forms.forEach(form => {
        fillFormMeta(form);
        setSubmitState(form, 'idle');
        setFormStatus(form, 'idle', '');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!form.reportValidity() || form.dataset.submitting === 'true') {
                return;
            }

            form.dataset.submitting = 'true';
            fillFormMeta(form);
            setSubmitState(form, 'loading');
            setFormStatus(form, 'idle', 'Отправляем заявку...');

            const payload = new URLSearchParams();
            const formData = new FormData(form);

            formData.forEach((value, key) => {
                payload.append(key, String(value));
            });

            try {
                await fetch(form.action || appsScriptUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: payload
                });

                setSubmitState(form, 'success');
                setFormStatus(form, 'success', 'Заявка отправлена. Мы свяжемся с вами в ближайшее время.');

                window.setTimeout(() => {
                    form.reset();
                    fillFormMeta(form);
                    setSubmitState(form, 'idle');
                    setFormStatus(form, 'idle', '');
                    closeModal(form.closest('.modal'));
                }, 2200);
            } catch (error) {
                setSubmitState(form, 'idle');
                setFormStatus(form, 'error', 'Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.');
            } finally {
                form.dataset.submitting = 'false';
            }
        });
    });
});
