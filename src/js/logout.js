document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("log_out");

  logoutButton.addEventListener("click", () => {
    // Hapus data login dari localStorage
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");

    // Redirect ke halaman login
    window.location.href = "login.html";
  });
});
