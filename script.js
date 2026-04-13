/* ============================================================
   MANYA R M – PORTFOLIO  |  script.js
   Features: Bubble Cursor · Typewriter · Scroll Reveal
             Navbar · Particles · Contact Form · Back-to-top
   ============================================================ */

'use strict';

/* ═══════════════════════════════════════
   1. CUSTOM BUBBLE CURSOR
═══════════════════════════════════════ */
(function initCursor() {
  const dot     = document.getElementById('cursor-dot');
  const outline = document.getElementById('cursor-outline');

  if (!dot || !outline) return;

  let mouseX = 0, mouseY = 0;
  let outX   = 0, outY   = 0;
  let rafId  = null;
  let bubbleCount = 0;

  // Smooth trailing outline
  function animateOutline() {
    outX += (mouseX - outX) * 0.14;
    outY += (mouseY - outY) * 0.14;
    outline.style.left = outX + 'px';
    outline.style.top  = outY + 'px';
    rafId = requestAnimationFrame(animateOutline);
  }

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = e.clientX + 'px';
    dot.style.top  = e.clientY + 'px';

    spawnBubble(e.clientX, e.clientY);
  });

  animateOutline();

  // Hover state on interactive elements
  const interactivos = 'a, button, input, textarea, .skill-pill, .project-card, .stat-card, [data-hover]';
  document.addEventListener('mouseover', function (e) {
    if (e.target.closest(interactivos)) {
      dot.classList.add('hovering');
      outline.classList.add('hovering');
    }
  });
  document.addEventListener('mouseout', function (e) {
    if (e.target.closest(interactivos)) {
      dot.classList.remove('hovering');
      outline.classList.remove('hovering');
    }
  });

  // Click ripple
  document.addEventListener('click', function (e) {
    const ripple = document.createElement('div');
    ripple.classList.add('cursor-bubble');
    const size = 40 + Math.random() * 20;
    ripple.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${e.clientX}px; top: ${e.clientY}px;
      border: 2px solid rgba(0, 200, 255, 0.6);
      background: transparent;
    `;
    document.body.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });

  // Trailing micro-bubbles on move
  let lastBubble = 0;
  function spawnBubble(x, y) {
    const now = Date.now();
    if (now - lastBubble < 80) return;
    lastBubble = now;

    const bubble = document.createElement('div');
    bubble.classList.add('cursor-bubble');
    const size = 6 + Math.random() * 10;
    const hue  = 180 + Math.random() * 40; // cyan range
    bubble.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${x}px; top: ${y}px;
      background: hsla(${hue}, 100%, 60%, 0.5);
      animation-duration: ${0.6 + Math.random() * 0.4}s;
    `;
    document.body.appendChild(bubble);
    bubble.addEventListener('animationend', () => bubble.remove());
  }

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity    = '0';
    outline.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity    = '1';
    outline.style.opacity = '1';
  });
})();


/* ═══════════════════════════════════════
   2. STICKY NAVBAR
═══════════════════════════════════════ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const allNavLinks = document.querySelectorAll('.nav-link');

  if (!navbar) return;

  // Scroll state
  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
  }, { passive: true });

  // Hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.classList.toggle('menu-open', isOpen);
    });

    // Close on link click
    allNavLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      }
    });
  }

  // Active section highlighting
  const sections = document.querySelectorAll('section[id]');
  function updateActiveLink() {
    const scrollY = window.scrollY + 100;
    sections.forEach(function (section) {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      const link   = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          allNavLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }
  updateActiveLink();
})();


/* ═══════════════════════════════════════
   3. TYPEWRITER EFFECT
═══════════════════════════════════════ */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'Turning ideas into real-world tech solutions',
    'AI/ML Enthusiast & Developer',
    'Team Lead & Hackathon Participant',
    'Information Science Student @ VVCE',
    'Building Smart City Solutions',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let pause     = false;

  function tick() {
    const current = phrases[phraseIdx];

    if (!deleting) {
      // Typing
      charIdx++;
      el.textContent = current.substring(0, charIdx);
      if (charIdx === current.length) {
        // Pause at end
        pause = true;
        setTimeout(() => { pause = false; deleting = true; tick(); }, 2200);
        return;
      }
    } else {
      // Deleting
      charIdx--;
      el.textContent = current.substring(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(tick, 400);
        return;
      }
    }

    const speed = deleting ? 35 : 65;
    setTimeout(tick, speed);
  }

  setTimeout(tick, 800);
})();


