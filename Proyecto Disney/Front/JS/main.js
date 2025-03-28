document.addEventListener('DOMContentLoaded', () => {
    const espacioFavoritos = document.getElementById("cont-favoritos");
    const espacioRecomendados = document.getElementById("cont-recomendados");
    const espacioGeneros = document.getElementById("cont-generos");
    const espacioDemografia = document.getElementById("demografias");

    let peliculas = [];
    let generos = [];
    let demografias = [];
    let pegi = [];

    const profileID = localStorage.getItem('profileId');

    getPeliculas();
    getGenero();
    getDemografias();
    getPegi();

    pintarPeliculasPorGenero(peliculas);

    if (profileID) {
        pintarFavoritos(profileID);
        pintarRecomendados(profileID);
    } else {
        console.log("Usuario no autenticado, no se pueden cargar favoritos.");
    }
});

// Obtener las películas desde la base de datos
function getPeliculas() {
    fetch(GET_PELICULAS)
        .then(response => response.json())
        .then(data => {
            peliculas = data;
            pintarPeliculasPorGenero(peliculas);
        })
        .catch(error => console.error("Error al obtener películas:", error));
}

// Obtener los géneros desde la base de datos
function getGenero() {
    fetch(GET_GENEROS)
        .then(response => response.json())
        .then(data => {
            generos = data;
        })
        .catch(error => console.error("Error al obtener géneros:", error));
}

// Obtener las demografías desde la base de datos
function getDemografias() {
    fetch(GET_DEMOGRAFIAS)
        .then(response => response.json())
        .then(data => {
            demografias = data;
            insertarDemografia(demografias);
        })
        .catch(error => console.error("Error al obtener demografías:", error));
}

// Obtener PEGI desde la base de datos
function getPegi() {
    fetch(GET_PEGI)
        .then(response => response.json())
        .then(data => {
            pegi = data;
        })
        .catch(error => console.error("Error al obtener PEGI:", error));
}

// Insertar las demografías en el DOM
function insertarDemografia(demografias) {
    const espacioDemografia = document.getElementById("demografias");
    if (!espacioDemografia) return;

    espacioDemografia.innerHTML = "";

    if (Array.isArray(demografias)) {
        demografias.forEach(demografia => {
            const div = document.createElement("div");
            div.classList.add("demografias_targeta");

            const imagen = document.createElement("img");
            imagen.src = demografia.url_demografia;

            div.appendChild(imagen);
            espacioDemografia.appendChild(div);
        });
    }
}


// Función para pintar las películas por género
function pintarPeliculasPorGenero(peliculas) {
    const espacioGeneros = document.getElementById("cont-generos");

    espacioGeneros.innerHTML = "";

    const peliculasPorGenero = {};

    peliculas.forEach(pelicula => {
        if (!peliculasPorGenero[pelicula.nombre_genero]) {
            peliculasPorGenero[pelicula.nombre_genero] = [];
        }
        peliculasPorGenero[pelicula.nombre_genero].push(pelicula);
    });

    // Recorrer los géneros y crear un contenedor para cada uno
    Object.keys(peliculasPorGenero).forEach(genero => {
        const generoContainer = document.createElement('div');
        generoContainer.id = genero;
        generoContainer.classList.add('genero-container');

        const title = document.createElement('h5');
        title.textContent = genero;
        generoContainer.appendChild(title);

        const carousel = document.createElement('div');
        carousel.classList.add('carousel');

        const track = document.createElement('div');
        track.id = `${genero}-track`;
        track.classList.add('carousel-track');

        const prevButton = document.createElement('button');
        prevButton.classList.add('carousel-button', 'prev');
        prevButton.innerHTML = '&#10094;';
        prevButton.onclick = () => moveCarousel(genero, -1);
        prevButton.style.display = 'none'; 

        const nextButton = document.createElement('button');
        nextButton.classList.add('carousel-button', 'next');
        nextButton.innerHTML = '&#10095;';
        nextButton.onclick = () => moveCarousel(genero, 1);
        nextButton.style.display = 'none'; 

        carousel.appendChild(prevButton);
        carousel.appendChild(track);
        carousel.appendChild(nextButton);

        generoContainer.appendChild(carousel);

        peliculasPorGenero[genero].forEach(pelicula => {
            const peliculaDiv = document.createElement('div');
            peliculaDiv.classList.add('pelicula-item');
            peliculaDiv.setAttribute("data-id", pelicula.id_pelicula);

            peliculaDiv.innerHTML = `
                <div class="peliculas_targeta">
                    <img src="${pelicula.url_portada}" alt="${pelicula.titulo}" class="cartel">
                    <p>${pelicula.titulo}</p>
                </div>
            `;

            peliculaDiv.addEventListener("click", function () {
                const idPelicula = this.getAttribute("data-id");
                window.location.href = `detalle.html?id_pelicula=${idPelicula}`;
            });

            track.appendChild(peliculaDiv);
        });

        espacioGeneros.appendChild(generoContainer);

        checkCarouselArrows(carousel);
    });
}

