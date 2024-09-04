document.getElementById("loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    alert("Email dan password harus diisi.");
    return;
  }

  try {
    const response = await fetch("https://serverbapokbeta.vercel.app/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (response.ok) {
      localStorage.setItem("userId", result.userId);
      localStorage.setItem("userName", result.userName);

      alert(`Login berhasil! Selamat datang, ${result.userName}`);
      window.location.href = "index.html";
    } else {
      alert(`Login gagal: ${result.error}`);
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("Terjadi kesalahan. Silakan coba lagi nanti.");
  }
});
