(function () {
  "use strict";

  /* =========================
     MARKER SYSTEM
     ========================= */
  function applyMarkers() {
    const markers = document.querySelectorAll("[data-marker]");
    markers.forEach((marker) => {
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
  function addGalleryOverlays() {
    // Carousel slides
    document.querySelectorAll("a.sqs-gallery-design-strip-slide").forEach((slide) => {
      if (slide.querySelector(".custom-gallery-title")) return;

      const img = slide.querySelector("img[alt]");
      const alt = img ? (img.getAttribute("alt") || "").trim() : "";
      if (!alt) return;

      const overlay = document.createElement("div");
      overlay.className = "custom-gallery-title";
      overlay.textContent = alt;
      slide.appendChild(overlay);
    });

    // Standalone image slides
    document.querySelectorAll("img.sqs-gallery-design-strip-slide[alt]").forEach((img) => {
      const parent = img.parentElement;
      if (!parent || parent.querySelector(".custom-gallery-title")) return;

      const alt = (img.getAttribute("alt") || "").trim();
      if (!alt) return;

      parent.style.position = "relative";

      const overlay = document.createElement("div");
      overlay.className = "custom-gallery-title";
      overlay.textContent = alt;
      parent.appendChild(overlay);
    });

    // Portfolio grid items
    document.querySelectorAll(".portfolio-grid-basic .grid-item").forEach((item) => {
      if (item.querySelector(".custom-gallery-title")) return;

      const gridImage = item.querySelector(".grid-image");
      if (!gridImage) return;

      gridImage.style.position = "relative";

      const overlay = document.createElement("div");
      overlay.className = "custom-gallery-title portfolio-view-project";
      overlay.textContent = "View Project";

      gridImage.appendChild(overlay);
    });
  }

  /* =========================
     BLOG HOVER OVERLAY
     ========================= */
  function addBlogHoverText() {
    document.querySelectorAll(".blog-basic-grid--container").forEach((post) => {
      if (post.querySelector(".custom-blog-hover")) return;

      const imageWrapper = post.querySelector(".image-wrapper");
      if (!imageWrapper) return;

      imageWrapper.style.position = "relative";

      const overlay = document.createElement("div");
      overlay.className = "custom-blog-hover";
      overlay.textContent = "Read More";

      imageWrapper.appendChild(overlay);
    });
  }

  /* =========================
     MASTER RUNNER
     ========================= */
  function runAll() {
    applyMarkers();
    dimFirstTwoApproachImages();
    addGalleryOverlays();
    addBlogHoverText();
    fixCartNavPadding();
  }

  function scheduleRetries() {
    setTimeout(runAll, 500);
    setTimeout(runAll, 1500);
    setTimeout(runAll, 2500);
  }

  function init() {
    runAll();
    scheduleRetries();

    // Watch for Squarespace DOM updates
    new MutationObserver(runAll).observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Re-run overlays when gallery navigation changes
    document.addEventListener("click", (e) => {
      if (e.target.closest(".sqs-gallery-controls")) {
        setTimeout(addGalleryOverlays, 400);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  /* =========================
   CART NAV PADDING FIX
   ========================= */
function fixCartNavPadding() {
  var cart = document.querySelector('.showOnDesktop .header-actions-action--cart');
  var navList = document.querySelector('.header-nav-list');
  
  if (cart && navList) {
    var cartWidth = cart.offsetWidth;
    if (cartWidth > 0) {
      var currentPadding = 40;
      navList.style.paddingRight = (currentPadding + cartWidth + 20) + 'px';
    }
  }
}
})();

