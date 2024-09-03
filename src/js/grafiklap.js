document.addEventListener("DOMContentLoaded", async () => {
  const grafikForm = document.getElementById("grafikForm");
  const hargaChart = document.getElementById("hargaChart").getContext("2d");

  let chartInstance;

  // Fungsi untuk fetch data grafik dan menampilkannya di chart
  async function fetchGrafikData(bulanA, bulanB) {
    // Validasi bulan
    if (new Date(bulanA) > new Date(bulanB)) {
      alert("Bulan mulai tidak boleh lebih besar dari bulan akhir.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/grafik-laporan?bulanA=${bulanA}&bulanB=${bulanB}`);
      const data = await response.json();

      if (response.ok) {
        const labels = data.map((entry) => entry.bahanBaku);
        const prices = data.map((entry) => entry.average_price);

        if (chartInstance) {
          chartInstance.destroy(); // Hapus grafik sebelumnya jika ada
        }

        chartInstance = new Chart(hargaChart, {
          type: "line", // Ubah menjadi bar chart jika lebih sesuai
          data: {
            labels: labels,
            datasets: [
              {
                label: "Rata-rata Harga Bahan Pokok",
                data: prices,
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      } else {
        console.error("Error fetching grafik data:", data.error);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  }

  // Event listener untuk form submit
  grafikForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const bulanA = document.getElementById("bulanA").value;
    const bulanB = document.getElementById("bulanB").value;

    fetchGrafikData(bulanA, bulanB);
  });
});
