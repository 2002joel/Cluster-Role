<?php
$host ="mysql-cluster-role-alextorresgomez47-b004.i.aivencloud.com";
$user = "avnadmin";
$database = "defaultdb";
$port = 11439;

$conn = new mysqli($host, $user, $password, $database, $port);
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}



?>



