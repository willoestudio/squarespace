(function () {
  "use strict";

  /* =========================
     MARKER SYSTEM
     ========================= */
  function applyMarkers() {
    const markers = document.querySelectorAll("[data-marker]");
    markers.forEach(function (marker) {
      const name = marker.getAttribute("data-marker");
      if (!name) return;

      const block = marker.closest(".sqs-block");
      const section = marker.closest(".page-section");

      if (block) {
        block.classList.add(name + "-block");
        marker.remove();
        return;
      }

      if (section) {
        section.classList.add(name + "-section");
        marker.remove();
      }
    });
  }

  /* =========================
     OPACITY FIX
     ========================= */
  function dimFirstTwoApproachImages() {
    const section = document.querySelector('section[data-section="approach"]');
    if (!section) return;

    const images = section.querySelectorAll(".sqs-block-image img");

    images.forEach((img) => (img.style.opacity = ""));

    if (images[0]) images[0].style.opacity = "0.9";
    if (images[1]) images[1].style.opacity = "0.9";
  }

  /* =========================
     GALLERY / PORTFOLIO OVERLAYS
     ========================= */
  function addTitleOverlays() {
    // Carousel slides
    const slides = document.querySelectorAll("a.sqs-gallery-design-strip-slide");

    slides.forEach((slide) => {
      if (slide.querySelector(".custom-gallery-title")) return;

      const img = slide.querySelector("img[alt]");
      const alt = img ? (img.getAttribute("alt") || "").trim() : "";
      if (!alt) return;

      const titleOverlay = document.createElement("div");
      titleOverlay.className = "custom-gallery-title";
      titleOverlay.textContent = alt;
      slide.appendChild(titleOverlay);
    });

    // Standalone img slides
    const imgSlides = document.querySelectorAll("img.sqs-gallery-design-strip-slide[alt]");
    imgSlides.forEach((img) => {
      const parent = img.parentElement;
      if (!parent) return;
      if (parent.querySelector(".custom-gallery-title")) return;

      parent.style.position = "relative";

      const alt = (img.getAttribute("alt") || "").trim();
      if (!alt) return;

      const titleOverlay = document.createElement("div");
      titleOverlay.className = "custom-gallery-title";
      titleOverlay.textContent = alt;
      parent.appendChild(titleOverlay);
    });

    // Portfolio grid items
    const gridItems = document.querySelectorAll(".portfolio-grid-basic .grid-item");
    gridItems.forEach((item) => {
      if (item.querySelector(".custom-gallery-title")) return;

      const gridImage = item.querySelector(".grid-image");
      if (!gridImage) return;

      gridImage.style.position = "relative";

      const titleOverlay = document.createElement("div");
      titleOverlay.className = "custom-gallery-title portfolio-view-project";
      titleOverlay.textContent = "View Project";

      gridImage.appendChild(titleOverlay);
    });
  }

  /* =========================
     BLOG HOVER OVERLAY
     ========================= */
  function addBlogHoverText() {
    const blogPosts = document.querySelectorAll(".blog-basic-grid--container");

    blogPosts.forEach((post) => {
      if (post.querySelector(".custom-blog-hover")) return;

      const imageWrapper = post.querySelector(".image-wrapper");
      if (!imageWrapper) return;

      const hoverOverlay = document.createElement("div");
      hoverOverlay.className = "custom-blog-hover";
      hoverOverlay.textContent = "Read More";

      imageWrapper.style.position = "relative";
      imageWrapper.appendChild(hoverOverlay);
    });
  }

  /* =========================
     RUNNERS
     ========================= */
  function runAll() {
    applyMarkers();
    dimFirstTwoApproachImages();
    addTitleOverlays();
    addBlogHoverText();
  }

  function scheduleReruns() {
    setTimeout(runAll, 500);
    setTimeout(runAll, 1500);
    setTimeout(runAll, 2500);
  }

  function observeDomChanges() {
    const obs = new MutationObserver(function () {
      runAll();
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  // Init
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      runAll();
      scheduleReruns();
      observeDomChanges();
    });
  } else {
    runAll();
    scheduleReruns();
    observeDomChanges();
  }

  // Re-run on gallery control clicks
  document.addEventListener("click", function (e) {
    if (e.target.closest(".sqs-gallery-controls")) {
      setTimeout(addTitleOverlays, 500);
    }
  });
})();
