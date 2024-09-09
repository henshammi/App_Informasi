let itemsPerPage = 12;
let currentPage = 1;
let allItems = [];
let filteredItems = [];

window.onload = function () {
  fetchItems();
};

function fetchItems() {
  fetch("http://localhost:3000/items")
    .then((response) => response.json())
    .then((data) => {
      allItems = data;
      filteredItems = allItems;
      displayItems();
      setupPagination();
    })
    .catch((error) => console.error("Error fetching items:", error));
}
function formatHarga(harga) {
  return parseFloat(harga).toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function displayItems() {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = filteredItems.slice(startIndex, endIndex);

  const table = `
                <table>
                    <thead>
                        <tr>
                            <th>Nama Bahan Pokok</th>
                            <th>Harga</th>
                            <th>Tanggal</th>
                            <th>Gambar</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsToDisplay
                          .map(
                            (item) => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${formatHarga(item.harga)}</td>
                                <td>${item.tanggal}</td>
                                <td><img src="${
                                  item.gambar ? `data:image/jpeg;base64,${item.gambar}` : "default.jpg"
                                }" alt="${item.name}" style="width: 50px; height: 50px;"></td>
                            </tr>
                        `
                          )
                          .join("")}
                    </tbody>
                </table>
            `;

  document.getElementById("itemsTable").innerHTML = table;

  const bahanContainer = document.querySelector(".bahan");
  if (bahanContainer) {
    bahanContainer.innerHTML = itemsToDisplay
      .map(
        (item) => `
      <div class="bahan-item">
        <div class="nama-item">
          <h2>${item.name}</h2>
        </div>

        <div class="grid-item"> 
          <div class="gambar-item">
            <img src="${item.gambar ? `data:image/jpeg;base64,${item.gambar}` : "default.jpg"}" alt="${
          item.name
        }" style="width: 70px; height: 70px;">
          </div>
          <div class="grid-item-v2">
            <div class="harga-item">
              <h2>${formatHarga(item.harga)}</h2>
              <p class="desc-item">/KG</p>
            </div>
            <div class="tanggal-item">            
              <p>${item.tanggal}</p>
            </div>
          </div>
        </div>

      </div>
    `
      )
      .join("");
  }
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
    paginationHTML += `<button class="pagination-button" onclick="changePage(${currentPage - 1})">
                          <i class="bx bx-left-arrow-alt"></i>
                       </button>`;
  }

  // Tombol next
  if (currentPage < pageCount) {
    paginationHTML += `<button class="pagination-button" onclick="changePage(${currentPage + 1})">
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
  document.getElementById("pagination-info").innerHTML = `Page ${currentPage} of ${pageCount}`;
}

// Add functions to window object to make them accessible globally
window.changePage = function (pageNumber) {
  currentPage = pageNumber;
  displayItems();
  setupPagination();
};

function searchItems() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  filterItems(searchTerm);
}

function filterItems(searchTerm = "") {
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

  currentPage = 1;
  displayItems();
  setupPagination();
}
