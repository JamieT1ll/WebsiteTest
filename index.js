const revealSections = document.querySelectorAll(".reveal-section");
const introSection = document.querySelector(".home-section--intro.reveal-section");

if (revealSections.length) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (introSection) {
    introSection.classList.add("is-visible");
  }

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealSections.forEach((section) => {
      section.classList.add("is-visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    revealSections.forEach((section) => {
      if (section === introSection) {
        return;
      }

      revealObserver.observe(section);
    });
  }
}