document.addEventListener("DOMContentLoaded", function () {
  // Element selection
  let logOutBtn = document.querySelector("#log_out");

  // Event listener for logout
  logOutBtn.addEventListener("click", () => {
    // Clear local storage
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");

    // Redirect to login page
    window.location.href = "login.html";
  });

  // Sidebar toggle functionality here
  let sidebar = document.querySelector(".sidebar");
  let closeBtn = document.querySelector("#btn");
  let searchBtn = document.querySelector(".bx-search");

  closeBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    menuBtnChange();
  });

  function menuBtnChange() {
    if (sidebar.classList.contains("open")) {
      closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
    } else {
      closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");
    }
  }
});
