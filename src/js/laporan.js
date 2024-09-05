document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("userId");
  const generatePdfButton = document.getElementById("generatePdf");

  // Sembunyikan tombol "Generate PDF" saat halaman dimuat
  generatePdfButton.style.display = "none";

  // Simpan tanggal inputan secara global
  let startDate = "";
  let endDate = "";

  if (!userId) {
    window.location.href = "login.html";
    return;
  }

  async function generateReport() {
    startDate = document.getElementById("startDate").value;
    endDate = document.getElementById("endDate").value;

    if (!startDate || !endDate) {
      alert("Harap masukkan tanggal mulai dan tanggal akhir.");
      return;
    }

    try {
      const response = await fetch(
        `https://serverbapokbeta.vercel.app/laporan?startDate=${startDate}&endDate=${endDate}`
      );
      const data = await response.json();

      if (response.ok) {
        displayReport(data);
        // Tampilkan tombol "Generate PDF" setelah laporan berhasil ditampilkan
        generatePdfButton.style.display = "block";
      } else {
        console.error(data.error);
        generatePdfButton.style.display = "none"; // Sembunyikan tombol jika ada error
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      generatePdfButton.style.display = "none"; // Sembunyikan tombol jika terjadi kesalahan
    }
  }

  function displayReport(data) {
    const reportContainer = document.getElementById("reportContainer");
    reportContainer.innerHTML = "";

    if (data.length === 0) {
      reportContainer.innerHTML = "<p>Tidak ada data untuk ditampilkan.</p>";
      return;
    }

    const table = document.createElement("table");
    table.innerHTML = `
      <thead>
        <tr>
          <th>Nama Bahan Pokok</th>
          <th>Harga Rata-Rata</th>
        </tr>
      </thead>
      <tbody>
        ${data
          .map(
            (item) => `
              <tr>
                <td>${item.bahanBaku}</td>
                <td>Rp ${parseFloat(item.average_price).toLocaleString("id-ID", { minimumFractionDigits: 0 })}</td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    `;

    reportContainer.appendChild(table);
  }

  document.getElementById("generatePdf").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    pdf.setFontSize(16);
    pdf.text("Laporan Harga Bahan Pokok", 14, 20);

    // Tambahkan tanggal inputan ke dalam PDF
    pdf.setFontSize(12);
    pdf.text(`Dari tanggal: ${startDate}`, 14, 30);
    pdf.text(`Sampai Tanggal: ${endDate}`, 14, 40);

    const table = document.querySelector("table");
    if (table) {
      pdf.autoTable({ html: table, startY: 50 }); // Sesuaikan posisi tabel
    }

    pdf.save("laporan.pdf");
  });

  // Export fungsi generateReport agar bisa dipanggil dari onclick di HTML
  window.generateReport = generateReport;
});
