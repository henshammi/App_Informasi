let itemsPerPage = 12;
let currentPage = 1;
let allItems = [];
let filteredItems = [];

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

  for (let i = 1; i <= pageCount; i++) {
    paginationHTML += `<button class="pagination-button ${
      i === currentPage ? "disabled" : ""
    }" onclick="changePage(${i})">${i}</button>`;
  }

  document.getElementById("pagination").innerHTML = paginationHTML;
}

function changePage(pageNumber) {
  currentPage = pageNumber;
  displayItems();
  setupPagination();
}

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
