// @ts-check
(function (A) {
  const { config, dom } = A;
  const { selectors: sel, classes, cursor: cursorConfig } = config;

  function init() {
    if (!dom.matches(config.breakpoints.finePointer)) return;
    const follower = dom.qs(sel.cursorFollower);
    const label = dom.qs(sel.cursorLabel);
    if (!follower || !label) return;

    const { gsap } = window;
    document.documentElement.classList.add(classes.hasCursor);
    follower.classList.add(classes.cursorHidden);

    const xTo = gsap.quickTo(follower, "x", { duration: cursorConfig.followDuration, ease: "power3" });
    const yTo = gsap.quickTo(follower, "y", { duration: cursorConfig.followDuration, ease: "power3" });

    window.addEventListener(
      "pointermove",
      (event) => {
        xTo(event.clientX);
        yTo(event.clientY);
      },
      { passive: true },
    );

    document.addEventListener("pointerover", (event) => {
      const target = /** @type {HTMLElement | null} */ (/** @type {Element} */ (event.target).closest(sel.cursorTarget));
      if (!target) return;
      label.textContent = target.dataset.cursor || cursorConfig.defaultLabel;
      follower.classList.remove(classes.cursorHidden);
      follower.classList.add(classes.cursorActive);
    });

    document.addEventListener("pointerout", (event) => {
      const from = /** @type {Element} */ (event.target).closest(sel.cursorTarget);
      const to = /** @type {Element | null} */ (event.relatedTarget)?.closest?.(sel.cursorTarget);
      if (from && from !== to) {
        follower.classList.remove(classes.cursorActive);
        follower.classList.add(classes.cursorHidden);
      }
    });
  }

  A.modules.cursor = Object.freeze({ init });
})(window.Arcadia);
