<?php
$host = "TU_HOST.aivencloud.com";
$port = 3306;
$dbname = "TU_BASE";
$user = "TU_USUARIO";
$password = "TU_PASSWORD";

$conn = new mysqli($host, $user, $password, $dbname, $port);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}
?>
