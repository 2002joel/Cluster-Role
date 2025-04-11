<?php
$email = $_POST['email'];
$pass = $_POST['pass'];

$data = json_encode([
  "email" => $email,
  "pass" => $pass
]);

$ch = curl_init('http://localhost:11439'); // Puerto 11439, como dijiste
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

$response = curl_exec($ch);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
  echo "Error al conectar con Node.js: $error";
} else {
  echo "Respuesta del servidor: $response";
}
?>
