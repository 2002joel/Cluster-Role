// funcio amb JS/json "puro y duro"
function cargarUsuarios() {
    let xhr = new XMLHttpRequest(); //objecte tipus XMLHttpRequest
    xhr.open("GET", "usuarios.json"); //obrir la connexió al servidor
    //  "usuarios.jason" es la ruta del fitxer
    console.log("hola");

    /*
    Estats del servidor
        0 - Unset (objecte creat no enviat)
        1 - Opened (s'ha cridat al metode open, no s'ha enviat)
        2 - Headers_recived (s'ha enviat les capceleres)
        3 - Loading (s'esta descarregant el cos de la resposta)
        4 - Done (s'ha completat la petició)
    */

    // s'executa per cada un dels estats del servidor

    // xhr.onreadystatechange = function () { 
    //     if(xhr.readyState === 4 && xhr.status === 200) {
    //         // si l'estat es 4 i el codi de resposta es 200 (tot correcte)
    //         // 200 es el numero (com el 404) que indica que tot ha anat bé
            
    // console.log(xhr.responseText); // resposta del servidor
    // // en cas d'estar llegint un JSON tornara el JSON com a text

    // let usuarios = JSON.parse(xhr.responseText); // convertir el text a JSON
    // let lista = document.getElementById("lista"); // agafem l'element amb id lista
    // lista.innerHTML = ""; // buidem la llista

    // usuarios.forEach(usuario => {
    //     let li = document.createElement("li");
    //     let textContent = '${usuario.nombre}';
    //     lista.appendChild(li);
    // });
    // }
    // };


    // s'executa nomes en el estat numero 4 
    xhr.onload = function () { // quan la petició es completa
        console.log(xhr.responseText); // resposta del servidor
        // en cas d'estar llegint un JSON tornara el JSON com a text
        if (xhr.status === 200) { 
            let usuarios = JSON.parse(xhr.responseText); // convertir el text a JSON
            let lista = document.getElementById("lista"); // agafem l'element amb id lista
            lista.innerHTML = ""; // buidem la llista
    
            usuarios.forEach(usuario => {
                let li = document.createElement("li");
                li.textContent = `${usuario.nombre}`;
                lista.appendChild(li);
            });
        } else {
            console.log("Error: " + xhr.status); // si hi ha un error, mostrem el codi d'error
        }
    }
    xhr.send(); // enviar la petició al servidor
}

// alternativa mes "moderna"
function cargarUsuarios2(){
    fetch("usuarios.json")
        .then(response => response.json())
        .then(usuarios => {
            let lista = document.getElementById("lista"); 
            lista.innerHTML = ""; 
            usuarios.forEach(usuario => {
                let li = document.createElement("li");
                li.textContent = `${usuario.nombre}` + " (carregat amb cargarUsuarios2)";
                lista.appendChild(li);
            });
        })
        .catch(error => {console.log("Error: " + error);});
}

function enviarDatos() {
    let nombre = document.getElementById("nombre").value; 
    let xhr = new XMLHttpRequest();

    xhr.open("POST", "procesar.php"); 
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); 
    xhr.onload = function (){
        let resultado = xhr.responseText;
        console.log(resultado); 
    }

    xhr.send(`nombre=${nombre}`);
    // alt; ("nombre= " + nombre);
}
