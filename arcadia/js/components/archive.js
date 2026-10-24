// @ts-check
(function (A) {
  const { config, dom } = A;
  const { selectors: sel, classes } = config;

  function init() {
    const { gsap } = window;
    const pin = dom.qs(sel.archivePin);
    const viewport = dom.qs(sel.archiveViewport);
    const track = /** @type {HTMLElement | null} */ (dom.qs(sel.archiveTrack));
    const progress = dom.qs(sel.archiveProgress);
    if (!pin || !viewport || !track || !progress) return;

    const prevBtn = dom.qs("[data-archive-prev]");
    const nextBtn = dom.qs("[data-archive-next]");

    const mm = gsap.matchMedia();

    mm.add(config.breakpoints.desktop, () => {
      viewport.classList.add(classes.archivePinned);
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const scrollSpan = () => Math.min(distance() * 0.5, 2600);

      const stTween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => `+=${scrollSpan()}`,
          pin: true,
          scrub: config.archive.scrubSmoothing,
          invalidateOnRefresh: true,
          onUpdate: (self) => gsap.set(progress, { scaleX: self.progress }),
        },
      });

      const onPrev = () => {
        const step = window.innerWidth * 0.65;
        const current = Number(gsap.getProperty(track, "x")) || 0;
        gsap.to(track, {
          x: Math.min(0, current + step),
          duration: 0.6,
          ease: "power2.out",
        });
      };

      const onNext = () => {
        const step = window.innerWidth * 0.65;
        const maxDist = distance();
        const current = Number(gsap.getProperty(track, "x")) || 0;
        gsap.to(track, {
          x: Math.max(-maxDist, current - step),
          duration: 0.6,
          ease: "power2.out",
        });
      };

      prevBtn?.addEventListener("click", onPrev);
      nextBtn?.addEventListener("click", onNext);

      return () => {
        viewport.classList.remove(classes.archivePinned);
        prevBtn?.removeEventListener("click", onPrev);
        nextBtn?.removeEventListener("click", onNext);
      };
    });

    mm.add(`not all and ${config.breakpoints.desktop}`, () => {
      const onScroll = () => {
        const max = viewport.scrollWidth - viewport.clientWidth;
        gsap.set(progress, { scaleX: max > 0 ? viewport.scrollLeft / max : 0 });
      };
      const onPrevMobile = () => viewport.scrollBy({ left: -window.innerWidth * 0.75, behavior: "smooth" });
      const onNextMobile = () => viewport.scrollBy({ left: window.innerWidth * 0.75, behavior: "smooth" });

      prevBtn?.addEventListener("click", onPrevMobile);
      nextBtn?.addEventListener("click", onNextMobile);
      viewport.addEventListener("scroll", onScroll, { passive: true });

      return () => {
        prevBtn?.removeEventListener("click", onPrevMobile);
        nextBtn?.removeEventListener("click", onNextMobile);
        viewport.removeEventListener("scroll", onScroll);
      };
    });
  }

  A.modules.archive = Object.freeze({ init });
})(window.Arcadia);
