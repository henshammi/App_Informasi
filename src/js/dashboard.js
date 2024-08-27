document.getElementById("userId").textContent = userId;
document.getElementById("userName").textContent = userName;

document.addEventListener('DOMContentLoaded', async () => {
  const tableBody = document.querySelector('#bahanTable tbody');
  const notificationElement = document.getElementById('notification');

  async function fetchItems() {
    try {
      const response = await fetch('http://localhost:3000/items');
      const items = await response.json();

      if (response.ok) {
        tableBody.innerHTML = ''; // Clear existing rows

        items.forEach((item, index) => {
          const row = document.createElement('tr');
          
          row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.name || 'Nama tidak tersedia'}</td>
            <td>${item.harga || 'Harga tidak tersedia'}</td>
            <td>${item.tanggal || 'Tanggal tidak tersedia'}</td>
            <td><button onclick="deleteItem(${item.id})">Delete</button></td>
          `;

          tableBody.appendChild(row);
        });
      } else {
        console.error('Error fetching items:', items.error);
      }
    } catch (error) {
      console.error('Error during fetch:', error);
    }
  }

  async function showNotification(message, type) {
    notificationElement.textContent = message;
    notificationElement.className = `notification ${type}`;
    notificationElement.style.display = 'block';

    setTimeout(() => {
      notificationElement.style.display = 'none';
    }, 3000); // Hide after 3 seconds
  }

  // Fetch items on page load
  await fetchItems();

  window.deleteItem = async function(itemId) {
    try {
      const response = await fetch(`http://localhost:3000/items/${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchItems();
        showNotification('Item berhasil dihapus', 'success');
      } else {
        const errorData = await response.json();
        showNotification('Gagal menghapus item', 'error');
        console.error('Failed to delete item:', errorData.error);
      }
    } catch (error) {
      showNotification('Error deleting item', 'error');
      console.error('Error deleting item:', error);
    }
  }
});
