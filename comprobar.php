<?php
    $tiempo = rand(1,5); //1 y 5 segundos
    sleep($tiempo);

    $dato = $_POST["nombre"];
    $resultado = rand(0,1);

    if($resultado == 0){
        echo "Usuario " . $dato . " no disponible";
    }else{
        echo "Usuario " . $dato . " disponible";
    }

?>