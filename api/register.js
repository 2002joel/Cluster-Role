const mysql = require('mysql2/promise');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Método no permitido');
  }

  const { nombre, pass, email } = req.body || {};

  if (!nombre || !pass || !email) {
    return res.status(400).send('Faltan campos');
  }

  try {
    const connection = await mysql.createConnection({
      host: 'mysql-cluster-role-alextorresgomez47-b004.i.aivencloud.com',
      user: 'avnadmin',
      password: 'AVNS_tCVtikVVgXH9mp8Rb1F',
      database: 'defaultdb',
      port: 11439,
      ssl: {
        rejectUnauthorized: true
      }
    });

    const [rows] = await connection.execute(
      'INSERT INTO usuarios (nombre, pass, email) VALUES (?, ?, ?)',
      [nombre, pass, email]
    );

    await connection.end();
    res.status(200).send('Usuario registrado');
  } catch (err) {
    res.status(500).send('Error al registrar: ' + err.message);
  }
}
