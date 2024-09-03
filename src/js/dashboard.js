document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.querySelector("#bahanTable tbody");
  const notificationElement = document.getElementById("notification");
  let allItems = [];
  let filteredItems = [];
  let currentPage = 1;
  const itemsPerPage = 5; // Menampilkan 5 data per halaman

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

  async function showNotification(message, type) {
    notificationElement.textContent = message;
    notificationElement.className = `notification ${type}`;
    notificationElement.style.display = "block";

    setTimeout(() => {
      notificationElement.style.display = "none";
    }, 3000); // Hide after 3 seconds
  }

  function displayItems() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDisplay = filteredItems.slice(startIndex, endIndex);

    tableBody.innerHTML = ""; // Clear existing rows

    itemsToDisplay.forEach((item, index) => {
      const row = document.createElement("tr");

      // Convert the Base64 string to a Data URL
      const imgSrc = item.gambar ? `data:image/jpeg;base64,${item.gambar}` : "default.jpg";

      row.innerHTML = `
        <td>${startIndex + index + 1}</td>
        <td>${item.name || "Nama tidak tersedia"}</td>
        <td>${item.harga ? `Rp ${item.harga.toLocaleString("id-ID")}` : "Harga tidak tersedia"}</td>
        <td>${item.tanggal || "Tanggal tidak tersedia"}</td>
        <td><img src="${imgSrc}" alt="${item.name}" style="width: 50px; height: 50px;"></td>
        <td><button onclick="deleteItem(${item.id})">Delete</button></td>
      `;

      tableBody.appendChild(row);
    });
  }

  function setupPagination() {
    const pageCount = Math.ceil(filteredItems.length / itemsPerPage);
    let paginationHTML = "";

    for (let i = 1; i <= pageCount; i++) {
      paginationHTML += `<button class="pagination-button ${
        i === currentPage ? "disabled" : ""
      }" onclick="changePage(${i})">${i}</button>`;
    }

    document.getElementById("pagination").innerHTML = paginationHTML;
  }

  // Add functions to window object to make them accessible globally
  window.changePage = function (pageNumber) {
    currentPage = pageNumber;
    displayItems();
    setupPagination();
  };

  window.filterItems = function () {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const minPrice = parseFloat(document.getElementById("minPrice").value) || 0;
    const maxPrice = parseFloat(document.getElementById("maxPrice").value) || Infinity;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    filteredItems = allItems.filter((item) => {
      const harga = parseFloat(item.harga);
      const tanggal = item.tanggal;

      const isWithinPriceRange = harga >= minPrice && harga <= maxPrice;
      const isWithinDateRange = (!startDate || tanggal >= startDate) && (!endDate || tanggal <= endDate);
      const matchesSearchTerm = item.name.toLowerCase().includes(searchTerm);

      return isWithinPriceRange && isWithinDateRange && matchesSearchTerm;
    });

    currentPage = 1; // Reset to first page after filtering
    displayItems();
    setupPagination();
  };

  window.deleteItem = async function (itemId) {
    const confirmation = confirm("Apakah Anda yakin ingin menghapus item ini?");

    if (!confirmation) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/items/${itemId}`, {
        method: "DELETE",
      });

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

  // Event listeners for filter inputs
  document.getElementById("searchInput").addEventListener("keyup", window.filterItems);
  document.getElementById("minPrice").addEventListener("input", window.filterItems);
  document.getElementById("maxPrice").addEventListener("input", window.filterItems);
  document.getElementById("startDate").addEventListener("change", window.filterItems);
  document.getElementById("endDate").addEventListener("change", window.filterItems);

  // Fetch items on page load
  await fetchItems();
});
