<?php
$host = 'mysql-cluster-role-alextorresgomez47-b004.i.aivencloud.com';
$port = 11439;
$dbname = 'defaultdb';
$user = 'avnadmin';
$password = 'AVNS_Tm7Y1J05zgl0T4HSbtI';

try {
    $conn = new PDO("mysql:host=$host;port=$port;dbname=$dbname;sslmode=require", $user, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // echo "Conexión exitosa!";
} catch (PDOException $e) {
    echo "Error de conexión: " . $e->getMessage();
    exit;
}
?>
