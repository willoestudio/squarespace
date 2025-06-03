document.addEventListener('DOMContentLoaded', function () {
    const themes = [
      { theme: 'light', varName: '--light' },
      { theme: 'light-green', varName: '--light-green' },
      { theme: 'dark-green', varName: '--dark-green' },
      { theme: 'brown', varName: '--brown' },
      { theme: 'dark', varName: '--dark' }
    ];
  
    themes.forEach(({ theme, varName }) => {
      const el = document.querySelector(`[data-section-theme="${theme}"]`);
      if (el) {
        const color = getComputedStyle(el).getPropertyValue('--siteBackgroundColor').trim();
        if (color) {
          document.documentElement.style.setProperty(varName, color);
        }
      }
    });
  });
  