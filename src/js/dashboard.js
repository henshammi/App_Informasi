document.addEventListener("DOMContentLoaded", function () {
  const bahanPokok = [
    { nama: "Beras", tanggal: "2024-08-20", harga: 12000 },
    { nama: "Gula", tanggal: "2024-08-21", harga: 15000 },
    { nama: "Minyak Goreng", tanggal: "2024-08-22", harga: 14000 },
    { nama: "Telur", tanggal: "2024-08-23", harga: 2000 },
    { nama: "Daging Ayam", tanggal: "2024-08-24", harga: 35000 },
  ];

  const tableBody = document.querySelector("#bahanTable tbody");
  if (tableBody) {
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

    tableBody.querySelectorAll(".hapus-btn").forEach((button, index) => {
      button.addEventListener("click", function () {
        tableBody.deleteRow(index);
      });
    });
  }
});
