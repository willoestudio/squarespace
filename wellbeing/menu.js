// MENU.JS — CUSTOM HAMBURGER MENU + POPOUT BEHAVIOR

document.addEventListener("DOMContentLoaded", function () {
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

  // Keep checking for changes in DOM and insert menu if necessary
  const headerObserver = new MutationObserver(insertCustomMenu);
  headerObserver.observe(document.body, { childList: true, subtree: true });

  // Main popout menu functionality
  const hamburger = document.getElementById("custom-hamburger");
  const popOutMenu = document.getElementById("custom-pop-out");
  const popoutMenuContent = document.getElementById("custom-popout-menu");
  const textEl = hamburger?.querySelector(".custom-burger-text");
  const defaultText = textEl?.textContent || "Explore";
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
  }

  fetch("/desktop-menu")
    .then((res) => res.text())
    .then((html) => {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const content = doc.querySelector("#page .page-section");
      if (content) popoutMenuContent.innerHTML = content.outerHTML;
    })
    .catch((err) => console.error("Error loading pop-out content:", err));

  handleEditMode();

  const modeObserver = new MutationObserver(handleEditMode);
  modeObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });

  hamburger?.addEventListener("click", function () {
    if (isEditMode() && isPopoutMenuPage()) return;

    const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
    hamburger.setAttribute("aria-expanded", String(!isExpanded));
    popOutMenu.classList.toggle("menu-visible");
    popOutMenu.classList.toggle("menu-hidden");

    if (textEl) {
      textEl.style.opacity = "0";
      setTimeout(() => {
        textEl.textContent = isExpanded ? defaultText : openText;
        textEl.style.opacity = "1";
      }, 400);
    }
  });
});
