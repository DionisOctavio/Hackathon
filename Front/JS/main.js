document.addEventListener('DOMContentLoaded', async (event) => {
    espacioDemografia = document.getElementById("demografias");
    espacioParaTi = document.getElementById("para-ti");

    const profileID = localStorage.getItem('profileId');

    let secciones = [];
    await getPeliculas();
    await getGenero();
    await getDemografias();
    await getPegi();

    if (profileID) {
        const favoritos = await pintarFavoritos(profileID);
        secciones.push({ valor: 1, contenido: favoritos });
    } else {
        console.log("Usuario no autenticado, no se pueden cargar favoritos.");
    }

    const peliculasGenero = pintarPeliculasPorGenero(peliculas);
    secciones.push({ valor: 2, contenido: peliculasGenero });

    ordenarSecciones(secciones);

    secciones.forEach(seccion => {
        espacioParaTi.appendChild(seccion.contenido);
    });

    insertarDemografia(demografias);
});

// Traemos las películas de la base de datos
async function getPeliculas(){
    const response = await fetch(GET_PELICULAS);
    const data = await response.json();
    peliculas = data;
}

// Traemos los géneros de la base de datos
async function getGenero() {
    const response = await fetch(GET_GENEROS);
    const data = await response.json();
    console.log(data);
}

// Traemos las demografías de la base de datos
async function getDemografias(){
    const response = await fetch(GET_DEMOGRAFIAS);
    const data = await response.json();
    demografias = data;
}

// Traemos los PEGI de la base de datos
async function getPegi(){
    const response = await fetch(GET_PEGI);
    const data = await response.json();
    console.log(data);
}

function insertarDemografia(demografias) {
    // Limpiar el contenido previo
    espacioDemografia.innerHTML = "";

    // Asegurarnos de que 'demografias' es un array
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

// Función para pintar los favoritos
async function pintarFavoritos(idPerfil) {
    const response = await fetch(API_URL + `/favoritos/${idPerfil}`);
    const data = await response.json();

    // Si no hay favoritos, no mostrar nada
    if (data.length === 0) {
        return null; // Si no hay favoritos, no se crea el contenido
    }

    // Crear el contenedor de favoritos
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

    const track = document.createElement('div');
    track.id = 'favoritos-track';
    track.classList.add('carousel-track');

    const nextButton = document.createElement('button');
    nextButton.classList.add('carousel-button', 'next');
    nextButton.innerHTML = '&#10095;';
    nextButton.onclick = () => moveCarousel('favoritos', 1);

    carousel.appendChild(prevButton);
    carousel.appendChild(track);
    carousel.appendChild(nextButton);
    favoritosContainer.appendChild(carousel);

    // Añadir las películas favoritas al carrusel
    data.forEach(pelicula => {
        const peliculaDiv = document.createElement('div');
        peliculaDiv.classList.add('pelicula-favorita');
        peliculaDiv.setAttribute("data-id", pelicula.id_pelicula);

        peliculaDiv.innerHTML = `
            <div class="peliculas_targeta">
                <img src="${pelicula.url_cartel}" alt="${pelicula.titulo}" class="cartel">
                <p>${pelicula.titulo}</p>
            </div>
        `;

        // Manejar el evento de clic para redirigir al detalle
        peliculaDiv.addEventListener("click", function () {
            const idPelicula = this.getAttribute("data-id");
            window.location.href = `detalle.html?id_pelicula=${idPelicula}`;
        });

        track.appendChild(peliculaDiv);
    });

    return favoritosContainer;
}

function pintarPeliculasPorGenero(peliculas) {
    const espacioParaTi = document.getElementById('para-ti');

    // Crear un objeto para almacenar películas por género
    let peliculasPorGenero = {};

    // Agrupar películas por género
    peliculas.forEach(pelicula => {
        if (!peliculasPorGenero[pelicula.nombre_genero]) {
            peliculasPorGenero[pelicula.nombre_genero] = [];
        }
        peliculasPorGenero[pelicula.nombre_genero].push(pelicula);
    });

    // Crear el contenedor de películas por género
    let generoContainer = document.createElement('div');
    generoContainer.classList.add('genero-container');

    // Recorrer los géneros y crear un contenedor para cada uno
    Object.keys(peliculasPorGenero).forEach(genero => {
        const title = document.createElement('h5');
        title.textContent = genero;
        generoContainer.appendChild(title);

        // Crear el contenedor del carrusel
        const carousel = document.createElement('div');
        carousel.classList.add('carousel');

        // Botones para mover el carrusel
        const prevButton = document.createElement('button');
        prevButton.classList.add('carousel-button', 'prev');
        prevButton.innerHTML = '&#10094;';
        prevButton.onclick = () => moveCarousel(genero, -1); // Usando la función externa para mover el carrusel

        const track = document.createElement('div');
        track.id = `${genero}-track`; // ID único para cada carrusel
        track.classList.add('carousel-track');

        const nextButton = document.createElement('button');
        nextButton.classList.add('carousel-button', 'next');
        nextButton.innerHTML = '&#10095;';
        nextButton.onclick = () => moveCarousel(genero, 1); // Usando la función externa para mover el carrusel

        // Agregar los botones y el track al carrusel
        carousel.appendChild(prevButton);
        carousel.appendChild(track);
        carousel.appendChild(nextButton);
        generoContainer.appendChild(carousel);

        // Insertar las películas en su contenedor correspondiente
        peliculasPorGenero[genero].forEach(pelicula => {
            const peliculaDiv = document.createElement('div');
            peliculaDiv.classList.add('pelicula-item');
            peliculaDiv.setAttribute("data-id", pelicula.id_pelicula);

            peliculaDiv.innerHTML = `
                <div class="peliculas_targeta">
                    <img src="${pelicula.url_cartel}" alt="${pelicula.titulo}" class="cartel">
                    <p>${pelicula.titulo}</p>
                </div>
            `;

            // Manejar el clic para redirigir al detalle
            peliculaDiv.addEventListener("click", function () {
                const idPelicula = this.getAttribute("data-id");
                window.location.href = `detalle.html?id_pelicula=${idPelicula}`;
            });

            track.appendChild(peliculaDiv);
        });
    });

    return generoContainer;
}


// Función para ordenar las secciones según el valor
function ordenarSecciones(secciones) {
    secciones.sort((a, b) => a.valor - b.valor);
}
