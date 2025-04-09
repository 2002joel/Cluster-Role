<?php
session_start();

require "conexion.php";

// Establecer conexión
$conn = new mysqli($host, $user, $password, $dbname);
if ($conn->connect_error) {
  die('Error de conexión: ' . $conn->connect_error);
}

// Obtener el modo (registro o login)
$modo = $_POST['modo'];
$email = $_POST['email'];
$password = $_POST['password'];  // Capturamos la contraseña tal como se recibe desde el formulario

if ($modo === 'registro') {
  // Registro de usuario
  $nombre = $_POST['nombre'];
  $passwordHash = password_hash($password, PASSWORD_DEFAULT);  // Encriptamos la contraseña

  // Comprobar si el email ya existe
  $check = $conn->prepare("SELECT * FROM usuarios WHERE email = ?");
  $check->bind_param("s", $email);
  $check->execute();
  $result = $check->get_result();

  if ($result->num_rows > 0) {
    echo "Este correo ya está registrado.";
  } else {
    // Insertar nuevo usuario
    $stmt = $conn->prepare("INSERT INTO usuarios (nombre, email, pass) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $nombre, $email, $passwordHash);  // Usamos la contraseña encriptada
    if ($stmt->execute()) {
      echo "¡Registro exitoso!";
    } else {
      echo "Error en el registro: " . $stmt->error;
    }
  }
} else {
  // LOGIN
  $stmt = $conn->prepare("SELECT * FROM usuarios WHERE email = ?");
  $stmt->bind_param("s", $email);
  $stmt->execute();
  $result = $stmt->get_result();
  $usuario = $result->fetch_assoc();

  if ($usuario && password_verify($password, $usuario['pass'])) {
    // Si las credenciales son correctas
    echo "Bienvenido, " . $usuario['nombre'];
    // Aquí podrías iniciar sesión con $_SESSION, etc.
  } else {
    echo "Credenciales incorrectas.";
  }
}

$conn->close();
?>

