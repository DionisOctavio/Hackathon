// FUNCION que redirecciona a otra pagina
function asignarRedireccion(idElemento, urlDestino) {
    document.getElementById(idElemento).addEventListener('click', function() {
        window.location.href = urlDestino;
    });
}

asignarRedireccion('empresa', 'index.html');
asignarRedireccion('curso', 'index.html');
asignarRedireccion('empresa-icon', 'buscar.html');
asignarRedireccion('curso-icon', 'buscar.html');

document.addEventListener('DOMContentLoaded', (event) => {
    profileImg = document.getElementById("profile-img");

    // Cargar datos del perfil desde localStorage
    console.log('Datos en localStorage al cargar la página:', localStorage);
    
    const profileImgUrl = localStorage.getItem('url');
    const profileName = localStorage.getItem('nombre');
    const profileID = localStorage.getItem('id_usuario');
    
    
    // URL de la imagen del perfil
    if (profileImgUrl) {
        profileImg.src = profileImgUrl;
        document.getElementById('login-button').style.display = 'none';
        document.getElementById('logout-button').style.display = 'block';
    } else {
        profileImg.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png';
        document.getElementById('login-button').style.display = 'block';
        document.getElementById('logout-button').style.display = 'none';
        document.getElementById('account-button').style.display = 'none';
        document.getElementById('perfil-button').style.display = 'none';
    }

    // Nombre del perfil
    if (profileName) {
        document.getElementById('profile-name').textContent = profileName;
        console.log(`Bienvenido, ${profileName}`);
    } else {
        document.getElementById('profile-name').textContent = 'Invitado';  
        console.log('Perfil no encontrado: Invitado');
    }

    // ID del perfil
    if (profileID) {
        console.log(`ID del perfil: ${profileID}`);
    } else {
        console.log("NO SE HA ENCONTRADO EL ID DEL PERFIL");
    }

    // Acceso a panel de administracion
    const profileRole = localStorage.getItem('rol'); 
    console.log("Rol de perfil desde localStorage:", profileRole); 

    const panelPeliculasButton = document.getElementById('panel-peliculas-button');
    
    if (profileRole === 'admin') {
        console.log('Acceso al panel de administración concedido');
        panelPeliculasButton.style.display = 'block'; 
    } else {
        console.log('Acceso al panel de administración denegado');
        panelPeliculasButton.style.display = 'none';
    }
});

// FUNCIONES DE LOGIN Y LOGOUT
function login() {
    window.location.href = 'login.html';
}

// AL CERRAR SESION NOS ASEGURAMOS DE BORRAR LOS DATOS GURDADOS EN LOCALSTORAGE
function logout() {
    console.log('Cerrando sesión y borrando datos de localStorage...');
    localStorage.removeItem('url');
    localStorage.removeItem('nombre');
    localStorage.removeItem('rol'); 
    localStorage.removeItem('id_usuario');
    console.log('Datos de localStorage eliminados');
    window.location.href = 'index.html';
}

// FUNCION DE ACCESO AL PANEL DE ADMINISTRACION
function irAlPanelPeliculas() {
    const profileRole = localStorage.getItem('rol'); 
    console.log("Intentando acceder al panel de administración con el rol:", profileRole);
    
    if (profileRole === 'admin') {
        console.log('Acceso permitido, redirigiendo al panel de administración');
        window.location.href = 'FRONT/JS/administracion.js';
    } else {
        console.log('Acceso denegado: Solo los administradores pueden acceder a este panel');
        alert('Acceso denegado. Solo los administradores pueden acceder a este panel.');
    }
}

function toggleMenu() {
    document.getElementById("mobile-menu").classList.toggle("open");
}
document.getElementById("menu-toggle").addEventListener("click", toggleMenu);
