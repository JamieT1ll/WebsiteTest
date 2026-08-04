(function () {
  "use strict";

  const navbar = document.querySelector(".navbar");
  if (!navbar) {
    return;
  }

  let lastScrollY = window.scrollY;
  const hideAfter = 120;
  const delta = 8;

  function isMenuOpen() {
    const expanded = navbar.querySelector(".navbar-collapse.show");
    return Boolean(expanded);
  }

  function onScroll() {
    const currentY = window.scrollY;
    const diff = currentY - lastScrollY;

    if (Math.abs(diff) < delta) {
      return;
    }

    if (currentY <= hideAfter || diff < 0 || isMenuOpen()) {
      navbar.classList.remove("navbar--hidden");
    } else {
      navbar.classList.add("navbar--hidden");
    }

    lastScrollY = currentY;
  }

  window.addEventListener("scroll", onScroll, { passive: true });
})();