// Función para pintar favoritos
function pintarFavoritos(idPerfil) {
    fetch(API_URL + `/favoritos/${idPerfil}`)
        .then(response => response.json())
        .then(data => {
            if (!data || data.length === 0) return;

            const espacioFavoritos = document.getElementById("cont-favoritos");
            if (!espacioFavoritos) return;

            let favoritosContainer = document.createElement('div');
            favoritosContainer.id = 'favoritos';
            favoritosContainer.classList.add('genero-container');

            const h5 = document.createElement('h5');
            h5.innerText = 'Tus Favoritos ' + localStorage.getItem('profileName');
            favoritosContainer.appendChild(h5);

            const carousel = document.createElement('div');
            carousel.classList.add('carousel');

            const prevButton = document.createElement('button');
            prevButton.classList.add('carousel-button', 'prev');
            prevButton.innerHTML = '&#10094;';
            prevButton.onclick = () => moveCarousel('favoritos', -1);
            prevButton.style.display = 'none';  

            const track = document.createElement('div');
            track.id = 'favoritos-track';
            track.classList.add('carousel-track');

            const nextButton = document.createElement('button');
            nextButton.classList.add('carousel-button', 'next');
            nextButton.innerHTML = '&#10095;';
            nextButton.onclick = () => moveCarousel('favoritos', 1);
            nextButton.style.display = 'none';  

            carousel.appendChild(prevButton);
            carousel.appendChild(track);
            carousel.appendChild(nextButton);
            favoritosContainer.appendChild(carousel);

            data.forEach(pelicula => {
                const peliculaDiv = document.createElement('div');
                peliculaDiv.classList.add('pelicula-favorita');
                peliculaDiv.setAttribute("data-id", pelicula.id_pelicula);

                peliculaDiv.innerHTML = `
                    <div class="peliculas_targeta">
                        <img src="${pelicula.url_portada}" alt="${pelicula.titulo}" class="cartel">
                        <p>${pelicula.titulo}</p>
                    </div>
                `;

                peliculaDiv.addEventListener("click", function () {
                    const idPelicula = this.getAttribute("data-id");
                    window.location.href = `detalle.html?id_pelicula=${idPelicula}`;
                });

                track.appendChild(peliculaDiv);
            });

            espacioFavoritos.appendChild(favoritosContainer);

            checkCarouselArrows(carousel);
        })
        .catch(error => console.error("Error al obtener favoritos:", error));
}

// Función para pintar las películas recomendadas
function pintarRecomendados(idPerfil) {
    fetch(API_URL + `/favoritos/${idPerfil}`)
        .then(response => response.json())
        .then(data => {
            if (!data || data.length === 0) return;

            // Paso 1: Encontrar la demografía más popular en los favoritos
            const demografiasFavoritos = data.map(fav => fav.nombre_demografia);
            const demografiaCounts = {};

            demografiasFavoritos.forEach(demografia => {
                demografiaCounts[demografia] = (demografiaCounts[demografia] || 0) + 1;
            });

            // Paso 2: Identificar la demografía más popular
            const demografiaMasPopular = Object.keys(demografiaCounts).reduce((a, b) => demografiaCounts[a] > demografiaCounts[b] ? a : b);

            // Paso 3: Filtrar las películas recomendadas según la demografía más popular
            const recomendaciones = peliculas.filter(pelicula => {
                // Verificamos que la película no esté en los favoritos y que coincida con la demografía más popular
                return !data.some(fav => fav.id_pelicula === pelicula.id_pelicula) && pelicula.nombre_demografia === demografiaMasPopular;
            });

            const recomendacionesLimitadas = recomendaciones.slice(0, 15); // Limitamos a 15 recomendaciones

            if (recomendacionesLimitadas.length === 0) return;

            // Paso 4: Mostrar las recomendaciones en el DOM
            const espacioRecomendados = document.getElementById("cont-recomendados");
            if (!espacioRecomendados) return;

            let recomendadosContainer = document.createElement('div');
            recomendadosContainer.id = 'recomendados';
            recomendadosContainer.classList.add('genero-container');

            const h5 = document.createElement('h5');
            h5.innerText = `Nuestras Recomendaciones: ${demografiaMasPopular}`;
            recomendadosContainer.appendChild(h5);

            const carousel = document.createElement('div');
            carousel.classList.add('carousel');

            const prevButton = document.createElement('button');
            prevButton.classList.add('carousel-button', 'prev');
            prevButton.innerHTML = '&#10094;';
            prevButton.onclick = () => moveCarousel('recomendados', -1);
            prevButton.style.display = 'none';

            const track = document.createElement('div');
            track.id = 'recomendados-track';
            track.classList.add('carousel-track');

            const nextButton = document.createElement('button');
            nextButton.classList.add('carousel-button', 'next');
            nextButton.innerHTML = '&#10095;';
            nextButton.onclick = () => moveCarousel('recomendados', 1);
            nextButton.style.display = 'none';

            carousel.appendChild(prevButton);
            carousel.appendChild(track);
            carousel.appendChild(nextButton);
            recomendadosContainer.appendChild(carousel);

            // Crear los elementos de las recomendaciones con el índice
            recomendacionesLimitadas.forEach((pelicula, index) => {
                const peliculaDiv = document.createElement('div');
                peliculaDiv.classList.add('pelicula-recomendada');
                peliculaDiv.setAttribute("data-id", pelicula.id_pelicula);

                peliculaDiv.innerHTML = `
                    <div class="peliculas_targeta">
                        <img src="${pelicula.url_cartel}" alt="${pelicula.titulo}" class="cartel">
                        <p>${index + 1}</p> <!-- El número se incrementa con cada película -->
                    </div>
                `;

                peliculaDiv.addEventListener("click", function () {
                    const idPelicula = this.getAttribute("data-id");
                    window.location.href = `detalle.html?id_pelicula=${idPelicula}`;
                });

                track.appendChild(peliculaDiv);
            });

            espacioRecomendados.appendChild(recomendadosContainer);

            checkCarouselArrows(carousel);
        })
        .catch(error => console.error("Error al obtener favoritos:", error));
}

