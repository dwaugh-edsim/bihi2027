// @ts-check
(function (A) {
  const { config, dom } = A;

  function init() {
    const band = dom.qs(config.selectors.band);
    const image = band && dom.qs(config.selectors.bandImage, band);
    if (!band || !image) return;

    const shift = config.band.parallaxPercent;
    window.gsap.fromTo(
      image,
      { yPercent: -shift },
      {
        yPercent: shift,
        ease: "none",
        scrollTrigger: { trigger: band, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
  }

  A.modules.band = Object.freeze({ init });
})(window.Arcadia);
