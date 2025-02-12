// Rutas de la API
const API_URL = "http://localhost:3000";
const GET_PELICULAS = API_URL + "/peliculas";
const GET_GENEROS = API_URL + "/genero"; // Ruta correcta para los géneros
const GET_PELICULAS_BY_GENERO = API_URL + "/peliculas/genero"; // Ruta para filtrar películas por género

// Selección de elementos del DOM
const espaciosPeliculas = document.getElementById("peliculas");
const perfilImg = document.getElementById("profile-img");
const generosSelect = document.getElementById('generos-select');
const ordenarAnoButton = document.getElementById('ordenar-ano');


let peliculasGuardadas = []; 
let paginaActual = 1;
const peliculasPorPagina = 15;


// Cargar datos de perfil desde localStorage
document.addEventListener('DOMContentLoaded', () => {
    const profileImgUrl = localStorage.getItem('profileImg');
    const profileName = localStorage.getItem('profileName');
    
    // Mostrar imagen y nombre del perfil
    if (profileImgUrl) {
        perfilImg.src = profileImgUrl;
        document.getElementById('login-button').style.display = 'none';
        document.getElementById('logout-button').style.display = 'block';
    } else {
        perfilImg.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png';
        document.getElementById('login-button').style.display = 'block';
        document.getElementById('logout-button').style.display = 'none';
    }

    document.getElementById('profile-name').textContent = profileName || 'Invitado';

    // Obtener los géneros disponibles
    fetch(GET_GENEROS)
        .then(response => response.json())
        .then(generos => {
            llenarGenerosSelect(generos);
        })
        .catch(error => console.error('Error al obtener los géneros', error));
});

// Función para llenar el select con los géneros
function llenarGenerosSelect(generos) {
    // Agregar un <option> por cada género
    generos.forEach(genero => {
        const option = document.createElement("option");
        option.value = genero.nombre_genero; // Usamos el nombre_genero como valor
        option.textContent = genero.nombre_genero; // Usamos el nombre_genero como texto visible

        // Añadir la opción al <select>
        generosSelect.appendChild(option);
    });
}

// FUNCION QUE FILTRA LAS PELICULAS POR GENERO
function filtrarPeliculasPorGenero(genero) {
    const url = `${GET_PELICULAS_BY_GENERO}/${genero}`; // Asegúrate de que la URL esté bien construida
    console.log(`Filtrando películas por género: ${url}`); // Mensaje de depuración
    fetch(url)
        .then(response => response.json())
        .then(peliculas => {
            console.log(peliculas); // Verifica la respuesta
            pintarPeliculas(peliculas);
        })
        .catch(error => console.error('Error al obtener las películas por género:', error));
}

// FUNCION PARA OBTENER TODAS LAS PELICULAS
function getPeliculas() {
    fetch(GET_PELICULAS)
        .then(response => response.json())
        .then(peliculas => {
            peliculasGuardadas = peliculas; // Guardar todas las películas
            paginaActual = 1; // Reiniciar a la primera página
            mostrarPeliculasPaginadas();
        })
        .catch(error => console.error('Error al obtener las películas:', error));
}

function mostrarPeliculasPaginadas() {
    const inicio = (paginaActual - 1) * peliculasPorPagina;
    const fin = inicio + peliculasPorPagina;
    const peliculasPaginadas = peliculasGuardadas.slice(inicio, fin);
    
    pintarPeliculas(peliculasPaginadas);
    actualizarBotones();
}


// FUNCION PARA PINTAR LAS PELICULAS EN EL DOM
function pintarPeliculas(peliculas) {
    if (!espaciosPeliculas) return;

    espaciosPeliculas.innerHTML = ""; // Limpiar el contenedor

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

        div.addEventListener("click", () => {
            window.location.href = `detalle.html?id_pelicula=${pelicula.id_pelicula}`;
        });

        espaciosPeliculas.appendChild(div);
    });
}

// Filtrar películas por género
generosSelect.addEventListener('change', () => {
    const generoSeleccionado = generosSelect.value;
    // Si se ha seleccionado un género, filtramos las películas por ese género, de lo contrario mostramos todas las películas
    if (generoSeleccionado) {
        filtrarPeliculasPorGenero(generoSeleccionado);
    } else {
        getPeliculas(); // Si no se selecciona ningún género, mostramos todas las películas
    }
});

// Ordenar películas por año
let ordenAscendente = true;
function ordenarPeliculas() {
    const peliculas = Array.from(espaciosPeliculas.children);
    peliculas.sort((a, b) => {
        const anioA = parseInt(a.querySelector('p:nth-child(3)').textContent);
        const anioB = parseInt(b.querySelector('p:nth-child(3)').textContent);
        return ordenAscendente ? anioA - anioB : anioB - anioA;
    });

    peliculas.forEach(pelicula => espaciosPeliculas.appendChild(pelicula));
    ordenAscendente = !ordenAscendente;
    document.getElementById('orden-indicador').textContent = ordenAscendente ? '⬆⮀' : '⬇⮂';
}

// Event Listeners
ordenarAnoButton.addEventListener('click', ordenarPeliculas);

// Actualizar estado de botones de paginación
function actualizarBotones() {
    document.getElementById("pagina-anterior").disabled = paginaActual === 1;
    document.getElementById("pagina-siguiente").disabled = 
        paginaActual * peliculasPorPagina >= peliculasGuardadas.length;
}

document.getElementById("pagina-anterior").addEventListener("click", () => {
    if (paginaActual > 1) {
        paginaActual--;
        mostrarPeliculasPaginadas();
        window.scrollTo(0, 0); // Mover al inicio de la página
    }
});

document.getElementById("pagina-siguiente").addEventListener("click", () => {
    if (paginaActual * peliculasPorPagina < peliculasGuardadas.length) {
        paginaActual++;
        mostrarPeliculasPaginadas();
        window.scrollTo(0, 0); // Mover al inicio de la página
    }
});

// Iniciar con todas las películas
getPeliculas();
