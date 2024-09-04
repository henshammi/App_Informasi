document.addEventListener("DOMContentLoaded", async function () {
  const userId = localStorage.getItem("userId");

  // Jika userId tidak ada, artinya pengguna belum login
  if (!userId) {
    window.location.href = "login.html";
    return;
  }

  const userName = localStorage.getItem("userName");

  // Update elemen di sidebar
  if (userId && userName) {
    document.getElementById("userId").textContent = userId;
    document.getElementById("userName").textContent = userName;
  }
  // Fungsi untuk mengambil data profil dari server
  async function loadProfile() {
    try {
      const response = await fetch(`https://serverbapokbeta.vercel.app/users/${userId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const user = await response.json();

      // Update tampilan profil dengan data yang diambil dari server
      document.getElementById("profileName").textContent = user.name;
      document.getElementById("profileEmail").textContent = user.email;
      document.getElementById("profilePhone").textContent = user.no_hp;
      document.getElementById("profileAddress").textContent = user.alamat;
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }

  // Panggil fungsi loadProfile untuk memuat data pengguna
  loadProfile();
});
