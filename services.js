const rows = Array.from(document.querySelectorAll(".service-row"));
const featureCards = Array.from(document.querySelectorAll(".feature-card"));
const spotlightImage = document.querySelector(".services-spotlight-media img");
const spotlightSources = ["background1.png", "background4.png"];
const scrollButtons = Array.from(document.querySelectorAll(".scroll-next-btn, .hero-cta"));
const heroOverlayTargets = Array.from(document.querySelectorAll(".hero-overlay"));
const revealTargets = Array.from(
  new Set(
    heroOverlayTargets.concat(
      Array.from(
        document.querySelectorAll(
          ".featured-header, .service-row .service-card, .example-card, .step-card, .examples-cta, .contact-info-item, .contact-form-panel, .contact-map-panel"
        )
      )
    )
  )
);
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

rows.forEach((row, index) => {
  row.classList.add(index % 2 === 0 ? "from-left" : "from-right");
  row.style.transitionDelay = `${index * 440}ms`;

  const fill = row.querySelector(".bar-fill");
  const barColor = row.getAttribute("data-bar-color") || "#3b82f6";

  if (fill) {
    fill.style.backgroundColor = barColor;
  }
});

featureCards.forEach((card, index) => {
  card.style.transitionDelay = `${index * 120}ms`;
});

revealTargets.forEach((element, index) => {
  element.classList.add("reveal-block");
  element.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 90}ms`);
});

if (prefersReducedMotion) {
  rows.forEach((row) => {
    row.classList.add("panel-active");
    row.classList.add("bar-active");
  });

  featureCards.forEach((card) => {
    card.classList.add("feature-card-active");
  });

  revealTargets.forEach((element) => {
    element.classList.add("is-visible");
  });
} else if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("panel-active");
          entry.target.classList.add("bar-active");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.35,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  rows.forEach((row) => observer.observe(row));

  const featureObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("feature-card-active");
          featureObserver.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.2,
      rootMargin: "0px 0px -6% 0px",
    }
  );

  featureCards.forEach((card) => featureObserver.observe(card));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.18,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  revealTargets.forEach((element) => revealObserver.observe(element));
} else {
  rows.forEach((row) => {
    row.classList.add("panel-active");
    row.classList.add("bar-active");
  });

  featureCards.forEach((card) => {
    card.classList.add("feature-card-active");
  });

  revealTargets.forEach((element) => {
    element.classList.add("is-visible");
  });
}

if (
  spotlightImage &&
  spotlightSources.length > 1 &&
  !prefersReducedMotion
) {
  let currentIndex = 0;

  const nextSpotlightImage = () => {
    spotlightImage.classList.add("is-fading");

    window.setTimeout(() => {
      currentIndex = (currentIndex + 1) % spotlightSources.length;
      spotlightImage.src = spotlightSources[currentIndex];
      window.requestAnimationFrame(() => {
        spotlightImage.classList.remove("is-fading");
      });
    }, 380);
  };

  window.setInterval(nextSpotlightImage, 6200);
}

scrollButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const targetId = button.getAttribute("href");
    if (!targetId || !targetId.startsWith("#")) {
      return;
    }

    const target = document.querySelector(targetId);
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
