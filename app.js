/**
 * DentX System — Interactive Experience & Physics Engine
 * High-performance clinical animations, CT simulation, live filters, counters, and dialogs.
 */

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initScrollProgress();
  initScrollReveal();
  initAnimatedCounters();
  initHeroTilt();
  initHeroSearchAndNav();
  initInteractiveCTViewer();
  initRoleTabs();
  initGalleryLightbox();
  initLeadForm();
  initContactModal();
  initMagneticButtons();
  initMobileNav();
  initHeaderShadow();
  initCookieConsent();
});

/* ==========================================================================
   0. SMOOTH SCROLL FOR IN-PAGE ANCHORS
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 76;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================================================
   1. SCROLL PROGRESS & HEADER SHADOW
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.pageYOffset / totalHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  }, { passive: true });
}

function initHeaderShadow() {
  const header = document.getElementById('site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 20) {
      header.classList.add('scrolled-header');
    } else {
      header.classList.remove('scrolled-header');
    }
  }, { passive: true });
}

/* ==========================================================================
   2. SCROLL REVEAL (IntersectionObserver — Bidirectional)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      if (entry.isIntersecting) {
        const delay = parseInt(el.getAttribute('data-delay') || '0', 10);
        if (delay > 0) {
          setTimeout(() => {
            if (el.classList.contains('in-viewport')) {
              el.classList.add('is-revealed');
            }
          }, delay);
        } else {
          el.classList.add('is-revealed');
        }
        el.classList.add('in-viewport');
      } else {
        el.classList.remove('is-revealed');
        el.classList.remove('in-viewport');
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   3. ANIMATED NUMBER & CURRENCY COUNTERS (Bidirectional)
   ========================================================================== */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.counter, .counter-currency');
  if (!counters.length) return;

  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const isCurrency = el.classList.contains('counter-currency');
    const duration = 1200;
    const start = 0;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quartic curve
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + (target - start) * easeProgress);

      if (isCurrency) {
        el.textContent = current.toLocaleString('ru-RU') + ' ₽';
      } else {
        el.textContent = current.toString();
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        if (isCurrency) {
          el.textContent = target.toLocaleString('ru-RU') + ' ₽';
        } else {
          el.textContent = target.toString();
        }
      }
    };

    requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
      } else {
        // Reset counter text when out of view
        const isCurrency = entry.target.classList.contains('counter-currency');
        entry.target.textContent = isCurrency ? '0 ₽' : '0';
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(c => counterObserver.observe(c));
}

/* ==========================================================================
   4. HERO 3D PERSPECTIVE TILT PHYSICS
   ========================================================================== */
function initHeroTilt() {
  const card = document.getElementById('hero-viewport');
  if (!card || window.innerWidth < 992) return;

  let isHovered = false;

  card.addEventListener('mouseenter', () => { isHovered = true; });
  card.addEventListener('mouseleave', () => {
    isHovered = false;
    card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
  });

  card.addEventListener('mousemove', (e) => {
    if (!isHovered) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    card.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
  });
}

/* ==========================================================================
   5. HERO LIVE SEARCH & SIDEBAR NAV
   ========================================================================== */
function initHeroSearchAndNav() {
  const searchInput = document.getElementById('hero-patient-search');
  const rows = document.querySelectorAll('#hero-patient-table .study-row');
  const navRows = document.querySelectorAll('#hero-side-nav .ui-nav-row');

  // Search filter
  if (searchInput && rows.length) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value.toLowerCase().trim();
      rows.forEach(row => {
        const text = row.getAttribute('data-name') || row.innerText.toLowerCase();
        if (text.includes(val)) {
          row.style.display = '';
          row.style.opacity = '1';
        } else {
          row.style.display = 'none';
          row.style.opacity = '0';
        }
      });
    });
  }

  // Sidebar nav selection
  if (navRows.length) {
    navRows.forEach(item => {
      item.addEventListener('click', () => {
        navRows.forEach(r => r.classList.remove('active'));
        item.classList.add('active');
      });
    });
  }
}

/* ==========================================================================
   6. INTERACTIVE CT MULTIPLANAR VIEWER SIMULATOR (Step 03)
   ========================================================================== */
