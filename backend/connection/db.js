const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: process.env.DB_CONN_LIMIT || 15,
  queueLimit: 0,
  charset: "utf8mb4"
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error(" Gagal konek:", err.message);
    process.exit(1);
  }
  console.log("Database terhubung");
  connection.release();
});

module.exports = pool.promise();
