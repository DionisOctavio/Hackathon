// Función para obtener los datos de la cuenta desde la API
function obtenerDatosCuenta() {
    const usuarioId = localStorage.getItem('userId');
    
    if (!usuarioId) {
        console.log('No se ha encontrado un ID de usuario en localStorage');
        
        // Mostrar el mensaje de error
        const errorMessage = document.getElementById('error-message');
        errorMessage.style.display = 'block';  // Mostrar el mensaje
        
        // Opcional: Ocultar el mensaje después de 5 segundos
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
        
        return;
    }
    

    fetch(`http://localhost:3000/cuenta/${usuarioId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos del usuario');
            }
            return response.json();
        })
        .then(data => {
            // Primero eliminamos el encabezado anterior si existe
            const datosCuentaDiv = document.getElementById('datos-cuenta');
            const existingH3 = datosCuentaDiv.querySelector('h3');
            if (existingH3) {
                datosCuentaDiv.removeChild(existingH3);
            }

            // Crear el encabezado con el nombre de usuario
            const h3 = document.createElement('h3');
            h3.textContent = `Bienvenido, ${data.usuario}`;
            datosCuentaDiv.appendChild(h3);

            // Asignamos los valores de la cuenta al formulario
            document.getElementById('usuario').value = data.usuario;
            document.getElementById('email').value = data.email;
            document.getElementById('nombre_usuario').value = data.nombre_usuario;
            document.getElementById('apellido_usuario').value = data.apellido_usuario;
            document.getElementById('rol_cuenta').value = data.rol_cuenta;

            // Convertir la fecha ISO a un formato legible
            const fecha = new Date(data.fecha_creacion);  // Asegúrate de que data.fecha_creacion esté presente
            const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
            const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);
            document.getElementById('fecha_creacion').value = fechaFormateada;


            // Seguridad (mostrar contraseña oculta)
            document.getElementById('contrasenia').value = "********";
        })
        .catch(error => {
            console.error('Error al obtener los datos de la API:', error);
            
            // Mostrar el mensaje de error en el HTML
            const errorMessageElement = document.getElementById('error-message');
            
            if (errorMessageElement) {
                errorMessageElement.style.display = 'block'; // Mostrar el mensaje de error
                errorMessageElement.textContent = 'Hubo un error al cargar los datos de la cuenta.'; // Establecer el mensaje
            }
        });        
}

// Función para editar perfil
function editarPerfil() {
    // Permitir editar los campos de texto
    document.getElementById('usuario').disabled = false;
    document.getElementById('email').disabled = false;
    document.getElementById('nombre_usuario').disabled = false;
    document.getElementById('apellido_usuario').disabled = false;

    // Mostrar los botones de guardar y cancelar
    document.getElementById('btn-guardar').style.display = 'inline-block';
    document.getElementById('btn-cancelar').style.display = 'inline-block';
    document.getElementById('btn-editar').style.display = 'none';
}

// Función para cancelar la edición
function cancelarEdicion() {
    // Deshabilitar los campos de texto nuevamente
    document.getElementById('usuario').disabled = true;
    document.getElementById('email').disabled = true;
    document.getElementById('nombre_usuario').disabled = true;
    document.getElementById('apellido_usuario').disabled = true;

    // Ocultar los botones de guardar y cancelar
    document.getElementById('btn-guardar').style.display = 'none';
    document.getElementById('btn-cancelar').style.display = 'none';
    document.getElementById('btn-editar').style.display = 'inline-block';
}

// Función para guardar los cambios del perfil
function guardarPerfil() {
    const usuarioId = localStorage.getItem('userId');
    const usuario = document.getElementById('usuario').value;
    const email = document.getElementById('email').value;
    const nombreUsuario = document.getElementById('nombre_usuario').value;
    const apellidoUsuario = document.getElementById('apellido_usuario').value;
    const rolCuenta = document.getElementById('rol_cuenta').value;

    const updatedData = {
        usuario,
        email,
        nombre_usuario: nombreUsuario,
        apellido_usuario: apellidoUsuario,
        rol_cuenta: rolCuenta,
    };

    fetch(`http://localhost:3000/cuenta/${usuarioId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        // Cancelar la edición después de guardar
        cancelarEdicion();
    })
    .catch(error => {
        console.error('Error al guardar los datos:', error);
        alert('Hubo un error al guardar los datos.');
    });
}

// Eventos
document.getElementById('btn-editar').addEventListener('click', editarPerfil);
document.getElementById('btn-cancelar').addEventListener('click', cancelarEdicion);
document.getElementById('btn-guardar').addEventListener('click', guardarPerfil);

// Cargar los datos de la cuenta cuando la página se carga
window.addEventListener('DOMContentLoaded', obtenerDatosCuenta);


// Mostrar el modal al hacer clic en el botón
document.getElementById('btn-cambiar-contrasenia').addEventListener('click', function() {
    document.getElementById('modal-cambiar-contrasenia').style.display = 'flex';
});

// Cerrar el modal al hacer clic en "Cancelar"
document.getElementById('btn-cancelar-contra').addEventListener('click', function() {
    document.getElementById('modal-cambiar-contrasenia').style.display = 'none';
});


// Asignar la función de cambiar visibilidad a los iconos de ojo
document.getElementById('eye-actual').addEventListener('click', function() {
    togglePasswordVisibility('contrasenia-actual', 'eye-actual');
});

document.getElementById('eye-nueva').addEventListener('click', function() {
    togglePasswordVisibility('contrasenia-nueva', 'eye-nueva');
});

document.getElementById('eye-repetir').addEventListener('click', function() {
    togglePasswordVisibility('repetir-contrasenia', 'eye-repetir');
});

// Función para guardar la nueva contraseña (comprobación)
document.getElementById('btn-guardar-contrasenia').addEventListener('click', function() {
    const contraseniaActual = document.getElementById('contrasenia-actual').value;
    const contraseniaNueva = document.getElementById('contrasenia-nueva').value;
    const repetirContrasenia = document.getElementById('repetir-contrasenia').value;

    // Comprobamos si las contraseñas coinciden
    if (contraseniaNueva === repetirContrasenia) {
        // Aquí se puede agregar la lógica para actualizar la contraseña en la base de datos
        alert('Contraseña cambiada correctamente');
        document.getElementById('modal-cambiar-contrasenia').style.display = 'none';
    } else {
        alert('Las contraseñas no coinciden');
    }
});
