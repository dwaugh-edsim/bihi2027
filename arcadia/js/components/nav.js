// @ts-check
(function (A) {
  const { config, dom } = A;
  const { selectors: sel, classes, nav: navConfig, breakpoints } = config;

  let lastY = 0;
  let menuOpen = false;

  function init() {
    const nav = dom.qs(sel.nav);
    if (!nav) return;
    const progress = /** @type {HTMLElement | null} */ (dom.qs(sel.scrollProgress));

    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      nav.classList.toggle(classes.navScrolled, y > navConfig.scrolledAfterPx);
      nav.classList.toggle(classes.navHidden, !menuOpen && y > lastY && y > navConfig.hideAfterPx);
      if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
      lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    initMenu();
  }

  function initMenu() {
    const toggle = /** @type {HTMLButtonElement | null} */ (dom.qs(sel.menuToggle));
    const menu = /** @type {HTMLElement | null} */ (dom.qs(sel.menu));
    if (!toggle || !menu) return;
    const links = dom.qsa(sel.menuLink, menu);

    const setOpen = (/** @type {boolean} */ open) => {
      menuOpen = open;
      menu.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle(classes.menuOpen, open);
      if (open) {
        A.scroll.stop();
        animateIn(links);
        /** @type {HTMLElement} */ (links[0])?.focus();
      } else {
        A.scroll.start();
      }
    };

    toggle.addEventListener("click", () => setOpen(!menuOpen));
    links.forEach((link) => link.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuOpen) {
        setOpen(false);
        toggle.focus();
      }
    });
    window.matchMedia(breakpoints.desktop).addEventListener("change", (event) => {
      if (event.matches && menuOpen) setOpen(false);
    });
  }

  /** @param {Element[]} links */
  function animateIn(links) {
    if (!dom.motionEnabled()) return;
    window.gsap.from(links, {
      yPercent: 60,
      autoAlpha: 0,
      duration: 0.8,
      stagger: 0.05,
      ease: config.ease.out,
    });
  }

  A.modules.nav = Object.freeze({ init });
})(window.Arcadia);
