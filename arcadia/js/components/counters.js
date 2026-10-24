// @ts-check
(function (A) {
  const { config, dom } = A;

  function init() {
    const { gsap } = window;
    dom.qsa(config.selectors.counter).forEach((el) => {
      const target = Number(/** @type {HTMLElement} */ (el).dataset.countTo);
      if (!Number.isFinite(target)) return;

      const state = { value: 0 };
      el.textContent = "0";
      gsap.to(state, {
        value: target,
        duration: config.counters.duration,
        ease: config.ease.soft,
        scrollTrigger: { trigger: el, start: config.counters.start, once: true },
        onUpdate: () => {
          el.textContent = String(Math.round(state.value));
        },
      });
    });
  }

  A.modules.counters = Object.freeze({ init });
})(window.Arcadia);
