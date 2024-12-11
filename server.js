const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Menyajikan file statis dari folder 'public'
app.use(express.static("public"));

// Koneksi ke database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "lostandfound"
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
        return;
    }
    console.log("Connected to database.");
});

// Endpoint untuk mendapatkan data
app.get("/missing-persons", (req, res) => {
    const query = "SELECT * FROM missingpersons";
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching data:", err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
        res.json(results);
    });
});

// Endpoint untuk menambahkan data
app.post("/missing-persons", (req, res) => {
    const { name, age, last_seen, contact, description } = req.body;

    if (!name || !age || !last_seen || !contact || !description) {
        return res.status(400).json({ message: "Semua kolom wajib diisi." });
    }

    const query = "INSERT INTO missingpersons (name, age, last_seen, contact, description) VALUES (?, ?, ?, ?, ?)";
    db.query(query, [name, age, last_seen, contact, description], (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
        res.json({ message: "Data added successfully", id: result.insertId });
    });
});

// Endpoint untuk menampilkan halaman HTML
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/enjel.html");
});

// Menjalankan server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
