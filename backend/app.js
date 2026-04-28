require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const path = require("path");
const port = process.env.PORT || 3000;

app.use("/view-uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use(express.json());


const userRoutes = require("./routes/userRoutes");

app.use("/api/v1/users", userRoutes);

app.listen(3000, () => {
  console.log("server jalan di localhost http://localhost:3000");
});
