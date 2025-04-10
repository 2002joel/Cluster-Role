// api/register.js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { nombre, pass, email } = req.body;

  if (!nombre || !pass || !email) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  try {
    const connection = await mysql.createConnection({
      host: 'mysql-cluster-role-alextorresgomez47-b004.i.aivencloud.com',
      user: 'avnadmin',
      password: 'AVNS_tCVtikVVgXH9mp8Rb1F',
      database: 'defaultdb',
      port: 11439,
      ssl: {
        rejectUnauthorized: false // ⚠️ Aiven requiere esto en entornos Node.js
      }
    });

const [result] = await connection.execute(
  'INSERT INTO usuarios (nombre, pass, email) VALUES (?, ?, ?)',
  [nombre, pass, email]
);

    await connection.end();
    res.status(200).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error('Error en la API /register:', error); // 👈 LOG DETALLADO
    res.status(500).json({ error: 'Error del servidor: ' + error.message });
  }
}

