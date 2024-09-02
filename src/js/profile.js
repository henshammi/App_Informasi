document.addEventListener('DOMContentLoaded', async function () {
    // Mendapatkan userId dari localStorage
    const userId = localStorage.getItem("userId");

    // Fungsi untuk mengambil data profil dari server
    async function loadProfile() {
        try {
            const response = await fetch(`http://localhost:3000/users/${userId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const user = await response.json();

            // Update tampilan profil dengan data yang diambil dari server
            document.getElementById("profileName").textContent = user.name;
            document.getElementById("profileEmail").textContent = user.email;
            document.getElementById("profilePhone").textContent = user.no_hp;
            document.getElementById("profileAddress").textContent = user.alamat;
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    // Panggil fungsi loadProfile untuk memuat data pengguna
    loadProfile();
});
