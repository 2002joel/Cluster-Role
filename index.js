const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');

const app = express();
const port = 11439;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret: 'clave_secreta',
  resave: false,
  saveUninitialized: true
}));

// Configurar la conexión a la base de datos Aiven
const conn = mysql.createConnection({
  host: 'mysql-cluster-role-alextorresgomez47-b004.i.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS_tCVtikVVgXH9mp8Rb1F',
  database: 'defaultdb',
  port: 11439,
  ssl: {
    rejectUnauthorized: true,
    // Si necesitas usar certificados SSL, descomenta y configura los archivos correspondientes
    // ca: fs.readFileSync('path_to_ca.pem'),
    // key: fs.readFileSync('path_to_client_key.pem'),
    // cert: fs.readFileSync('path_to_client_cert.pem')
  }
});

// Conectar a la base de datos
conn.connect((err) => {
  if (err) {
    console.error('Error conectando a MySQL:', err.message);
  } else {
    console.log('Conectado a MySQL en Aiven');
  }
});
export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Permite cualquier origen
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  res.status(200).json({ message: "CORS habilitado" });
}

// Ruta principal para registro/login
app.post('/auth', async (req, res) => {
  const { modo, email, password, nombre } = req.body;

  if (!modo || !email || !password) {
    return res.status(400).send("Faltan parámetros en la solicitud.");
  }

  if (modo === 'registro') {
    if (!nombre) return res.status(400).send("Faltan datos para el registro.");

    conn.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).send('Error al verificar el email.');

      if (results.length > 0) {
        return res.status(400).send('Este correo ya está registrado.');
      }

      // Hash de la contraseña utilizando bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);

      conn.query(
        'INSERT INTO usuarios (nombre, email, pass) VALUES (?, ?, ?)',
        [nombre, email, hashedPassword],
        (err) => {
          if (err) return res.status(500).send('Error en el registro: ' + err.message);
          return res.send('¡Registro exitoso!');
        }
      );
    });

  } else if (modo === 'login') {
    conn.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).send('Error en la base de datos.');

      if (results.length === 0) return res.status(401).send('Credenciales incorrectas.');

      const usuario = results[0];
      const match = await bcrypt.compare(password, usuario.pass);

      if (match) {
        // Configurar la sesión del usuario
        req.session.user_id = usuario.id;
        req.session.user_name = usuario.nombre;
        return res.send('Bienvenido, ' + usuario.nombre);
      } else {
        return res.status(401).send('Credenciales incorrectas.');
      }
    });
  } else {
    return res.status(400).send('Modo no válido.');
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
