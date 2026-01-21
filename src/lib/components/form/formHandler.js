import logger from "../../logger.js";

// we need to also clear the cache to prevent it reinserting data iinto the form. lets use dependency injection.
function formHandler(stateManager) {
  function mountFormHandler(formId) {
    const form = document.getElementById(formId);
    if (!form) {
      throw new Error(`Form with id ${formId} not found`);
    }

    form.addEventListener("submit", async () => {
      try {
        logger.info("Contact form submitted", { formId });
        stateManager.saveStateToLocalStorage("formSubmitted", true);
      } catch (error) {
        logger.error(
          "Form submission handler error",
          { formId, errorMessage: error.message },
          error,
        );
        // Form submission still proceeds
      }
    });
  }
  return { mountFormHandler };
}
export { formHandler };
