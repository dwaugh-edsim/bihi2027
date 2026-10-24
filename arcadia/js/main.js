// @ts-check
(function (A) {
  const { config, dom } = A;
  const { classes } = config;
  const root = document.documentElement;
  const FONT_WAIT_LIMIT_MS = 2500;

  const hasGsap = Boolean(window.gsap && window.ScrollTrigger && window.SplitText);
  if (!hasGsap) root.classList.remove(classes.hasMotion, classes.intro);
  A.ready = true;

  /**
   * Error boundary: one failing module must not blank the page. If a motion
   * module throws, drop the pre-animation hidden states so content shows.
   * @template T
   * @param {string} name
   * @param {() => T} fn
   * @returns {T | undefined}
   */
  function safely(name, fn) {
    try {
      return fn();
    } catch (error) {
      console.error(`[arcadia] ${name} failed`, error);
      root.classList.remove(classes.hasMotion, classes.intro);
      return undefined;
    }
  }

  dom.qsa(config.selectors.year).forEach((el) => (el.textContent = String(new Date().getFullYear())));
  safely("nav", () => A.modules.nav.init());
  safely("video dialog", () => A.modules.videoDialog.init());
  safely("hero video", () => A.modules.hero.loadVideo());

  if (!dom.motionEnabled()) return;

  window.gsap.registerPlugin(window.ScrollTrigger, window.SplitText);
  safely("smooth scroll", () => A.scroll.init());

  const fontsReady = Promise.race([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise((resolve) => setTimeout(resolve, FONT_WAIT_LIMIT_MS)),
  ]);

  fontsReady.then(() => {
    const introDone = safely("preloader", () => A.modules.preloader.play()) || Promise.resolve();
    introDone.then(() => safely("hero intro", () => A.modules.hero.intro()));

    safely("hero scroll", () => A.modules.hero.scrollEffects());
    safely("reveals", () => A.modules.reveals.init());
    safely("counters", () => A.modules.counters.init());
    safely("marquee", () => A.modules.marquee.init());
    safely("media reveal", () => A.modules.mediaReveal.init());
    safely("archive", () => A.modules.archive.init());
    safely("band", () => A.modules.band.init());
    safely("cursor", () => A.modules.cursor.init());

    window.ScrollTrigger.refresh();
  });
})(window.Arcadia);
