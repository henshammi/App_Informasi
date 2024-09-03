async function generateReport() {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  if (!startDate || !endDate) {
    alert("Harap masukkan tanggal mulai dan tanggal akhir.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/laporan?startDate=${startDate}&endDate=${endDate}`);
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
