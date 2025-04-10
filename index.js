const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = 3000;

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
    rejectUnauthorized: true
  }
});

// Conectar
conn.connect((err) => {
  if (err) {
    console.error('Error conectando a MySQL:', err.message);
  } else {
    console.log('Conectado a MySQL en Aiven');
  }
});

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
        req.session.user_id = usuario.id;
        req.session.user_name = usuario.nombre;
        res.send('Bienvenido, ' + usuario.nombre);
      } else {
        res.status(401).send('Credenciales incorrectas.');
      }
    });
  } else {
    res.status(400).send('Modo no válido.');
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
