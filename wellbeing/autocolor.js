document.addEventListener('DOMContentLoaded', function() {
    // Define color mappings for Squarespace theme colors
    const colorMappings = [
      {
        selector: '.body',
        mappings: [
          { prop: '--siteBackgroundColor', variable: '--body-background', fallback: '#F9F8F4' },
          { prop: '--siteFontColor', variable: '--body-font-color', fallback: '#242424' }
        ]
      },
      {
        selector: '[data-section-theme="light"]',
        mappings: [
          { prop: '--siteBackgroundColor', variable: '--light', fallback: '#F9F8F4' }
        ]
      },
      {
        selector: '[data-section-theme="dark"]',
        mappings: [
          { prop: '--siteBackgroundColor', variable: '--dark', fallback: '#242424' }
        ]
      },
      {
        selector: '[data-section-theme="accent"]',
        mappings: [
          { prop: '--siteBackgroundColor', variable: '--accent', fallback: '#897866' }
        ]
      }
    ];
  
    // Apply color mappings
    colorMappings.forEach(({ selector, mappings }) => {
      const element = document.querySelector(selector);
      if (element) {
        const styles = getComputedStyle(element);
        mappings.forEach(({ prop, variable, fallback }) => {
          const value = styles.getPropertyValue(prop).trim() || fallback;
          document.documentElement.style.setProperty(variable, value);
        });
      }
    });
  });