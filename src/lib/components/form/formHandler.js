// we need to also clear the cache to prevent it reinserting data iinto the form. lets use dependency injection.
function formHandler(stateManager) {
  function mountFormHandler(formId) {
    const form = document.getElementById(formId);
    if (!form) {
      throw new Error(`Form with id ${formId} not found`);
    }

    form.addEventListener("submit", async (e) => {
      try {
        //disabled so that formsubmit.co can handle the form submission
        //  e.preventDefault();
        //save a form submission token to local storage
        try {
          stateManager.saveStateToLocalStorage("formSubmitted", true);
        } catch (storageError) {
          console.error("Failed to save submission state:", storageError);
          // Form submission still proceeds
        }
      } catch (error) {
        console.error("Form submission handler error:", error);
        // Let the form submit naturally even if JS fails
      }
    });
  }
  return { mountFormHandler };
}
export { formHandler };
