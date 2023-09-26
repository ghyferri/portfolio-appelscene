// Get references to the hamburger menu and navigation links
const hamburgerMenu = document.querySelector(".hamburger-menu");
const navLinks = document.querySelector(".nav-links");

// Add a click event listener to the hamburger menu
hamburgerMenu.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});
