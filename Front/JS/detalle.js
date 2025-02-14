
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


// FUNCION para obtener el ID de la pelicula de la URL

document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const idPelicula = params.get("id_pelicula"); 

    console.log("ID de la película obtenida:", idPelicula); 

    if (!idPelicula) {
        alert("Película no encontrada.");
        window.history.back();
        return;
    }

    fetch("http://localhost:3000/peliculas")
        .then(response => response.json())
        .then(peliculas => {
            console.log("Datos de películas cargados:", peliculas);

            const pelicula = peliculas.find(p => p.id_pelicula == idPelicula);
            console.log("Película encontrada:", pelicula); 

            if (!pelicula) {
                alert("Película no encontrada.");
                window.history.back();
                return;
            }

            // Mostrar los datos en la página
            document.getElementById("pelicula-titulo").textContent = pelicula.titulo;
            document.getElementById("pelicula-imagen").src = pelicula.url_cartel;
            document.getElementById("pelicula-sinopsis").textContent = pelicula.sinopsis;
            document.getElementById("pelicula-genero").textContent = pelicula.nombre_genero;
            document.getElementById("pelicula-año").textContent = pelicula.anyo;
            document.getElementById("pelicula-categoria").textContent = pelicula.nombre_demografia;
            document.getElementById("pelicula-pegi").textContent = pelicula.edad;



            // Inserta el iframe del trailer en el div
            const trailerDiv = document.getElementById("pelicula-trailer");
            trailerDiv.innerHTML = `<iframe width="560" height="315" src="${pelicula.url_trailer}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
        })
        .catch(error => console.error("Error cargando los datos:", error));
});




document.addEventListener("DOMContentLoaded", () => {
    const favoritoBtn = document.getElementById("favorito");
    const pendienteSelect = document.getElementById("pendiente");

    // Obtener el perfil y la película
    const idPerfil = localStorage.getItem("idPerfil"); // Asegúrate de que este key sea correcto
    const idPelicula = getPeliculaIdFromUrl(); // Obtener ID de la URL

    if (!idPerfil || !idPelicula) {
        console.error("Faltan datos de perfil o película.");
        return;
    }

    // Cargar el estado desde la base de datos
    getEstadoFavorito(idPerfil, idPelicula);

    // Manejar clic en el botón de favorito
    favoritoBtn.addEventListener("click", () => {
        const esFavorito = favoritoBtn.classList.contains("favorito-activo");
        const nuevoEstado = !esFavorito; // Alterna el estado

        // Actualizar la interfaz: aplica o remueve la clase
        favoritoBtn.classList.toggle("favorito-activo", nuevoEstado);

        // Guardar el nuevo estado en la base de datos
        actualizarEstadoFavorito(idPerfil, idPelicula, nuevoEstado, pendienteSelect.value);
    });

    // Manejar cambio en el select de estado
    pendienteSelect.addEventListener("change", () => {
        const esFavorito = favoritoBtn.classList.contains("favorito-activo");
        actualizarEstadoFavorito(idPerfil, idPelicula, esFavorito, pendienteSelect.value);
    });
});

// Función para obtener el ID de la película de la URL
function getPeliculaIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id_pelicula");
}

// Función para obtener el estado de favorito desde la base de datos
function getEstadoFavorito(idPerfil, idPelicula) {
    fetch(`http://localhost:3000/visto?id_perfil=${idPerfil}&id_pelicula=${idPelicula}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const favorito = data[0].favorito;
                const estado = data[0].estado || "pendiente";

                // Actualiza la interfaz según el estado obtenido
                document.getElementById("favorito").classList.toggle("favorito-activo", favorito);
                document.getElementById("pendiente").value = estado;
            }
        })
        .catch(error => console.error("Error obteniendo estado de favorito:", error));
}

// Función para actualizar el estado y favorito en la base de datos
function actualizarEstadoFavorito(idPerfil, idPelicula, favorito, estado) {
    fetch("http://localhost:3000/visto/actualizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id_perfil: idPerfil,
            id_pelicula: idPelicula,
            favorito: favorito,
            estado: estado
        })
    })
    .then(response => response.json())
    .then(data => console.log("Estado actualizado:", data))
    .catch(error => console.error("Error al actualizar estado:", error));
}
