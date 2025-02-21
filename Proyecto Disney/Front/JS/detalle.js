console.log(localStorage);

document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const idPelicula = params.get("id_pelicula");

    console.log("ID de la película obtenida:", idPelicula);

    if (!idPelicula) {
        alert("Película no encontrada.");
        window.history.back();
        return;
    }

    // Obtener los datos de películas
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

            document.getElementById("pelicula-titulo").textContent = pelicula.titulo;
            document.getElementById("pelicula-imagen").src = pelicula.url_cartel;
            document.getElementById("pelicula-sinopsis").textContent = pelicula.sinopsis;
            document.getElementById("pelicula-genero").textContent = pelicula.nombre_genero;
            document.getElementById("pelicula-año").textContent = pelicula.anyo;
            document.getElementById("pelicula-categoria").textContent = pelicula.nombre_demografia;
            document.getElementById("pelicula-pegi").textContent = pelicula.edad;

            const trailerDiv = document.getElementById("pelicula-trailer");
            trailerDiv.innerHTML = `<iframe width="560" height="315" src="${pelicula.url_trailer}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
        })
        .catch(error => console.error("Error cargando los datos:", error));

    const favoritoBtn = document.getElementById("favorito");
    const pendienteSelect = document.getElementById("visto");

    const idPerfil = localStorage.getItem("profileId");
    console.log("ID de perfil obtenido desde localStorage:", idPerfil);

    if (!idPerfil || !idPelicula) {
        console.error("Faltan datos de perfil o película.");
        return;
    }

    getEstadoFavorito(idPerfil, idPelicula);

favoritoBtn.addEventListener("click", () => {
    const esFavorito = favoritoBtn.classList.contains("favorito-activo");

    const nuevoEstado = !esFavorito; 

    favoritoBtn.classList.toggle("favorito-activo", nuevoEstado);
    console.log("Estado del favorito cambiado a:", nuevoEstado ? "Favorito" : "No favorito");

    actualizarEstadoFavorito(idPerfil, idPelicula, nuevoEstado, pendienteSelect.value);
});

// Establecer el estado inicial como 'false' al cargar la página
favoritoBtn.classList.remove("favorito-activo"); 


    // Evento para manejar el cambio de estado pendiente
    pendienteSelect.addEventListener("change", () => {
        const esFavorito = favoritoBtn.classList.contains("favorito-activo");
        console.log("Estado pendiente cambiado a:", pendienteSelect.value);

        actualizarEstadoFavorito(idPerfil, idPelicula, esFavorito, pendienteSelect.value);
    });

    // Función para obtener el estado de favorito y pendiente
    function getEstadoFavorito(idPerfil, idPelicula) {
        console.log(idPerfil, idPelicula);
        fetch(`http://localhost:3000/visto?id_perfil=${idPerfil}&id_pelicula=${idPelicula}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const favorito = data[0].favorito;
                    const estado = data[0].estado || "No Visto";

                    // Establecer "favorito" en false por defecto si no se encuentra en la base de datos
                    const estadoFavorito = favorito == undefined ? favorito : false;

                    // Actualizar la UI con los valores obtenidos
                    document.getElementById("favorito").classList.toggle("favorito-activo", estadoFavorito);
                    document.getElementById("visto").value = estado;
                    console.log("Estado de favorito y pendiente cargados:", estadoFavorito, estado);
                } else {
                    // Si no hay datos, establecer por defecto como "no favorito"
                    document.getElementById("favorito").classList.remove("favorito-activo");
                    document.getElementById("visto").value = "No Visto";
                    console.log("No se encontró el estado, se establece como 'no favorito'.");
                }
            })
            .catch(error => console.error("Error obteniendo estado de favorito:", error));
    }

    // Función para actualizar el estado en la base de datos
    function actualizarEstadoFavorito(idPerfil, idPelicula, favorito, estado) {
        const dataToUpdate = {
            id_perfil: idPerfil,
            id_pelicula: idPelicula,
            favorito: favorito,
            estado: estado
        };
    
        console.log("Enviando datos al backend:", dataToUpdate);
    
        fetch("http://localhost:3000/visto/actualizar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataToUpdate)
        })
        .then(response => response.json())
        .then(data => console.log("Respuesta del backend:", data))
        .catch(error => console.error("Error actualizando el estado:", error));
    }
    
});
