/**
 * BRANDTRIX — Premium Digital Brand Experience
 * Master Application Architecture & High-Performance Motion System
 */

(function () {
  'use strict';

  // Check reduced motion preference
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     GLOBAL HELPER: NATIVE SMOOTH SCROLL (NO HIJACKING)
     ========================================================================== */
  function smoothScrollToElement(el, offset) {
    if (!el) return;
    var off = typeof offset === 'number' ? offset : -70;
    var targetPosition = el.getBoundingClientRect().top + window.pageYOffset + off;
    window.scrollTo({
      top: Math.max(0, targetPosition),
      behavior: 'smooth'
    });
  }

  /* ==========================================================================
     1. LIVE CHENNAI IST CLOCK & METRICS
     ========================================================================== */
  function initChennaiClock() {
    var timeEl = document.getElementById('liveChennaiTime');
    if (!timeEl) return;

    function updateTime() {
      try {
        var options = {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        };
        var formatter = new Intl.DateTimeFormat('en-IN', options);
        timeEl.textContent = formatter.format(new Date()) + ' IST';
      } catch (e) {
        var now = new Date();
        timeEl.textContent = now.toLocaleTimeString() + ' IST';
      }
    }

    updateTime();
    setInterval(updateTime, 1000);

    // Current Year in Footer
    var yearEl = document.getElementById('currentYear');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  /* ==========================================================================
     2. PRELOADER & CINEMATIC OPENING (NON-BLOCKING)
     ========================================================================== */
  function initPreloader() {
    var preloader = document.getElementById('preloader');
    var bar = document.getElementById('preloaderBar');
    var counter = document.getElementById('preloaderPercent');
    if (!preloader || !bar || !counter) {
      triggerHeroReveals();
      return;
    }

    var progress = 0;
    var duration = prefersReducedMotion ? 100 : 700;
    var startTime = performance.now();

    function updateProgress(currentTime) {
      var elapsed = currentTime - startTime;
      var factor = Math.min(elapsed / duration, 1);

      progress = Math.floor(Math.pow(factor, 0.85) * 100);

      bar.style.width = progress + '%';
      counter.textContent = (progress < 10 ? '0' : '') + progress + '%';

      if (factor < 1) {
        requestAnimationFrame(updateProgress);
      } else {
        completePreloader();
      }
    }

    function completePreloader() {
      bar.style.width = '100%';
      counter.textContent = '100%';

      setTimeout(function () {
        preloader.classList.add('completed');
        triggerHeroReveals();
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }
      }, 300);
    }

    requestAnimationFrame(updateProgress);
  }

  function triggerHeroReveals() {
    if (prefersReducedMotion || typeof gsap === 'undefined') return;

    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.reveal-text', {
      y: '100%',
      opacity: 0,
      duration: 0.9,
      stagger: 0.12
    })
    .from('.hero-meta-badge', {
      opacity: 0,
      y: -12,
      duration: 0.7
    }, '-=0.7')
    .from('.hero-col-left', {
      opacity: 0,
      y: 20,
      duration: 0.8
    }, '-=0.5')
    .from('.hero-col-right', {
      opacity: 0,
      y: 25,
      duration: 0.8
    }, '-=0.6')
    .from('.hero-scroll-indicator', {
      opacity: 0,
      duration: 0.7
    }, '-=0.3');
  }

  /* ==========================================================================
     3. NATIVE SMOOTH SCROLLING & ANCHOR NAVIGATION (ZERO SCROLL HIJACKING)
     ========================================================================== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#' || !targetId) return;
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          smoothScrollToElement(target, -70);
        }
      });
    });
  }

  /* ==========================================================================
     4. HEADER SCROLL DETECTION
     ========================================================================== */
  function initHeaderScroll() {
    var header = document.getElementById('siteHeader');
    if (!header) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* ==========================================================================
     5. FULLSCREEN LUXURY OVERLAY MENU
     ========================================================================== */
  function initFullscreenMenu() {
    var menuToggle = document.getElementById('menuToggle');
    var menu = document.getElementById('fullscreenMenu');
    var menuLinks = document.querySelectorAll('[data-menu-close]');
    if (!menuToggle || !menu) return;

    var isOpen = false;

    function toggleMenu() {
      isOpen = !isOpen;
      menuToggle.setAttribute('aria-expanded', isOpen);
      menu.setAttribute('aria-hidden', !isOpen);

      if (isOpen) {
        menu.classList.add('open');
        document.body.style.overflow = 'hidden';

        if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
          gsap.fromTo('.menu-item', 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power3.out' }
          );
          gsap.fromTo('.menu-sidebar', 
            { opacity: 0, x: 20 },
            { opacity: 1, x: 0, duration: 0.6, delay: 0.15, ease: 'power3.out' }
          );
        }
      } else {
        menu.classList.remove('open');
        document.body.style.overflow = '';
      }
    }

    menuToggle.addEventListener('click', toggleMenu);

    menuLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (isOpen) {
          toggleMenu();
        }
        if (href && href.startsWith('#')) {
          var target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            setTimeout(function () {
              smoothScrollToElement(target, -70);
            }, 100);
          }
        }
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) {
        toggleMenu();
      }
    });
  }

  /* ==========================================================================
     6. CUSTOM DESKTOP LUXURY CURSOR
     ========================================================================== */
  function initCustomCursor() {
    var cursor = document.querySelector('.custom-cursor');
    var cursorDot = document.querySelector('.cursor-dot');
    var cursorRing = document.querySelector('.cursor-ring');
    var cursorLabel = document.querySelector('.cursor-label');
    var cursorText = document.querySelector('.cursor-text');

    if (!cursor || !cursorDot || !cursorRing || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    var mouseX = -100, mouseY = -100;
    var ringX = -100, ringY = -100;

    window.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = 'translate(' + mouseX + 'px, ' + mouseY + 'px)';
    });

    function renderRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      cursorRing.style.transform = 'translate(' + ringX + 'px, ' + ringY + 'px)';
      if (cursorLabel) {
        cursorLabel.style.transform = 'translate(' + ringX + 'px, ' + ringY + 'px)';
      }
      requestAnimationFrame(renderRing);
    }
    requestAnimationFrame(renderRing);

    // Interactive elements hover state
    var hoverElements = document.querySelectorAll('a, button, .chapter-chip, .pill-checkbox, .luxury-range, .offering-card');
    hoverElements.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        document.body.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', function () {
        document.body.classList.remove('cursor-hover');
      });
    });

    // Special contextual labels (e.g. "VIEW DOSSIER", "EXPLORE")
    var labelledElements = document.querySelectorAll('[data-cursor-text]');
    labelledElements.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        var text = el.getAttribute('data-cursor-text') || 'EXPLORE';
        if (cursorText) cursorText.textContent = text;
        document.body.classList.add('cursor-active');
      });
      el.addEventListener('mouseleave', function () {
        document.body.classList.remove('cursor-active');
      });
    });

    // Magnetic buttons
    var magneticElements = document.querySelectorAll('.magnetic');
    magneticElements.forEach(function (elem) {
      elem.addEventListener('mousemove', function (e) {
        var rect = elem.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        var strength = parseFloat(elem.getAttribute('data-magnetic-strength')) || 0.22;

        elem.style.transform = 'translate(' + (x * strength) + 'px, ' + (y * strength) + 'px)';
      });

      elem.addEventListener('mouseleave', function () {
        elem.style.transform = 'translate(0px, 0px)';
        elem.style.transition = 'transform 0.3s ease-out';
      });

      elem.addEventListener('mouseenter', function () {
        elem.style.transition = 'none';
      });
    });
  }

  /* ==========================================================================
     7. SERVICE CHAPTER QUICK NAV SWITCHER
     ========================================================================== */
  function initServiceChapters() {
    var chips = document.querySelectorAll('.chapter-chip');
    if (!chips.length) return;

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var targetId = this.getAttribute('data-target-chapter');
        var targetChapter = document.getElementById(targetId);
        if (!targetChapter) return;

        chips.forEach(function (c) { 
          c.classList.remove('active');
          c.setAttribute('aria-selected', 'false');
        });
        chip.classList.add('active');
        chip.setAttribute('aria-selected', 'true');

        smoothScrollToElement(targetChapter, -90);
      });
    });

    // IntersectionObserver to sync active chip on scroll
    if ('IntersectionObserver' in window) {
      var chapters = document.querySelectorAll('.service-chapter');
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            chips.forEach(function (c) {
              if (c.getAttribute('data-target-chapter') === id) {
                c.classList.add('active');
                c.setAttribute('aria-selected', 'true');
              } else {
                c.classList.remove('active');
                c.setAttribute('aria-selected', 'false');
              }
            });
          }
        });
      }, { threshold: 0.35 });

      chapters.forEach(function (ch) { observer.observe(ch); });
    }
  }

  /* ==========================================================================
     8. INTERACTIVE CAMPAIGN REACH PLANNER & ESTIMATOR
     ========================================================================== */
  function initCampaignPlanner() {
    var rangeParks = document.getElementById('rangeTechParks');
    var rangeSocieties = document.getElementById('rangeSocieties');
    var rangeTransit = document.getElementById('rangeTransit');
    var rangeInserts = document.getElementById('rangeInserts');

    var valParks = document.getElementById('valTechParks');
    var valSocieties = document.getElementById('valSocieties');
    var valTransit = document.getElementById('valTransit');
    var valInserts = document.getElementById('valInserts');

    var estImpressions = document.getElementById('estImpressions');
    var estFootfall = document.getElementById('estFootfall');
    var applyPlanBtn = document.getElementById('applyPlanBtn');

    if (!rangeParks || !estImpressions) return;

    function recalculate() {
      var p = parseInt(rangeParks.value, 10) || 0;
      var s = parseInt(rangeSocieties.value, 10) || 0;
      var t = parseInt(rangeTransit.value, 10) || 0;
      var ins = parseInt(rangeInserts.value, 10) || 0;

      // Update labels
      if (valParks) valParks.textContent = p + (p === 1 ? ' Park' : ' Parks');
      if (valSocieties) valSocieties.textContent = s + (s === 1 ? ' Society' : ' Societies');
      if (valTransit) valTransit.textContent = t + (t === 1 ? ' Vehicle' : ' Vehicles');
      if (valInserts) valInserts.textContent = ins.toLocaleString() + ' Copies';

      // Impression modeling across Chennai channels
      var totalImpressions = (p * 45000) + (s * 8000) + (t * 7000) + Math.round(ins * 2.2);
      var totalFootfall = (p * 3500) + (s * 500) + Math.round(ins * 0.08);

      estImpressions.textContent = totalImpressions.toLocaleString() + '+';
      estFootfall.textContent = totalFootfall.toLocaleString() + '+';
    }

    [rangeParks, rangeSocieties, rangeTransit, rangeInserts].forEach(function (slider) {
      if (slider) {
        slider.addEventListener('input', recalculate);
      }
    });

    // Transfer Plan to Brief Inquiry Form
    if (applyPlanBtn) {
      applyPlanBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var p = rangeParks.value;
        var s = rangeSocieties.value;
        var t = rangeTransit.value;
        var ins = rangeInserts.value;

        // Auto-check corresponding form checkboxes
        var checkboxes = document.querySelectorAll('input[name="services"]');
        checkboxes.forEach(function (cb) {
          if (p > 0 && cb.value.indexOf('Tech Park') !== -1) cb.checked = true;
          if (s > 0 && cb.value.indexOf('Society') !== -1) cb.checked = true;
          if (t > 0 && cb.value.indexOf('Transit') !== -1) cb.checked = true;
          if (ins > 0 && cb.value.indexOf('Newspaper') !== -1) cb.checked = true;
        });

        // Pre-fill scope textarea
        var scopeArea = document.getElementById('projectScope');
        if (scopeArea) {
          scopeArea.value = 'Configured Campaign Scope from Calculator: ' +
            p + ' Tech Parks, ' + s + ' Gated Societies, ' + t + ' Transit Vehicles, ' +
            parseInt(ins).toLocaleString() + ' Newspaper Inserts. Estimated Reach: ' +
            estImpressions.textContent + ' impressions. Please share timeline and rate quotation.';
        }

        // Scroll to form cleanly
        var contactSec = document.getElementById('contact');
        if (contactSec) {
          smoothScrollToElement(contactSec, -60);
        }
      });
    }

    recalculate();
  }

  /* ==========================================================================
     9. CAMPAIGN DOSSIER MODAL & CASE DETAILS
     ========================================================================== */
  var campaignDossiers = {
    'Apex Tech Park Multi-Campus Takeover': {
      category: 'TECH PARK ACTIVATION // BTL',
      location: 'OMR, Guindy & Porur IT Corridors, Chennai',
      objective: 'High-density corporate employee acquisition and interactive product sampling for a premier technology brand.',
      touchpoints: [
        '8 Grade-A Tech Parks including Tidel Park, Ascendas IT Park & RMZ Millenia',
        'Turnkey high-concept architectural lounge pavilion with interactive touchscreens',
        'Cafeteria sampling kiosks and barista-sponsored conversation lounges',
        'Dedicated team of 16 multilingual corporate brand ambassadors'
      ],
      metrics: {
        'Verified Footfall': '45,000+ Corporate Professionals',
        'Direct Trial Engagements': '14,200 Interactive Demos',
        'App Installs / Lead Capture': '8,640 Attributed Registrations',
        'Geo-tagged Proof Logs': '100% Hourly Supervisor Verification'
      },
      quote: 'The precision with which the tech park entrances and cafeterias were activated generated immediate executive buzz.'
    },
    'Aura Living Luxury Society Blitz': {
      category: 'GATED RESIDENTIAL SOCIETY TAKEOVER // BTL',
      location: 'ECR, Adyar, Velachery & Anna Nagar, Chennai',
      objective: 'Direct-to-home immersion targeting high-net-worth families in gated villa and luxury apartment enclaves.',
      touchpoints: [
        '32 Premium Residential Welfare Associations (RWAs) secured with legal permits',
        'Weekend experiential gazebos with interactive family activities',
        'Permanent branded Society Gate Boards and No-Parking Boards installed for 60-day retention',
        'Society WhatsApp broadcast and resident portal banner inclusions'
      ],
      metrics: {
        'Resident Households Reached': '18,500+ Luxury Homes',
        'Weekend Test Drives / Demos': '1,280 High-Value In-person Appointments',
        'Society Gate Recall Score': '91% Resident Recognition at 30 Days',
        'Permit Turnaround Time': 'Zero RWA Friction'
      },
      quote: 'Securing access to high-end gated societies in Chennai is notoriously difficult; Brandtrix made it look effortless.'
    },
    'Metropolitan Transit Dominance Fleet': {
      category: 'OUTDOOR TRANSIT MEDIA // OOH',
      location: 'Greater Chennai Metropolitan Transit Corridors',
      objective: 'Unmissable arterial brand presence connecting residential corridors to core employment epicentres.',
      touchpoints: [
        '60 Full Metropolitan Transport Corporation (MTC) Bus Vinyl Wraps',
        '150 Airport & Railway Hub Branded Cabs with high-frequency passenger circulation',
        'Strategic route selection targeting GST Road, Mount Road, and Inner Ring Road',
        '3M Premium UV-resistant vinyl substrates ensuring flawless presentation in Chennai heat'
      ],
      metrics: {
        'Monthly Arterial Impressions': '14,800,000+ Commuters',
        'Active Route Kilometres': '12,500 km Daily Fleet Transit',
        'Maintenance Inspection': '48-hour mandatory wash & vinyl audit check'
      },
      quote: 'When your fleet wraps roll through Mount Road during peak hours, your brand owns the city.'
    },
    'Gen-Next Campus & Hostel Synchronized Surge': {
      category: 'COLLEGIATE & HOSTEL ACTIVATIONS // BTL',
      location: '22 Engineering, Arts & Management Campuses, Chennai',
      objective: 'Mobilizing youth culture and high-volume app adoption during prime collegiate semester windows.',
      touchpoints: [
        '22 Leading College Campuses across Chennai and suburban institutional belts',
        '40+ Clustered Student PG & Hostel activations with evening pop-up kiosks',
        'Custom interactive gaming arena and campus ambassador referral network',
        'Festival sponsorship integrations with live MC engagements'
      ],
      metrics: {
        'Youth Students Engaged': '62,000+ Students',
        'Direct App Registrations': '21,400 Verified Signups',
        'Campus Ambassador Army': '85 Student Micro-Influencers'
      },
      quote: 'Energy and disciplined crowd management rarely go hand-in-hand, but Brandtrix executed both flawlessly.'
    },
    'Omni-Channel Morning Table Inserts': {
      category: 'PINCODE-TARGETED PRINT // BTL',
      location: 'Targeted Affluent Pincodes, Chennai (600028, 600041, 600020, 600034)',
      objective: 'Direct physical placement into consumer households during prime morning consumption hours.',
      touchpoints: [
        'High-grade art-card inserts physically placed inside The Hindu, Times of India & leading Tamil dailies',
        'Supervised morning newspaper depot insertion at 4:30 AM with photographic proof',
        'Accompanied by 50 framed commercial standees at local high-street retail zones',
        'Unique QR voucher code tracking conversion down to specific street pincodes'
      ],
      metrics: {
        'Copies Hand-Inserted': '75,000 Verified Households',
        'Morning Scan Rate': '3.8% QR Voucher Redemption',
        'Depot Photo Audits': '100% Depot Dispatch Logged'
      },
      quote: 'The morning newspaper remains the most trusted physical surface in South Indian households.'
    }
  };

  function initDossierModal() {
    var modal = document.getElementById('dossierModal');
    var modalBody = document.getElementById('modalBody');
    var closeBtn = document.getElementById('modalCloseBtn');
    var backdrop = document.getElementById('modalBackdrop');
    var cards = document.querySelectorAll('.campaign-card');

    if (!modal || !modalBody) return;

    function openModal(title) {
      var data = campaignDossiers[title];
      if (!data) return;

      var touchpointsHtml = data.touchpoints.map(function (tp) {
        return '<li><span class="text-gold">◆</span> <span>' + tp + '</span></li>';
      }).join('');

      var metricsHtml = Object.keys(data.metrics).map(function (k) {
        return '<div class="dossier-metric-box"><span class="m-k">' + k + '</span><span class="m-v">' + data.metrics[k] + '</span></div>';
      }).join('');

      modalBody.innerHTML = [
        '<div class="dossier-header">',
        '  <span class="dossier-kicker">' + data.category + '</span>',
        '  <h2 class="dossier-title">' + title + '</h2>',
        '  <p class="dossier-loc"><span class="text-gold">LOCATION:</span> ' + data.location + '</p>',
        '</div>',
        '<div class="dossier-content">',
        '  <div class="dossier-section">',
        '    <h4 class="dossier-subheading">CAMPAIGN OBJECTIVE</h4>',
        '    <p class="dossier-p">' + data.objective + '</p>',
        '  </div>',
        '  <div class="dossier-section">',
        '    <h4 class="dossier-subheading">DEPLOYED TOUCHPOINTS & MEDIA MIX</h4>',
        '    <ul class="dossier-list">' + touchpointsHtml + '</ul>',
        '  </div>',
        '  <div class="dossier-section">',
        '    <h4 class="dossier-subheading">VERIFIED EXECUTION METRICS</h4>',
        '    <div class="dossier-metrics-grid">' + metricsHtml + '</div>',
        '  </div>',
        '  <div class="dossier-quote-box">',
        '    <p>“' + data.quote + '”</p>',
        '    <span class="dossier-attribution">— BRANDTRIX CHENNAI FIELD OPERATIONS DESK</span>',
        '  </div>',
        '  <div class="dossier-cta-row">',
        '    <a href="#contact" class="btn-luxury-primary modal-brief-cta">',
        '      <span>INITIATE SIMILAR CAMPAIGN</span>',
        '    </a>',
        '  </div>',
        '</div>'
      ].join('\n');

      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // Attach scroll link to CTA inside modal
      var briefCta = modalBody.querySelector('.modal-brief-cta');
      if (briefCta) {
        briefCta.addEventListener('click', function (e) {
          e.preventDefault();
          closeModal();
          var contactSec = document.getElementById('contact');
          if (contactSec) {
            setTimeout(function () {
              smoothScrollToElement(contactSec, -60);
            }, 150);
          }
        });
      }
    }

    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        var titleEl = card.querySelector('.card-title');
        if (titleEl) {
          openModal(titleEl.textContent.trim());
        }
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });
  }

  /* ==========================================================================
     10. INTERACTIVE BRIEF FORM & DIRECT WHATSAPP/EMAIL DISPATCH
     ========================================================================== */
  function initContactForm() {
    var form = document.getElementById('brandBriefForm');
    var banner = document.getElementById('formStatusBanner');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameInput = document.getElementById('clientName');
      var companyInput = document.getElementById('clientCompany');
      var emailInput = document.getElementById('clientEmail');
      var phoneInput = document.getElementById('clientPhone');
      var scopeInput = document.getElementById('projectScope');

      var isValid = true;

      // Validation
      [nameInput, companyInput, emailInput, phoneInput].forEach(function (input) {
        var group = input.closest('.form-group');
        if (!input.value.trim()) {
          group.classList.add('has-error');
          isValid = false;
        } else {
          group.classList.remove('has-error');
        }
      });

      // Email format check
      if (emailInput.value.trim() && !/^\S+@\S+\.\S+$/.test(emailInput.value.trim())) {
        emailInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      }

      if (!isValid) {
        if (banner) {
          banner.className = 'form-status-banner error';
          banner.textContent = 'Please complete all required fields with valid details.';
          banner.style.display = 'block';
        }
        return;
      }

      // Collect selected services
      var selectedServices = [];
      document.querySelectorAll('input[name="services"]:checked').forEach(function (cb) {
        selectedServices.push(cb.value);
      });

      var servicesText = selectedServices.length ? selectedServices.join(', ') : 'Integrated Promotions & Activations';
      var scopeText = scopeInput ? scopeInput.value.trim() : 'Standard campaign feasibility required.';

      // Compose WhatsApp link
      var waMessage = [
        '*NEW BRANDTRIX CLIENT BRIEF*',
        '-------------------------',
        '*Name:* ' + nameInput.value.trim(),
        '*Brand/Company:* ' + companyInput.value.trim(),
        '*Email:* ' + emailInput.value.trim(),
        '*Phone:* ' + phoneInput.value.trim(),
        '*Channels:* ' + servicesText,
        '*Scope/Timeline:* ' + scopeText,
        '-------------------------',
        'Submitted via brandtrix.in digital portal.'
      ].join('\n');

      var encodedWa = encodeURIComponent(waMessage);
      var waUrl = 'https://wa.me/916379886505?text=' + encodedWa;

      // Success Display
      if (banner) {
        banner.className = 'form-status-banner success';
        banner.innerHTML = [
          '<strong>CAMPAIGN BRIEF LOGGED SUCCESSFULLY.</strong><br>',
          'Our Chennai operations lead will review your requirements immediately.<br>',
          '<a href="' + waUrl + '" target="_blank" rel="noopener noreferrer" style="display:inline-block; margin-top:0.75rem; color:#C6A76A; text-decoration:underline; font-weight:700;">',
          '⚡ Click here to instantly notify our desk on WhatsApp with your brief &rarr;</a>'
        ].join('');
        banner.style.display = 'block';
      }

      form.reset();
    });
  }

  /* ==========================================================================
     11. GSAP SCROLLTRIGGER EDITORIAL REVEALS (NATURAL & PERFORMANT)
     ========================================================================== */
  function initScrollReveals() {
    if (prefersReducedMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    var revealElements = document.querySelectorAll('[data-reveal]');
    revealElements.forEach(function (el) {
      var revealType = el.getAttribute('data-reveal');
      var delay = parseFloat(el.getAttribute('data-delay')) / 1000 || 0;

      var vars = {
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          once: true // Trigger once so it never recalculates or causes layout jank during scroll
        },
        duration: 0.8,
        delay: delay,
        ease: 'power3.out'
      };

      if (revealType === 'fade-up') {
        vars.opacity = 0;
        vars.y = 30;
        gsap.from(el, vars);
      } else if (revealType === 'fade-left') {
        vars.opacity = 0;
        vars.x = 30;
        gsap.from(el, vars);
      } else if (revealType === 'fade') {
        vars.opacity = 0;
        gsap.from(el, vars);
      }
    });

    window.addEventListener('load', function () {
      ScrollTrigger.refresh();
    });
  }

  /* ==========================================================================
     12. BRAND SEARCH ENGINE WITH INTEGRATED LOGO
     ========================================================================== */
  var searchIndex = [
    { title: 'Tech Park Activations', category: 'ACTIVATIONS', desc: 'OMR, Guindy, Porur IT corridor employee engagement', target: '#chapter-01', keywords: 'tech park it corridor omr guindy porur corporate employee kiosks cafeteria' },
    { title: 'Residential Society Activations', category: 'ACTIVATIONS', desc: 'Gated communities & luxury apartment takeovers', target: '#chapter-01', keywords: 'society residential apartment gated community ecr adyar velachery rwa' },
    { title: 'College & Campus Promotions', category: 'ACTIVATIONS', desc: 'Collegiate fest sponsorships & youth ambassador drives', target: '#chapter-01', keywords: 'college campus student youth fest university' },
    { title: 'PG & Hostel Activations', category: 'ACTIVATIONS', desc: 'Direct outreach to student & young professional hubs', target: '#chapter-01', keywords: 'pg hostel student housing room accommodation' },
    { title: 'Bus Branding Fleet', category: 'OUTDOOR', desc: 'Full MTC fleet wraps & arterial route dominance', target: '#chapter-02', keywords: 'bus transit mtc fleet wrap transport arterial mount road gst' },
    { title: 'Cab & Auto Fleet Branding', category: 'OUTDOOR', desc: 'Airport corridor & railway hub mobile media', target: '#chapter-02', keywords: 'cab auto taxi fleet airport railway transit' },
    { title: 'Lamp Post & Pole Kiosks', category: 'OUTDOOR', desc: 'Sequential street-level visual rhythm on avenues', target: '#chapter-02', keywords: 'lamp post pole kiosk street avenue road median' },
    { title: 'Society Gate & No-Parking Boards', category: 'OUTDOOR', desc: 'Persistent eye-level compound placements', target: '#chapter-02', keywords: 'gate board no-parking parking society entrance' },
    { title: 'Umbrella Branding', category: 'OUTDOOR', desc: 'High-utility localized street corner presence', target: '#chapter-02', keywords: 'umbrella vendor tea kiosk corner stall' },
    { title: 'Hotspot & Flyer Operations', category: 'PROMOTIONS', desc: 'Trained promoter distribution at high-footfall hubs', target: '#chapter-03', keywords: 'flyer flyering pamphlet distribution hotspot promoter metro' },
    { title: 'Targeted Newspaper Inserts', category: 'PROMOTIONS', desc: 'Pincode morning paper household placement', target: '#chapter-03', keywords: 'newspaper insert print hindu times of india daily morning pincode' },
    { title: 'WhatsApp Promotional Blasts', category: 'PROMOTIONS', desc: 'Rich media segmented conversational campaigns', target: '#chapter-03', keywords: 'whatsapp broadcast blast conversational digital leads' },
    { title: 'Framed Standees', category: 'PROMOTIONS', desc: 'Architectural floor displays in retail & cinema foyers', target: '#chapter-03', keywords: 'standee display floor retail mall cinema foyer' },
    { title: 'Event Management & Staging', category: 'EVENTS', desc: 'Brand launches, corporate summits & keynote galas', target: '#event-management', keywords: 'event launch summit corporate keynote gala stage conference' },
    { title: 'Campaign Reach Calculator', category: 'PLANNER', desc: 'Interactive impression estimator & brief generator', target: '.planner-section', keywords: 'calculator planner estimate reach impressions footfall cost budget' },
    { title: 'Apex Tech Park Takeover Case', category: 'SELECTED WORK', desc: '45,000 corporate professionals engaged on OMR', target: '#selected-work', keywords: 'apex case study dossier omr tech park work' },
    { title: 'Aura Living Society Blitz Case', category: 'SELECTED WORK', desc: '32 luxury gated communities in ECR & Adyar', target: '#selected-work', keywords: 'aura living society case study ecr adyar residential work' },
    { title: 'Metropolitan Transit Fleet Case', category: 'SELECTED WORK', desc: '210 transit units across Greater Chennai', target: '#selected-work', keywords: 'metropolitan transit case study bus cab work' },
    { title: 'Direct Campaign Brief & WhatsApp', category: 'CONTACT', desc: 'Connect directly with Chennai operations desk (+91 63798 86505)', target: '#contact', keywords: 'contact phone whatsapp email quote brief pricing address perambur' }
  ];

  function initSearchBar() {
    function setupSearch(inputEl, dropdownEl, clearBtnEl) {
      if (!inputEl || !dropdownEl) return;

      function renderResults(query) {
        var q = query.trim().toLowerCase();
        if (!q) {
          dropdownEl.style.display = 'none';
          dropdownEl.innerHTML = '';
          if (clearBtnEl) clearBtnEl.style.display = 'none';
          return;
        }

        if (clearBtnEl) clearBtnEl.style.display = 'block';

        var matches = searchIndex.filter(function (item) {
          return item.title.toLowerCase().indexOf(q) !== -1 ||
                 item.desc.toLowerCase().indexOf(q) !== -1 ||
                 item.category.toLowerCase().indexOf(q) !== -1 ||
                 item.keywords.toLowerCase().indexOf(q) !== -1;
        });

        if (matches.length === 0) {
          dropdownEl.innerHTML = [
            '<div class="search-dropdown-header">',
            '  <span>BRANDTRIX SEARCH</span>',
            '  <span>0 RESULTS</span>',
            '</div>',
            '<div style="padding: 1.25rem 1rem; color: var(--text-muted); font-size: 0.85rem; text-align: center;">',
            '  No direct match for "' + query + '".<br>',
            '  <a href="#contact" class="text-gold" style="display:inline-block; margin-top:0.5rem; text-decoration:underline;">Inquire custom requirement &rarr;</a>',
            '</div>'
          ].join('');
          dropdownEl.style.display = 'block';
          return;
        }

        var html = [
          '<div class="search-dropdown-header">',
          '  <span>BRANDTRIX SEARCH</span>',
          '  <span>' + matches.length + ' MATCHES</span>',
          '</div>'
        ];

        matches.forEach(function (m) {
          html.push(
            '<a href="' + m.target + '" class="search-result-item" data-search-target="' + m.target + '">' +
            '  <span class="result-badge">' + m.category + '</span>' +
            '  <div class="result-info">' +
            '    <span class="result-title">' + m.title + '</span>' +
            '    <span class="result-desc">' + m.desc + '</span>' +
            '  </div>' +
            '</a>'
          );
        });

        dropdownEl.innerHTML = html.join('');
        dropdownEl.style.display = 'block';

        dropdownEl.querySelectorAll('.search-result-item').forEach(function (item) {
          item.addEventListener('click', function (e) {
            e.preventDefault();
            var targetSelector = this.getAttribute('data-search-target');
            var targetEl = document.querySelector(targetSelector);
            dropdownEl.style.display = 'none';
            inputEl.value = '';
            if (clearBtnEl) clearBtnEl.style.display = 'none';

            // Close fullscreen menu if open
            var menu = document.getElementById('fullscreenMenu');
            if (menu && menu.classList.contains('open')) {
              var menuToggle = document.getElementById('menuToggle');
              if (menuToggle) menuToggle.click();
            }

            if (targetEl) {
              smoothScrollToElement(targetEl, -80);
              targetEl.style.transition = 'box-shadow 0.6s ease';
              targetEl.style.boxShadow = '0 0 40px rgba(198, 167, 106, 0.4)';
              setTimeout(function () {
                targetEl.style.boxShadow = '';
              }, 1600);
            }
          });
        });
      }

      inputEl.addEventListener('input', function () {
        renderResults(this.value);
      });

      inputEl.addEventListener('focus', function () {
        if (this.value.trim()) renderResults(this.value);
      });

      if (clearBtnEl) {
        clearBtnEl.addEventListener('click', function () {
          inputEl.value = '';
          dropdownEl.style.display = 'none';
          clearBtnEl.style.display = 'none';
          inputEl.focus();
        });
      }

      document.addEventListener('click', function (e) {
        if (!inputEl.contains(e.target) && !dropdownEl.contains(e.target)) {
          dropdownEl.style.display = 'none';
        }
      });
    }

    var globalInput = document.getElementById('globalSearchInput');
    var globalDropdown = document.getElementById('searchResultsDropdown');
    var globalClear = document.getElementById('searchClearBtn');
    setupSearch(globalInput, globalDropdown, globalClear);

    var menuInput = document.getElementById('menuSearchInput');
    var menuDropdown = document.getElementById('menuSearchResultsDropdown');
    var menuClear = document.getElementById('menuSearchClearBtn');
    setupSearch(menuInput, menuDropdown, menuClear);

    // Keyboard shortcut: Cmd+K or Ctrl+K
    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (globalInput && window.innerWidth >= 992) {
          globalInput.focus();
          globalInput.select();
        } else if (menuInput) {
          var menu = document.getElementById('fullscreenMenu');
          if (!menu || !menu.classList.contains('open')) {
            var toggle = document.getElementById('menuToggle');
            if (toggle) toggle.click();
          }
          setTimeout(function () {
            menuInput.focus();
            menuInput.select();
          }, 200);
        }
      }
    });
  }

  /* ==========================================================================
     INIT ALL MODULES
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    initChennaiClock();
    initPreloader();
    initSmoothScroll();
    initHeaderScroll();
    initFullscreenMenu();
    initCustomCursor();
    initServiceChapters();
    initCampaignPlanner();
    initDossierModal();
    initContactForm();
    initScrollReveals();
    initSearchBar();
  });

})();
