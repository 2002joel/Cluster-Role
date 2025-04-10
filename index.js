<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Login</title>
</head>
<body>
  <h1>Iniciar Sesión</h1>
  <form action="/login" method="POST">
    <label for="email">Correo:</label>
    <input type="email" name="email" required><br><br>

    <label for="password">Contraseña:</label>
    <input type="password" name="password" required><br><br>

    <button type="submit">Iniciar Sesión</button>
  </form>
</body>
</html>
