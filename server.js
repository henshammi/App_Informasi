const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const multer = require("multer");
const XLSX = require("xlsx");
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

function checkAuth(req, res, next) {
  const loggedIn = req.session && req.session.user;
  req.loggedIn = loggedIn;
  next();
}

// Endpoint untuk memeriksa status login
app.get("/check-login", checkAuth, (req, res) => {
  res.json({ loggedIn: req.loggedIn });
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

// Middleware untuk menangani 404
app.use((req, res, next) => {
  res.status(404).sendFile(__dirname + "/public/404.html");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
