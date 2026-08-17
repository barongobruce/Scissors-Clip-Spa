/* ============================================================
   THE SCISSORS CLIP & SPA — SCRIPT.JS (Vanilla JavaScript)
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* UTILITIES */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

  /* 1. PRELOADER */
  (() => {
    const preloader = $('#preloader');
    if (!preloader) return;
    const hidePreloader = () => preloader.classList.add('is-hidden');
    if (document.readyState === 'complete') {
      setTimeout(hidePreloader, 300);
    } else {
      window.addEventListener('load', () => setTimeout(hidePreloader, 300), { once: true });
      /* Safety fallback */
      setTimeout(hidePreloader, 3500);
    }
  })();

  /* 2. NAVBAR SCROLL EFFECT */
  (() => {
    const navbar = $('#navbar');
    if (!navbar) return;
    const updateNavbar = () => navbar.classList.toggle('is-scrolled', window.scrollY > 40);
    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();
  })();

  /* 3. NAVBAR SCROLL SPY */
  (() => {
    const navLinks = $$('.nav-link');
    const sections = $$('main section[id]');
    if (!navLinks.length || !sections.length) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(section => observer.observe(section));
  })();

  /* 4. MOBILE MENU */
  (() => {
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
      if (hamburger.classList.contains('is-active')) closeMenu();
      else openMenu();
    });

    $$('.mobile-link').forEach(link => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });

    document.addEventListener('click', event => {
      if (!mobileMenu.classList.contains('is-open')) return;
      if (mobileMenu.contains(event.target) || hamburger.contains(event.target)) return;
      closeMenu();
    });
  })();

  /* 5. SCROLL REVEAL */
  (() => {
    const elements = $$('[data-reveal]');
    if (!elements.length) return;
    if (prefersReducedMotion) {
      elements.forEach(element => element.classList.add('is-visible'));
      return;
    }
    elements.forEach(element => {
      const delay = element.getAttribute('data-delay');
      if (delay !== null) element.style.setProperty('--delay', delay);
    });
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    elements.forEach(element => observer.observe(element));
  })();

  /* 6. BUTTON RIPPLE */
  (() => {
    $$('.btn-ripple').forEach(button => {
      button.addEventListener('click', event => {
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
        button.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
      });
    });
  })();

  /* 7. GOLD BUTTON SHIMMER */
  (() => {
    if (prefersReducedMotion) return;
    const buttons = $$('.btn--gold');
    if (!buttons.length) return;
    const sweep = () => {
      buttons.forEach(button => {
        button.classList.add('shimmer');
        setTimeout(() => button.classList.remove('shimmer'), 2700);
      });
    };
    setTimeout(sweep, 1200);
    setInterval(sweep, 4800);
  })();

  /* 8. BOOKING FORM → WHATSAPP */
  (() => {
    const form = $('#bookingForm');
    if (!form) return;
    form.addEventListener('submit', event => {
      event.preventDefault();
      const service = $('#service', form);
      const date = $('#date', form);
      const time = $('#time', form);
      const name = $('#fullName', form);
      const phone = $('#phone', form);
      const message = $('#message', form);
      if (!service || !date || !time || !name || !phone || !message) return;
      if (!service.value || !date.value || !time.value || !name.value.trim() || !phone.value.trim()) {
        form.reportValidity();
        return;
      }
      const text =
`Hello The Scissors Clip & Spa,
I would like to book an appointment.
SERVICE: ${service.value}
DATE: ${date.value}
TIME: ${time.value}
NAME: ${name.value.trim()}
PHONE: ${phone.value.trim()}
ADDITIONAL MESSAGE: ${message.value.trim() || 'None'}
Please confirm my booking.`;
      const whatsappNumber = '254702715038';
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank', 'noopener');
    });
  })();

  /* 9. SERVICE CARD INTERACTION */
  (() => {
    const cards = $$('.service-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const title = $('.service-card__title', card);
        const serviceSelect = $('#service');
        if (!title || !serviceSelect) return;
        const serviceName = title.textContent.trim();
        const matchingOption = Array.from(serviceSelect.options).find(option =>
          option.value.toLowerCase().startsWith(serviceName.toLowerCase())
        );
        if (matchingOption) serviceSelect.value = matchingOption.value;
        const booking = $('#book');
        if (booking) {
          booking.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        }
      });
    });
  })();

  /* 10. BACK TO TOP */
  (() => {
    const button = $('#backToTop');
    if (!button) return;
    const update = () => button.classList.toggle('is-visible', window.scrollY > 480);
    window.addEventListener('scroll', update, { passive: true });
    update();
    button.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  })();

  /* 11. FOOTER YEAR */
  (() => {
    const year = $('#year');
    if (year) year.textContent = new Date().getFullYear();
  })();

});