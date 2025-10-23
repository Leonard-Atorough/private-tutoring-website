const onTabButtonClick = (e, tabs) => {
  if (!e.target.closest(".button")) return;

  tabs.forEach((tab) => tab.classList.remove("active"));

  const button = e.target.closest(".button");
  const allBtns = button.parentElement.children;
  Array.from(allBtns).forEach((btn) => btn.classList.remove("active"));

  const tabSelector = button.getAttribute("aria-controls");
  const tab = document.getElementById(tabSelector);

  tab.classList.add("active");
  button.classList.add("active");
};

function attachTabHandler(tabBtnContainer, tabs) {
  tabBtnContainer.addEventListener("click", (e) => onTabButtonClick(e, tabs));
}

export const initTabs = () => {
  const tabBtnContainer = document.querySelector(".service-tabs");
  const tabs = document.querySelectorAll(".service-card");
  if (!tabBtnContainer || !tabs.length) return;
  attachTabHandler(tabBtnContainer, tabs);
};
