document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("bahanForm");
  const message = document.getElementById("message");
  const preview = document.getElementById("preview");
  const gambarInput = document.getElementById("gambar");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const nama = document.getElementById("nama").value.trim();
    const harga = document.getElementById("harga").value.trim();
    const tanggal = document.getElementById("tanggal").value;
    const gambar = gambarInput.files[0];

    if (nama && harga && tanggal && gambar) {
      if (isNaN(harga) || harga <= 0) {
        message.textContent = "Harga harus berupa angka positif!";
        message.style.color = "red";
        return;
      }

      message.textContent = `Data berhasil ditambahkan: ${nama}, Rp.${harga}, ${tanggal}`;
      message.style.color = "green";

      form.reset();
      preview.style.display = "none";
    } else {
      message.textContent = "Semua field harus diisi!";
      message.style.color = "red";
    }
  });

  gambarInput.addEventListener("change", function () {
    const file = gambarInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        preview.src = e.target.result;
        preview.style.display = "block";
      };
      reader.readAsDataURL(file);
    } else {
      preview.style.display = "none";
    }
  });
});
