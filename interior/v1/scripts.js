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

(function () {
  "use strict";

  const POPUP_PAGE = "/desktop-menu";

  function isEditMode() {
    return document.body.classList.contains("sqs-edit-mode");
  }

  function insertMenuTemplate() {
    const template = document.getElementById("custom-hamburger-template");
    const headerActions = document.querySelector(".header-actions");
    if (!template || !headerActions) return;

    // Already inserted?
    if (headerActions.querySelector(".custom-popout-menu")) return;

    headerActions.appendChild(template.content.cloneNode(true));
  }

  function ensureMenuContentLoaded() {
    const target = document.getElementById("custom-popout-menu");
    if (!target || target.dataset.loaded === "true") return;

    target.dataset.loaded = "true";

    fetch(POPUP_PAGE)
      .then((res) => res.text())
      .then((html) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        const content = doc.querySelector("#page .page-section");
        if (content) target.innerHTML = content.outerHTML;
      })
      .catch(() => {});
  }

  function bindHamburgerOnce() {
    const hamburger = document.getElementById("custom-hamburger");
    const popOutMenu = document.getElementById("custom-pop-out");
    if (!hamburger || !popOutMenu) return false;

    // Prevent double-binding
    if (hamburger.dataset.wsBound === "true") return true;
    hamburger.dataset.wsBound = "true";

    const textEl = hamburger.querySelector(".custom-burger-text");
    const headerTitle = document.querySelector(".header-title");
    const headerNav = document.querySelector(".header-nav");
    const defaultText = textEl ? textEl.textContent : "Menu";
    const openText = "Close";

    function setHeaderOpacity(isOpen) {
      if (headerTitle) headerTitle.style.opacity = isOpen ? "0" : "1";
      if (headerNav) headerNav.style.opacity = isOpen ? "0" : "1";
    }

    function syncEditModeState() {
      const expanded = isEditMode() && window.location.pathname === POPUP_PAGE;
      hamburger.setAttribute("aria-expanded", String(expanded));
      popOutMenu.classList.toggle("menu-visible", expanded);
      popOutMenu.classList.toggle("menu-hidden", !expanded);
      if (textEl) textEl.textContent = expanded ? openText : defaultText;
      setHeaderOpacity(expanded);
    }

    hamburger.addEventListener("click", () => {
      // Don’t allow toggling while editing the menu source page
      if (isEditMode() && window.location.pathname === POPUP_PAGE) return;

      const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
      const willOpen = !isExpanded;

      hamburger.setAttribute("aria-expanded", String(willOpen));
      popOutMenu.classList.toggle("menu-visible", willOpen);
      popOutMenu.classList.toggle("menu-hidden", !willOpen);

      if (textEl) textEl.textContent = willOpen ? openText : defaultText;
      setHeaderOpacity(willOpen);

      // Make sure content is present when opening
      if (willOpen) ensureMenuContentLoaded();
    });

    // React to edit-mode toggles
    new MutationObserver(syncEditModeState).observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Initial state
    ensureMenuContentLoaded();
    syncEditModeState();

    return true;
  }

  function applyDataAttributesSafe() {
    // Keep your existing nth-of-type approach, but retry-safe
    const hero = document.querySelector(".page-section:nth-of-type(1)");
    if (hero) hero.setAttribute("data-section", "hero");

    const approach = document.querySelector(".page-section:nth-of-type(2)");
    if (approach) approach.setAttribute("data-section", "approach");

    const portfolio = document.querySelector(".page-section:nth-of-type(4)");
    if (portfolio) portfolio.setAttribute("data-section", "portfolio-projects");

    const approachShapes = document.querySelectorAll(
      '[data-section="approach"] .sqs-block[data-definition-name="website.components.shape"]'
    );
    if (approachShapes[0]) approachShapes[0].setAttribute("data-shape", "shape-bg");

    const pinnedText = document.querySelector("#hero-text .fe-block:first-of-type");
    if (pinnedText) pinnedText.setAttribute("data-block", "pinned-text");
  }

  function init() {
    let attempts = 0;

    const tryInit = () => {
      insertMenuTemplate();
      applyDataAttributesSafe();

      if (bindHamburgerOnce()) return;

      attempts += 1;
      if (attempts < 40) setTimeout(tryInit, 150);
    };

    tryInit();

    // If Squarespace re-renders header, re-insert + rebind
    new MutationObserver(() => {
      insertMenuTemplate();
      bindHamburgerOnce();
    }).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
