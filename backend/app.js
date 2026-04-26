require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// status(500).json itu artinya server error 
// status(200).json itu artinya jalan dan ok 


app.get("/api/v1/users", (req, res) => {
  console.log("get api direquest");
  database.query("SELECT * FROM users", (err, rows) => {
    if (err) throw err;
    res.json({
      succses: true,
      message: "getting users data",
      data: rows,
    });
  });
});

app.post("/api/v1/users", async(req, res) => {
  const { nama, email, password } = req.body;
  
  if (!nama || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "nama wajib diisi",
    });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const sql = "INSERT INTO users (nama, email, password) VALUES (?, ?, ?)";
  
  database.query(sql, [nama, email, hashedPassword], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "gagal menambahkan data user",
      });
    }

    res.status(201).json({
      success: true,
      message: "data user berhasil ditambahkan",
      data: {
        id: result.insertId,
        nama,
        email,
      },
    });
  });
});

app.post("/api/v1/login", (req, res) => {
  const { nama, password } = req.body;

  
  if (!nama || !password) {
    return res.status(400).json({
      success: false,
      message: "username dan password wajib diisi",
    });
  }
  
  database.query(
    "SELECT id, nama, password FROM users WHERE nama = ?",
    [nama],
    async (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          message: "server error",
        });
      } 
      
      if (rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: "nama atau password salah",
        });
      }
      
      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "nama atau password salah",
        });
      }

      res.status(200).json({
        success: true,
        message: "selamat datang",
        data: {
          id: user.id,
          nama: user.nama
        },
      });
    },
  );
});

app.listen(3000, () => {
  console.log("server jalan di localhost http://localhost:3000");
});
