// firstly, we want to write a function to save form state
function createFormStateManager(persistState, getPersistedState) {
   function getFormData(formId) {
      const form = document.getElementById(formId);
      console.log(form, form.elements);
      if (!form) {
         console.warn(`Form with id ${formId} not found`);
         return;
      }
      const formData = new FormData(form);
      for (let [key, value] of formData.entries()) {
         console.log(`${key}: ${value}`);
      }

      const data = Object.fromEntries(formData);
      console.log(data);

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
         return;
      }
      const saved = getPersistedState(formId);
      if (saved) {
         setFormData(form, saved);
      }

      let idleTimer;
      const saveState = () => {
         persistState(formId, getFormData(formId));
         console.log("Form state saved");
      };

      const resetIdleTimer = () => {
         if (idleTimer) clearTimeout(idleTimer);
         idleTimer = setTimeout(saveState, 2000);
      };

      form.addEventListener("input", resetIdleTimer);

      form.addEventListener("submit", () => {
         if (idleTimer) clearTimeout(idleTimer);
         saveState();
      });
      window.addEventListener("beforeunload", saveState);
   }
   return { persistFormState };
}
export { createFormStateManager };
