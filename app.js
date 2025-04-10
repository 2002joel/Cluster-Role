const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'mysql-cluster-role-alextorresgomez47-b004.i.aivencloud.com',
    port: 11439,
    user: 'avnadmin',
    password: 'AVNS_tCVtikVVgXH9mp8Rb1F',
    database: 'defaultdb'
});

// Conexión a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos:', err);
        process.exit(1);
    }
    console.log('Conexión a la base de datos establecida');
});

// Inicialización de Express
const app = express();
const port = 11439;

// Middleware
app.use(cors());  // Habilita CORS
app.use(bodyParser.json());  // Para parsear los datos JSON

// Ruta para registrar un nuevo usuario
app.post('/register', (req, res) => {
    const { nombre, email, pass } = req.body;

    if (!nombre || !email || !pass) {
        return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }

    // Verificar si el email ya existe
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error al consultar la base de datos:', err);
            return res.status(500).json({ success: false, message: 'Error al procesar la solicitud' });
        }

        if (results.length > 0) {
            return res.status(400).json({ success: false, message: 'El correo ya está registrado' });
        }

        // Registrar el nuevo usuario
        const query = 'INSERT INTO usuarios (nombre, email, pass) VALUES (?, ?, ?)';
        db.query(query, [nombre, email, pass], (err, result) => {
            if (err) {
                console.error('Error al insertar en la base de datos:', err);
                return res.status(500).json({ success: false, message: 'Error al registrar el usuario' });
            }

            res.status(200).json({ success: true, message: 'Usuario registrado con éxito' });
        });
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});

