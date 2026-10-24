// @ts-check
(function (A) {
  const { config, dom } = A;
  const { selectors: sel, media: timing } = config;

  const CLIP_OPEN = "inset(0% 0% 0% 0%)";
  const PARALLAX_HEADROOM_SCALE = 1.18;

  function init() {
    const { gsap } = window;
    dom.qsa(sel.showMedia).forEach((frame) => {
      gsap.to(frame, {
        clipPath: CLIP_OPEN,
        duration: timing.revealDuration,
        ease: config.ease.inOut,
        scrollTrigger: { trigger: frame, start: timing.start, once: true },
      });

      const image = dom.qs(sel.showImage, frame);
      if (!image) return;
      gsap.fromTo(
        image,
        { yPercent: -timing.parallaxPercent, scale: PARALLAX_HEADROOM_SCALE },
        {
          yPercent: timing.parallaxPercent,
          ease: "none",
          scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });
  }

  A.modules.mediaReveal = Object.freeze({ init });
})(window.Arcadia);
