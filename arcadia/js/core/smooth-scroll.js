// @ts-check
(function (A) {
  const { gsap, ScrollTrigger } = window;

  /** @type {any} */
  let lenis = null;

  function init() {
    if (typeof window.Lenis !== "function") return;

    lenis = new window.Lenis({
      duration: A.config.smoothScroll.duration,
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    document.addEventListener("click", onAnchorClick);
  }

  /** @param {MouseEvent} event */
  function onAnchorClick(event) {
    const target = /** @type {Element} */ (event.target);
    const link = target.closest('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute("href");
    if (!hash || hash === "#") return;
    const destination = document.querySelector(hash);
    if (!destination) return;

    event.preventDefault();
    scrollTo(destination);
    history.pushState(null, "", hash);
  }

  /** @param {Element | number} target */
  function scrollTo(target) {
    if (lenis) {
      lenis.scrollTo(target, { offset: A.config.smoothScroll.anchorOffsetPx });
    } else if (typeof target === "number") {
      window.scrollTo({ top: target });
    } else {
      target.scrollIntoView();
    }
  }

  function stop() {
    if (lenis) lenis.stop();
  }

  function start() {
    if (lenis) lenis.start();
  }

  A.scroll = Object.freeze({ init, scrollTo, stop, start });
})(window.Arcadia);
