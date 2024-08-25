document.addEventListener("DOMContentLoaded", function () {
  // Daftar bahan pokok (data dummy)
  const bahanPokok = [
    { nama: "Beras", tanggal: "2024-08-20", harga: 12000 },
    { nama: "Gula", tanggal: "2024-08-21", harga: 15000 },
    { nama: "Minyak Goreng", tanggal: "2024-08-22", harga: 14000 },
    { nama: "Telur", tanggal: "2024-08-23", harga: 2000 },
    { nama: "Daging Ayam", tanggal: "2024-08-24", harga: 35000 },
  ];

  // Memastikan tableBody ada
  const tableBody = document.querySelector("#bahanTable tbody");
  if (tableBody) {
    // Memuat data ke dalam tabel
    bahanPokok.forEach((bahan, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
                <td>${index + 1}</td>
                <td>${bahan.nama}</td>
                <td>Rp.${bahan.harga.toLocaleString()},00</td>
                <td>${bahan.tanggal}</td>
                <td><button class="hapus-btn">Hapus</button></td>
            `;

      tableBody.appendChild(row);
    });

    // Tambahkan event listener untuk tombol hapus
    tableBody.querySelectorAll(".hapus-btn").forEach((button, index) => {
      button.addEventListener("click", function () {
        // Menghapus baris tabel
        tableBody.deleteRow(index);
      });
    });
  }

  // Login Form Submission
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      // Dummy login logic
      if (username === "admin" && password === "password") {
        window.location.href = "dashboard.html";
      } else {
        document.getElementById("error-message").textContent =
          "Invalid username or password";
      }
    });
  }

  // Logout
  const logoutButton = document.getElementById("logout");
  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      window.location.href = "login.html";
    });
  }
});
