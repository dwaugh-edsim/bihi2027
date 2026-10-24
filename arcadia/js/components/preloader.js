// @ts-check
(function (A) {
  const { config, dom } = A;
  const { selectors: sel, classes, preloader: timing, ease } = config;

  /**
   * Plays the first-visit curtain. Resolves when the curtain starts lifting
   * so the hero intro can overlap it.
   * @returns {Promise<void>}
   */
  function play() {
    const root = document.documentElement;
    const el = dom.qs(sel.preloader);
    const word = dom.qs(sel.preloaderWord);
    const meta = dom.qs(sel.preloaderMeta);
    if (!root.classList.contains(classes.intro) || !el || !word || !meta) {
      return Promise.resolve();
    }

    try {
      sessionStorage.setItem(config.storage.introSeenKey, "1");
    } catch (e) {
      /* storage unavailable (private mode); the intro will simply replay */
    }

    const { gsap, SplitText } = window;
    const split = SplitText.create(word, { type: "chars", mask: "chars" });
    dom.reveal([word, meta]);
    A.scroll.stop();

    return new Promise((resolve) => {
      gsap
        .timeline({
          onComplete() {
            root.classList.remove(classes.intro);
            split.revert();
            A.scroll.start();
          },
        })
        .from(split.chars, {
          yPercent: 110,
          duration: timing.letterDuration,
          stagger: timing.letterStagger,
          ease: ease.out,
        })
        .from(meta, { autoAlpha: 0, y: 12, duration: 0.6, ease: ease.soft }, "<0.3")
        .addLabel("lift", `+=${timing.holdSeconds}`)
        .to(el, { yPercent: -100, duration: timing.liftDuration, ease: ease.inOut }, "lift")
        .call(resolve, [], `lift+=${timing.liftDuration * 0.35}`);
    });
  }

  A.modules.preloader = Object.freeze({ play });
})(window.Arcadia);
