import logger from "../../logger.js";

function formHandler(stateManager) {
  function mountFormHandler(formId) {
    const form = document.getElementById(formId);
    if (!form) {
      logger.warn("Form not found", { formId });
      return;
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
