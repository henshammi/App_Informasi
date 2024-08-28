document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
  
    if (!email || !password) {
      alert("Email dan password harus diisi.");
      return;
    }
  
    try {
      // Mengirim permintaan login ke server
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        // Jika login berhasil
        alert(`Login successful! Welcome, ${result.userName}`);
        window.location.href = "index.html";
      } else {
        // Menampilkan pesan error jika login gagal
        alert(`Login failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again later.");
    }
  });
  
