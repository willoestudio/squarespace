(function () {
  function init() {
    // Insert custom hamburger template
    function insertCustomMenu() {
      const template = document.getElementById("custom-hamburger-template");
      const alreadyInserted = document.querySelector(".custom-popout-menu");
      const headerActions = document.querySelector(".header-actions");

      if (!alreadyInserted && headerActions && template) {
        const clone = template.content.cloneNode(true);
        headerActions.appendChild(clone);
      }
    }

    insertCustomMenu();

    const headerObserver = new MutationObserver(insertCustomMenu);
    headerObserver.observe(document.body, { childList: true, subtree: true });

    // Main popout menu functionality
    const hamburger = document.getElementById("custom-hamburger");
    const popOutMenu = document.getElementById("custom-pop-out");
    const popoutMenuContent = document.getElementById("custom-popout-menu");
    const textEl = hamburger ? hamburger.querySelector(".custom-burger-text") : null;
    const headerTitle = document.querySelector(".header-title");
    const headerNav = document.querySelector(".header-nav");
    const defaultText = textEl ? textEl.textContent : "Menu";
    const openText = "Close";

    const isPopoutMenuPage = () => window.location.pathname === "/desktop-menu";
    const isEditMode = () => document.body.classList.contains("sqs-edit-mode");

    function handleEditMode() {
      if (!hamburger || !popOutMenu) return;

      const expanded = isPopoutMenuPage() && isEditMode();
      hamburger.setAttribute("aria-expanded", String(expanded));
      popOutMenu.classList.toggle("menu-visible", expanded);
      popOutMenu.classList.toggle("menu-hidden", !expanded);

      if (textEl) textEl.textContent = expanded ? openText : defaultText;

      // Hide/show header elements
      if (headerTitle) headerTitle.style.opacity = expanded ? "0" : "1";
      if (headerNav) headerNav.style.opacity = expanded ? "0" : "1";
    }

    // Fetch menu content from /desktop-menu page
    if (popoutMenuContent) {
      fetch("/desktop-menu")
        .then((res) => res.text())
        .then((html) => {
          const doc = new DOMParser().parseFromString(html, "text/html");
          const content = doc.querySelector("#page .page-section");
          if (content) popoutMenuContent.innerHTML = content.outerHTML;
        })
        .catch(() => {});
    }

    handleEditMode();

    const modeObserver = new MutationObserver(handleEditMode);
    modeObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    // Toggle menu on click
    if (hamburger) {
      hamburger.addEventListener("click", function () {
        if (isEditMode() && isPopoutMenuPage()) return;
        if (!popOutMenu) return;

        const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
        hamburger.setAttribute("aria-expanded", String(!isExpanded));
        popOutMenu.classList.toggle("menu-visible");
        popOutMenu.classList.toggle("menu-hidden");

        // Hide/show header elements
        if (headerTitle) {
          headerTitle.style.transition = "opacity 0.3s ease";
          headerTitle.style.opacity = isExpanded ? "1" : "0";
        }
        if (headerNav) {
          headerNav.style.transition = "opacity 0.3s ease";
          headerNav.style.opacity = isExpanded ? "1" : "0";
        }

        if (textEl) {
          textEl.style.opacity = "0";
          setTimeout(() => {
            textEl.textContent = isExpanded ? defaultText : openText;
            textEl.style.opacity = "1";
          }, 400);
        }
      });
    }

    // DATA ATTRIBUTES
    const heroSection = document.querySelector(".page-section:nth-of-type(1)");
    if (heroSection) heroSection.setAttribute("data-section", "hero");

    const approachSection = document.querySelector(".page-section:nth-of-type(2)");
    if (approachSection) approachSection.setAttribute("data-section", "approach");

    const portfolioSection = document.querySelector(".page-section:nth-of-type(4)");
    if (portfolioSection) portfolioSection.setAttribute("data-section", "portfolio-projects");

    const approachShapes = document.querySelectorAll(
      '[data-section="approach"] .sqs-block[data-definition-name="website.components.shape"]'
    );
    if (approachShapes[0]) approachShapes[0].setAttribute("data-shape", "shape-bg");

    const pinnedText = document.querySelector("#hero-text .fe-block:first-of-type");
    if (pinnedText) pinnedText.setAttribute("data-block", "pinned-text");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
