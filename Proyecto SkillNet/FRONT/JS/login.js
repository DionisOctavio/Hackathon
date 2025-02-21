const API_URL = "http://localhost:3000"; // URL de tu servidor backend
const GET_LOGIN = API_URL + "/login"; // Endpoint de login

console.log("URL del endpoint de login:", GET_LOGIN);

document.querySelector(".login-btn").addEventListener("click", async (e) => {
    e.preventDefault();  // Evitar que se envíe el formulario de forma predeterminada

    const correo = document.getElementById("email").value;
    const contrasenia = document.getElementById("password").value;

    console.log("Intentando iniciar sesión con el correo:", correo);  // Log para ver el correo

    // Crear el objeto para enviar al servidor
    const data = {
        correo: correo,
        contrasenia: contrasenia
    };

    try {
        // Hacer la solicitud POST al servidor
        console.log("Enviando solicitud al servidor...");  // Log para saber cuando se envía la solicitud
        const response = await fetch(GET_LOGIN, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        console.log("Respuesta del servidor:", result);  // Log para ver la respuesta

        if (result.success) {
            // Si el login es exitoso, guardar los datos en localStorage
            const { id_usuario, nombre, rol, correo, url } = result.data;
            localStorage.setItem("id_usuario", id_usuario);
            localStorage.setItem("nombre", nombre);
            localStorage.setItem("rol", rol);
            localStorage.setItem("correo", correo);
            localStorage.setItem("url", url); // Guardar la URL en el localStorage

            console.log("Login exitoso, redirigiendo a index.html");

            // Redirigir a la página principal (index.html)
            window.location.href = "index.html";  // Cambia esto a "index.html"
        } else {
            // Si el login falla, mostrar el mensaje de error
            console.log("Error de login:", result.message);  // Log para ver el mensaje de error
            alert(result.message);
        }
    } catch (error) {
        console.error("Error al hacer login:", error);
        alert("Hubo un problema con el servidor. Intenta de nuevo más tarde.");
    }
});
