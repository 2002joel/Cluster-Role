const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "tu-host.aivencloud.com",
  port: 11439,
  user: "tu-usuario",
  password: "tu-contraseña",
  database: "tu-bd",
  ssl: { rejectUnauthorized: true }
});

app.post("/", (req, res) => {
  const { email, pass } = req.body;

  const query = "SELECT * FROM usuarios WHERE email = ? AND pass = ?";
  db.execute(query, [email, pass], (err, results) => {
    if (err) {
      console.error("Error en la BD:", err);
      return res.status(500).json({ error: "Error en la base de datos" });
    }

    if (results.length > 0) {
      res.json({ mensaje: "Login correcto", usuario: results[0] });
    } else {
      res.json({ mensaje: "Credenciales incorrectas" });
    }
  });
});

app.listen(11439, () => {
  console.log("Servidor Node.js escuchando en puerto 11439");
});



