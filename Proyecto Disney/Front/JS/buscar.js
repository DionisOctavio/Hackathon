const espacioPeliculas = document.getElementById("peliculas");
const barraBusqueda = document.getElementById("buscador-input");

const GET_PELICULAS = "http://localhost:3000/peliculas"; 

let peliculas = [];

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
            imprimirPeliculas(""); 
        })
        .catch(error => {
            console.error("Error al obtener películas:", error);
            espacioPeliculas.innerHTML = `<p style="color: white; text-align: center;">Hubo un problema al obtener las películas.</p>`;
        });
}

function imprimirPeliculas(filtro) {
    if (!espacioPeliculas) return;

    espacioPeliculas.innerHTML = "";

    const peliculasFiltradas = peliculas.filter(pelicula =>
        pelicula.titulo.toLowerCase().includes(filtro.toLowerCase())
    );

    if (peliculasFiltradas.length === 0) {
        espacioPeliculas.innerHTML = `<p style="color: white; text-align: center;">No se encontraron resultados.</p>`;
        return;
    }

    peliculasFiltradas.forEach(pelicula => {
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

        espacioPeliculas.appendChild(div);
    });
}


barraBusqueda.addEventListener("input", () => {
    const textoBusqueda = barraBusqueda.value.trim();
    imprimirPeliculas(textoBusqueda);
});

getPeliculas();
