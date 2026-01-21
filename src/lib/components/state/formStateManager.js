import logger from "../../logger.js";
import * as Sentry from "@sentry/browser";

function createFormStateManager(saveStateToLocalStorage, fetchStoredState) {
  function getFormData(formId) {
    try {
      const form = document.getElementById(formId);
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      return data;
    } catch (error) {
      logger.error("Error getting form data", { formId, errorMessage: error.message }, error);
      return {};
    }
  }

  function setFormData(form, data) {
    try {
      for (const [key, value] of Object.entries(data)) {
        try {
          const field = form.elements.namedItem(key);
          if (field) {
            field.value = value;
          }
        } catch (fieldError) {
          logger.error("Error setting form field", {
            field: key,
            errorMessage: fieldError.message,
          });
        }
      }
    } catch (error) {
      logger.error("Error setting form data", { errorMessage: error.message }, error);
    }
  }

  function persistFormState(formId) {
    const form = document.getElementById(formId);
    if (!form) throw new Error("Form not found");

    const safe = (fn, { message = "Non-fatal error", capture = false, context = {} } = {}) => {
      try {
        return fn();
      } catch (err) {
        logger.error(message, { formId, ...context, errorMessage: err.message });
        if (capture) Sentry.captureException(err);
        return undefined;
      }
    };

    safe(
      () => {
        const formSubmitted = fetchStoredState("formSubmitted");
        if (formSubmitted) {
          saveStateToLocalStorage("formSubmitted", false);
          clearFormState(formId);
        }
      },
      { message: "Error checking form submission state", capture: true },
    );

    safe(
      () => {
        const saved = fetchStoredState(formId);
        if (saved) setFormData(form, saved);
      },
      { message: "Error restoring form state", capture: true },
    );

    let idleTimer;
    const saveState = () => {
      try {
        saveStateToLocalStorage(formId, getFormData(formId));
      } catch (err) {
        logger.error("Error saving form state", { formId, errorMessage: err.message });
      }
    };

    const debounceSaveState = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(saveState, 2000);
    };

    form.addEventListener("input", debounceSaveState);

    form.addEventListener("submit", () => {
      if (idleTimer) clearTimeout(idleTimer);
    });

    window.addEventListener("beforeunload", saveState);
  }

  function clearFormState(formId) {
    saveStateToLocalStorage(formId, null);
  }

  return { persistFormState, clearFormState };
}
export { createFormStateManager };
