// @ts-check
(function (A) {
  const { config, dom } = A;
  const { selectors: sel, video: videoConfig } = config;

  /**
   * @typedef {object} DialogParts
   * @property {HTMLDialogElement} dialog
   * @property {HTMLElement} title
   * @property {HTMLElement} frame
   * @property {HTMLElement} loading
   * @property {HTMLElement} empty
   * @property {HTMLElement} foot
   * @property {HTMLAnchorElement} external
   */

  /** @returns {DialogParts | null} */
  function collectParts() {
    const dialog = /** @type {HTMLDialogElement | null} */ (dom.qs(sel.videoDialog));
    if (!dialog || typeof dialog.showModal !== "function") return null;
    const parts = {
      dialog,
      title: dom.qs(sel.videoTitle, dialog),
      frame: dom.qs(sel.videoFrame, dialog),
      loading: dom.qs(sel.videoLoading, dialog),
      empty: dom.qs(sel.videoEmpty, dialog),
      foot: dom.qs(sel.videoFoot, dialog),
      external: dom.qs(sel.videoExternal, dialog),
    };
    return Object.values(parts).every(Boolean) ? /** @type {DialogParts} */ (parts) : null;
  }

  /** @param {string} id */
  function watchUrl(id) {
    return `${videoConfig.watchBase}${encodeURIComponent(id)}`;
  }

  function init() {
    const openers = /** @type {HTMLElement[]} */ (dom.qsa(sel.videoOpen));
    const parts = collectParts();

    if (!parts) {
      openers.forEach((btn) => {
        const id = btn.dataset.videoId;
        if (id) btn.addEventListener("click", () => window.open(watchUrl(id), "_blank", "noopener"));
      });
      return;
    }

    const { dialog, title, frame, loading, empty, foot, external } = parts;

    const clearFrame = () => frame.querySelectorAll("iframe").forEach((iframe) => iframe.remove());

    /** @param {string} id @param {string} label */
    const open = (id, label) => {
      clearFrame();
      title.textContent = label;

      if (!id) {
        loading.hidden = true;
        empty.hidden = false;
        foot.hidden = true;
      } else {
        empty.hidden = true;
        loading.hidden = false;
        const iframe = document.createElement("iframe");
        iframe.src = `${videoConfig.embedBase}${encodeURIComponent(id)}?${videoConfig.embedParams}`;
        iframe.title = label;
        iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
        iframe.allowFullscreen = true;
        iframe.referrerPolicy = "strict-origin-when-cross-origin";
        iframe.addEventListener("load", () => (loading.hidden = true), { once: true });
        frame.appendChild(iframe);
        external.href = watchUrl(id);
        foot.hidden = false;
      }

      dialog.showModal();
      A.scroll.stop();
    };

    openers.forEach((btn) =>
      btn.addEventListener("click", () => open(btn.dataset.videoId || "", btn.dataset.videoTitle || "Video")),
    );

    dom.qs(sel.videoClose, dialog)?.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", () => {
      clearFrame();
      A.scroll.start();
    });
  }

  A.modules.videoDialog = Object.freeze({ init });
})(window.Arcadia);
