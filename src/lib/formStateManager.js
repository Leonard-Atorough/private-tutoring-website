// firstly, we want to write a function to save form state
function createFormStateManager(persistState, getPersistedState) {
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
      console.warn(`Form with id ${formId} not found`);
      throw new Error("Form not found");
    }
    //only load persisted state if form has not been submitted. we also want to set persisted state to false if it has been submitted.
    const formSubmitted = getPersistedState("formSubmitted");
    if (formSubmitted) {
      console.log(formSubmitted);
      persistState("formSubmitted", false);
      clearFormState(formId);
    }
    // we always want to load the persisted state when the form is created, even if it has been submitted.
    const saved = getPersistedState(formId);
    if (saved) {
      setFormData(form, saved);
    }

    let idleTimer;
    const saveState = () => {
      persistState(formId, getFormData(formId));
      console.log(`Form state saved for ${formId}`);
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
    persistState(formId, null);
  }

  return { persistFormState, clearFormState };
}
export { createFormStateManager };
