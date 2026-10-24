// @ts-check
(function (A) {
  const { config, dom } = A;
  const { selectors: sel, marquee: timing } = config;

  function init() {
    const { gsap, ScrollTrigger } = window;
    dom.qsa(sel.marquee).forEach((marquee) => {
      const track = dom.qs(sel.marqueeTrack, marquee);
      if (!track || track.children.length === 0) return;

      Array.from(track.children).forEach((item) => {
        const clone = /** @type {Element} */ (item.cloneNode(true));
        clone.setAttribute("aria-hidden", "true");
        track.appendChild(clone);
      });

      const loop = gsap.to(track, { xPercent: -50, duration: timing.secondsPerLoop, ease: "none", repeat: -1 });

      ScrollTrigger.create({
        trigger: marquee,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
        onUpdate: (self) => {
          const boost = gsap.utils.clamp(1, timing.maxBoost, 1 + Math.abs(self.getVelocity()) / timing.velocityDivisor);
          gsap.to(loop, {
            timeScale: boost,
            duration: 0.2,
            overwrite: true,
            onComplete: () => {
              gsap.to(loop, { timeScale: 1, duration: timing.settleDuration });
            },
          });
        },
      });
    });
  }

  A.modules.marquee = Object.freeze({ init });
})(window.Arcadia);