function initInteractiveCTViewer() {
  const viewer = document.getElementById('interactive-ct-viewer');
  const coordsDisplay = document.getElementById('viewer-coords');
  const densityButtons = document.querySelectorAll('.density-btn');
  const panes = document.querySelectorAll('.vq-pane');
  const render3D = document.getElementById('interactive-3d-render');

  if (!viewer) return;

  // Mousemove Crosshair Tracking on 2D slices
  panes.forEach(pane => {
    const axis = pane.getAttribute('data-axis');
    const chH = pane.querySelector('.crosshair-h');
    const chV = pane.querySelector('.crosshair-v');

    if (axis !== '3d' && chH && chV) {
      pane.addEventListener('mousemove', (e) => {
        const rect = pane.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        chH.style.top = `${y}px`;
        chV.style.left = `${x}px`;

        if (coordsDisplay) {
          const posX = (10 + (x / rect.width) * 20).toFixed(1);
          const posY = (20 + (y / rect.height) * 25).toFixed(1);
          const posZ = (35 + ((x + y) / (rect.width + rect.height)) * 15).toFixed(1);
          coordsDisplay.textContent = `X: ${posX} mm | Y: ${posY} mm | Z: ${posZ} mm`;
        }
      });
    }
  });

  // Density HU Presets
  const filterPresets = {
    bone: 'contrast(125%) brightness(100%)',
    soft: 'contrast(90%) brightness(130%) hue-rotate(15deg)',
    enamel: 'contrast(160%) brightness(85%) hue-rotate(-20deg)'
  };

  densityButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      densityButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const preset = btn.getAttribute('data-preset');
      const filterVal = filterPresets[preset] || filterPresets.bone;

      document.querySelectorAll('.vp-img').forEach(img => {
        img.style.filter = filterVal;
      });
    });
  });

  // 3D Volume Interactive Drag / Rotate
  if (render3D) {
    let isDragging = false;
    let startX = 0;
    let currentRotation = 0;

    render3D.parentElement.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      render3D.parentElement.style.cursor = 'grabbing';
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        if (render3D.parentElement) render3D.parentElement.style.cursor = 'grab';
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      currentRotation += deltaX * 0.5;
      render3D.style.transform = `scale(1.05) rotateY(${currentRotation}deg)`;
      startX = e.clientX;
    });
  }
}

/* ==========================================================================
   7. ROLE TABS & CHART ANIMATIONS
   ========================================================================== */
function initRoleTabs() {
  const tabs = document.querySelectorAll('.role-tab-btn');
  const panels = document.querySelectorAll('.role-view-panel');

  if (!tabs.length || !panels.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetRole = tab.getAttribute('data-role');

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      panels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === `role-${targetRole}`) {
          panel.classList.add('active');

          // Trigger counter animation inside active panel if not already run
          const panelCounters = panel.querySelectorAll('.counter, .counter-currency');
          panelCounters.forEach(c => {
            const target = parseInt(c.getAttribute('data-target'), 10);
            if (c.classList.contains('counter-currency')) {
              c.textContent = target.toLocaleString('ru-RU') + ' ₽';
            } else {
              c.textContent = target.toString();
            }
          });
        }
      });
    });
  });
}

/* ==========================================================================
   8. GALLERY & LIGHTBOX ARCHITECTURE
   ========================================================================== */
