document.getElementById('bahanForm').addEventListener('submit', async (event) => {
  event.preventDefault(); // Mencegah form dari pengiriman default

  const nama = document.getElementById('nama').value;
  const harga = document.getElementById('harga').value;
  const tanggal = document.getElementById('tanggal').value;

  try {
      const response = await fetch('http://localhost:3000/add-bahan', { // Ganti dengan URL yang sesuai
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ nama, harga, tanggal })
      });

      const result = await response.json();

      if (response.ok) {
          document.getElementById('message').textContent = result.message;
          document.getElementById('bahanForm').reset(); // Reset form
      } else {
          document.getElementById('message').textContent = result.error;
      }
  } catch (error) {
      console.error('Error:', error);
      document.getElementById('message').textContent = 'Internal server error.';
  }
});
