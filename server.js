// server.js

const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
require("dotenv").config();

// Konfigurasi Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: "*" }));

// Meningkatkan batas ukuran payload untuk body-parser
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use(express.static("public"));

// Endpoint Registrasi
app.post("/register", async (req, res) => {
  const { name, email, password, alamat, no_hp } = req.body;

  if (!name || !email || !password || !alamat || !no_hp) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Cek apakah email sudah terdaftar
    const { data: existingUser, error: existingUserError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUser) {
      return res.status(409).json({ error: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Menambahkan pengguna baru ke database
    const { data: user, error } = await supabase
      .from("users")
      .insert([{ name, email, password: hashedPassword, alamat, no_hp }])
      .single();

    if (error) {
      console.error("Error creating user:", error.message);
      return res.status(500).json({ error: "Error creating user." });
    }

    res.status(201).json({ message: "User registered successfully.", user });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Endpoint Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const { data: user, error } = await supabase.from("users").select("*").eq("email", email).single();

    if (error || !user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    res.status(200).json({
      message: "Login successful.",
      userId: user.id,
      userName: user.name,
    });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Endpoint untuk mendapatkan data pengguna berdasarkan ID
app.get("/users/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const { data: user, error } = await supabase.from("users").select("*").eq("id", userId).single();

    if (error || !user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Endpoint untuk mendapatkan daftar items
app.get("/items", async (req, res) => {
  try {
    const { data: items, error } = await supabase.from("items").select("*");

    if (error) {
      console.error("Error fetching items:", error.message);
      return res.status(500).json({ error: "Error fetching items." });
    }

    res.status(200).json(items);
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Endpoint untuk menambahkan bahan pokok
app.post("/add-bahan", async (req, res) => {
  const { nama, harga, tanggal, gambar } = req.body;

  if (!nama || !harga || !tanggal || !gambar) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const { data, error } = await supabase
      .from("items")
      .insert([{ name: nama, harga, tanggal, gambar }])
      .single();

    if (error) {
      console.error("Error inserting data:", error.message);
      return res.status(500).json({ error: "Error inserting data." });
    }

    res.status(201).json({ message: "Data successfully added.", data });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Endpoint untuk menghapus item berdasarkan ID
app.delete("/items/:id", async (req, res) => {
  const itemId = req.params.id;

  try {
    const { data, error } = await supabase.from("items").delete().eq("id", itemId);

    if (error) {
      console.error("Error deleting item from Supabase:", error.message);
      return res.status(500).json({ error: "Error deleting item." });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Endpoint untuk mendapatkan data grafik rata-rata harga bahan pokok
app.get("/grafik-data", async (req, res) => {
  const { bulanA, bulanB, bahanBaku } = req.query;

  if (!bulanA || !bulanB || !bahanBaku) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const { data, error } = await supabase
      .from("items")
      .select("harga, tanggal")
      .gte("tanggal", `${bulanA}-01`)
      .lte("tanggal", `${bulanB}-31`)
      .eq("name", bahanBaku);

    if (error) {
      console.error("Error fetching grafik data:", error.message);
      return res.status(500).json({ error: "Error fetching grafik data." });
    }

    // Proses data untuk menghasilkan rata-rata harga per bulan
    const processedData = processGrafikData(data);
    res.status(200).json(processedData);
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Fungsi untuk memproses data dan menghitung rata-rata harga per bulan
function processGrafikData(items) {
  const monthlyData = {};

  items.forEach((item) => {
    const month = item.tanggal.substring(0, 7); // Mengambil "YYYY-MM" dari tanggal
    if (!monthlyData[month]) {
      monthlyData[month] = { total: 0, count: 0 };
    }
    monthlyData[month].total += parseFloat(item.harga);
    monthlyData[month].count += 1;
  });

  return Object.keys(monthlyData).map((month) => {
    return {
      month,
      average_price: (monthlyData[month].total / monthlyData[month].count).toFixed(2),
    };
  });
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
