/**
 * Keeps editing actions in viewport.
 */

(function (Drupal) {
  // Prevents the need to query the DOM multiple times
  const actionsContainerMap = new Map();

  const getActionsContainer = (element) => {
    if (!actionsContainerMap.has(element)) {
      // Do not select actions inside child frontend-editing elements
      const actions = element.querySelector(
        '.common-actions-container:not(:scope .frontend-editing .common-actions-container)'
      );
      actionsContainerMap.set(element, actions);
    }
    return actionsContainerMap.get(element);
  };

  const updatePositionReset = (element) => {
    const actions = getActionsContainer(element);

    actions.removeAttribute('style');
    actions.classList.remove('place-bottom');
    actions.classList.remove('place-fixed');
  }

  const updatePositionBottom = (element, rect) => {
    const { bottom } = rect;

    // Apply bottom position if element bottom is inside the viewport
    if (bottom <= window.innerHeight && bottom >= 0) {
      const actions = getActionsContainer(element);

      updatePositionReset(element);
      actions.classList.add('place-bottom');
    }
  }

  const updatePositionFixed = (element, rect) => {
    const { left, bottom, top } = rect;

    // Apply fixed position if element top and bottom are outside the viewport
    if (top <= 0 && bottom >= window.innerHeight) {
      const actions = getActionsContainer(element);

      updatePositionReset(element);
      actions.classList.add('place-fixed');
      actions.style.left = left + 'px'; 
    }
  }

  // Observer for the top of the element
  const topObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const element = entry.target;
      const rect = element.getBoundingClientRect();

      if (entry.isIntersecting) {
        // Top left viewport
        updatePositionFixed(element, rect);
      } else {
        if(rect.bottom > 0) {
          // Top entered viewport
          updatePositionReset(element); 
        } else {
          // Bottom left viewport at the top of screen
          updatePositionBottom(element, rect);
        }
      }
    });
  }, {
    root: null,
    threshold: 0,
    rootMargin: '0px 0px -100% 0px'
  });

  // Observer for the bottom of the element
  const bottomObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const element = entry.target;
      const rect = element.getBoundingClientRect();

      if (entry.isIntersecting) {
        // Bottom left viewport
        updatePositionFixed(element, rect);
      } else {
        // Bottom entered viewport
        updatePositionBottom(element, rect);
      }
    });
  }, {
    root: null,
    threshold: 0,
    rootMargin: '-100% 0px 0px 0px'
  });

  // Observer for the top of elements smaller than the viewport
  const smallerElemObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const element = entry.target;
      const rect = element.getBoundingClientRect();

      if (entry.isIntersecting) {
        // Top left viewport
        updatePositionBottom(element, rect);
      } else {
        // Top entered viewport
        updatePositionReset(element);
      }
    });
  }, {
    root: null,
    threshold: 0,
    rootMargin: '0px 0px -100% 0px'
  });

  Drupal.behaviors.editingActionsPosition = {
    attach(context) {
      context.querySelectorAll('.frontend-editing').forEach((element) => {
        // Observe top and bottom if element is larger than the viewport
        if (element.offsetHeight > window.innerHeight) {
          topObserver.observe(element);
          bottomObserver.observe(element);
        } else {
          smallerElemObserver.observe(element);
        }
      });
    }
  };

})(Drupal);
