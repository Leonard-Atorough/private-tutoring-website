// firstly, we want to write a function to save form state
function createFormStateManager(saveStateToLocalStorage, fetchStoredState) {
  function getFormData(formId) {
    const form = document.getElementById(formId);
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    return data;
  }

  function setFormData(form, data) {
    for (const [key, value] of Object.entries(data)) {
      const field = form.elements.namedItem(key);
      if (field) {
        field.value = value;
      }
    }
  }

  function persistFormState(formId) {
    const form = document.getElementById(formId);
    if (!form) {
      throw new Error("Form not found");
    }
    //only load persisted state if form has not been submitted. we also want to set persisted state to false if it has been submitted.
    const formSubmitted = fetchStoredState("formSubmitted");
    if (formSubmitted) {
      saveStateToLocalStorage("formSubmitted", false);
      clearFormState(formId);
    }
    // we always want to load the persisted state when the form is created, even if it has been submitted.
    const saved = fetchStoredState(formId);
    if (saved) {
      setFormData(form, saved);
    }

    let idleTimer;
    const saveState = () => {
      saveStateToLocalStorage(formId, getFormData(formId));
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
