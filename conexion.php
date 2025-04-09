<?php
$host = "mysql-cluster-role-alextorresgomez47-b004.i.aivencloud.com";
$port = 11439;
$dbname = "defaultdb";  // Asegúrate de usar el nombre correcto de tu base de datos
$user = "avnadmin";
$password = "AVNS_tCVtikVVgXH9mp8Rb1F";

// Crear la conexión
$conn = new mysqli($host, $user, $password, $dbname, $port);

// Comprobar si la conexión fue exitosa
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}
?>

