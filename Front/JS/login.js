document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const usuario = document.getElementById('username').value;
    const contrasenia = document.getElementById('password').value;

    console.log('Attempting login with', usuario, contrasenia);

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario, contrasenia })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response from server:', data);  // Verifica la respuesta completa
        if (data.success) {
            console.log("Rol recibido:", data.rol_cuenta);  // Verifica que el rol se reciba correctamente
            localStorage.setItem('userId', data.userId);       
            localStorage.setItem('profileRole', data.rol_cuenta);  // Guardar 'rol_cuenta' en localStorage
    
            if (data.profile && data.profile.nombre_perfil) {
                localStorage.setItem('profileName', data.profile.nombre_perfil); 
                localStorage.setItem('profileImg', data.profile.url_fotoperfil || ''); 
            }

            // Asegúrate de que 'profileRole' se haya guardado correctamente en localStorage
            console.log("Rol guardado en localStorage:", localStorage.getItem('profileRole'));

            window.location.href = 'perfiles.html';
        } else {
            alert('Login failed: ' + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});


// LOADER 
document.addEventListener("DOMContentLoaded", () => {
    const loadingScreen = document.getElementById("loading-screen");

    // Ocultar la pantalla de carga cuando la página termine de cargar
    window.addEventListener("load", () => {
        loadingScreen.style.opacity = "0";
        setTimeout(() => {
            loadingScreen.style.display = "none";
        }, 500);
    });

    // Agregar efecto de carga al cambiar de página
    document.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const href = this.href;
            
            // Mostrar pantalla de carga
            loadingScreen.style.display = "flex";
            loadingScreen.style.opacity = "1";

            // Redirigir a la nueva página cuando esta termine de cargar
            window.location.href = href;
        });
    });
});