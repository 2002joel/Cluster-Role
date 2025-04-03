function cargarUsuario() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "usuarios.json");

    /*
        readyState
        0 - Unsent (Objeto creado no enviado)
        1 - Opened (Se ha llamado al metodo open, no se ha enviado)
        2 - Headers_received (Se han enviado las cabeceras)
        3 - Loading (Se está descargando el cuerpo de la respuesta)
        4 - Done (Ha finalizado la operación)
    */

    // xhr.onreadystatechange = function() {
    //     console.log("veces");
    //     if (xhr.readyState === 4 && xhr.status === 200) {
    //         console.log(xhr.responseText);
    //         let usuarios = JSON.parse(xhr.responseText);
    //         let lista = document.getElementById("lista");
    //         lista.innerHTML = "";

    //         usuarios.forEach(usuario => {
    //             let li = document.createElement("li");
    //             li.textContent = `${usuario.nombre}`;
    //             lista.appendChild(li);
    //         });
    //     }

    // };


    xhr.onload = function () {
        // console.log("veces");
        if (xhr.status === 200) {
            console.log(xhr.responseText);
            let usuarios = JSON.parse(xhr.responseText);
            let lista = document.getElementById("lista");
            lista.innerHTML = "";

            usuarios.forEach(usuario => {
                let li = document.createElement("li");
                li.textContent = `${usuario.nombre}`;
                lista.appendChild(li);
            });
        }
        else {
            console.log("Error");
        }
    };
    xhr.send();
}


function cargarUsuario2() {
    fetch("usuarios.json")
        .then(response => response.json())
        .then(usuarios => {
            let lista = document.getElementById("lista");
            lista.innerHTML = "";
            usuarios.forEach(usuario => {
                let li = document.createElement("li");
                li.textContent = `${usuario.nombre}` + " OK";
                lista.appendChild(li);
            });
        })
        .catch(error => console.log("Error"));
}



function enviarDatos() {
    let nombre = document.getElementById("nombre").value;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "procesar.php");
    xhr.setRequestHeader("Content-Type",
        "application/x-www-form-urlencoded");

    xhr.onload = function () {
        let resultado = xhr.responseText;
        console.log(resultado);
    }
    xhr.send("nombre=" + nombre);
}

function validar() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "users.json");

    xhr.onload = function () {
        if (xhr.status === 200) {
            let nombre = document.getElementById("nombre").value;
            let pass = document.getElementById("pass").value;
            let usuarios = JSON.parse(xhr.responseText);
            let userOK = false;
            usuarios.forEach(usuario => {
                if (usuario.nombre == nombre) {
                    // console.log("usuario encontrado");
                    if (usuario.pass == pass) {
                        // console.log("Usuario correcto");
                        userOK = true;
                        return false;
                    }
                }
            });
           
            let resultado = document.getElementById("resultado");
            if (userOK) {
                console.log("Usuario correcto");
                resultado.innerHTML = "Usuario correcto";
                resultado.classList.add("correcto");
                resultado.classList.remove("error");
            }
            else {
                console.log("Usuario incorrecto");
                resultado.innerHTML = "Usuario incorrecto";
                resultado.classList.add("error");
                resultado.classList.remove("correcto");

            }
        }
        else {
            console.log("Error");
        }
    };
    xhr.send();

}



function comprobar() {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "comprobar.php");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    let nombre = document.getElementById("nombre").value;
    let res = document.getElementById("resul");
    res.innerHTML = "Comprobando...";
    xhr.onload = function () {
        if (xhr.status === 200) {
            let resultado = xhr.responseText;
            res.innerHTML = resultado;
          
        }
        else {
            console.log("Error");
        }
    };
    xhr.send("nombre=" + nombre);
}