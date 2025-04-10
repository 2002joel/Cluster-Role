const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');

// Inicializa la app de Express
const app = express();

// Configura el puerto
const port = 11439;

// Middleware de CORS para permitir solicitudes desde cualquier origen
app.use(cors()); 

// Middleware para procesar las solicitudes JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Configuración de la conexión a la base de datos de Aiven
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

// Conectar a la base de datos
conn.connect((err) => {
  if (err) {
    console.error('Error conectando a MySQL:', err.message);
    process.exit();
  } else {
    console.log('Conectado a MySQL');
  }
});

// Ruta de prueba (root)
app.get('/', (req, res) => {
  res.send('CORS desactivado');
});

// Ruta para registrar un nuevo usuario
app.post('/register', async (req, res) => {
  const { nombre, email, password } = req.body;

  // Validar los datos recibidos
  if (!nombre || !email || !password) {
    return res.json({ success: false, message: 'Faltan campos obligatorios.' });
  }

  try {
    // Verificar si el correo ya está registrado
    conn.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
      if (err) {
        return res.json({ success: false, message: 'Error en la base de datos.' });
      }

      if (results.length > 0) {
        return res.json({ success: false, message: 'Este correo ya está registrado.' });
      }

      // Encriptar la contraseña antes de almacenarla
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insertar el nuevo usuario en la base de datos
      conn.query('INSERT INTO usuarios (nombre, email, pass) VALUES (?, ?, ?)', [nombre, email, hashedPassword], (err) => {
        if (err) {
          return res.json({ success: false, message: 'Error al registrar el usuario.' });
        }
        res.json({ success: true, message: 'Usuario registrado exitosamente.' });
      });
    });
  } catch (error) {
    res.json({ success: false, message: 'Error en el registro.' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en https://mysql-cluster-role-alextorresgomez47-b004.i.aivencloud.com:${port}`);
});


