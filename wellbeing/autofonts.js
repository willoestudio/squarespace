document.addEventListener('DOMContentLoaded', function() {
  // Map Squarespace font classes to CSS variables used in styles
  const fontMappings = [
    { selector: '.sqs-heading-font', variable: '--heading-font-font-family' },
    { selector: '.sqs-body-font', variable: '--body-font-font-family' }
  ];

  // Apply font family values
  fontMappings.forEach(({ selector, variable }) => {
    const element = document.querySelector(selector);
    if (element) {
      const fontFamily = getComputedStyle(element).fontFamily;
      document.documentElement.style.setProperty(variable, fontFamily);
    }
  });
});