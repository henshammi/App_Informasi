document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("userId");

  // Jika userId tidak ada, artinya pengguna belum login
  if (!userId) {
    window.location.href = "login.html";
    return;
  }

  document.getElementById("importForm").addEventListener("submit", async (event) => {
    event.preventDefault(); // Mencegah perilaku default dari form

    // Menampilkan dialog konfirmasi sebelum melanjutkan
    const confirmation = confirm(
      "Apakah Anda yakin ingin mengimpor data? Pastikan data pada file excel sudah benar sebelum melanjutkan."
    );

    if (!confirmation) {
      return; // Jika user memilih "Batal", eksekusi dihentikan
    }

    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
      alert("Silakan pilih file.");
      return;
    }

    try {
      const data = await readExcelFile(file);
      console.log("Data to be sent:", data); // Tambahkan log untuk memeriksa data

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
      alert("Data berhasil diimpor!");
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan.");
    }
  });

  async function readExcelFile(file) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file);
    const worksheet = workbook.worksheets[0];
    const data = [];

    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      if (rowNumber > 1) {
        // Skip header
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
