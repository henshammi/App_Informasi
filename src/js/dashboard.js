document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.querySelector("#bahanTable tbody");
  const notificationElement = document.getElementById("notification");
  const notification2 = document.getElementById("notification2");

  let allItems = [];
  let filteredItems = [];
  let currentPage = 1;
  const itemsPerPage = 10;

  const userId = localStorage.getItem("userId");
  console.log("User ID saat ini:", userId);

  if (!userId) {
    window.location.href = "login.html";
  }

  async function fetchItems() {
    try {
      const response = await fetch("http://localhost:3000/items");
      const items = await response.json();

      if (response.ok) {
        allItems = items; // Store all items
        filterItems(); // Apply filters and display items
      } else {
        console.error("Error fetching items:", items.error);
        showNotification("Gagal mengambil data item", "error");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      showNotification("Terjadi kesalahan saat mengambil data", "error");
    }
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
    }, 3000); // Tampilkan notifikasi selama 3 detik
  }

  //notif login
  function showNotification2(message, isSuccess = true) {
    notification2.textContent = message;
    notification2.classList.remove("hidden", "success", "error");
    notification2.classList.add(isSuccess ? "success" : "error", "visible");

    setTimeout(() => {
      notification2.classList.remove("visible");
      notification2.classList.add("hidden");
    }, 5000);
  }

  const loginSuccess = localStorage.getItem("loginSuccess");
  if (loginSuccess) {
    showNotification2(loginSuccess, true);
    localStorage.removeItem("loginSuccess"); // Hapus pesan setelah ditampilkan
  }

  function displayItems() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDisplay = filteredItems.slice(startIndex, endIndex);

    tableBody.innerHTML = ""; // Clear existing rows

    itemsToDisplay.forEach((item, index) => {
      const row = document.createElement("tr");

      // Convert the Base64 string to a Data URL
      const imgSrc = item.gambar
        ? `data:image/jpeg;base64,${item.gambar}`
        : "default.jpg";

      row.innerHTML = `
        <td>${startIndex + index + 1}</td>
        <td>${item.name || "Nama tidak tersedia"}</td>
        <td>${
          item.harga
            ? `Rp ${item.harga.toLocaleString("id-ID")}`
            : "Harga tidak tersedia"
        }</td>
        <td>${item.tanggal || "Tanggal tidak tersedia"}</td>
        <td><img src="${imgSrc}" alt="${
        item.name
      }" style="width: 50px; height: 50px;"></td>
        <td><button onclick="confirmDeleteItem(${item.id})">Delete</button></td>
      `;

      tableBody.appendChild(row);
    });
  }

  function setupPagination() {
    const pageCount = Math.ceil(filteredItems.length / itemsPerPage);
    let paginationHTML = "";

    // Tombol ke halaman pertama
    if (currentPage > 1) {
      paginationHTML += `<button class="pagination-button" onclick="changePage(1)">
                           <i class="fas fa-angle-double-left"></i> First
                         </button>`;
    }

    // Tombol previous
    if (currentPage > 1) {
      paginationHTML += `<button class="pagination-button" onclick="changePage(${
        currentPage - 1
      })">
                            <i class="bx bx-left-arrow-alt"></i>
                         </button>`;
    }

    // Tombol next
    if (currentPage < pageCount) {
      paginationHTML += `<button class="pagination-button" onclick="changePage(${
        currentPage + 1
      })">
                            <i class="bx bx-right-arrow-alt"></i>
                         </button>`;
    }

    // Tombol ke halaman terakhir
    if (currentPage < pageCount) {
      paginationHTML += `<button class="pagination-button" onclick="changePage(${pageCount})">
                           Last <i class="fas fa-angle-double-right"></i>
                         </button>`;
    }

    document.getElementById("pagination-buttons").innerHTML = paginationHTML;

    // Tampilkan teks "Page X of Y"
    document.getElementById(
      "pagination-info"
    ).innerHTML = `Page ${currentPage} of ${pageCount}`;
  }

  // Add functions to window object to make them accessible globally
  window.changePage = function (pageNumber) {
    currentPage = pageNumber;
    displayItems();
    setupPagination();
  };

  window.filterItems = function () {
    const searchTerm = document
      .getElementById("searchInput")
      .value.toLowerCase();
    const minPrice = parseFloat(document.getElementById("minPrice").value) || 0;
    const maxPrice =
      parseFloat(document.getElementById("maxPrice").value) || Infinity;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    filteredItems = allItems.filter((item) => {
      const harga = parseFloat(item.harga);
      const tanggal = item.tanggal;

      const isWithinPriceRange = harga >= minPrice && harga <= maxPrice;
      const isWithinDateRange =
        (!startDate || tanggal >= startDate) &&
        (!endDate || tanggal <= endDate);
      const matchesSearchTerm = item.name.toLowerCase().includes(searchTerm);

      return isWithinPriceRange && isWithinDateRange && matchesSearchTerm;
    });

    currentPage = 1; // Reset to first page after filtering
    displayItems();
    setupPagination();
  };

  function showConfirmModal(itemId) {
    const modal = document.getElementById("confirmModal");
    const confirmYesButton = document.getElementById("confirmYes");
    const confirmNoButton = document.getElementById("confirmNo");
    const closeModal = document.querySelector(".modal .close");

    modal.style.display = "block";

    confirmYesButton.onclick = async () => {
      modal.style.display = "none";
      try {
        const response = await fetch(
          `https://serverbapokbeta.vercel.app/items/${itemId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          await fetchItems();
          showNotification("Item berhasil dihapus", "success");
        } else {
          const errorData = await response.json();
          showNotification("Gagal menghapus item", "error");
          console.error("Failed to delete item:", errorData.error);
        }
      } catch (error) {
        showNotification("Terjadi kesalahan saat menghapus item", "error");
        console.error("Error deleting item:", error);
      }
    };

    confirmNoButton.onclick = () => {
      modal.style.display = "none";
    };

    closeModal.onclick = () => {
      modal.style.display = "none";
    };
  }

  window.confirmDeleteItem = function (itemId) {
    showConfirmModal(itemId);
  };

  // Event listeners for filter inputs
  document
    .getElementById("searchInput")
    .addEventListener("keyup", window.filterItems);
  document
    .getElementById("minPrice")
    .addEventListener("input", window.filterItems);
  document
    .getElementById("maxPrice")
    .addEventListener("input", window.filterItems);
  document
    .getElementById("startDate")
    .addEventListener("change", window.filterItems);
  document
    .getElementById("endDate")
    .addEventListener("change", window.filterItems);

  // Fetch items on page load
  await fetchItems();
});
