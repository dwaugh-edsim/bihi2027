// @ts-check
/**
 * Central tuning for every animation and behaviour on the site.
 * Change feel here rather than inside components.
 */
(function () {
  const boot = /** @type {{introKey: string, failsafeMs: number}} */ (window.ArcadiaBoot);

  window.Arcadia = {
    ready: false,
    modules: {},
    config: Object.freeze({
      storage: Object.freeze({
        introSeenKey: boot.introKey,
      }),

      breakpoints: Object.freeze({
        desktop: "(min-width: 861px)",
        finePointer: "(hover: hover) and (pointer: fine)",
        reducedMotion: "(prefers-reduced-motion: reduce)",
      }),

      ease: Object.freeze({
        out: "expo.out",
        inOut: "power3.inOut",
        soft: "power2.out",
      }),

      smoothScroll: Object.freeze({
        duration: 1.15,
        anchorOffsetPx: 0,
      }),

      preloader: Object.freeze({
        letterStagger: 0.05,
        letterDuration: 1.1,
        holdSeconds: 0.35,
        liftDuration: 1.1,
      }),

      hero: Object.freeze({
        lineStagger: 0.09,
        lineDuration: 1.3,
        mediaScrollScale: 1.12,
        contentScrollShiftPercent: -18,
      }),

      reveal: Object.freeze({
        start: "top 86%",
        lineStagger: 0.08,
        lineDuration: 1.15,
        fadeDistancePx: 36,
        fadeDuration: 1.1,
        groupStagger: 0.08,
      }),

      scrubWords: Object.freeze({
        start: "top 80%",
        end: "bottom 55%",
        dimOpacity: 0.16,
      }),

      counters: Object.freeze({
        duration: 2.2,
        start: "top 85%",
      }),

      marquee: Object.freeze({
        secondsPerLoop: 38,
        velocityDivisor: 220,
        maxBoost: 5,
        settleDuration: 0.8,
      }),

      media: Object.freeze({
        revealDuration: 1.5,
        parallaxPercent: 9,
        start: "top 85%",
      }),

      archive: Object.freeze({
        scrubSmoothing: 0.6,
      }),

      band: Object.freeze({
        parallaxPercent: 14,
      }),

      nav: Object.freeze({
        scrolledAfterPx: 80,
        hideAfterPx: 400,
      }),

      video: Object.freeze({
        embedBase: "https://www.youtube-nocookie.com/embed/",
        watchBase: "https://www.youtube.com/watch?v=",
        embedParams: "autoplay=1&rel=0&modestbranding=1&playsinline=1",
      }),

      cursor: Object.freeze({
        followDuration: 0.45,
        defaultLabel: "View",
      }),

      selectors: Object.freeze({
        preloader: "[data-preloader]",
        preloaderWord: "[data-preloader-word]",
        preloaderMeta: "[data-preloader-meta]",
        nav: "[data-nav]",
        menu: "[data-menu]",
        menuToggle: "[data-menu-toggle]",
        menuLink: "[data-menu-link]",
        scrollProgress: "[data-scroll-progress]",
        hero: "[data-hero]",
        heroMedia: "[data-hero-media]",
        heroVideo: "[data-hero-video]",
        heroContent: "[data-hero-content]",
        heroEyebrow: "[data-hero-eyebrow]",
        heroTitle: "[data-hero-title]",
        heroSub: "[data-hero-sub]",
        heroActions: "[data-hero-actions]",
        heroFooter: "[data-hero-footer]",
        revealLines: '[data-reveal="lines"]',
        revealFade: '[data-reveal="fade"]',
        revealStagger: '[data-reveal="stagger"]',
        scrubWords: "[data-scrub-words]",
        counter: "[data-count-to]",
        marquee: "[data-marquee]",
        marqueeTrack: "[data-marquee-track]",
        showMedia: "[data-show-media]",
        showImage: "[data-show-image]",
        archive: "[data-archive]",
        archivePin: "[data-archive-pin]",
        archiveViewport: "[data-archive-viewport]",
        archiveTrack: "[data-archive-track]",
        archiveProgress: "[data-archive-progress]",
        band: "[data-band]",
        bandImage: "[data-band-image]",
        videoOpen: "[data-video-open]",
        videoDialog: "[data-video-dialog]",
        videoTitle: "[data-video-title]",
        videoClose: "[data-video-close]",
        videoFrame: "[data-video-frame]",
        videoLoading: "[data-video-loading]",
        videoEmpty: "[data-video-empty]",
        videoFoot: "[data-video-foot]",
        videoExternal: "[data-video-external]",
        cursorFollower: "[data-cursor-follower]",
        cursorLabel: "[data-cursor-label]",
        cursorTarget: "[data-cursor]",
        year: "[data-year]",
      }),

      classes: Object.freeze({
        hasMotion: "has-motion",
        intro: "is-intro",
        hasCursor: "has-cursor",
        menuOpen: "menu-open",
        navScrolled: "is-scrolled",
        navHidden: "is-hidden",
        videoPlaying: "is-playing",
        archivePinned: "is-pinned",
        cursorActive: "is-active",
        cursorHidden: "is-hidden",
        splitLine: "split-line",
      }),
    }),
  };
})();
