<?php
session_start();

require "conexion.php";

// Establecer conexión
$conn = new mysqli($host, $user, $password, $dbname, $port);
if ($conn->connect_error) {
  die('Error de conexión: ' . $conn->connect_error);
}

// Comprobar si el modo (registro o login) está definido
if (!isset($_POST['modo']) || !isset($_POST['email']) || !isset($_POST['password'])) {
  echo "Faltan parámetros en la solicitud.";
  exit();
}

$modo = $_POST['modo'];
$email = $_POST['email'];
$password = $_POST['password'];  // Capturamos la contraseña tal como se recibe desde el formulario

// Sanitize inputs (para evitar posibles inyecciones de SQL)
$email = filter_var($email, FILTER_SANITIZE_EMAIL);

if ($modo === 'registro') {
  // Validar que el correo electrónico sea válido
  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "El correo electrónico no es válido.";
    exit();
  }

  // Registro de usuario
  if (!isset($_POST['nombre'])) {
    echo "Faltan datos para el registro.";
    exit();
  }

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
    $_SESSION['user_id'] = $usuario['id'];  // Iniciar sesión
    $_SESSION['user_name'] = $usuario['nombre'];
    echo "Bienvenido, " . $usuario['nombre'];
  } else {
    echo "Credenciales incorrectas.";
  }
}

$conn->close();
?>


