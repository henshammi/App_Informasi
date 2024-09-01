document.addEventListener("DOMContentLoaded", function () {
  let logOutBtn = document.querySelector("#log_out");

  logOutBtn.addEventListener("click", () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");

    window.location.href = "login.html";
  });
});
