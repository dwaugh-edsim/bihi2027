// @ts-check
(function (A) {
  const { config, dom } = A;
  const { selectors: sel, classes, reveal: timing, scrubWords, ease } = config;

  function lines() {
    const { gsap, SplitText } = window;
    dom.qsa(sel.revealLines).forEach((el) => {
      const split = SplitText.create(el, { type: "lines", mask: "lines", linesClass: classes.splitLine });
      dom.reveal(el);
      gsap.from(split.lines, {
        yPercent: 115,
        duration: timing.lineDuration,
        stagger: timing.lineStagger,
        ease: ease.out,
        scrollTrigger: { trigger: el, start: timing.start, once: true },
        onComplete: () => split.revert(),
      });
    });
  }

  function fades() {
    const { gsap } = window;
    dom.qsa(sel.revealFade).forEach((el) => {
      dom.reveal(el);
      gsap.from(el, {
        autoAlpha: 0,
        y: timing.fadeDistancePx,
        duration: timing.fadeDuration,
        ease: ease.out,
        scrollTrigger: { trigger: el, start: timing.start, once: true },
      });
    });
  }

  function staggers() {
    const { gsap } = window;
    dom.qsa(sel.revealStagger).forEach((group) => {
      const children = Array.from(group.children);
      dom.reveal(children);
      gsap.from(children, {
        autoAlpha: 0,
        y: timing.fadeDistancePx,
        duration: timing.fadeDuration,
        stagger: timing.groupStagger,
        ease: ease.out,
        scrollTrigger: { trigger: group, start: timing.start, once: true },
      });
    });
  }

  function scrub() {
    const { gsap, SplitText } = window;
    dom.qsa(sel.scrubWords).forEach((el) => {
      const split = SplitText.create(el, { type: "words" });
      gsap.fromTo(
        split.words,
        { opacity: scrubWords.dimOpacity },
        {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: el, start: scrubWords.start, end: scrubWords.end, scrub: true },
        },
      );
    });
  }

  function init() {
    lines();
    fades();
    staggers();
    scrub();
  }

  A.modules.reveals = Object.freeze({ init });
})(window.Arcadia);
