/* ============================================================
   GEOMETRIC HAIR STUDIO — SCRIPT.JS
   Vanilla JS only. No dependencies.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 0. UTILITIES ---------- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- 1. PRELOADER ---------- */
  (function initPreloader() {
    const preloader = $('#preloader');
    if (!preloader) return;

    const hide = () => preloader.classList.add('is-hidden');

    if (document.readyState === 'complete') {
      setTimeout(hide, 300);
    } else {
      window.addEventListener('load', () => setTimeout(hide, 300));
      // Safety fallback in case 'load' never fires (slow third-party assets)
      setTimeout(hide, 3500);
    }
  })();

  /* ---------- 2. NAVBAR: scrolled background + scrollspy ---------- */
  (function initNavbar() {
    const navbar = $('#navbar');
    const navLinks = $$('.nav-link');
    const sections = $$('main section[id]');
    if (!navbar) return;

    const onScroll = () => {
      navbar.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (!sections.length || !navLinks.length) return;

    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach((section) => spy.observe(section));
  })();

  /* ---------- 3. MOBILE MENU ---------- */
  (function initMobileMenu() {
    const hamburger = $('#hamburger');
    const mobileMenu = $('#mobileMenu');
    if (!hamburger || !mobileMenu) return;

    const closeMenu = () => {
      hamburger.classList.remove('is-active');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('is-open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('menu-open');
    };

    const openMenu = () => {
      hamburger.classList.add('is-active');
      hamburger.setAttribute('aria-expanded', 'true');
      mobileMenu.classList.add('is-open');
      mobileMenu.setAttribute('aria-hidden', 'false');
      document.body.classList.add('menu-open');
    };

    hamburger.addEventListener('click', () => {
      hamburger.classList.contains('is-active') ? closeMenu() : openMenu();
    });

    $$('.mobile-link', mobileMenu).forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    document.addEventListener('click', (e) => {
      if (mobileMenu.classList.contains('is-open') &&
          !mobileMenu.contains(e.target) &&
          !hamburger.contains(e.target)) {
        closeMenu();
      }
    });
  })();

  /* ---------- 4. SCROLL REVEAL (fade-up / slide-up) ---------- */
  (function initReveal() {
    const items = $$('[data-reveal]');
    if (!items.length) return;

    if (prefersReducedMotion) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    items.forEach((el) => {
      const delay = el.getAttribute('data-delay');
      if (delay !== null) el.style.setProperty('--delay', delay);
    });

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    items.forEach((el) => observer.observe(el));
  })();

  

  /* ---------- 6. BUTTON RIPPLE ---------- */
  (function initRipple() {
    $$('.btn-ripple').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        btn.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
      });
    });
  })();

  /* ---------- 7. GOLD BUTTON SHIMMER (periodic) ---------- */
  (function initShimmer() {
    if (prefersReducedMotion) return;
    const goldButtons = $$('.btn--gold');
    if (!goldButtons.length) return;

    const sweep = () => {
      goldButtons.forEach((btn) => {
        btn.classList.add('shimmer');
        setTimeout(() => btn.classList.remove('shimmer'), 2700);
      });
    };
    setTimeout(sweep, 1200);
    setInterval(sweep, 4800);
  })();

  /* ---------- 8. HERO PARALLAX ---------- */
  (function initParallax() {
    const heroBg = $('.hero__bg');
    const hero = $('.hero');
    if (!heroBg || !hero || prefersReducedMotion) return;

    let ticking = false;
    const update = () => {
      const rect = hero.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const offset = Math.round(window.scrollY * 0.22);
        heroBg.style.backgroundPosition = `center ${offset}px`;
      }
      ticking = false;
    };

    document.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  })();

  /* ---------- 9. GALLERY FILTER ---------- */
  (function initGalleryFilter() {
    const filterBtns = $$('.filter-btn');
    const items = $$('.gallery-item');
    if (!filterBtns.length || !items.length) return;

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');

        filterBtns.forEach((b) => {
          b.classList.toggle('is-active', b === btn);
          b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
        });

        items.forEach((item) => {
          const match = filter === 'all' || item.getAttribute('data-category') === filter;
          item.classList.toggle('is-hidden', !match);
        });
      });
    });
  })();

  /* ---------- 10. "VIEW MORE" — sends people to Instagram for the full portfolio ---------- */
  (function initViewMore() {
    const viewMoreBtn = $('#viewMoreBtn');
    if (!viewMoreBtn) return;
    viewMoreBtn.addEventListener('click', () => {
      const instagram = $('.social-icon[aria-label="Instagram"]');
      const url = instagram ? instagram.getAttribute('href') : '#';
      if (url && url !== '#') {
        window.open(url, '_blank', 'noopener');
      } else {
        // Fallback: guide the visitor to the contact section if no real link is set yet
        $('#contact')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  })();

  /* ---------- 11. LIGHTBOX ---------- */
  (function initLightbox() {
    const lightbox = $('#lightbox');
    const lightboxImg = $('#lightboxImg');
    const closeBtn = $('#lightboxClose');
    const prevBtn = $('#lightboxPrev');
    const nextBtn = $('#lightboxNext');
    if (!lightbox || !lightboxImg) return;

    let currentIndex = 0;

    const getVisibleItems = () => $$('.gallery-item:not(.is-hidden)');

    const openAt = (index) => {
      const visible = getVisibleItems();
      if (!visible.length) return;
      currentIndex = (index + visible.length) % visible.length;
      const img = visible[currentIndex].querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('menu-open'); // reuse to lock scroll
    };

    const close = () => {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('menu-open');
    };

    $$('.gallery-item').forEach((item) => {
      item.addEventListener('click', () => {
        const visible = getVisibleItems();
        openAt(visible.indexOf(item));
      });
    });

    closeBtn?.addEventListener('click', close);
    prevBtn?.addEventListener('click', () => openAt(currentIndex - 1));
    nextBtn?.addEventListener('click', () => openAt(currentIndex + 1));

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) close();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') openAt(currentIndex - 1);
      if (e.key === 'ArrowRight') openAt(currentIndex + 1);
    });
  })();

  /* ---------- 12. BOOKING FORM → WHATSAPP ---------- */
  (function initBookingForm() {
    const form = $('#bookingForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const service = $('#service', form)?.value.trim() || 'Not specified';
      const date = $('#date', form)?.value || 'Not specified';
      const time = $('#time', form)?.value || 'Not specified';
      const name = $('#fullName', form)?.value.trim() || 'Not specified';
      const phone = $('#phone', form)?.value.trim() || 'Not specified';
      const message = $('#message', form)?.value.trim() || 'None';

      if (!$('#service', form).value || !$('#date', form).value || !$('#time', form).value ||
          !$('#fullName', form).value.trim() || !$('#phone', form).value.trim()) {
        form.reportValidity();
        return;
      }

      const text =
`Hello Geometric Hair Studio,

I would like to book an appointment.

Service: ${service}
Date: ${date}
Time: ${time}
Name: ${name}
Phone: ${phone}
Additional Message: ${message}

Please confirm my booking.`;

      const whatsappUrl = `https://wa.me/254702715038?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank', 'noopener');
    });
  })();

  /* ---------- 13. BACK TO TOP ---------- */
  (function initBackToTop() {
    const btn = $('#backToTop');
    if (!btn) return;

    document.addEventListener('scroll', () => {
      btn.classList.toggle('is-visible', window.scrollY > 480);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  })();

  /* ---------- 14. FOOTER YEAR ---------- */
  (function initFooterYear() {
    const yearEl = $('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  })();

});

