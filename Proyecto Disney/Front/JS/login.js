// Función para manejar el clic en el botón de inicio de sesión

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
        console.log('Response from server:', data);
        if (data.success) {
            // ME GUARDO EN MEMORIA LOCAL LOS DATOS DE LA CUENTA
            console.log("Rol recibido:", data.rol_cuenta);
            localStorage.setItem('userId', data.userId);       
            localStorage.setItem('profileRole', data.rol_cuenta);
    
            if (data.profile && data.profile.nombre_perfil) {
                localStorage.setItem('profileName', data.profile.nombre_perfil); 
                localStorage.setItem('profileImg', data.profile.url_fotoperfil || ''); 
            }
            console.log("Rol guardado en localStorage:", localStorage.getItem('profileRole'));
            window.location.href = 'perfiles.html';
        } else {
            alert('Login Fallido: ' + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});


// LOADER 

document.addEventListener("DOMContentLoaded", () => {
    const loadingScreen = document.getElementById("loading-screen");
    window.addEventListener("load", () => {
        loadingScreen.style.opacity = "0";
        setTimeout(() => {
            loadingScreen.style.display = "none";
        }, 500);
    });
    document.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const href = this.href;
            loadingScreen.style.display = "flex";
            loadingScreen.style.opacity = "1";
            window.location.href = href;
        });
    });
});