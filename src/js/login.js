document.addEventListener("DOMContentLoaded", function () {
  const notification = document.getElementById("notification");

  function showNotification(message, isSuccess = true) {
    notification.textContent = message;
    notification.classList.remove("hidden", "success", "error");
    notification.classList.add(isSuccess ? "success" : "error", "visible");

    setTimeout(() => {
      notification.classList.remove("visible");
      notification.classList.add("hidden");
    }, 5000);
  }

  // Cek apakah ada pesan sukses dari halaman register
  const registrationSuccess = localStorage.getItem("registrationSuccess");
  if (registrationSuccess) {
    showNotification(registrationSuccess, true);
    localStorage.removeItem("registrationSuccess"); // Hapus pesan setelah ditampilkan
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value.trim();

      if (!email || !password) {
        showNotification("Email dan password harus diisi.", false);
        return;
      }

      try {
        const response = await fetch(
          "https://serverbapokbeta.vercel.app/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          }
        );

        const result = await response.json();

        if (response.ok) {
          localStorage.setItem("userId", result.userId);
          localStorage.setItem("userName", result.userName);

          showNotification(
            `Login berhasil! Selamat datang, ${result.userName}`,
            true
          );
          window.location.href = "index.html"; // Redirect ke halaman utama
        } else {
          showNotification(`Login gagal: ${result.error}`, false);
        }
      } catch (error) {
        console.error("Error during login:", error);
        showNotification("Terjadi kesalahan. Silakan coba lagi nanti.", false);
      }
    });
  } else {
    console.error("Login form not found!");
  }
});
