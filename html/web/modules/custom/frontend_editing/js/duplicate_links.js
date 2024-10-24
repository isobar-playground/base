(function (Drupal) {

  Drupal.frontendEditing = Drupal.frontendEditing || {};

  /**
   * Add callback for enabling additional float action links at bottom.
   */
  Drupal.behaviors.actionsButtonBottom = {
    attach(context, settings) {
      const heightSettings = settings.frontend_editing.duplicate_action_links_height;
      setTimeout(function () {
        const actionsElementsBottom = context.querySelectorAll('.common-actions-container');
        actionsElementsBottom.forEach(function (originalDiv) {
          // Get current parent div height.
          const parentHeight = originalDiv
            .closest('.frontend-editing')
            .getBoundingClientRect()
            .height;
          // And check parent height with provided setting height for enabling
          // button at bottom.
          if (parentHeight >= heightSettings) {
            const clonedDiv = originalDiv
              .closest('.frontend-editing-actions')
              .querySelector('.common-actions-bottom-container');
            // Check if the cloned additional float action links button is
            // already present.
            if (clonedDiv == null) {
              // Clone the div, including its children.
              const newDiv = originalDiv.cloneNode(true);
              // Add new class to cloned div.
              newDiv.classList.add('common-actions-bottom-container');
              // Insert the cloned div as sibling.
              originalDiv.parentNode.insertBefore(
                newDiv,
                originalDiv.nextSibling
              );
              // Fetch all anchor elements within newDiv.
              const newAnchors = newDiv.getElementsByClassName('frontend-editing-open-sidebar');

              // Iterate over and add event listeners to each anchor.
              for (let i = 0; i < newAnchors.length; i++) {
                newAnchors[i].addEventListener('click', Drupal.frontendEditing.editingClick);
              }
            }
          }
        });
      }, 100);
    },
  };

})(Drupal);
