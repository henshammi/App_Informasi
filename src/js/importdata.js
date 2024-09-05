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

  const dropZone = document.getElementById("dropZone");
  const fileInput = document.getElementById("fileInput");
  const fileNameDisplay = document.getElementById("fileNameDisplay");

  let file;

  // Drag and drop event handlers
  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("drag-over");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("drag-over");
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("drag-over");
    file = e.dataTransfer.files[0];
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInput.files = dataTransfer.files; // Update file input dengan file yang di-drop

    // Tampilkan nama file setelah di-drop
    fileNameDisplay.textContent = `File yang dipilih: ${file.name}`;
  });

  dropZone.addEventListener("click", () => {
    fileInput.click(); // Klik file input ketika drop zone diklik
  });

  fileInput.addEventListener("change", (e) => {
    file = e.target.files[0]; // Dapatkan file dari input

    // Tampilkan nama file setelah dipilih
    fileNameDisplay.textContent = `File yang dipilih: ${file.name}`;
  });

  document.getElementById("importForm").addEventListener("submit", async (event) => {
    event.preventDefault(); // Mencegah perilaku default dari form
    if (!file) {
      alert("Silakan pilih atau drag file.");
      return;
    }

    // Tampilkan modal konfirmasi
    const modal = document.getElementById("confirmationModal");
    modal.style.display = "block";

    // Pastikan hanya menambahkan event listener sekali
    document.getElementById("confirmBtn").onclick = async () => {
      modal.style.display = "none"; // Tutup modal setelah konfirmasi
      document.getElementById("loading").style.display = "flex";

      try {
        const data = await readExcelFile(file);

        // Periksa apakah data kosong
        if (data.length === 0) {
          showNotification("error: File excel tidak boleh kosong", "error");
          return;
        }

        console.log("Data to be sent:", data);

        const json = JSON.stringify(data);

        // Kirim data ke server
        const response = await fetch("https://serverbapokbeta.vercel.app/import-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: json,
        });

        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }

        const result = await response.json();
        console.log(result);
        showNotification("Berhasil menginputkan data", "success");
        // Reset file input setelah data berhasil diimpor
        fileInput.value = ""; // Reset file input
        fileNameDisplay.textContent = ""; // Kosongkan tampilan nama file
        file = null; // Hapus file dari variabel
      } catch (error) {
        console.error("Error:", error);
        showNotification("Terjadi kesalahan pada server.", "error");
      } finally {
        // Menyembunyikan animasi loading setelah selesai
        document.getElementById("loading").style.display = "none";
      }
    };

    document.getElementById("cancelBtn").onclick = () => {
      modal.style.display = "none"; // Tutup modal jika dibatalkan
    };
  });

  async function readExcelFile(file) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file);
    const worksheet = workbook.worksheets[0];
    const data = [];

    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      if (rowNumber > 1) {
        const nama = row.getCell(1).text;
        const harga = row.getCell(2).text;
        const cellTanggal = row.getCell(3);
        const gambar = row.getCell(4).text;

        // Tangani format tanggal
        let tanggal;
        if (cellTanggal.value instanceof Date) {
          tanggal = formatTanggal(cellTanggal.value);
        } else {
          const dateStr = cellTanggal.text;
          tanggal = formatTanggal(new Date(dateStr));
        }

        // Hanya tambahkan jika semua field ada
        if (nama && harga && tanggal && gambar) {
          data.push({
            nama,
            harga,
            tanggal,
            gambar,
          });
        }
      }
    });

    return data;
  }

  function formatTanggal(tanggal) {
    if (tanggal instanceof Date) {
      const year = tanggal.getFullYear();
      const month = (tanggal.getMonth() + 1).toString().padStart(2, "0");
      const day = tanggal.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    console.error("Invalid date:", tanggal);
    return "";
  }
});
