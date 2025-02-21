// Rutas de la API
const API_URL = "http://localhost:3000";
const GET_PELICULAS = API_URL + "/peliculas";
const GET_GENEROS = API_URL + "/genero"; 

const espaciosPeliculas = document.getElementById("peliculas");
const generosSelect = document.getElementById("generos-select");
const ordenarAnoButton = document.getElementById("ordenar-ano");
const indicadorOrden = document.getElementById("orden-indicador");
const btnPaginaAnterior = document.getElementById("pagina-anterior");
const btnPaginaSiguiente = document.getElementById("pagina-siguiente");

let peliculasGuardadas = [];
let peliculasMostradas = [];
let paginaActual = 1;
const peliculasPorPagina = 15;
let ordenAscendente = true;

// Cargar datos al iniciar
document.addEventListener("DOMContentLoaded", () => {
    cargarGeneros();
    cargarPeliculas();

    cargarGeneros().then(() => {
        generosSelect.value = "Todos"; 
        cargarPeliculas(); 
    });

});

function cargarGeneros() {
    return fetch(GET_GENEROS) 
        .then(response => response.json())
        .then(generos => {
            generosSelect.innerHTML = `<option value="Todos">Todos</option>`;
            generos.forEach(genero => {
                const option = document.createElement("option");
                option.value = genero.nombre_genero;
                option.textContent = genero.nombre_genero;
                generosSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Error al obtener los géneros:", error));
}

// Obtener todas las películas
function cargarPeliculas() {
    fetch(GET_PELICULAS)
        .then(response => response.json())
        .then(peliculas => {
            peliculasGuardadas = peliculas;
            aplicarFiltros();
        })
        .catch(error => console.error("Error al obtener las películas:", error));
}

function aplicarFiltros() {
    let generoSeleccionado = generosSelect.value;
    
    peliculasMostradas = (generoSeleccionado === "Todos") 
        ? [...peliculasGuardadas] 
        : peliculasGuardadas.filter(p => p.nombre_genero?.trim().toLowerCase() === generoSeleccionado.trim().toLowerCase());

    ordenarPeliculas();
    mostrarPeliculasPaginadas();

}




// Ordenar películas por año
function ordenarPeliculas() {
    peliculasMostradas.sort((a, b) => ordenAscendente ? a.anyo - b.anyo : b.anyo - a.anyo);
    
    indicadorOrden.textContent = ordenAscendente ? "⬆⮀" : "⬇⮂";

    mostrarPeliculasPaginadas();
}

// Mostrar películas con paginación
function mostrarPeliculasPaginadas() {
    const inicio = (paginaActual - 1) * peliculasPorPagina;
    const fin = inicio + peliculasPorPagina;
    const peliculasPaginadas = peliculasMostradas.slice(inicio, fin);

    pintarPeliculas(peliculasPaginadas);
    actualizarBotones();
}

// Renderizar películas en el DOM
function pintarPeliculas(peliculas) {
    espaciosPeliculas.innerHTML = ""; 

    peliculas.forEach(pelicula => {
        const div = document.createElement("div");
        div.classList.add("peliculas_targeta");
        div.setAttribute("data-id", pelicula.id_pelicula);

        const imagen = document.createElement("img");
        imagen.src = pelicula.url_cartel;
        imagen.alt = pelicula.titulo;
        imagen.loading = "lazy";

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

generosSelect.addEventListener("change", aplicarFiltros);

ordenarAnoButton.addEventListener("click", () => {
    ordenAscendente = !ordenAscendente;
    ordenarPeliculas();
});

function actualizarBotones() {
    btnPaginaAnterior.disabled = paginaActual === 1;
    btnPaginaSiguiente.disabled = paginaActual * peliculasPorPagina >= peliculasMostradas.length;
}

btnPaginaAnterior.addEventListener("click", () => {
    if (paginaActual > 1) {
        paginaActual--;
        mostrarPeliculasPaginadas();
    }
});

btnPaginaSiguiente.addEventListener("click", () => {
    if (paginaActual * peliculasPorPagina < peliculasMostradas.length) {
        paginaActual++;
        mostrarPeliculasPaginadas();
    }
});
