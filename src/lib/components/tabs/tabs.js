const _tabBtnContainer = document.querySelector(".service-tabs");
const _tabs = document.querySelectorAll(".service-card");

const onTabButtonClick = (e) => {
  if (!e.target.closest(".button")) return;

  _tabs.forEach((tab) => tab.classList.remove("active"));

  const button = e.target.closest(".button");
  const allBtns = button.parentElement.children;
  Array.from(allBtns).forEach((btn) => btn.classList.remove("active"));

  const tabSelector = button.getAttribute("aria-controls");
  const tab = document.getElementById(tabSelector);

  tab.classList.add("active");
  button.classList.add("active");
};

function attachTabHandler() {
  _tabBtnContainer.addEventListener("click", onTabButtonClick);
}

export const initTabs = () => {
  attachTabHandler();
};
