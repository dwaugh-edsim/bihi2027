// @ts-check
(function (A) {
  /**
   * @template {Element} T
   * @param {string} selector
   * @param {ParentNode} [scope]
   * @returns {T | null}
   */
  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  /**
   * @template {Element} T
   * @param {string} selector
   * @param {ParentNode} [scope]
   * @returns {T[]}
   */
  function qsa(selector, scope) {
    return Array.from((scope || document).querySelectorAll(selector));
  }

  /** @param {string} query */
  function matches(query) {
    return window.matchMedia(query).matches;
  }

  /** @returns {boolean} */
  function motionEnabled() {
    return document.documentElement.classList.contains(A.config.classes.hasMotion);
  }

  /**
   * Makes an element visible again after the CSS pre-animation state hid it.
   * @param {Element | Element[]} target
   */
  function reveal(target) {
    window.gsap.set(target, { visibility: "visible" });
  }

  A.dom = Object.freeze({ qs, qsa, matches, motionEnabled, reveal });
})(window.Arcadia);
