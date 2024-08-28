//TONG DIOTAKATIK!
//TONG DIOTAKATIK!
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
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(
  cors({
    origin: "*",
  })
);

// Endpoint Registrasi
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const { data: existingUser, error: existingUserError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUser) {
      return res.status(409).json({ error: "Email already registered." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // input ke db
    const { data: user, error } = await supabase
      .from("users")
      .insert([{ name, email, password: hashedPassword }])
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
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    res
      .status(200)
      .json({
        message: "Login successful.",
        userId: user.id,
        userName: user.name,
      });
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

    console.log("Items fetched:", items); // Log data untuk verifikasi

    res.status(200).json(items);
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Endpoint untuk menghapus item berdasarkan ID
app.delete("/items/:id", async (req, res) => {
  const itemId = req.params.id;

  console.log("Received DELETE request for item ID:", itemId); // Tambahkan log ini

  try {
    // Log request and Supabase query
    console.log("Attempting to delete item from Supabase");

    const { data, error } = await supabase
      .from("items")
      .delete()
      .eq("id", itemId);

    console.log("Supabase delete response:", { data, error }); // Tambahkan log ini

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

// Endpoint untuk menambahkan bahan pokok
app.post("/add-bahan", async (req, res) => {
  const { nama, harga, tanggal } = req.body;

  if (!nama || !harga || !tanggal) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const { data, error } = await supabase
      .from("items")
      .insert([{ name: nama, harga, tanggal }]);

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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
