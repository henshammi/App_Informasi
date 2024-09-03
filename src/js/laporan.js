async function generateReport() {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

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
    } else {
      console.error(data.error);
    }
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
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

// laporan.js
document.getElementById("generatePdf").addEventListener("click", async () => {
  const { jsPDF } = window.jspdf;

  // Ambil data dari tabel
  const table = document.querySelector("table");
  const pdf = new jsPDF();

  // Tambahkan judul
  pdf.setFontSize(16);
  pdf.text("Laporan Harga Bahan Pokok", 14, 20);

  // Tambahkan tabel ke PDF
  pdf.autoTable({ html: table, startY: 30 });

  // Simpan PDF
  pdf.save("laporan.pdf");
});
