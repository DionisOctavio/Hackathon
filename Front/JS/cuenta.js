// Función para obtener los datos de la cuenta desde la API
function obtenerDatosCuenta() {
    // Aquí podemos usar el ID del usuario guardado en el localStorage (o el token, según cómo gestionen la autenticación)
    const usuarioId = localStorage.getItem('userId');
    
    // Verificamos si existe el ID del usuario
    if (!usuarioId) {
        console.log('No se ha encontrado un ID de usuario en localStorage');
        alert('No se puede obtener los datos sin el ID de usuario.');
        return;
    }

    // Realizamos la petición HTTP para obtener los datos del usuario
    fetch(`http://localhost:3000/cuenta/${usuarioId}`)
        .then(response => {
            // Verificamos si la respuesta es exitosa
            if (!response.ok) {
                throw new Error('Error al obtener los datos del usuario');
            }
            return response.json(); // Parseamos la respuesta a JSON
        })
        .then(data => {
            // Aquí es donde los datos obtenidos de la API son asignados al formulario
            console.log('Datos obtenidos de la API:', data);

            // Creamos un encabezado con el nombre de usuario en grande
            const h3 = document.createElement('h3');
            h3.textContent = `Bienvenido, ${data.usuario}`;  // Mostrar nombre de usuario en el encabezado grande

            // Insertamos el encabezado encima de la tabla de datos
            document.getElementById('datos-cuenta').appendChild(h3);

            // Llenamos el formulario con los datos obtenidos
            document.getElementById('usuario').value = data.usuario;
            document.getElementById('email').value = data.email;
            document.getElementById('nombre_usuario').value = data.nombre_usuario;
            document.getElementById('apellido_usuario').value = data.apellido_usuario;
            document.getElementById('rol_cuenta').value = data.rol_cuenta;
        })
        .catch(error => {
            // Si ocurre algún error, lo mostramos en la consola
            console.error('Error al obtener los datos de la API:', error);
            alert('Hubo un error al cargar los datos de la cuenta.');
        });
}

// Cargar los datos cuando la página se haya cargado completamente
document.addEventListener('DOMContentLoaded', () => {
    console.log('Página cargada. Cargando datos de la cuenta...');
    obtenerDatosCuenta();
});
