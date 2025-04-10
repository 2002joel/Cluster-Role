<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro</title>
    <script>
        function registerUser(event) {
            event.preventDefault();

            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const pass = document.getElementById('pass').value;

            // Validación simple
            if (!nombre || !email || !pass) {
                alert('Todos los campos son obligatorios');
                return;
            }

            // Crear la solicitud XMLHttpRequest
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://mysql-cluster-role-alextorresgomez47-b004.i.aivencloud.com:11439/register', true);
            xhr.setRequestHeader('Content-Type', 'application/json');

            // Crear el cuerpo de la solicitud
            const data = JSON.stringify({ nombre, email, pass });

            // Configurar la respuesta
            xhr.onload = function() {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const response = JSON.parse(xhr.responseText);
                    if (response.success) {
                        alert('Usuario registrado con éxito');
                        // Aquí podrías redirigir a otra página o hacer algo más
                    } else {
                        alert('Error: ' + response.message);
                    }
                } else {
                    alert('Hubo un error en la solicitud');
                }
            };

            xhr.onerror = function() {
                alert('Hubo un error en la solicitud');
            };

            // Enviar la solicitud
            xhr.send(data);
        }
    </script>
</head>
<body>
    <h2>Formulario de Registro</h2>
    <form onsubmit="registerUser(event)">
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" required><br><br>
        <label for="email">Email:</label>
        <input type="email" id="email" required><br><br>
        <label for="pass">Contraseña:</label>
        <input type="password" id="pass" required><br><br>
        <button type="submit">Registrar</button>
    </form>
</body>
</html>


