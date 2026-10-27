/**
 * ==========================================================================
 * StudentHub - Interactive Dynamic UI Components
 * 
 * Includes:
 * 1. Light / Dark Theme Switcher (localStorage + system preference detection)
 * 2. Mobile Responsive Hamburger Menu (Animated toggle, focus management, overlay)
 * 3. Notification Banner & Dynamic Toast Notification Manager
 * 4. Accessible Modal Popup System (Focus trapping, Esc key, backdrop click)
 * 5. Responsive Image & Content Slider / Carousel (Autoplay, touch swipe, controls)
 * 6. Collapsible FAQ Accordion (Smooth animation, live search, category filters)
 * ==========================================================================
 */

(function () {
  'use strict';

  // Global namespace for StudentHub utilities
  window.StudentHub = window.StudentHub || {};

  /* --------------------------------------------------------------------------
     1. THEME SWITCHER (Light / Dark Mode)
     -------------------------------------------------------------------------- */
  const ThemeManager = {
    STORAGE_KEY: 'studenthub_theme',

    init() {
      // Determine initial theme: localStorage -> system preference -> 'light'
      const savedTheme = localStorage.getItem(this.STORAGE_KEY);
      const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

      this.applyTheme(initialTheme, false);
      this.ensureToggleButtons();
      this.bindEvents();

      // Listen for OS system theme changes if user hasn't explicitly chosen
      if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
          if (!localStorage.getItem(this.STORAGE_KEY)) {
            this.applyTheme(e.matches ? 'dark' : 'light', true);
          }
        });
      }
    },

    applyTheme(theme, showNotice = false) {
      const root = document.documentElement;
      root.setAttribute('data-theme', theme);
      localStorage.setItem(this.STORAGE_KEY, theme);

      // Update all toggle buttons in the document
      const toggleButtons = document.querySelectorAll('.theme-toggle-btn');
      toggleButtons.forEach((btn) => {
        const isDark = theme === 'dark';
        btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
        btn.setAttribute('title', isDark ? 'Switch to light theme' : 'Switch to dark theme');
        
        const iconSpan = btn.querySelector('.theme-toggle-icon');
        if (iconSpan) {
          iconSpan.textContent = isDark ? '☀️' : '🌙';
        }

        const textSpan = btn.querySelector('.theme-toggle-text');
        if (textSpan) {
          textSpan.textContent = isDark ? 'Light Mode' : 'Dark Mode';
        }
      });

      // Dispatch custom event for listeners
      document.dispatchEvent(new CustomEvent('studenthub:themechange', { detail: { theme } }));

      if (showNotice && window.StudentHub.toast) {
        window.StudentHub.toast(
          `Theme changed to ${theme === 'dark' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}`,
          'info',
          2500
        );
      }
    },

    toggle() {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      this.applyTheme(newTheme, true);
    },

    ensureToggleButtons() {
      // If no theme toggle exists in the header, inject one automatically
      const headerInner = document.querySelector('.site-header .header-inner');
      const navToggle = document.querySelector('.nav-toggle');

      if (headerInner && !document.querySelector('.theme-toggle-btn')) {
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'theme-toggle-btn';
        toggleBtn.setAttribute('aria-label', 'Toggle theme');
        toggleBtn.innerHTML = `
          <span class="theme-toggle-icon" aria-hidden="true">🌙</span>
          <span class="sr-only">Toggle theme</span>
        `;

        if (navToggle) {
          // Wrap toggle and navToggle in header-actions container if not present
          let headerActions = headerInner.querySelector('.header-actions');
          if (!headerActions) {
            headerActions = document.createElement('div');
            headerActions.className = 'header-actions';
            navToggle.parentNode.insertBefore(headerActions, navToggle);
            headerActions.appendChild(toggleBtn);
            headerActions.appendChild(navToggle);
          } else {
            headerActions.insertBefore(toggleBtn, navToggle);
          }
        } else {
          headerInner.appendChild(toggleBtn);
        }

        // Re-sync icon with active theme
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const iconSpan = toggleBtn.querySelector('.theme-toggle-icon');
        if (iconSpan) {
          iconSpan.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
        }
      }
    },

    bindEvents() {
      document.addEventListener('click', (e) => {
        const targetBtn = e.target.closest('.theme-toggle-btn');
        if (targetBtn) {
          e.preventDefault();
          this.toggle();
        }
      });
    }
  };

  /* --------------------------------------------------------------------------
     2. HAMBURGER MENU & MOBILE NAVIGATION
     -------------------------------------------------------------------------- */
  const HamburgerMenu = {
    init() {
      const navToggle = document.querySelector('.nav-toggle');
      const navMenu = document.querySelector('.nav-menu');

      if (!navToggle || !navMenu) return;

      // Create backdrop overlay for mobile menu if not exists
      let backdrop = document.querySelector('.nav-backdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'nav-backdrop';
        backdrop.setAttribute('aria-hidden', 'true');
        document.body.appendChild(backdrop);
      }

      const openMenu = () => {
        navToggle.classList.add('is-active');
        navToggle.setAttribute('aria-expanded', 'true');
        navMenu.classList.add('is-active');
        backdrop.classList.add('is-active');
        document.body.classList.add('nav-open');

        // Focus first navigation link
        const firstLink = navMenu.querySelector('a');
        if (firstLink) firstLink.focus();
      };

      const closeMenu = () => {
        if (!navMenu.classList.contains('is-active')) return;
        navToggle.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-active');
        backdrop.classList.remove('is-active');
        document.body.classList.remove('nav-open');
      };

      const toggleMenu = () => {
        const isOpen = navMenu.classList.contains('is-active');
        if (isOpen) {
          closeMenu();
          navToggle.focus();
        } else {
          openMenu();
        }
      };

      // Toggle click
      navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
      });

      // Backdrop click closes menu
      backdrop.addEventListener('click', () => {
        closeMenu();
        navToggle.focus();
      });

      // Close when clicking outside menu and toggle
      document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('is-active')) {
          closeMenu();
        }
      });

      // Close on navigation link click (on mobile)
      navMenu.addEventListener('click', (e) => {
        if (e.target.closest('a')) {
          closeMenu();
        }
      });

      // Escape key closes mobile navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('is-active')) {
          closeMenu();
          navToggle.focus();
        }
      });

      // Auto-close on viewport resize to desktop
      window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024 && navMenu.classList.contains('is-active')) {
          closeMenu();
        }
      });
    }
  };

  /* --------------------------------------------------------------------------
     3. NOTIFICATION BANNER & TOAST NOTIFICATION SYSTEM
     -------------------------------------------------------------------------- */
  const NotificationManager = {
    STORAGE_KEY: 'studenthub_banner_dismissed',

    init() {
      this.initBanner();
      this.initToastContainer();
    },

    initBanner() {
      const banner = document.querySelector('.notification-banner');
      if (!banner) return;

      const isDismissed = localStorage.getItem(this.STORAGE_KEY) === 'true';
      if (isDismissed) {
        banner.classList.add('is-dismissed');
      }

      // Banner close button
      const closeBtn = banner.querySelector('.banner-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.dismissBanner(banner);
        });
      }

      // Listen for restore banner triggers
      document.addEventListener('click', (e) => {
        const restoreTrigger = e.target.closest('[data-banner-restore]');
        if (restoreTrigger) {
          e.preventDefault();
          this.restoreBanner(banner);
        }
      });
    },

    dismissBanner(banner) {
      if (!banner) return;
      banner.classList.add('is-dismissed');
      localStorage.setItem(this.STORAGE_KEY, 'true');
      
      if (window.StudentHub.toast) {
        window.StudentHub.toast('Announcement banner dismissed. You can reopen it anytime.', 'info', 3000);
      }
    },

    restoreBanner(banner) {
      const targetBanner = banner || document.querySelector('.notification-banner');
      if (!targetBanner) return;
      targetBanner.classList.remove('is-dismissed');
      localStorage.removeItem(this.STORAGE_KEY);
      
      if (window.StudentHub.toast) {
        window.StudentHub.toast('Announcement banner restored.', 'success', 2500);
      }
    },

    initToastContainer() {
      let container = document.getElementById('toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        container.setAttribute('aria-live', 'polite');
        container.setAttribute('aria-atomic', 'true');
        document.body.appendChild(container);
      }
      this.toastContainer = container;
    },

    createToast(message, type = 'info', duration = 4000, title = '') {
      if (!this.toastContainer) this.initToastContainer();

      const icons = {
        success: '&#10004;',
        warning: '&#9888;',
        danger: '&#10006;',
        info: '&#8505;'
      };

      const defaultTitles = {
        success: 'Success',
        warning: 'Notice',
        danger: 'Alert',
        info: 'StudentHub Notification'
      };

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.setAttribute('role', 'status');

      toast.innerHTML = `
        <span class="toast-icon" aria-hidden="true">${icons[type] || icons.info}</span>
        <div class="toast-content">
          <div class="toast-title">${title || defaultTitles[type] || 'Notification'}</div>
          <p class="toast-message">${message}</p>
        </div>
        <button class="toast-close" aria-label="Close notification">&times;</button>
        <div class="toast-progress" style="animation-duration: ${duration}ms;"></div>
      `;

      this.toastContainer.appendChild(toast);

      const closeToast = () => {
        toast.classList.add('is-hiding');
        setTimeout(() => {
          if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 250);
      };

      toast.querySelector('.toast-close').addEventListener('click', closeToast);

      // Auto-dismiss after duration
      const timer = setTimeout(closeToast, duration);

      // Pause on hover
      toast.addEventListener('mouseenter', () => {
        clearTimeout(timer);
        const progress = toast.querySelector('.toast-progress');
        if (progress) progress.style.animationPlayState = 'paused';
      });

      toast.addEventListener('mouseleave', () => {
        const progress = toast.querySelector('.toast-progress');
        if (progress) progress.style.animationPlayState = 'running';
        setTimeout(closeToast, 1500);
      });
    }
  };

  // Expose toast method on global StudentHub object
  window.StudentHub.toast = (message, type, duration, title) => {
    NotificationManager.createToast(message, type, duration, title);
  };
  window.StudentHub.banner = {
    dismiss: () => NotificationManager.dismissBanner(),
    restore: () => NotificationManager.restoreBanner()
  };

  /* --------------------------------------------------------------------------
     4. ACCESSIBLE MODAL POPUP SYSTEM
     -------------------------------------------------------------------------- */
  const ModalManager = {
    activeModal: null,
    previousFocusedElement: null,

    init() {
      // Bind trigger buttons with [data-modal-target]
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-modal-target]');
        if (trigger) {
          e.preventDefault();
          const targetSelector = trigger.getAttribute('data-modal-target');
          this.open(targetSelector, trigger);
        }

        // Close triggers with [data-modal-close]
        const closeTrigger = e.target.closest('[data-modal-close]');
        if (closeTrigger) {
          e.preventDefault();
          this.close(this.activeModal);
        }
      });

      // Backdrop click closes modal
      document.addEventListener('click', (e) => {
        if (this.activeModal && e.target === this.activeModal) {
          this.close(this.activeModal);
        }
      });

      // Close modal on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.activeModal) {
          this.close(this.activeModal);
        }

        // Focus trap inside modal
        if (e.key === 'Tab' && this.activeModal) {
          this.trapFocus(e);
        }
      });
    },

    open(modalSelectorOrElement, triggerElement = null) {
      const modal = typeof modalSelectorOrElement === 'string'
        ? (document.querySelector(modalSelectorOrElement) || document.getElementById(modalSelectorOrElement.replace(/^#/, '')))
        : modalSelectorOrElement;

      if (!modal) return;

      this.previousFocusedElement = triggerElement || document.activeElement;
      this.activeModal = modal;

      modal.classList.add('is-active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');

      // Focus first interactive element inside modal or close button
      const focusable = this.getFocusableElements(modal);
      if (focusable.length > 0) {
        setTimeout(() => focusable[0].focus(), 50);
      }
    },

    close(modalElement) {
      const modal = modalElement || this.activeModal;
      if (!modal) return;

      modal.classList.remove('is-active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');

      // Restore focus to previous trigger
      if (this.previousFocusedElement && typeof this.previousFocusedElement.focus === 'function') {
        this.previousFocusedElement.focus();
      }

      this.activeModal = null;
      this.previousFocusedElement = null;
    },

    getFocusableElements(container) {
      const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      return Array.from(container.querySelectorAll(selector)).filter(
        el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')
      );
    },

    trapFocus(e) {
      const focusable = this.getFocusableElements(this.activeModal);
      if (focusable.length === 0) return;

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  window.StudentHub.modal = {
    open: (target, trigger) => ModalManager.open(target, trigger),
    close: (target) => ModalManager.close(target)
  };

  /* --------------------------------------------------------------------------
     5. IMAGE & CONTENT SLIDER (Carousel)
     -------------------------------------------------------------------------- */
  class ContentSlider {
    constructor(container) {
      this.container = container;
      this.track = container.querySelector('.slider-track');
      this.slides = Array.from(container.querySelectorAll('.slide, .slider-slide'));
      this.prevBtn = container.querySelector('.slider-btn-prev');
      this.nextBtn = container.querySelector('.slider-btn-next');
      this.dotsContainer = container.querySelector('.slider-dots');
      this.counterCurrent = container.querySelector('.slider-counter-current');
      this.counterTotal = container.querySelector('.slider-counter-total');
      this.playToggleBtn = container.querySelector('.slider-play-toggle');

      this.currentIndex = 0;
      this.totalSlides = this.slides.length;
      this.autoplayDelay = parseInt(container.getAttribute('data-autoplay-delay'), 10) || 5000;
      this.isPlaying = true;
      this.timer = null;

      // Touch swipe tracking
      this.touchStartX = 0;
      this.touchEndX = 0;

      if (this.totalSlides === 0) return;

      this.init();
    }

    init() {
      // Initialize counter
      if (this.counterTotal) {
        this.counterTotal.textContent = String(this.totalSlides).padStart(2, '0');
      }

      // Generate dots if container exists and is empty
      if (this.dotsContainer && this.dotsContainer.children.length === 0) {
        this.slides.forEach((_, i) => {
          const dot = document.createElement('button');
          dot.type = 'button';
          dot.className = `slider-dot ${i === 0 ? 'is-active' : ''}`;
          dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
          dot.addEventListener('click', () => {
            this.goTo(i);
            this.restartAutoplay();
          });
          this.dotsContainer.appendChild(dot);
        });
      }

      this.updateState();
      this.bindEvents();
      this.startAutoplay();
    }

    bindEvents() {
      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', () => {
          this.prev();
          this.restartAutoplay();
        });
      }

      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', () => {
          this.next();
          this.restartAutoplay();
        });
      }

      if (this.playToggleBtn) {
        this.playToggleBtn.addEventListener('click', () => {
          this.togglePlay();
        });
      }

      // Pause autoplay on mouse hover or focus
      this.container.addEventListener('mouseenter', () => this.pauseAutoplay());
      this.container.addEventListener('mouseleave', () => {
        if (this.isPlaying) this.startAutoplay();
      });

      this.container.addEventListener('focusin', () => this.pauseAutoplay());
      this.container.addEventListener('focusout', () => {
        if (this.isPlaying) this.startAutoplay();
      });

      // Keyboard arrow navigation when container has focus
      this.container.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.prev();
          this.restartAutoplay();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.next();
          this.restartAutoplay();
        }
      });

      // Touch gestures for mobile
      this.container.addEventListener('touchstart', (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      this.container.addEventListener('touchend', (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
      }, { passive: true });
    }

    handleSwipe() {
      const threshold = 40;
      const diff = this.touchStartX - this.touchEndX;
      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          this.next();
        } else {
          this.prev();
        }
        this.restartAutoplay();
      }
    }

    goTo(index) {
      if (index < 0) {
        this.currentIndex = this.totalSlides - 1;
      } else if (index >= this.totalSlides) {
        this.currentIndex = 0;
      } else {
        this.currentIndex = index;
      }
      this.updateState();
    }

    next() {
      this.goTo(this.currentIndex + 1);
    }

    prev() {
      this.goTo(this.currentIndex - 1);
    }

    updateState() {
      // Slide transform
      if (this.track) {
        this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
      }

      // Update ARIA and active class on slides
      this.slides.forEach((slide, i) => {
        const isActive = i === this.currentIndex;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', !isActive);
      });

      // Update dots
      if (this.dotsContainer) {
        const dots = this.dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, i) => {
          dot.classList.toggle('is-active', i === this.currentIndex);
          dot.setAttribute('aria-current', i === this.currentIndex ? 'true' : 'false');
        });
      }

      // Update counter
      if (this.counterCurrent) {
        this.counterCurrent.textContent = String(this.currentIndex + 1).padStart(2, '0');
      }
    }

    startAutoplay() {
      this.pauseAutoplay();
      this.timer = setInterval(() => {
        this.next();
      }, this.autoplayDelay);
    }

    pauseAutoplay() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }

    restartAutoplay() {
      if (this.isPlaying) {
        this.startAutoplay();
      }
    }

    togglePlay() {
      this.isPlaying = !this.isPlaying;
      if (this.isPlaying) {
        this.startAutoplay();
        if (this.playToggleBtn) {
          this.playToggleBtn.innerHTML = '<span>&#10074;&#10074;</span> Pause';
          this.playToggleBtn.setAttribute('aria-label', 'Pause slideshow autoplay');
        }
        window.StudentHub.toast('Autoplay resumed', 'info', 2000);
      } else {
        this.pauseAutoplay();
        if (this.playToggleBtn) {
          this.playToggleBtn.innerHTML = '<span>&#9658;</span> Play';
          this.playToggleBtn.setAttribute('aria-label', 'Start slideshow autoplay');
        }
        window.StudentHub.toast('Autoplay paused', 'info', 2000);
      }
    }
  }

  /* --------------------------------------------------------------------------
     6. COLLAPSIBLE FAQ ACCORDION WITH LIVE SEARCH & CATEGORY FILTERS
     -------------------------------------------------------------------------- */
  const FAQManager = {
    init() {
      const faqWrappers = document.querySelectorAll('.faq-accordion-container, .faq-list');
      if (faqWrappers.length === 0) return;

      faqWrappers.forEach((wrapper) => {
        this.enhanceFAQ(wrapper);
      });
    },

    enhanceFAQ(container) {
      // 1. Transform any native details into accessible accordions or wire them up
      const detailsElements = container.querySelectorAll('details.faq-item');
      if (detailsElements.length > 0) {
        this.wireNativeDetails(container, detailsElements);
      }

      // 2. Wire custom .faq-accordion-item elements
      const customItems = container.querySelectorAll('.faq-accordion-item');
      if (customItems.length > 0) {
        this.wireCustomAccordion(container, customItems);
      }

      // 3. Wire Search input if present
      const searchInput = container.querySelector('.faq-search-input') || document.querySelector('.faq-search-input');
      const clearSearchBtn = container.querySelector('.faq-clear-search') || document.querySelector('.faq-clear-search');
      const categoryButtons = document.querySelectorAll('.faq-cat-btn');
      const countBadge = container.querySelector('.faq-count-badge') || document.querySelector('.faq-count-badge');
      const noResultsBox = container.querySelector('.faq-no-results') || document.querySelector('.faq-no-results');

      let currentCategory = 'all';
      let currentQuery = '';

      const filterItems = () => {
        const items = container.querySelectorAll('.faq-accordion-item, details.faq-item');
        let visibleCount = 0;

        items.forEach((item) => {
          const headerText = (item.querySelector('.faq-accordion-header, summary') || {}).textContent || '';
          const bodyText = (item.querySelector('.faq-accordion-body, p') || {}).textContent || '';
          const combined = (headerText + ' ' + bodyText).toLowerCase();
          const category = (item.getAttribute('data-category') || 'general').toLowerCase();

          const matchesSearch = !currentQuery || combined.includes(currentQuery.toLowerCase());
          const matchesCategory = currentCategory === 'all' || category === currentCategory.toLowerCase();

          if (matchesSearch && matchesCategory) {
            item.style.display = '';
            visibleCount++;
          } else {
            item.style.display = 'none';
          }
        });

        if (countBadge) {
          countBadge.textContent = `Showing ${visibleCount} of ${items.length} questions`;
        }

        if (noResultsBox) {
          noResultsBox.classList.toggle('is-visible', visibleCount === 0);
        }

        if (clearSearchBtn) {
          clearSearchBtn.classList.toggle('is-visible', Boolean(currentQuery));
        }
      };

      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          currentQuery = e.target.value.trim();
          filterItems();
        });
      }

      if (clearSearchBtn && searchInput) {
        clearSearchBtn.addEventListener('click', () => {
          searchInput.value = '';
          currentQuery = '';
          filterItems();
          searchInput.focus();
        });
      }

      if (categoryButtons.length > 0) {
        categoryButtons.forEach((btn) => {
          btn.addEventListener('click', () => {
            categoryButtons.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            currentCategory = btn.getAttribute('data-category') || 'all';
            filterItems();
          });
        });
      }

      // Wire Expand All / Collapse All buttons
      const expandAllBtn = document.querySelector('[data-faq-action="expand-all"]');
      const collapseAllBtn = document.querySelector('[data-faq-action="collapse-all"]');

      if (expandAllBtn) {
        expandAllBtn.addEventListener('click', () => {
          container.querySelectorAll('.faq-accordion-item').forEach(item => {
            item.classList.add('is-open');
            const btn = item.querySelector('.faq-accordion-header');
            if (btn) btn.setAttribute('aria-expanded', 'true');
          });
          container.querySelectorAll('details.faq-item').forEach(details => {
            details.open = true;
          });
        });
      }

      if (collapseAllBtn) {
        collapseAllBtn.addEventListener('click', () => {
          container.querySelectorAll('.faq-accordion-item').forEach(item => {
            item.classList.remove('is-open');
            const btn = item.querySelector('.faq-accordion-header');
            if (btn) btn.setAttribute('aria-expanded', 'false');
          });
          container.querySelectorAll('details.faq-item').forEach(details => {
            details.open = false;
          });
        });
      }
    },

    wireNativeDetails(container, detailsElements) {
      detailsElements.forEach((details) => {
        const summary = details.querySelector('summary');
        if (!summary) return;

        summary.addEventListener('click', (e) => {
          // Accordion mode: close other details if container has data-accordion="true"
          if (container.getAttribute('data-accordion') === 'true') {
            detailsElements.forEach((other) => {
              if (other !== details) {
                other.open = false;
              }
            });
          }
        });
      });
    },

    wireCustomAccordion(container, items) {
      const isSingleOpen = container.getAttribute('data-accordion') === 'true';

      items.forEach((item, index) => {
        const headerBtn = item.querySelector('.faq-accordion-header');
        const content = item.querySelector('.faq-accordion-content');
        if (!headerBtn || !content) return;

        // Ensure unique IDs for ARIA linkage
        const headerId = headerBtn.id || `faq-header-${index}`;
        const contentId = content.id || `faq-content-${index}`;
        headerBtn.id = headerId;
        content.id = contentId;
        headerBtn.setAttribute('aria-controls', contentId);
        content.setAttribute('aria-labelledby', headerId);
        content.setAttribute('role', 'region');

        const isOpen = item.classList.contains('is-open');
        headerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

        headerBtn.addEventListener('click', () => {
          const willOpen = !item.classList.contains('is-open');

          if (isSingleOpen && willOpen) {
            items.forEach((otherItem) => {
              if (otherItem !== item) {
                otherItem.classList.remove('is-open');
                const otherBtn = otherItem.querySelector('.faq-accordion-header');
                if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
              }
            });
          }

          item.classList.toggle('is-open', willOpen);
          headerBtn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        });

        // Keyboard arrow navigation
        headerBtn.addEventListener('keydown', (e) => {
          const headers = Array.from(container.querySelectorAll('.faq-accordion-header'));
          const currIdx = headers.indexOf(headerBtn);

          if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = headers[(currIdx + 1) % headers.length];
            if (next) next.focus();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prev = headers[(currIdx - 1 + headers.length) % headers.length];
            if (prev) prev.focus();
          } else if (e.key === 'Home') {
            e.preventDefault();
            headers[0].focus();
          } else if (e.key === 'End') {
            e.preventDefault();
            headers[headers.length - 1].focus();
          }
        });
      });
    }
  };

  /* --------------------------------------------------------------------------
     INITIALIZATION ON DOMContentLoaded
     -------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Theme Switcher
    ThemeManager.init();

    // 2. Initialize Hamburger Menu
    HamburgerMenu.init();

    // 3. Initialize Notification Banner & Toast System
    NotificationManager.init();

    // 4. Initialize Modals
    ModalManager.init();

    // 5. Initialize Content Sliders
    const sliderContainers = document.querySelectorAll('.slider-container');
    sliderContainers.forEach(container => new ContentSlider(container));

    // 6. Initialize Collapsible FAQ
    FAQManager.init();
  });

})();
