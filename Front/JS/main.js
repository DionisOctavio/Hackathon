
document.addEventListener('DOMContentLoaded', (event) => {

    espacioDemografia = document.getElementById("demografias");
    espacioParaTi = document.getElementById("para-ti");



    const profileID = localStorage.getItem('profileId');


    // TRAEMOS DATOS DE BD
    getPeliculas();
    getGenero();
    getDemografias();
    getPegi();
    pintarFavoritos(profileID);
    pintarPeliculas(peliculas, generos);
    //
    insertarDemografia(demografias);
});


// TRAEMOS TODAS LAS PELICULAS DE NUESTRA BD
function getPeliculas(){
    fetch(GET_PELICULAS)
    .then(response => response.json())
    .then(
        (data) => {
            console.log(data);
            getGenero(data);
        }
    )
}



// TRAEMOS TODOS LOS GENEROS DE NUESTRA BD
function getGenero() {
    fetch(GET_GENEROS)
    .then(response => response.json())
    .then((data) => {
        console.log(data); 
        pintarPeliculasPorGenero(data, peliculasPorGenero);
    })
}




// TRAEMOS TODAS LAS DEMOGRAFIAS DE NUESTRA BD
function getDemografias(){
    fetch(GET_DEMOGRAFIAS)
    .then(response => response.json())
    .then(
        (data) => {
            console.log(data);
            insertarDemografia(data);
        }
    )
}


// TRAEMOS TODOS LOS PEGI DE NUESTRA BD
function getPegi(){
    fetch(GET_PEGI)
    .then(response => response.json())
    .then(
        (data) => {
            console.log(data);
        }
    )
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


function pintarFavoritos(idPerfil) {
    fetch(API_URL + `/favoritos/${idPerfil}`)
    .then(response => response.json())
    .then(
        (data) => {
            console.log(data);

            // Si no hay favoritos, no mostrar nada
            if (data.length === 0) {
                return; // No hacer nada si el array está vacío
            }

            // Crear el contenedor de favoritos
            let favoritosContainer = document.getElementById('favoritos');
            if (!favoritosContainer) {
                favoritosContainer = document.createElement('div');
                favoritosContainer.id = 'favoritos';
                favoritosContainer.classList.add('genero-container');

                const h5 = document.createElement('h5');
                h5.innerText = 'Tus Favoritos';
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
                espacioParaTi.appendChild(favoritosContainer);
            }

            // Limpiar el contenido previo del track
            const track = document.getElementById('favoritos-track');
            track.innerHTML = '';

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
        }
    )
}


