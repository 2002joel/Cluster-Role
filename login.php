<?php
session_start();

require "conexion.php";

$conn = new mysqli($host, $user, $password, $dbname);
if ($conn->connect_error) {
  die('Error de conexión: ' . $conn->connect_error);
}

$modo = $_POST['modo'];
$email = $_POST['email'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);

if ($modo === 'registro') {
  $nombre = $_POST['nombre'];

  // Comprobar si ya existe
  $check = $conn->prepare("SELECT * FROM usuarios WHERE email = ?");
  $check->bind_param("s", $email);
  $check->execute();
  $result = $check->get_result();

  if ($result->num_rows > 0) {
    echo "Este correo ya está registrado.";
  } else {
    $stmt = $conn->prepare("INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $nombre, $email, $password);
    if ($stmt->execute()) {
      echo "¡Registro exitoso!";
    } else {
      echo "Error en el registro.";
    }
  }
} else {
  // LOGIN
  $stmt = $conn->prepare("SELECT * FROM usuarios WHERE email = ?");
  $stmt->bind_param("s", $email);
  $stmt->execute();
  $result = $stmt->get_result();
  $usuario = $result->fetch_assoc();

  if ($usuario && password_verify($_POST['password'], $usuario['password'])) {
    echo "Bienvenido, " . $usuario['nombre'];
    // Aquí podrías iniciar sesión con $_SESSION, etc.
  } else {
    echo "Credenciales incorrectas.";
  }
}

$conn->close();
?>
