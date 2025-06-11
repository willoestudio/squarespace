document.addEventListener('DOMContentLoaded', function () {
  const fontPairs = [
    { className: '.sqs-heading-font', variable: '--heading-font-family' },
    { className: '.sqs-body-font',    variable: '--body-font-family' },
    { className: '.sqs-meta-font',    variable: '--meta-font-family' }
  ];

  fontPairs.forEach(({ className, variable }) => {
    const el = document.querySelector(className);
    if (el) {
      const fontFamily = getComputedStyle(el).getPropertyValue('font-family');
      document.documentElement.style.setProperty(variable, fontFamily);
    }
  });
});
