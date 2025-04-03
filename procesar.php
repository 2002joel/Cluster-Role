<?php
    if(isset($_POST["nombre"])){
        $nombre = $_POST["nombre"];
        echo "Hola " . $nombre;
    }else{
        echo "Usuario desconocido";
    }
?>