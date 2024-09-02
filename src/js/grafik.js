document.addEventListener("DOMContentLoaded", async () => {
  const bahanBakuSelect = document.getElementById("bahanBaku");
  const grafikForm = document.getElementById("grafikForm");
  const hargaChart = document.getElementById("hargaChart").getContext("2d");

  let chartInstance;

  // Fungsi untuk fetch bahan baku unik dari server
  async function fetchBahanBaku() {
    try {
      const response = await fetch("http://localhost:3000/items");
      const items = await response.json();

      if (response.ok) {
        // Ambil nama bahan baku yang unik
        const uniqueItems = [...new Set(items.map((item) => item.name))];

        uniqueItems.forEach((name) => {
          const option = document.createElement("option");
          option.value = name;
          option.textContent = name;
          bahanBakuSelect.appendChild(option);
        });
      } else {
        console.error("Error fetching items:", items.error);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  }

  // Fungsi untuk fetch data grafik dan menampilkannya di chart
  async function fetchGrafikData(bulanA, bulanB, bahanBaku) {
    // Validasi bulan
    if (new Date(bulanA) > new Date(bulanB)) {
      alert("Bulan mulai tidak boleh lebih besar dari bulan akhir.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/grafik-data?bulanA=${bulanA}&bulanB=${bulanB}&bahanBaku=${bahanBaku}`
      );
      const data = await response.json();

      if (response.ok) {
        const labels = data.map((entry) => entry.month);
        const prices = data.map((entry) => entry.average_price);

        if (chartInstance) {
          chartInstance.destroy(); // Hapus grafik sebelumnya jika ada
        }

        chartInstance = new Chart(hargaChart, {
          type: "line",
          data: {
            labels: labels,
            datasets: [
              {
                label: `Rata-rata Harga ${bahanBaku}`,
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
    const bahanBaku = document.getElementById("bahanBaku").value;

    fetchGrafikData(bulanA, bulanB, bahanBaku);
  });

  // Load bahan baku saat halaman dimuat
  await fetchBahanBaku();
});
