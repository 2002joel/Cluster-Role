const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conexión a MySQL (Aiven)
const connection = mysql.createConnection({
  host: "mysql-cluster-role-alextorresgomez47-b004.i.aivencloud.com",
  user: "avnadmin",
  password: "AVNS_tCVtikVVgXH9mp8Rb1F",
  database: "defaultdb",
  port: 11439,
  ssl: {
    rejectUnauthorized: false
  }
});

connection.connect(err => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
  } else {
    console.log("Conexión exitosa a la base de datos Aiven");
  }
});

// Ruta de login
app.post("/api/login", (req, res) => {
  const { email, pass } = req.body;

  const query = "SELECT * FROM usuarios WHERE email = ? AND pass = ?";
  connection.query(query, [email, pass], (err, results) => {
    if (err) {
      console.error("Error en la consulta:", err);
      return res.status(500).send("Error en el servidor");
    }

    if (results.length > 0) {
      res.status(200).send("Login exitoso");
    } else {
      res.status(401).send("Email o contraseña incorrectos");
    }
  });
});

// Escuchar en el puerto asignado por Vercel (exportación)
module.exports = app;


