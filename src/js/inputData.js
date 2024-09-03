document.getElementById("bahanForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  // Menampilkan animasi loading
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
        const response = await fetch("http://localhost:3000/add-bahan", {
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
          document.getElementById("message").textContent = result.message;
          document.getElementById("bahanForm").reset(); // Reset form setelah berhasil
        } else {
          document.getElementById("message").textContent = result.error;
        }
      } catch (error) {
        console.error("Error:", error);
        document.getElementById("message").textContent = "Internal server error.";
      } finally {
        // Menyembunyikan animasi loading setelah selesai
        document.getElementById("loading").style.display = "none";
      }
    };

    reader.readAsDataURL(gambarInput); // Membaca gambar sebagai Data URL
  } else {
    // Jika tidak ada gambar yang diunggah, kirim data tanpa gambar
    try {
      const response = await fetch("http://localhost:3000/add-bahan", {
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
        document.getElementById("message").textContent = result.message;
        document.getElementById("bahanForm").reset();
      } else {
        document.getElementById("message").textContent = result.error;
      }
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("message").textContent = "Internal server error.";
    } finally {
      // Menyembunyikan animasi loading setelah selesai
      document.getElementById("loading").style.display = "none";
    }
  }
});
