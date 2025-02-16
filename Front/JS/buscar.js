const espacioPeliculas = document.getElementById("peliculas");
const barraBusqueda = document.getElementById("buscador-input");

const GET_PELICULAS = "http://localhost:3000/peliculas"; // Asegúrate de que esta URL sea válida

let peliculas = [];

// 🔄 Obtiene las películas de la API y las almacena en la variable `peliculas`
function getPeliculas() {
    fetch(GET_PELICULAS)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la respuesta de la API");
            }
            return response.json();
        })
        .then(data => {
            peliculas = data;
            imprimirPeliculas(""); // Muestra todas al inicio
        })
        .catch(error => {
            console.error("Error al obtener películas:", error);
            espacioPeliculas.innerHTML = `<p style="color: white; text-align: center;">Hubo un problema al obtener las películas.</p>`;
        });
}

// 🎥 Función para imprimir películas según el filtro de búsqueda
function imprimirPeliculas(filtro) {
    espacioPeliculas.innerHTML = ""; // Limpia antes de agregar nuevas películas

    const peliculasFiltradas = peliculas.filter(pelicula =>
        pelicula.titulo.toLowerCase().includes(filtro.toLowerCase())
    );

    if (peliculasFiltradas.length === 0) {
        espacioPeliculas.innerHTML = `<p style="color: white; text-align: center;">No se encontraron resultados.</p>`;
        return;
    }

    peliculasFiltradas.forEach(pelicula => {
        const peliculaHTML = `
            <div class="peliculas_targeta">
                <img src="${pelicula.url_cartel}" alt="${pelicula.titulo}" class="cartel">
                <p>${pelicula.titulo}</p>
            </div>
        `;
        espacioPeliculas.innerHTML += peliculaHTML;
    });
}

// 🎯 Evento de búsqueda activa (cada vez que el usuario escribe)
barraBusqueda.addEventListener("input", () => {
    const textoBusqueda = barraBusqueda.value.trim();
    imprimirPeliculas(textoBusqueda);
});

// 🔥 Cargar las películas al inicio
getPeliculas();
