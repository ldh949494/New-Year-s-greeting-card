(() => {
  const appEl = document.getElementById("app");
  const openBtn = document.getElementById("openEnvelope");
  const dialogEl = document.getElementById("letterDialog");
  const closeBtn = document.getElementById("closeLetter");

  if (!appEl || !openBtn || !dialogEl || !closeBtn) return;

  const motionReduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  const state = {
    isOpening: false,
    lastFocused: null,
  };

  const setDialogVisible = (visible) => {
    dialogEl.setAttribute("aria-hidden", visible ? "false" : "true");
    openBtn.setAttribute("aria-expanded", visible ? "true" : "false");
  };

  const openLetter = () => {
    if (appEl.classList.contains("is-letter")) return;
    if (state.isOpening) return;

    state.isOpening = true;
    state.lastFocused = document.activeElement;
    appEl.classList.add("is-opening");

    const delay = motionReduce ? 0 : 520;
    window.setTimeout(() => {
      appEl.classList.remove("is-opening");
      appEl.classList.add("is-letter");
      setDialogVisible(true);
      closeBtn.focus({ preventScroll: true });
      state.isOpening = false;
    }, delay);
  };

  const closeLetter = () => {
    if (!appEl.classList.contains("is-letter")) return;

    appEl.classList.remove("is-letter");
    setDialogVisible(false);

    const target = state.lastFocused instanceof HTMLElement ? state.lastFocused : openBtn;
    target.focus({ preventScroll: true });
  };

  openBtn.addEventListener("click", openLetter);
  openBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openLetter();
    }
  });

  closeBtn.addEventListener("click", closeLetter);

  dialogEl.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.close === "true") closeLetter();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLetter();
  });

  setDialogVisible(false);
})();
