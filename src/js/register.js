document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("registerForm");
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

  if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const alamat = document.getElementById("alamat").value;
      const no_hp = document.getElementById("no_hp").value;

      console.log("Register form submitted");
      console.log("Name:", name);
      console.log("Email:", email);
      console.log("Password:", password);

      try {
        const response = await fetch(
          "https://serverbapokbeta.vercel.app/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password, alamat, no_hp }),
          }
        );

        const result = await response.json();
        console.log("Registration response:", result);

        if (response.ok) {
          // Simpan notifikasi ke localStorage
          localStorage.setItem(
            "registrationSuccess",
            "Registration successful! You can now login."
          );
          window.location.href = "login.html"; // Redirect ke halaman login
        } else {
          showNotification(result.error || "Registration failed", false);
        }
      } catch (error) {
        console.error("Error during registration:", error);
        showNotification("An error occurred. Please try again later.", false);
      }
    });
  } else {
    console.error("Register form not found!");
  }
});
