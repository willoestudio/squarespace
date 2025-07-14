// BLOG-FILTER.JS — CATEGORY FILTER + SORTING

document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".blog-basic-grid, .blog-list, .summary-block-wrapper");
    const categoryFilter = document.querySelector(".category-filter");
  
    // Exit if not on a blog page
    if (!container || !categoryFilter) return;
  
    const blogItems = Array.from(container.querySelectorAll(".blog-item"));
  
    // STEP 1: Add data-title, data-date, data-categories
    blogItems.forEach(item => {
      const titleEl = item.querySelector("h1, h2, h3");
      const title = titleEl ? titleEl.textContent.trim() : "Untitled";
      item.setAttribute("data-title", title.toLowerCase());
  
      const dateEl = item.querySelector("time");
      if (dateEl) {
        const date = new Date(dateEl.getAttribute("datetime") || dateEl.textContent);
        if (!isNaN(date)) {
          item.setAttribute("data-date", date.toISOString());
        }
      }
  
      const categoryLinks = item.querySelectorAll(".blog-categories");
      const categoryValues = Array.from(categoryLinks).map(link =>
        link.textContent.trim().toLowerCase().replace(/\s+/g, "-")
      );
      item.setAttribute("data-categories", categoryValues.join(","));
    });
  
    // STEP 2: Generate category filter buttons from blog JSON
    fetch("/blog?format=json")
      .then(res => res.json())
      .then(data => {
        const categoriesSet = new Set();
        data.items.forEach(post => {
          if (post.categories) {
            post.categories.forEach(cat => categoriesSet.add(cat));
          }
        });
  
        const categories = Array.from(categoriesSet).sort();
  
        // All button
        const allBtn = document.createElement("button");
        allBtn.className = "filter-btn active";
        allBtn.textContent = "All";
        allBtn.setAttribute("data-filter", "all");
        categoryFilter.appendChild(allBtn);
  
        // Category buttons
        categories.forEach(cat => {
          const btn = document.createElement("button");
          btn.className = "filter-btn";
          btn.textContent = cat;
          btn.setAttribute("data-filter", cat.toLowerCase().replace(/\s+/g, "-"));
          categoryFilter.appendChild(btn);
        });
  
        // STEP 3: Filtering logic
        const buttons = document.querySelectorAll(".filter-btn");
        buttons.forEach(btn => {
          btn.addEventListener("click", () => {
            const filter = btn.getAttribute("data-filter");
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
  
            blogItems.forEach(post => {
              const categories = post.getAttribute("data-categories") || "";
              post.style.display = (filter === "all" || categories.includes(filter)) ? "" : "none";
            });
          });
        });
      });
  
    // STEP 4: Sorting logic
    const trigger = document.getElementById("sort-trigger");
    const optionsMenu = document.querySelector(".sort-options");
    const options = document.querySelectorAll(".sort-option");
  
    if (trigger && optionsMenu && options.length > 0) {
      trigger.addEventListener("click", () => {
        optionsMenu.style.display = optionsMenu.style.display === "block" ? "none" : "block";
      });
  
      options.forEach(option => {
        option.addEventListener("click", function () {
          const method = this.dataset.sort;
          trigger.textContent = "Sort: " + this.textContent;
          optionsMenu.style.display = "none";
  
          const sorted = [...blogItems].sort((a, b) => {
            const aTitle = a.dataset.title || "";
            const bTitle = b.dataset.title || "";
            const aDate = new Date(a.dataset.date || 0);
            const bDate = new Date(b.dataset.date || 0);
  
            if (method === "date-desc") return bDate - aDate;
            if (method === "date-asc") return aDate - bDate;
            if (method === "title-asc") return aTitle.localeCompare(bTitle);
            if (method === "title-desc") return bTitle.localeCompare(aTitle);
          });
  
          sorted.forEach(item => container.appendChild(item));
        });
      });
    }
  });
  