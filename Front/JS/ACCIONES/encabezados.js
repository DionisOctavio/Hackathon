

// FUNCION que redirecciona a otra pagina
function asignarRedireccion(idElemento, urlDestino) {
    document.getElementById(idElemento).addEventListener('click', function() {
        window.location.href = urlDestino;
    });
}

asignarRedireccion('home', 'index.html');
asignarRedireccion('home-icon', 'index.html');
asignarRedireccion('generos', 'peliculas.html');
asignarRedireccion('peliculas-icon', 'peliculas.html');
asignarRedireccion('buscar', '');
asignarRedireccion('buscar-icon', '');

document.addEventListener('DOMContentLoaded', (event) => {

    profileImg = document.getElementById("profile-img");

        // Cargar datos del perfil desde localStorage
        const profileImgUrl = localStorage.getItem('profileImg');
        const profileName = localStorage.getItem('profileName');
        const profileID = localStorage.getItem('profileId');
        
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
        }
    
        // ID del perfil
        if (profileID) {
            console.log(`ID del perfil: ${profileID}`);
        } else {
            console.log("NO SE HA ENCONTRADO EL ID DEL PERFIL");
        }

         // Acceso a panel de administracion
    const profileRole = localStorage.getItem('profileRole'); 
    console.log("profileRole:", profileRole); 
    const panelPeliculasButton = document.getElementById('panel-peliculas-button');
    
    if (profileRole === 'ADMINISTRADOR') {
        panelPeliculasButton.style.display = 'block'; 
    } else {
        panelPeliculasButton.style.display = 'none';
    }

});


// FUNCIONES DE LOGIN Y LOGOUT
function login() {
    window.location.href = 'login.html';
}

// AL CERRAR SESION NOS ASEGURAMOS DE BORRAR LOS DATOS GURDADOS EN LOCALSTORAGE
function logout() {
    localStorage.removeItem('profileImg');
    localStorage.removeItem('profileName');
    localStorage.removeItem('profileRole'); 
    localStorage.removeItem('profileId');
    window.location.href = 'index.html';
}


// FUNCION DE ACCESO AL PANEL DE ADMINISTRACION
function irAlPanelPeliculas() {
    const profileRole = localStorage.getItem('profileRole'); 
    if (profileRole === 'ADMINISTRADOR') {
        window.location.href = 'administracion.html';
    } else {
        alert('Acceso denegado. Solo los administradores pueden acceder a este panel.');
    }
}

function toggleMenu() {
    document.getElementById("mobile-menu").classList.toggle("open");
}
document.getElementById("menu-toggle").addEventListener("click", toggleMenu);