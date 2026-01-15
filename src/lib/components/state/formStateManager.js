// firstly, we want to write a function to save form state
function createFormStateManager(saveStateToLocalStorage, fetchStoredState) {
  function getFormData(formId) {

    const form = document.getElementById(formId);
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    return data;
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
          console.error(`Error setting field ${key}:`, fieldError);
        }
      }
    } catch (error) {
      console.error("Error setting form data:", error);
    }
  }

  function persistFormState(formId) {
    try {
      const form = document.getElementById(formId);
      if (!form) {
        throw new Error("Form not found");
      }
      
      //only load persisted state if form has not been submitted. we also want to set persisted state to false if it has been submitted.
      try {
        const formSubmitted = fetchStoredState("formSubmitted");
        if (formSubmitted) {
          saveStateToLocalStorage("formSubmitted", false);
          clearFormState(formId);
        }
      } catch (error) {
        console.error("Error checking form submission state:", error);
      }
      
      // we always want to load the persisted state when the form is created, even if it has been submitted.
      try {
        const saved = fetchStoredState(formId);
        if (saved) {
          setFormData(form, saved);
        }
      } catch (error) {
        console.error("Error restoring form state:", error);
      }

      let idleTimer;
      const saveState = () => {
        try {
          saveStateToLocalStorage(formId, getFormData(formId));
        } catch (error) {
          console.error("Error saving form state:", error);
        }
      };

      const debounceSaveState = () => {
        try {
          if (idleTimer) clearTimeout(idleTimer);
          idleTimer = setTimeout(saveState, 2000);
        } catch (error) {
          console.error("Error debouncing save:", error);
        }
      };

      form.addEventListener("input", debounceSaveState);

      form.addEventListener("submit", () => {
        try {
          if (idleTimer) clearTimeout(idleTimer);
        } catch (error) {
          console.error("Error clearing idle timer:", error);
        }
      });
      window.addEventListener("beforeunload", saveState);
    } catch (error) {
      console.error(`Failed to persist form state for ${formId}:`, error);
      throw error;
    }
  }

  function clearFormState(formId) {
    saveStateToLocalStorage(formId, null);
  }

  return { persistFormState, clearFormState };
}
export { createFormStateManager };
