const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 11439;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Conexión a MySQL en Aiven
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

conn.connect((err) => {
  if (err) {
    console.error('Error al conectar a MySQL:', err.message);
    process.exit();
  }
  console.log('Conectado a MySQL (Aiven)');
});

// Página de login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Procesar login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.send('Faltan datos');
  }

  conn.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
    if (err) return res.send('Error al acceder a la base de datos');

    if (results.length === 0) {
      return res.send('Usuario no encontrado');
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.pass);

    if (match) {
      res.send(`Bienvenido, ${user.nombre}`);
    } else {
      res.send('Contraseña incorrecta');
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor funcionando en puerto ${port}`);
});

