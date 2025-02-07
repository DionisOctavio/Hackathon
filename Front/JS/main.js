// RUTA API
const API_URL = "http://localhost:3000";

// RUTAS ELEMENTOS
const GET_PELICULAS = API_URL + "/peliculas";
const GET_DEMOGRAFIAS = API_URL + "/demografia";
const GET_GENEROS = API_URL + "/genero";
const GET_PEGI = API_URL + "/pegi";
const GET_VISTOS = API_URL + "/visto";
const GET_PROFILE = API_URL + "/profile";
const GET_USUARIOS = API_URL + "/cuentas";


// RUTAS ELEMENTOS CRUZADOS
const GET_PELICULAS_BY_GENERO = API_URL + "/peliculas/genero/:genero";
const GET_PELICULAS_DEMOGRAFIAS = API_URL + "/peliculas/demografia/:demografia";


// VARIABLES GLOBALES
let ascendente = true;
let espaciosPeliculas;
let espacioDemografia;
let botonOrdenar;
let botonBuscar;
let profileImg;

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
    espaciosPeliculas = document.getElementById("peliculas");
    espacioDemografia = document.getElementById("demografias");
    botonOrdenar = document.getElementById("ordenar");
    botonBuscar = document.getElementById('buscar');
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

    // Llamamos a las funciones
    getDemografias();
    getPeliculasByGenero('Animación', 'animacion-track');
    getPeliculasByGenero('Acción', 'accion-track');
    getPeliculasByGenero('Ciencia Ficción', 'ciencia-ficcion-track');
    getGenero();
    getPeliculas();
    getPegi();
    mostrarFavoritos();
    mostrarFavoritos(profileID);

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


// TRAEMOS TODAS LAS PELICULAS DE NUESTRA BD
function getPeliculas(){
    fetch(GET_PELICULAS)
    .then(response => response.json())
    .then(
        (data) => {
            console.log(data);
            const peliculas = data;
            pintarPeliculas(peliculas);
        }
    )
}


// TRAEMOS TODOS LOS GENEROS DE NUESTRA BD
function getGenero() {
    fetch(GET_GENEROS)
    .then(response => response.json())
    .then((data) => {
        console.log("Datos de géneros recibidos:", data); // Verifica la estructura de los datos
        const generosSelect = document.getElementById('generos-select');
        generosSelect.innerHTML = '<option value="">Selecciona un género</option>';

        // Si los géneros no tienen películas asociadas, simplemente agregamos todos
        if (data && Array.isArray(data)) {
            data.forEach(genero => {
                const option = document.createElement('option');
                option.value = genero.nombre_genero;
                option.textContent = genero.nombre_genero;
                generosSelect.appendChild(option);
            });
        } else {
            console.error('Los datos no tienen el formato esperado o no hay géneros disponibles');
        }
    })
    .catch(error => {
        console.error('Error al obtener géneros:', error); // Para manejar posibles errores
    });
}


// TRAEMOS TODOS LOS PERFILES DE NUESTRA BD
function getPerfil() {
    fetch(GET_PERFIL)
    .then(response => response.json())
    .then(
        (data) => {
            console.log(data);
            pintarLogoPerfil(data);
        }
    )
}

// TRAEMOS TODAS LAS DEMOGRAFIAS DE NUESTRA BD
function getDemografias(){
    fetch(GET_DEMOGRAFIAS)
    .then(response => response.json())
    .then(
        (data) => {
            console.log(data);
            const demografias = data;
            pintarDemografias(demografias);
        }
    )
}


// TRAEMOS TODOS LOS PEGI DE NUESTRA BD
function getPegi(){
    fetch(GET_PEGI)
    .then(response => response.json())
    .then(
        (data) => {
            console.log(data);
            
        }
    )
}


// FUNCION QUE PINTA LAS PELICULAS EN EL HTML
function pintarPeliculas(peliculas) {
    if (!espaciosPeliculas) {
        console.error('Element with id "peliculas" not found');
        return;
    }
    espaciosPeliculas.innerHTML = "";
    peliculas.forEach(pelicula => {
        const div = document.createElement("div");
        div.classList.add("peliculas_targeta");
        div.setAttribute("data-id", pelicula.id_pelicula);

        const imagen = document.createElement("img");
        imagen.src = pelicula.url_cartel;
        imagen.alt = pelicula.titulo;

        const titulo = document.createElement("p");
        titulo.textContent = pelicula.titulo;

        const anio = document.createElement("p");
        anio.textContent = pelicula.anyo;

        div.appendChild(imagen);
        div.appendChild(titulo);
        div.appendChild(anio);

        div.addEventListener("click", function () {
            const idPelicula = this.getAttribute("data-id");
            window.location.href = `detalle.html?id_pelicula=${idPelicula}`;
        });

        espaciosPeliculas.appendChild(div);
    });
}


