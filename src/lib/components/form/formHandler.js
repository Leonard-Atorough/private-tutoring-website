// we need to also clear the cache to prevent it reinserting data iinto the form. lets use dependency injection.
function formHandler(stateManager) {
  function mountFormHandler(formId) {
    const form = document.getElementById(formId);
    if (!form) {
      throw new Error(`Form with id ${formId} not found`);
    }

    form.addEventListener("submit", async (e) => {
      //disabled so that formsubmit.co can handle the form submission
      //  e.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      //save a form submission token to local storage
      stateManager.saveStateToLocalStorage("formSubmitted", true);
    });
  }
  return { mountFormHandler };
}
export { formHandler };
