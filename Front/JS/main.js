const API_URL = "http://localhost:3000";

// RUTAS ELEMENTOS
const GET_PELICULAS = API_URL + "/peliculas";
const GET_DEMOGRAFIAS = API_URL + "/demografia";
const GET_GENEROS = API_URL + "/genero";
const GET_PEGI = API_URL + "/pegi";
const GET_VISTOS = API_URL + "/visto";
// const GET_PROFILE = API_URL + "/profile";

// RUTAS ELEMENTOS CRUZADOS
const GET_PELICULAS_BY_GENERO = API_URL + "/peliculas/genero/:genero";
const GET_PELICULAS_DEMOGRAFIAS = API_URL + "/peliculas/demografia/:demografia";
const GET_USUARIOS = API_URL + "/cuentas";

// VARIABLES GLOBALES
let ascendente = true;
let espaciosPeliculas;
let espacioDemografia;
let botonOrdenar;
let botonBuscar;
let profileImg;

// Mostrar el loader al iniciar la carga de la página
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("loader").style.display = "flex";
});

// Ocultar el loader cuando la página esté completamente cargada
window.onload = function () {
    document.getElementById("loader").style.display = "none";
};

document.getElementById('home').addEventListener('click', function() {
    window.location.href = 'index.html';
});

document.getElementById('home-icon').addEventListener('click', function() {
    window.location.href = 'index.html';
});

document.getElementById('generos').addEventListener('click', function() {
    window.location.href = 'peliculas.html';
});

document.getElementById('peliculas-icon').addEventListener('click', function() {
    window.location.href = 'peliculas.html';
});

document.getElementById('buscar').addEventListener('click', function() {
    window.location.href = '';
});

document.getElementById('buscar-icon').addEventListener('click', function() {
    window.location.href = '';
});

document.addEventListener('DOMContentLoaded', (event) => {
    espaciosPeliculas = document.getElementById("peliculas");
    espacioDemografia = document.getElementById("demografias");
    botonOrdenar = document.getElementById("ordenar");
    botonBuscar = document.getElementById('buscar');
    profileImg = document.getElementById("profile-img");

    // Cargar datos del perfil desde localStorage
    const profileImgUrl = localStorage.getItem('profileImg');
    const profileName = localStorage.getItem('profileName');
    const profileID = localStorage.getItem('profileId'); // Aquí traes el id del perfil
    
    if (profileImgUrl) {
        profileImg.src = profileImgUrl;
        document.getElementById('login-button').style.display = 'none';
        document.getElementById('logout-button').style.display = 'block';
    } else {
        profileImg.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png';
        document.getElementById('login-button').style.display = 'block';
        document.getElementById('logout-button').style.display = 'none';
    }

    if (profileName) {
        document.getElementById('profile-name').textContent = profileName;
        console.log(`Bienvenido, ${profileName}`);
    } else {
        document.getElementById('profile-name').textContent = 'Invitado';  // Valor por defecto si no hay nombre
    }

    if (profileID) {
        console.log(`ID del perfil cargado: ${profileID}`);
    } else {
        console.log("No se encontró el ID del perfil.");
    }

    getDemografias();
    getPeliculasByGenero('Animación', 'animacion-track');
    getPeliculasByGenero('Acción', 'accion-track');
    getPeliculasByGenero('Ciencia Ficción', 'ciencia-ficcion-track');
    getGenero();
    getPeliculas();
    getPegi();
    mostrarFavoritos();

    const profileRole = localStorage.getItem('profileRole');  // Verifica si profileRole está correctamente guardado
    console.log("profileRole:", profileRole);  // Para verificar si el valor está bien guardado

    const panelPeliculasButton = document.getElementById('panel-peliculas-button');
    
    // Asegúrate de que profileRole se compara correctamente
    if (profileRole === 'ADMINISTRADOR') {
        panelPeliculasButton.style.display = 'block';  // Mostrar solo si es administrador
    } else {
        panelPeliculasButton.style.display = 'none';  // No mostrar si no es admin
    }

    const generos = ["Animación", "Acción", "Ciencia Ficción", "Comedia", "Drama"]; // Puedes añadir más géneros aquí
    crearGeneros(generos); 
});