function initGalleryLightbox() {
  const lightbox = document.getElementById('lightbox-modal');
  const display = document.getElementById('lightbox-display');
  const caption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close-btn');

  if (!lightbox || !display || !caption) return;

  const screens = {
    journal_real: {
      caption: "<strong>Рабочее место центра // Журнал исследований</strong> — оперативный учёт томографии, привязка направлений и кассы в реальном времени.",
      html: `
        <div style="font-family:var(--font-body); color:var(--text-main);">
          <div style="border-bottom:1px solid #DFE2E6; padding-bottom:10px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:0.75rem; color:var(--color-primary); font-weight:700;">ЖУРНАЛ ИССЛЕДОВАНИЙ СМЕНЫ</div>
              <h3 style="font-family:var(--font-heading); font-size:1.25rem; margin:0;">Оперативный пульт диагностического центра</h3>
            </div>
            <span style="background:#E8F7F0; color:#0A8F54; font-size:0.75rem; font-weight:700; padding:4px 8px; border-radius:3px;">Томограф Онлайн</span>
          </div>
          <div style="margin-bottom:14px; border:1px solid #DFE2E6; border-radius:4px; overflow:hidden;">
            <img src="images/kassa.png" alt="Журнал исследований" style="width:100%; height:auto; display:block;">
          </div>
          <div style="font-size:0.8125rem; color:var(--text-muted); line-height:1.5;">
            Все филиалы («Север», «Центр», «Юг», «Запад»), проведённые процедуры, привязка врачей-направителей и кассовая сводка за смену в едином окне.
          </div>
        </div>
      `
    },
    patient_card: {
      caption: "<strong>Вся история пациента в одном месте</strong> — без поиска по журналам и разрозненным таблицам.",
      html: `
        <div style="font-family:var(--font-body); color:var(--text-main); text-align:center;">
          <img src="images/patient.png" alt="Карточка пациента" style="max-width:100%; height:auto; display:block; margin:0 auto; border-radius:4px; box-shadow:0 2px 10px rgba(0,0,0,0.06);">
        </div>
      `
    },
    viewer_3d: {
      caption: "<strong>Направляющий врач открывает исследование непосредственно через браузер</strong> без установки стороннего ПО.",
      html: `
        <div style="font-family:var(--font-body); color:var(--text-main); text-align:center;">
          <img src="images/3dview.png" alt="2D / 3D Веб-просмотр томограмм" style="max-width:100%; height:auto; display:block; margin:0 auto; border-radius:4px; box-shadow:0 2px 10px rgba(0,0,0,0.06);">
        </div>
      `
    },
    panorama_editor: {
      caption: "<strong>Редактор панорам</strong> — индивидуальная подгонка зубочелюстной дуги ОПТГ доступна онлайн всем пользователям прямо в браузере.",
      html: `
        <div style="font-family:var(--font-body); color:var(--text-main); text-align:center;">
          <img src="images/panorama.png" alt="Редактор панорам ОПТГ" style="max-width:100%; height:auto; display:block; margin:0 auto; border-radius:4px; box-shadow:0 2px 10px rgba(0,0,0,0.06);">
        </div>
      `
    },
    finance_report: {
      caption: "<strong>Финансовый учёт и аналитика</strong> — данные для отчётности формируются автоматически из операций, которые сотрудники уже выполняют.",
      html: `
        <div style="font-family:var(--font-body); color:var(--text-main); text-align:center;">
          <img src="images/finance.png" alt="Финансовая аналитика и отчётность" style="max-width:100%; height:auto; display:block; margin:0 auto; border-radius:4px; box-shadow:0 2px 10px rgba(0,0,0,0.06);">
        </div>
      `
    },
    dentist_portal: {
      caption: "<strong>Личный кабинет врача (Стоматологи, Ортодонты, ЛОР)</strong> — быстрый доступ к томограммам челюстей, ВНЧС, ТРГ и пазух носа в один клик без установки ПО.",
      html: `
        <div style="font-family:var(--font-body); color:var(--text-main); text-align:center;">
          <img src="images/doctor.png" alt="Личный кабинет врача" style="max-width:100%; height:auto; display:block; margin:0 auto; border-radius:4px; box-shadow:0 2px 10px rgba(0,0,0,0.06);">
        </div>
      `
    },
    calendar_schedule: {
      caption: "<strong>Интерактивный календарь записи</strong> — наглядное расписание с цветовой дифференциацией по ролям и автоматической подсветкой опозданий и неявок.",
      html: `
        <div style="font-family:var(--font-body); color:var(--text-main); text-align:center;">
          <img src="images/calend.png" alt="Интерактивный календарь записи" style="max-width:100%; height:auto; display:block; margin:0 auto; border-radius:4px; box-shadow:0 2px 10px rgba(0,0,0,0.06);">
        </div>
      `
    }
  };

  const openLightbox = (key) => {
    const data = screens[key];
    if (!data) return;

    display.innerHTML = data.html;
    caption.innerHTML = data.caption;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Attach to both gallery cards and interactive buttons
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-screen]');
    if (trigger) {
      const key = trigger.getAttribute('data-screen');
      openLightbox(key);
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   9. LEAD FORM WITH REAL-TIME MASK & LOADING SPINNER
   ========================================================================== */
function initLeadForm() {
  const form = document.getElementById('main-lead-form');
  const successBox = document.getElementById('form-success');
  const submitBtn = document.getElementById('lead-submit-btn');
  const phoneInput = document.getElementById('lead-phone');

  // Phone input formatting mask
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (!val) {
        e.target.value = '';
        return;
      }
      if (val[0] === '7' || val[0] === '8') val = val.substring(1);
      
      let formatted = '+7 (';
      if (val.length > 0) formatted += val.substring(0, 3);
      if (val.length >= 3) formatted += ') ' + val.substring(3, 6);
      if (val.length >= 6) formatted += '-' + val.substring(6, 8);
      if (val.length >= 8) formatted += '-' + val.substring(8, 10);
      
      e.target.value = formatted;
    });
  }

  if (!form || !successBox || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const spinner = submitBtn.querySelector('.btn-spinner');
    const arrow = submitBtn.querySelector('.btn-arrow');
    const text = submitBtn.querySelector('.btn-text');

    if (spinner) spinner.style.display = 'inline-block';
    if (arrow) arrow.style.display = 'none';
    if (text) text.textContent = 'Отправка...';
    // Save lead to DB
    const nameInput = document.getElementById('lead-name');
    const cityInput = document.getElementById('lead-city');
    saveLeadToDb({
      name: nameInput ? nameInput.value.trim() : 'Клиент',
      phone: phoneInput ? phoneInput.value.trim() : '',
      email: '',
      details: cityInput ? cityInput.value.trim() : '',
      source: 'Форма на главной'
    });

    // Simulate clean, fast server response
    setTimeout(() => {
      form.style.display = 'none';
      successBox.style.display = 'block';
      successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 600);
  });
}

