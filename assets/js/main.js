// ===== LOADER =====
window.addEventListener('load', () => {
  const loader = document.querySelector('.loader');
  const bar = document.querySelector('.loader-bar');
  const num = document.querySelector('.loader-number');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => loader.classList.add('hidden'), 400);
    }
    bar.style.width = progress + '%';
    num.textContent = Math.floor(progress) + '%';
  }, 80);
});

// ===== NAVIGATION SCROLL EFFECT =====
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  // Swap text → image logo after 80px
  nav.classList.toggle('scrolled', window.scrollY > 80);
});

// ===== SCROLLSPY — NAV ACTIVE STATE =====
const navSectionLinks = document.querySelectorAll('.nav-links a[data-section]');
if (navSectionLinks.length) {
  const sectionIds = [...navSectionLinks].map(a => a.dataset.section);
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navSectionLinks.forEach(a => a.classList.remove('nav-active'));
        const active = document.querySelector(`.nav-links a[data-section="${entry.target.id}"]`);
        if (active) active.classList.add('nav-active');
      }
    });
  }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });

  sections.forEach(s => spyObserver.observe(s));
}

// ===== HAMBURGER MENU =====
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => observer.observe(el));

// ===== STAGGER DELAY ON CARDS =====
document.querySelectorAll('.service-card').forEach((card, i) => {
  card.style.transitionDelay = (i * 0.1) + 's';
});

document.querySelectorAll('.work-card').forEach((card, i) => {
  card.style.transitionDelay = (i * 0.1) + 's';
});

// ===== COUNTER ANIMATION =====
function animateCount(el, target, suffix = '') {
  let current = 0;
  const step = target / 60;
  const update = () => {
    current += step;
    if (current >= target) {
      el.textContent = target + suffix;
    } else {
      el.textContent = Math.floor(current) + suffix;
      requestAnimationFrame(update);
    }
  };
  update();
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-num');
      nums.forEach(num => {
        const val = parseInt(num.dataset.val);
        const suffix = num.dataset.suffix || '';
        animateCount(num, val, suffix);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.hero-stats');
if (statsSection) statsObserver.observe(statsSection);

// ===== SMOOTH SCROLL FOR ANCHORS =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== PORTFOLIO TABS =====
const tabs = document.querySelectorAll('.work-tab');
const allCards = document.querySelectorAll('.work-card[data-category]');
let currentFilter = 'all';

function applyFilter(filter) {
  currentFilter = filter;
  allCards.forEach(card => {
    const isExtra = card.classList.contains('work-extra');
    const matchesFilter = filter === 'all' || card.dataset.category === filter;
    const revealed = card.dataset.revealed === 'true';
    // On a specific category tab show all matching cards; on "all" restrict extras until revealed
    const show = matchesFilter && (filter !== 'all' || !isExtra || revealed);
    card.style.display = show ? '' : 'none';
  });
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    applyFilter(tab.dataset.filter);
  });
});

// ===== SEE MORE WORK =====
const seeMoreBtn = document.getElementById('seeMoreBtn');
if (seeMoreBtn) {
  seeMoreBtn.addEventListener('click', () => {
    const extras = document.querySelectorAll('.work-extra');
    extras.forEach(card => {
      card.dataset.revealed = 'true';
      if (currentFilter === 'all' || card.dataset.category === currentFilter) {
        card.style.display = '';
        // Trigger reveal animation
        setTimeout(() => card.classList.add('visible'), 50);
      }
    });
    seeMoreBtn.style.display = 'none';
  });
}

// ===== PROJECT MODAL =====
const modal = document.getElementById('projectModal');
const modalMainImg = document.getElementById('modalMainImg');
const modalThumbs = document.getElementById('modalThumbs');
const modalTitle = document.getElementById('modalTitle');
const modalTag = document.getElementById('modalTag');
const modalDesc = document.getElementById('modalDesc');

function openModal(card) {
  const images = JSON.parse(card.dataset.images || '[]');
  const title = card.dataset.title || '';
  const tag = card.dataset.tag || '';
  const desc = card.dataset.desc || '';

  modalTitle.textContent = title;
  modalTag.textContent = tag;
  modalDesc.textContent = desc;

  // Set main image
  if (images.length > 0) {
    modalMainImg.src = images[0];
    modalMainImg.alt = title;
  }

  // Build thumbnails
  modalThumbs.innerHTML = '';
  images.forEach((src, i) => {
    const thumb = document.createElement('img');
    thumb.src = src;
    thumb.alt = title + ' ' + (i + 1);
    thumb.className = 'modal-thumb' + (i === 0 ? ' active' : '');
    thumb.addEventListener('click', () => {
      modalMainImg.style.opacity = '0';
      setTimeout(() => {
        modalMainImg.src = src;
        modalMainImg.style.opacity = '1';
      }, 200);
      document.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
    modalThumbs.appendChild(thumb);
  });

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Open on "Explore The Design" button click
document.querySelectorAll('.work-cta').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const card = btn.closest('.work-card');
    if (card) openModal(card);
  });
});

// Close on backdrop or close button
document.querySelector('.modal-backdrop')?.addEventListener('click', closeModal);
document.querySelector('.modal-close')?.addEventListener('click', closeModal);

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// Enquire button closes modal before scrolling to contact
document.querySelector('.modal-enquire')?.addEventListener('click', closeModal);

// ===== CONTACT FORM =====
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Sending...';

    try {
      const data = new FormData(form);
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data
      });
      const json = await res.json();

      if (json.success) {
        btn.innerHTML = '<i class="bx bx-check"></i> Message Sent!';
        btn.style.background = '#1a7f37';
        btn.style.clipPath = 'none';
        form.reset();
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.background = '';
          btn.style.clipPath = '';
          btn.disabled = false;
        }, 4000);
      } else {
        throw new Error(json.message || 'Submission failed');
      }
    } catch (err) {
      btn.innerHTML = '<i class="bx bx-error"></i> Failed — Try Again';
      btn.style.background = '#b00020';
      btn.style.clipPath = 'none';
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.style.clipPath = '';
        btn.disabled = false;
      }, 4000);
    }
  });
}

// ===== CURSOR EFFECT (DESKTOP) =====
if (window.matchMedia('(pointer: fine)').matches) {
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position: fixed; width: 8px; height: 8px; background: #CC0000;
    border-radius: 50%; pointer-events: none; z-index: 99999;
    transition: transform 0.15s ease, opacity 0.3s ease;
    transform: translate(-50%, -50%);
  `;
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  document.querySelectorAll('a, button, .work-card, .service-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(3)';
      cursor.style.opacity = '0.5';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.opacity = '1';
    });
  });
}

// ===== FOOTER YEAR =====
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
