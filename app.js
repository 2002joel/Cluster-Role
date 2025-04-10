const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());  // Para que Express pueda parsear el JSON en las solicitudes

const PORT = process.env.PORT || 3000;

// Conexión a MySQL (Aiven)
const dbConfig = {
  host: "mysql-cluster-role-alextorresgomez47-b004.i.aivencloud.com",
  port: 11439,
  user: "avnadmin",
  password: "AVNS_tCVtikVVgXH9mp8Rb1F",
  database: "defaultdb",
  ssl: { rejectUnauthorized: false }
};

// Ruta para iniciar sesión
app.post("/api/login", async (req, res) => {
  const { email, pass } = req.body;

  if (!email || !pass) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);
    // Asegúrate de que la columna en la base de datos sea `pass` o cambia el nombre según tu tabla
    const [rows] = await connection.execute("SELECT * FROM usuarios WHERE email = ? AND pass = ?", [email, pass]);
    
    if (rows.length > 0) {
      res.json({ message: "Login exitoso" });
    } else {
      res.status(401).json({ error: "Credenciales incorrectas" });
    }

    await connection.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error del servidor: " + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});


