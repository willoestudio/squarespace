// ANNOUNCEMENT.JS — ADJUST HAMBURGER POSITION + BODY CLASS

document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.getElementById("custom-hamburger");
    const announcementBar = document.querySelector(".sqs-announcement-bar");
  
    function adjustHamburgerPosition() {
      if (!hamburger || !announcementBar) return;
  
      const style = window.getComputedStyle(announcementBar);
      const isVisible = announcementBar.offsetHeight > 0 &&
        !announcementBar.classList.contains("sqs-announcement-bar-hidden") &&
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        parseFloat(style.opacity) > 0;
  
      hamburger.style.top = isVisible
        ? `calc(1.6vw + ${announcementBar.offsetHeight}px)`
        : "1.6vw";
    }
  
    adjustHamburgerPosition();
  
    document.addEventListener("click", (e) => {
      if (e.target.closest(".sqs-announcement-bar-close")) {
        hamburger.style.top = "1.6vw";
      }
    });
  
    const barObserver = new MutationObserver(() => setTimeout(adjustHamburgerPosition, 50));
    if (announcementBar) {
      barObserver.observe(announcementBar, { attributes: true, childList: true, subtree: true });
    }
  
    window.addEventListener("resize", adjustHamburgerPosition);
  
    let checks = 0;
    const interval = setInterval(() => {
      adjustHamburgerPosition();
      if (++checks > 10) clearInterval(interval);
    }, 100);
  });
  
  function checkAnnouncementBarHeight() {
    const bar = document.querySelector(".sqs-announcement-bar-dropzone");
    if (!bar) return;
    const barHeight = bar.offsetHeight;
    document.body.classList.toggle("announcement-visible", barHeight > 5);
  }
  
  document.addEventListener("DOMContentLoaded", checkAnnouncementBarHeight);
  window.addEventListener("load", checkAnnouncementBarHeight);
  window.addEventListener("resize", checkAnnouncementBarHeight);
  