/* ==========================================================================
   10. MAGNETIC BUTTON MICRO-INTERACTIONS (Desktop)
   ========================================================================== */
function initMagneticButtons() {
  if (window.innerWidth < 992) return;
  const magneticButtons = document.querySelectorAll('.magnetic-btn');

  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
}

/* ==========================================================================
   11. MOBILE NAVIGATION
   ========================================================================== */
function initMobileNav() {
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('main-nav');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    menu.classList.toggle('mobile-open');
  });

  const links = document.querySelectorAll('.menu-link');
  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('mobile-open');
    });
  });
}

/* ==========================================================================
   12. COOKIE CONSENT BANNER
   ========================================================================== */
function initCookieConsent() {
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept-btn');
  if (!banner || !acceptBtn) return;

  const isAccepted = localStorage.getItem('dentx_cookie_consent');
  if (!isAccepted) {
    setTimeout(() => {
      banner.classList.add('show');
    }, 800);
  }

  acceptBtn.addEventListener('click', () => {
    localStorage.setItem('dentx_cookie_consent', 'true');
    banner.classList.remove('show');
  });
}

/* ==========================================================================
   13. CONTACT MODAL DIALOG (Имя, Почта, Телефон)
   ========================================================================== */
function initContactModal() {
  const modal = document.getElementById('contact-modal');
  const closeBtn = document.getElementById('contact-modal-close-btn');
  const form = document.getElementById('modal-lead-form');
  const successBox = document.getElementById('modal-form-success');
  const submitBtn = document.getElementById('modal-submit-btn');
  const phoneInput = document.getElementById('modal-lead-phone');

  if (!modal) return;

  const openModal = () => {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Open triggers
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.open-contact-modal-btn');
    if (btn) {
      e.preventDefault();
      openModal();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // Phone input formatting mask
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (!val) {
        e.target.value = '';
        return;
      }
      if (val[0] === '7' || val[0] === '8') val = val.substring(1);
      
      let formatted = '+7 (';
      if (val.length > 0) formatted += val.substring(0, 3);
      if (val.length >= 3) formatted += ') ' + val.substring(3, 6);
      if (val.length >= 6) formatted += '-' + val.substring(6, 8);
      if (val.length >= 8) formatted += '-' + val.substring(8, 10);
      
      e.target.value = formatted;
    });
  }

  // Modal form submit
  if (form && successBox && submitBtn) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const spinner = submitBtn.querySelector('.btn-spinner');
      const arrow = submitBtn.querySelector('.btn-arrow');
      const text = submitBtn.querySelector('.btn-text');

      if (spinner) spinner.style.display = 'inline-block';
      if (arrow) arrow.style.display = 'none';
      if (text) text.textContent = 'Отправка...';
      const nameInput = document.getElementById('modal-lead-name');
      const emailInput = document.getElementById('modal-lead-email');

      saveLeadToDb({
        name: nameInput ? nameInput.value.trim() : 'Клиент',
        phone: phoneInput ? phoneInput.value.trim() : '',
        email: emailInput ? emailInput.value.trim() : '',
        details: '',
        source: 'Модальное окно'
      });

      setTimeout(() => {
        form.style.display = 'none';
        successBox.style.display = 'block';
      }, 600);
    });
  }
}

/* ==========================================================================
   14. LOCAL DATABASE HELPER FOR LEADS
   ========================================================================== */
function saveLeadToDb(lead) {
  try {
    const STORAGE_KEY = 'dentx_leads_db';
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const newLead = {
      id: 'L-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'new',
      ...lead
    };
    existing.unshift(newLead);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error('Error saving lead:', e);
  }
}
