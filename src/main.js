const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

function isOpen(el) {
  return el && el.getAttribute("data-open") === "true";
}

function setOpen(el, open) {
  if (!el) return;
  el.setAttribute("data-open", open ? "true" : "false");
}

function getFocusable(container) {
  return qsa(
    [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "[tabindex]:not([tabindex='-1'])",
    ].join(","),
    container,
  ).filter((el) => !el.hasAttribute("hidden") && el.offsetParent !== null);
}

function createFocusTrap(container) {
  let lastFocused = null;

  function onKeyDown(e) {
    if (e.key === "Escape") {
      container.dispatchEvent(new CustomEvent("request-close", { bubbles: true }));
      return;
    }

    if (e.key !== "Tab") return;
    const focusable = getFocusable(container);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }

  return {
    activate() {
      lastFocused = document.activeElement;
      container.addEventListener("keydown", onKeyDown);
      const focusable = getFocusable(container);
      (focusable[0] ?? container).focus();
    },
    deactivate() {
      container.removeEventListener("keydown", onKeyDown);
      if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
      lastFocused = null;
    },
  };
}

function setupDropdowns() {
  const dropdowns = qsa("[data-dropdown]");
  if (dropdowns.length === 0) return;

  function closeAll(except) {
    dropdowns.forEach((dd) => {
      if (dd === except) return;
      const btn = qs("[data-dropdown-button]", dd);
      const menu = qs("[data-dropdown-menu]", dd);
      btn?.setAttribute("aria-expanded", "false");
      menu?.setAttribute("hidden", "");
      setOpen(dd, false);
    });
  }

  dropdowns.forEach((dd) => {
    const btn = qs("[data-dropdown-button]", dd);
    const menu = qs("[data-dropdown-menu]", dd);
    if (!btn || !menu) return;

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const next = !isOpen(dd);
      closeAll(dd);
      setOpen(dd, next);
      btn.setAttribute("aria-expanded", next ? "true" : "false");
      if (next) menu.removeAttribute("hidden");
      else menu.setAttribute("hidden", "");
    });
  });

  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    const inside = target.closest("[data-dropdown]");
    if (!inside) closeAll();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closeAll();
  });
}

function setupMobileMenu() {
  const openBtn = qs("[data-mobile-open]");
  const panel = qs("[data-mobile-panel]");
  const backdrop = qs("[data-mobile-backdrop]");
  const closeBtn = qs("[data-mobile-close]");

  if (!openBtn || !panel || !backdrop || !closeBtn) return;

  const trap = createFocusTrap(panel);

  function open() {
    document.documentElement.classList.add("is-menu-open");
    openBtn.setAttribute("aria-expanded", "true");
    panel.removeAttribute("hidden");
    backdrop.removeAttribute("hidden");
    requestAnimationFrame(() => {
      panel.classList.add("is-open");
      backdrop.classList.add("is-open");
    });
    trap.activate();
  }

  function close() {
    panel.classList.remove("is-open");
    backdrop.classList.remove("is-open");
    openBtn.setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove("is-menu-open");
    window.setTimeout(() => {
      panel.setAttribute("hidden", "");
      backdrop.setAttribute("hidden", "");
      trap.deactivate();
    }, 180);
  }

  openBtn.addEventListener("click", () =>
    openBtn.getAttribute("aria-expanded") === "true" ? close() : open(),
  );
  closeBtn.addEventListener("click", close);
  backdrop.addEventListener("click", close);
  panel.addEventListener("request-close", close);

  // Mobile accordion behavior (independent of desktop dropdowns)
  qsa("[data-accordion]", panel).forEach((acc) => {
    const btn = qs("[data-accordion-button]", acc);
    const body = qs("[data-accordion-body]", acc);
    if (!btn || !body) return;

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", expanded ? "false" : "true");
      if (expanded) body.setAttribute("hidden", "");
      else body.removeAttribute("hidden");
    });
  });
}

setupDropdowns();
setupMobileMenu();
