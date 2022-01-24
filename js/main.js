const menu = (function() {
  // VARIABLES
  const btnToggle = document.querySelector(".primary-nav__toggle");
  const menu = document.querySelector(".primary-nav__menu");
  
  // FUNCTIONS
  const isOpen = () => menu.dataset.visible === "true";
  const toggle = () => isOpen() ? close() : open();

  const open = function() {
    menu.dataset.visible = true;
    btnToggle.setAttribute('aria-expanded', true);
  }

  const close = function() {
    menu.dataset.visible = false;
    btnToggle.setAttribute('aria-expanded', false);
  }

  return { start: () => btnToggle.addEventListener('click', toggle) };
})();

const form = (function(customDelay) {
  // VARIABLES
  const newsletter = document.querySelector("#newsletter-form");
  const delay = customDelay || 3000;

  // FUNCTIONS
  const isEmpty = fieldName => newsletter[fieldName].value === '';
  const setError = function(fieldName) {
    const formGroup = newsletter[fieldName]?.closest(".form__group");
    formGroup.classList.add("form__group--error");
    setTimeout(() => formGroup.classList.remove("form__group--error"), delay);
  };

  const handlerFormSubmit = function(e) { 
    e.preventDefault();
    if(isEmpty("email")) setError("email");
  };

  return { start: () => newsletter.addEventListener('submit', handlerFormSubmit) };
})();

const start = function() {
  form.start();
  menu.start();
}

start();
