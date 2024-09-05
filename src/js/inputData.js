document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("userId");

  // Jika userId tidak ada, artinya pengguna belum login
  if (!userId) {
    window.location.href = "login.html";
    return;
  }

  function showNotification(message, type) {
    const notificationElement = document.getElementById("notification");
    notificationElement.textContent = message;
    notificationElement.className = `notification ${type} hide`; // Mulai dari posisi tersembunyi
    notificationElement.style.display = "block"; // Tampilkan elemen terlebih dahulu

    // Gunakan setTimeout untuk memicu perubahan animasi
    setTimeout(() => {
      notificationElement.classList.remove("hide");
      notificationElement.classList.add("show"); // Tambahkan kelas 'show' untuk animasi muncul
    }, 10); // Timeout kecil agar transisi terjadi

    // Setelah 3 detik, sembunyikan notifikasi lagi
    setTimeout(() => {
      notificationElement.classList.remove("show");
      notificationElement.classList.add("hide");
      setTimeout(() => {
        notificationElement.style.display = "none"; // Sembunyikan setelah animasi keluar
        notificationElement.classList.remove("hide");
      }, 500); // Waktu ini harus sesuai dengan durasi transisi
    }, 3000); // Tampilkan notifikasi selama 3 detik
  }

  // Jika pengguna sudah login, lanjutkan dengan inisialisasi form dan event listener
  document.getElementById("bahanForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    document.getElementById("loading").style.display = "flex";
    const nama = document.getElementById("nama").value;
    const harga = document.getElementById("harga").value;
    const tanggal = document.getElementById("tanggal").value;
    const gambarInput = document.getElementById("gambar").files[0];

    if (gambarInput) {
      const reader = new FileReader();

      reader.onloadend = async function () {
        // Menghapus prefix data URL dan mengambil string Base64
        const base64String = reader.result.replace(/^data:.+;base64,/, "");

        try {
          const response = await fetch("https://serverbapokbeta.vercel.app/add-bahan", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nama,
              harga,
              tanggal,
              gambar: base64String, // Mengirim string Base64 ke server
            }),
          });

          const result = await response.json();

          if (response.ok) {
            showNotification("Berhasil menginputkan data", "success");
          } else {
            showNotification(result.error, "error");
          }
        } catch (error) {
          console.error("Error:", error);
          showNotification("Terjadi kesalahan pada server.", "error");
        } finally {
          // Menyembunyikan animasi loading setelah selesai
          document.getElementById("loading").style.display = "none";
          document.getElementById("bahanForm").reset(); // Reset form setelah selesai
        }
      };

      reader.readAsDataURL(gambarInput); // Membaca gambar sebagai Data URL
    } else {
      // Jika tidak ada gambar yang diunggah, kirim data tanpa gambar
      try {
        const response = await fetch("https://serverbapokbeta.vercel.app/add-bahan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nama,
            harga,
            tanggal,
            gambar: null, // Tidak ada gambar, kirim null
          }),
        });

        const result = await response.json();

        if (response.ok) {
          showNotification("Berhasil menginputkan data", "success");
        } else {
          showNotification(result.error, "error");
        }
      } catch (error) {
        console.error("Error:", error);
        showNotification("Terjadi kesalahan pada server.", "error");
      } finally {
        // Menyembunyikan animasi loading setelah selesai
        document.getElementById("loading").style.display = "none";
        document.getElementById("bahanForm").reset(); // Reset form setelah selesai
      }
    }
  });
});