function irAlPanelPeliculas() {
    const profileRole = localStorage.getItem('profileRole'); // Obtener el rol nuevamente
    if (profileRole === 'ADMINISTRADOR') {
        window.location.href = 'administracion.html'; // Redirige a la página de administración de películas
    } else {
        alert('Acceso denegado. Solo los administradores pueden acceder a este panel.');
    }
}


function login() {
    window.location.href = 'login.html';
}

function logout() {
    localStorage.removeItem('profileImg');
    localStorage.removeItem('profileName');
    window.location.href = 'index.html';
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

function getPegi(){
    fetch(GET_PEGI)
    .then(response => response.json())
    .then(
        (data) => {
            console.log(data);
            
        }
    )
}

function getPeliculasByGenero(genero, containerId) {
    const url = GET_PELICULAS_BY_GENERO.replace(':genero', genero);
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const peliculas = data;
            pintarPeliculasPorGenero(peliculas, containerId); // Mantén esta línea si la usas en otro lugar
            pintarPeliculas(data); // Muestra las películas en el contenedor principal
        })
        .catch(error => {
            console.error('Error al obtener las películas por género:', error);
        });
}

document.getElementById('generos-select').addEventListener('change', function() {
    const generoSeleccionado = this.value;

    if (generoSeleccionado) {
        // Filtrar películas por género
        getPeliculasByGenero(generoSeleccionado, 'peliculas');
    } else {
        // Si no se selecciona un género, mostrar todas las películas
        getPeliculas(); // Esta es la función que muestra todas las películas
    }
});

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
        getPeliculasByGenero(generoSeleccionado); // Filtrar las películas por el género seleccionado
    } else {
        getPeliculas(); // Si no se selecciona un género, mostrar todas las películas
    }
});

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".pelicula-targeta").forEach((tarjeta) => {
        tarjeta.addEventListener("click", function () {
            const idPelicula = this.getAttribute("data-id"); // Obtener ID de la película
            window.location.href = `detalle.html?id=${id_pelicula}`;
        });
    });
});


function mostrarFavoritos() {
    const profileID = localStorage.getItem('profileId'); // Obtener el ID del perfil desde localStorage
    if (!profileID) {
        console.error('No se ha encontrado el perfil');
        return;
    }

    // Supongamos que la lista de películas favoritas del perfil se obtiene desde una API o localStorage
    fetch(GET_FAVORITOS) // URL que devolvería las películas favoritas de un perfil
        .then(response => response.json())
        .then(favoritos => {
            const contenedorFavoritos = document.getElementById("favoritos-track");
            console.log(favoritos);
            // Limpiamos el contenedor para evitar que se repitan las películas
            contenedorFavoritos.innerHTML = "";

            // Verificamos que tenemos las películas favoritas
            if (favoritos && favoritos.length > 0) {
                favoritos.forEach(pelicula => {
                    // Creamos la tarjeta de cada película favorita
                    const div = document.createElement("div");
                    div.classList.add("pelicula-favorita"); // Asigna la clase para estilo

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

                    // Añadimos un evento de clic para mostrar el detalle de la película
                    div.addEventListener("click", function () {
                        const idPelicula = pelicula.id_pelicula;
                        window.location.href = `detalle.html?id_pelicula=${idPelicula}`;
                    });

                    // Insertamos la tarjeta de película en el contenedor
                    contenedorFavoritos.appendChild(div);
                });
            } else {
                // Si no hay películas favoritas, mostramos un mensaje
                contenedorFavoritos.innerHTML = "<p>No tienes películas favoritas.</p>";
            }
        })
        .catch(error => {
            console.error('Error al cargar las películas favoritas:', error);
        });
}