// FUNCION QUE PINTA LAS PELICULAS EN EL HTML DEPENDIENDO DEL GENERO
function pintarPeliculasPorGenero(peliculas, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    peliculas.forEach(pelicula => {
        const div = document.createElement("div");
        div.classList.add("peliculas_targeta");
        div.setAttribute("data-id", pelicula.id_pelicula);

        const imagen = document.createElement("img");
        imagen.src = pelicula.url_cartel;
        imagen.alt = pelicula.titulo;

        const titulo = document.createElement("p");
        titulo.textContent = pelicula.titulo;

        const anio = document.createElement("p")
        anio.textContent = pelicula.anio;

        const id = document.createElement("p");

        div.appendChild(imagen);
        div.appendChild(titulo);
        div.appendChild(anio);
        div.appendChild(id);

        div.addEventListener("click", function () {
            const idPelicula = this.getAttribute("data-id");
            window.location.href = `detalle.html?id_pelicula=${idPelicula}`;
        });

        container.appendChild(div);
    });
}


// FUNCION QUE FILTRA LAS PELICULAS POR GENERO
function getPeliculasByGenero(genero, containerId) {
    const url = GET_PELICULAS_BY_GENERO.replace(':genero', genero);
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const peliculas = data;
            pintarPeliculasPorGenero(peliculas, containerId);
            pintarPeliculas(data);
        })
        .catch(error => {
            console.error('Error al obtener las películas por género:', error);
        });
}

// EVENTO QUE SE ACTIVA AL SELECIONAR UN GENERO EN EL SELECT
document.getElementById('generos-select').addEventListener('change', function() {
    const generoSeleccionado = this.value;

    if (generoSeleccionado) {
        getPeliculasByGenero(generoSeleccionado, 'peliculas');
    } else {
        getPeliculas();
    }
});


// FUNCION QUE PINTA LAS DEMOGRAFIA EN EL HTML
function pintarDemografias(demografias) {
    espacioDemografia.innerHTML = "";
    demografias.forEach(demografia => {
        const div = document.createElement("div");
        div.classList.add("demografias_targeta");

        const imagen = document.createElement("img");
        imagen.src = demografia.url_demografia;

        div.appendChild(imagen);

        espacioDemografia.appendChild(div);
    });
}


// FUNCION QUE ORDENA LAS PELICULAS POR AÑO EN ORDEN ASCENDENTE 
let ordenAscendente = true;
function ordenarPeliculas() {
    const peliculasContainer = document.getElementById('peliculas');
    const peliculas = Array.from(peliculasContainer.children);
    
    peliculas.sort((a, b) => {
        const anioA = parseInt(a.querySelector('p:nth-child(3)').textContent);
        const anioB = parseInt(b.querySelector('p:nth-child(3)').textContent);
        return ordenAscendente ? anioA - anioB : anioB - anioA;
    });

    peliculas.forEach(pelicula => peliculasContainer.appendChild(pelicula));

    ordenAscendente = !ordenAscendente;
    document.getElementById('orden-indicador').textContent = ordenAscendente ? '⬆️' : '⬇️';
}

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('ordenar-ano').addEventListener('click', ordenarPeliculas);
});

document.getElementById('generos-select').addEventListener('change', function() {
    const generoSeleccionado = this.value;
    if (generoSeleccionado) {
        getPeliculasByGenero(generoSeleccionado); 
    } else {
        getPeliculas(); 
    }
});

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".pelicula-targeta").forEach((tarjeta) => {
        tarjeta.addEventListener("click", function () {
            const idPelicula = this.getAttribute("data-id"); 
            window.location.href = `detalle.html?id=${id_pelicula}`;
        });
    });
});



async function mostrarFavoritos(idPerfil) {
    try {
        const response = await fetch(API_URL + `/favoritos/${idPerfil}`);

        if (response.ok) {
            const peliculasFavoritas = await response.json();

            if (peliculasFavoritas.length > 0) {
                const track = document.getElementById('favoritos-track');
                track.innerHTML = ''; 

                peliculasFavoritas.forEach(pelicula => {
                    const peliculaDiv = document.createElement('div');
                    peliculaDiv.classList.add('pelicula-favorita');

                    peliculaDiv.innerHTML = `
                        <div class="peliculas_targeta">
                            <img src="${pelicula.url_cartel}" alt="${pelicula.titulo}" class="cartel">
                            <p>${pelicula.titulo}</p>
                        </div>
                    `;

                    track.appendChild(peliculaDiv);
                });
            } else {
                const track = document.getElementById('favoritos-track');
                track.innerHTML = '<p>No tienes películas favoritas.</p>';
            }
        } else {
            console.error('Error al obtener las películas favoritas:', response.statusText);
        }
    } catch (error) {
        console.error('Hubo un problema al hacer la solicitud:', error);
    }
};
