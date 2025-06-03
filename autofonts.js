document.addEventListener('DOMContentLoaded', () => {
    const fontTargets = ['--heading', '--body', '--meta'];
    const sourceClasses = ['sqs-heading-font', 'sqs-body-font', 'sqs-meta-font'];
  
    sourceClasses.forEach((className, i) => {
      const element = document.querySelector(`.${className}`);
      if (element) {
        const font = getComputedStyle(element).getPropertyValue('font-family').trim();
        document.documentElement.style.setProperty(fontTargets[i], font);
      }
    });
  });
  