/* ═══════════════════════════════════════
   4. HERO PARTICLES
═══════════════════════════════════════ */
(function initParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;

  const COUNT = 28;

  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');

    const size     = 1 + Math.random() * 2;
    const left     = Math.random() * 100;
    const duration = 8 + Math.random() * 14;
    const delay    = Math.random() * 12;
    const hue      = 175 + Math.random() * 35;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      background: hsl(${hue}, 100%, 60%);
      box-shadow: 0 0 ${size * 3}px hsl(${hue}, 100%, 60%);
    `;
    container.appendChild(p);
  }
})();


/* ═══════════════════════════════════════
   5. SCROLL REVEAL ANIMATIONS
═══════════════════════════════════════ */
(function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px',
  });

  reveals.forEach(el => observer.observe(el));
})();


/* ═══════════════════════════════════════
   6. BACK TO TOP BUTTON
═══════════════════════════════════════ */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', function () {
    btn.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ═══════════════════════════════════════
   7. CONTACT FORM  — powered by EmailJS
   ─────────────────────────────────────
   SETUP (one-time, ~3 minutes):
   1. Go to https://www.emailjs.com and create a FREE account
   2. Dashboard → Email Services → Add Service → Gmail
      • Connect your Gmail (manyarm774@gmail.com)
      • Copy the Service ID  → paste below as EMAILJS_SERVICE_ID
   3. Dashboard → Email Templates → Create Template
      Use these exact variable names in the template body:
        From:    {{from_name}} <{{from_email}}>
        Subject: {{subject}}
        Message: {{message}}
      • Copy the Template ID → paste below as EMAILJS_TEMPLATE_ID
   4. Dashboard → Account → Public Key
      • Copy your Public Key → paste below as EMAILJS_PUBLIC_KEY
   ─────────────────────────────────────
   Replace the three placeholder strings below with your real IDs.
═══════════════════════════════════════ */
(function initContactForm() {

  /* ── YOUR EMAILJS CREDENTIALS ── */
  const EMAILJS_PUBLIC_KEY   = 'YOUR_PUBLIC_KEY';    // e.g. 'abc123XYZ'
  const EMAILJS_SERVICE_ID   = 'YOUR_SERVICE_ID';    // e.g. 'service_xxxxxx'
  const EMAILJS_TEMPLATE_ID  = 'YOUR_TEMPLATE_ID';   // e.g. 'template_xxxxxx'
  /* ─────────────────────────────── */

  // Initialise EmailJS with your public key
  if (window.emailjs) {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  const form         = document.getElementById('contact-form');
  if (!form) return;

  const nameInput    = document.getElementById('form-name');
  const emailInput   = document.getElementById('form-email');
  const subjectInput = document.getElementById('form-subject');
  const msgInput     = document.getElementById('form-message');
  const submitBtn    = document.getElementById('form-submit');
  const btnText      = document.getElementById('btn-text');
  const btnIcon      = document.getElementById('btn-icon');
  const successMsg   = document.getElementById('form-success');

  const SPINNER_SVG = `<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"
    fill="none" stroke-dasharray="31.4" stroke-dashoffset="10">
    <animateTransform attributeName="transform" type="rotate"
      from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/>
    </circle>`;
  const SEND_SVG = `<line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>`;

  const fields = [
    { el: nameInput,    err: 'err-name',    validate: v => v.trim().length >= 2 },
    { el: emailInput,   err: 'err-email',   validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
    { el: subjectInput, err: 'err-subject', validate: v => v.trim().length >= 3 },
    { el: msgInput,     err: 'err-message', validate: v => v.trim().length >= 10 },
  ];

  /* — Real-time validation — */
  fields.forEach(function ({ el, err, validate }) {
    if (!el) return;
    el.addEventListener('input', function () {
      const errEl = document.getElementById(err);
      if (validate(el.value)) {
        el.classList.remove('error');
        if (errEl) errEl.classList.remove('show');
      }
    });
    el.addEventListener('blur', function () {
      const errEl = document.getElementById(err);
      if (!validate(el.value)) {
        el.classList.add('error');
        if (errEl) errEl.classList.add('show');
      }
    });
  });

  function validateAll() {
    let valid = true;
    fields.forEach(function ({ el, err, validate }) {
      if (!el) return;
      const errEl = document.getElementById(err);
      if (!validate(el.value)) {
        el.classList.add('error');
        if (errEl) errEl.classList.add('show');
        valid = false;
      }
    });
    return valid;
  }

  function setLoading(on) {
    submitBtn.disabled = on;
    if (btnText) btnText.textContent = on ? 'Sending…' : 'Send Message';
    if (btnIcon) btnIcon.innerHTML   = on ? SPINNER_SVG : SEND_SVG;
  }

  function showSuccess() {
    if (successMsg) {
      successMsg.classList.add('show');
      setTimeout(() => successMsg.classList.remove('show'), 5000);
    }
  }

  function showError(msg) {
    // Reuse the success bar but styled differently
    const bar = document.createElement('div');
    bar.style.cssText = `
      display:flex; align-items:center; gap:.6rem; margin-top:1rem;
      padding:1rem; border-radius:10px; font-size:.88rem; font-weight:500;
      background:rgba(255,77,109,0.08); border:1px solid rgba(255,77,109,0.35);
      color:#ff4d6d; animation: fade-in .4s ease;
    `;
    bar.textContent = '⚠️  ' + msg;
    form.appendChild(bar);
    setTimeout(() => bar.remove(), 6000);
  }

  /* — Form submit — */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateAll()) return;

    // Guard: warn if credentials not set yet
    if (
      EMAILJS_PUBLIC_KEY  === 'YOUR_PUBLIC_KEY'  ||
      EMAILJS_SERVICE_ID  === 'YOUR_SERVICE_ID'  ||
      EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID'
    ) {
      showError('EmailJS is not configured yet. Please follow the setup steps in script.js.');
      return;
    }

    if (!window.emailjs) {
      showError('EmailJS failed to load. Check your internet connection and try again.');
      return;
    }

    setLoading(true);

    // Build the template parameters — these match the template variable names
    const templateParams = {
      from_name:  nameInput.value.trim(),
      from_email: emailInput.value.trim(),
      subject:    subjectInput.value.trim(),
      message:    msgInput.value.trim(),
      to_email:   'manyarm774@gmail.com',
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then(function () {
        setLoading(false);
        showSuccess();
        form.reset();
        fields.forEach(({ el }) => { if (el) el.classList.remove('error'); });
      })
      .catch(function (err) {
        setLoading(false);
        console.error('EmailJS error:', err);
        showError('Failed to send message. Please try emailing directly at manyarm774@gmail.com');
      });
  });
})();


/* ═══════════════════════════════════════
   8. SMOOTH SCROLL FOR ANCHOR LINKS
═══════════════════════════════════════ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = 70;
        const top  = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();


/* ═══════════════════════════════════════
   9. STAT COUNTER ANIMATION
═══════════════════════════════════════ */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const seen = new WeakSet();

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !seen.has(entry.target)) {
        seen.add(entry.target);
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));

  function animateCounter(el) {
    const rawText = el.textContent.trim();
    const numMatch = rawText.match(/[\d.]+/);
    if (!numMatch) return;

    const target   = parseFloat(numMatch[0]);
    const suffix   = rawText.replace(numMatch[0], '');
    const isFloat  = rawText.includes('.');
    const duration = 1500;
    const start    = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3);
      const current  = target * ease;
      el.textContent = (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }
})();


/* ═══════════════════════════════════════
   10. SKILL PILL HOVER GLOW
═══════════════════════════════════════ */
(function initSkillPills() {
  document.querySelectorAll('.skill-pill').forEach(function (pill) {
    pill.addEventListener('mouseenter', function () {
      this.style.boxShadow = '0 0 14px rgba(0, 200, 255, 0.35)';
    });
    pill.addEventListener('mouseleave', function () {
      this.style.boxShadow = '';
    });
  });
})();


/* ═══════════════════════════════════════
   11. PROFILE IMAGE FALLBACK
═══════════════════════════════════════ */
(function initProfileFallback() {
  const img = document.getElementById('profile-img');
  if (!img) return;

  img.addEventListener('error', function () {
    // Create SVG avatar fallback
    const wrapper = this.parentElement;
    this.remove();

    const fallback = document.createElement('div');
    fallback.style.cssText = `
      width: 100%; height: 100%;
      background: linear-gradient(135deg, #0d1520 0%, #0a1928 100%);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Poppins', sans-serif;
      font-size: 5rem; font-weight: 900;
      color: #00c8ff;
      text-shadow: 0 0 30px rgba(0,200,255,0.5);
      user-select: none;
    `;

    const initials = document.createElement('span');
    initials.textContent = 'M';
    fallback.appendChild(initials);
    wrapper.appendChild(fallback);
  });
})();


/* ═══════════════════════════════════════
   12. HERO SCROLL INDICATOR HIDE
═══════════════════════════════════════ */
(function initScrollIndicator() {
  const indicator = document.getElementById('scroll-indicator');
  if (!indicator) return;

  window.addEventListener('scroll', function () {
    indicator.style.opacity = window.scrollY > 100 ? '0' : '1';
    indicator.style.transform = window.scrollY > 100
      ? 'translateX(-50%) translateY(10px)'
      : 'translateX(-50%) translateY(0)';
    indicator.style.transition = 'opacity 0.4s, transform 0.4s';
  }, { passive: true });
})();


/* ═══════════════════════════════════════
   13. CURSOR HIDE ON TOUCH DEVICES
═══════════════════════════════════════ */
(function initTouchCheck() {
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    const dot     = document.getElementById('cursor-dot');
    const outline = document.getElementById('cursor-outline');
    if (dot)     dot.style.display     = 'none';
    if (outline) outline.style.display = 'none';
    document.body.style.cursor = 'auto';
  }
})();


/* ═══════════════════════════════════════
   14. CARD TILT EFFECT (Projects)
═══════════════════════════════════════ */
(function initTilt() {
  const cards = document.querySelectorAll('.project-card-inner, .education-card');

  cards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const rotY   = dx * 5;
      const rotX   = -dy * 5;
      card.style.transform = `translateY(-6px) perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
})();


/* ═══════════════════════════════════════
   15. RESUME DOWNLOAD TOAST
═══════════════════════════════════════ */
(function initResumeToast() {
  const resumeBtns = document.querySelectorAll('[download]');
  resumeBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      showToast('⬇️  Resume download starting…');
    });
  });

  function showToast(msg) {
    const existing = document.getElementById('toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.style.cssText = `
      position: fixed;
      bottom: 5rem; left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: rgba(13, 21, 32, 0.95);
      border: 1px solid rgba(0,200,255,0.4);
      color: #00c8ff;
      padding: 0.75rem 1.5rem;
      border-radius: 999px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      z-index: 9000;
      box-shadow: 0 0 20px rgba(0,200,255,0.25);
      opacity: 0;
      transition: all 0.35s ease;
      white-space: nowrap;
    `;
    toast.textContent = msg;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(() => toast.remove(), 350);
    }, 3000);
  }
})();
