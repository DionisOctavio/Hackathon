
document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const idPelicula = params.get("id_pelicula"); // ✅ Debe coincidir con el parámetro en la URL

    console.log("ID de la película obtenida:", idPelicula); // ✅ Verificar si el ID se pasa bien

    if (!idPelicula) {
        alert("Película no encontrada.");
        window.history.back();
        return;
    }

    fetch("http://localhost:3000/peliculas")
        .then(response => response.json())
        .then(peliculas => {
            console.log("Datos de películas cargados:", peliculas); // ✅ Verifica si carga bien el JSON

            const pelicula = peliculas.find(p => p.id_pelicula == idPelicula);
            console.log("Película encontrada:", pelicula); // ✅ Verifica si encuentra la película correcta

            if (!pelicula) {
                alert("Película no encontrada.");
                window.history.back();
                return;
            }

            // Mostrar los datos en la página
            document.getElementById("pelicula-titulo").textContent = pelicula.titulo;
            document.getElementById("pelicula-imagen").src = pelicula.url_cartel;
            document.getElementById("pelicula-sinopsis").textContent = pelicula.sinopsis;
            document.getElementById("pelicula-genero").textContent = pelicula.genero;
            document.getElementById("pelicula-año").textContent = pelicula.anyo;
            document.getElementById("pelicula-trailer").href = pelicula.url_trailer;
        })
        .catch(error => console.error("Error cargando los datos:", error));
});

document.addEventListener('DOMContentLoaded', (event) => {
    const favoritoBtn = document.getElementById("favorito");
    const pendienteSelect = document.getElementById("pendiente");

    // Obtener el perfil y película
    const idPerfil = localStorage.getItem("idPerfil"); // Se asume que el id de perfil está guardado en localStorage
    const idPelicula = getPeliculaIdFromUrl(); // Asegúrate de obtener el id de la película desde la URL o algún otro lugar

    // Verificar estado actual desde la base de datos (si hay un estado y favorito guardado)
    getEstadoFavorito(idPerfil, idPelicula);

    // Manejar el clic en el botón de favorito
    favoritoBtn.addEventListener("click", () => {
        const favorito = !favoritoBtn.classList.contains("favorito-activo"); // Cambiar el estado de favorito
        actualizarEstadoFavorito(idPerfil, idPelicula, favorito, pendienteSelect.value);
    });

    // Manejar el cambio en el estado pendiente
    pendienteSelect.addEventListener("change", () => {
        actualizarEstadoFavorito(idPerfil, idPelicula, favoritoBtn.classList.contains("favorito-activo"), pendienteSelect.value);
    });
});

// Obtener el ID de la película de la URL
function getPeliculaIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id_pelicula');
}

document.addEventListener('DOMContentLoaded', (event) => {
    const favoritoBtn = document.getElementById("favorito");
    const pendienteSelect = document.getElementById("pendiente");

    // Obtener el perfil y película
    const idPerfil = localStorage.getItem('profileId'); // Obtener el id del perfil desde localStorage
    const idPelicula = getPeliculaIdFromUrl(); // Obtener el id de la película desde la URL

    // Verificar si se tiene el perfil y la película
    if (!idPerfil || !idPelicula) {
        console.error("Faltan datos de perfil o película.");
        return;
    }

    // Verificar estado actual desde la base de datos (si hay un estado y favorito guardado)
    getEstadoFavorito(idPerfil, idPelicula);

    // Manejar el clic en el botón de favorito
    favoritoBtn.addEventListener("click", () => {
        const favorito = !favoritoBtn.classList.contains("favorito-activo"); // Cambiar el estado de favorito
        actualizarEstadoFavorito(idPerfil, idPelicula, favorito, pendienteSelect.value);
    });

    // Manejar el cambio en el estado pendiente
    pendienteSelect.addEventListener("change", () => {
        actualizarEstadoFavorito(idPerfil, idPelicula, favoritoBtn.classList.contains("favorito-activo"), pendienteSelect.value);
    });
});

// Obtener el ID de la película de la URL
function getPeliculaIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id_pelicula');
}

// Obtener el estado y favorito de la película desde la base de datos
function getEstadoFavorito(idPerfil, idPelicula) {
    fetch(`http://localhost:3000/visto?id_perfil=${idPerfil}&id_pelicula=${idPelicula}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const estado = data[0].estado;
                const favorito = data[0].favorito;
                
                // Establecer el estado del botón de favorito y del select
                const favoritoBtn = document.getElementById("favorito");
                if (favorito) {
                    favoritoBtn.classList.add("favorito-activo");
                } else {
                    favoritoBtn.classList.remove("favorito-activo");
                }

                const pendienteSelect = document.getElementById("pendiente");
                pendienteSelect.value = estado;
            }
        })
        .catch(error => console.error("Error al obtener el estado de la película:", error));
}

// Actualizar el estado y el favorito de la película en la base de datos
function actualizarEstadoFavorito(idPerfil, idPelicula, favorito, estado) {
    fetch("http://localhost:3000/visto/actualizar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id_perfil: idPerfil,
            id_pelicula: idPelicula,
            favorito: favorito,
            estado: estado
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message); // Confirmación de actualización
    })
    .catch(error => console.error("Error al actualizar el estado:", error));    
}
