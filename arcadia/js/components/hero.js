// @ts-check
(function (A) {
  const { config, dom } = A;
  const { selectors: sel, classes, hero: timing, ease } = config;

  function intro() {
    const { gsap, SplitText } = window;
    const title = dom.qs(sel.heroTitle);
    const eyebrow = dom.qs(sel.heroEyebrow);
    const sub = dom.qs(sel.heroSub);
    const actions = dom.qs(sel.heroActions);
    const footer = dom.qs(sel.heroFooter);
    if (!title || !eyebrow || !sub || !actions || !footer) return;

    const split = SplitText.create(title, { type: "lines", mask: "lines", linesClass: classes.splitLine });
    dom.reveal([title, eyebrow, sub, actions, footer]);

    gsap
      .timeline({ onComplete: () => split.revert() })
      .from(split.lines, {
        yPercent: 115,
        duration: timing.lineDuration,
        stagger: timing.lineStagger,
        ease: ease.out,
      })
      .from(eyebrow, { autoAlpha: 0, y: 16, duration: 1, ease: ease.soft }, 0.1)
      .from([sub, actions], { autoAlpha: 0, y: 28, duration: 1.1, stagger: 0.12, ease: ease.out }, "-=0.95")
      .from(footer, { autoAlpha: 0, duration: 1, ease: ease.soft }, "-=0.8");
  }

  function scrollEffects() {
    const { gsap } = window;
    const hero = dom.qs(sel.hero);
    const media = dom.qs(sel.heroMedia);
    const content = dom.qs(sel.heroContent);
    if (!hero || !media || !content) return;

    const scrub = { trigger: hero, start: "top top", end: "bottom top", scrub: true };
    gsap.to(media, { scale: timing.mediaScrollScale, ease: "none", scrollTrigger: scrub });
    gsap.to(content, { yPercent: timing.contentScrollShiftPercent, opacity: 0, ease: "none", scrollTrigger: scrub });
  }

  /**
   * Swaps the still for the reel loop once a video file exists at data-src.
   * A missing file is the expected state until footage arrives, so failure is silent.
   */
  function loadVideo() {
    const video = /** @type {HTMLVideoElement | null} */ (dom.qs(sel.heroVideo));
    if (!video || dom.matches(config.breakpoints.reducedMotion)) return;
    const src = video.dataset.src;
    if (!src) return;

    video.addEventListener("error", () => video.remove(), { once: true });
    video.addEventListener(
      "canplay",
      () => {
        video
          .play()
          .then(() => video.classList.add(classes.videoPlaying))
          .catch(() => video.remove());
      },
      { once: true },
    );
    video.src = src;
    video.load();
  }

  A.modules.hero = Object.freeze({ intro, scrollEffects, loadVideo });
})(window.Arcadia);
