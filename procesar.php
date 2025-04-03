<?php
    if (isset($_POST["nombre"])){
        $nombre = $_POST['nombre'];
        echo "hola ", $nombre;
    }else{
        echo "Usuario desconocido";
    }
?>