const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs'); // Necesario si tienes un certificado SSL

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'mysql-cluster-role-alextorresgomez47-b004.i.aivencloud.com',
    port: 11439,
    user: 'avnadmin',
    password: 'AVNS_tCVtikVVgXH9mp8Rb1F',
    database: 'defaultdb'
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos:', err);
        process.exit(1);  // Salir si no se puede conectar a la base de datos
    }
    console.log('Conexión a la base de datos establecida');
});

// Configuración de Express
const app = express();
const port = 11439;

// Middleware para habilitar CORS
app.use(cors());

// Middleware para manejar datos JSON
app.use(bodyParser.json());

// Ruta para registrar un nuevo usuario
app.post('/register', (req, res) => {
    const { nombre, email, pass } = req.body;

    // Validación de los datos recibidos
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

        // Insertar el nuevo usuario en la base de datos
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

// Opcional: Si tienes certificados SSL, configura HTTPS
// const options = {
//     key: fs.readFileSync('path/to/private-key.pem'),
//     cert: fs.readFileSync('path/to/certificate.pem')
// };

// Usar https si tienes certificado SSL
https.createServer(/*options,*/ app).listen(port, () => {
    console.log(`Servidor HTTPS escuchando en el puerto ${port}`);
});

